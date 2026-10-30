import { NextRequest, NextResponse } from 'next/server';
import { getAliadoByTelefono } from '@/lib/aliados-db';
import { createPromo } from '@/lib/promos-db';
import { extraerPrefijoMenu, parsearMenuConIA } from '@/lib/services/menuParser';
import { sendEvolutionWhatsApp, normalizarTelefono, getEvolutionMediaBase64 } from '@/lib/services/evolutionService';
import { extraerTextoDeImagen } from '@/lib/services/ocrService';
import { uploadBase64ToBunny } from '@/lib/services/imageUploadService';
import {
  yaPublicoHoyEnMemoria,
  yaPublicoHoyEnBD,
  marcarPublicacionHoy,
  esPrimerContacto,
  registrarLog,
  guardarBorrador,
  obtenerBorrador,
  eliminarBorrador,
  type BorradorMenu,
} from '@/lib/services/botState';

export const dynamic = 'force-dynamic';

// ─── Mensajes del bot ──────────────────────────────────────────────────────
const MSG_BIENVENIDA = (nombre: string) =>
  `¡Hola *${nombre}*! 👋🍽️

¡Bienvenido al sistema de menús diarios de *Qué Comer en Loja*!

Con este número puedes enviar tu menú o afiche diario para publicarlo en la web.

📌 *¿Cómo funciona?*
Envía una foto de tu menú o afiche con tu mensaje. Te mostraremos un borrador y podrás confirmar o pedir correcciones antes de publicarlo. 🚀`;

const MSG_DUPLICADO = (nombre: string, titulo: string, enlace: string) =>
  `Hola *${nombre}* 👋

Tu menú de hoy ya fue publicado anteriormente:
🍽️ *${titulo}*

📲 Puedes verlo en tu enlace directo:
${enlace}

Si deseas cambiarlo o actualizarlo, envíame tu nuevo menú o afiche. 🙌`;

const MSG_CONFIRMACION_PUBLICADO = (nombre: string, titulo: string, precio: string | null, enlace: string) =>
  `🎉 *¡Tu menú ya está en vivo, ${nombre}!*

🍽️ *${titulo}*${precio ? `\n💰 *Precio:* ${precio}` : ''}

🔗 *Tu enlace oficial:*
${enlace}

📲 Ya lo pueden ver todas las personas que buscan qué comer hoy en Loja. ¡Muchos éxitos en las ventas! 🙌🍴`;

const MSG_PROPUESTA_BORRADOR = (nombre: string, titulo: string, precio: string | null, platosDesc: string) =>
  `🍽️ *Menú detectado para ${nombre}:*

📌 *Título:* ${titulo}
${precio ? `💰 *Precio:* ${precio}` : '💰 *Precio:* No detectado'}

📋 *Detalle:*
${platosDesc.slice(0, 350)}

─────────────────────
👉 ¿Está todo correcto? Responde *SI* para publicarlo.
👉 Si deseas corregir algo (ej: el precio o un plato), solo escríbelo (ej: _precio $3.00_).`;


// ─── Endpoint principal ────────────────────────────────────────────────────

/**
 * POST /api/webhooks/whatsapp-promos
 * Recibe los eventos 'messages.upsert' de Evolution API y procesa el flujo
 * de publicación de menú diario por parte de aliados autorizados.
 *
 * Flujo completo:
 * 1. Filtrar mensajes propios, grupos y estados
 * 2. Extraer número y texto
 * 3. Detectar prefijo de menú (MENU:, PROMO:, OFERTA:, EVENTO:)
 * 4. Verificar que el número sea de un aliado autorizado
 * 5. Enviar bienvenida si es primer contacto
 * 6. Verificar anti-duplicados (no publicar 2 veces el mismo día)
 * 7. Parsear el menú con IA (Groq) y guardarlo en BD
 * 8. Confirmar al aliado con enlace a la publicación
 */
export async function POST(req: NextRequest) {
  let rawText = '';
  let numeroRemitente = '';

  try {
    const body = await req.json();

    // ── 1. Filtrar eventos irrelevantes ──────────────────────────────────
    const messageData = body.data || body;
    const key = messageData.key || {};
    const fromMe = Boolean(key.fromMe);

    if (fromMe) {
      return NextResponse.json({ status: 'ignored', reason: 'message_from_me' });
    }

    const remoteJid: string = key.remoteJid || messageData.remoteJid || '';

    if (!remoteJid || remoteJid.includes('@g.us') || remoteJid.includes('status@broadcast')) {
      return NextResponse.json({ status: 'ignored', reason: 'not_private_message' });
    }

    // ── 2. Extraer texto e imagen del mensaje ───────────────────────────
    const msg = messageData.message || {};
    const messageId = key.id || '';
    const hasImage = Boolean(msg.imageMessage || msg.documentMessage?.mimetype?.includes('image'));

    rawText =
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.imageMessage?.caption ||
      msg.videoMessage?.caption ||
      '';

    numeroRemitente = normalizarTelefono(remoteJid);

    // ── 3. Verificar aliado autorizado ───────────────────────────────────
    const aliado = await getAliadoByTelefono(numeroRemitente);

    if (!aliado) {
      console.warn(`[WA Bot] Número NO autorizado intentó publicar: ${numeroRemitente}`);
      await registrarLog({
        numero: numeroRemitente,
        tipo: 'NO_AUTORIZADO',
        mensaje_in: rawText.slice(0, 500),
      });
      return NextResponse.json({ status: 'ignored', reason: 'unauthorized_sender' });
    }

    const aliadoSlug = aliado.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const textoUsuario = rawText.trim();
    const textoLower = textoUsuario.toLowerCase();

    // ── 4. Comprobar si hay un borrador pendiente de confirmación ──────────
    const borradorActual = obtenerBorrador(numeroRemitente);

    const esConfirmacion =
      /^(si|sí|ok|dale|publicar|confirmo|listo|de una|afirmativo|adelante)$/i.test(textoLower);

    if (borradorActual && esConfirmacion) {
      // El usuario CONFIRMÓ publicar el borrador
      const { id: promoId, slug: promoSlug } = await createPromo({
        aliado_slug: borradorActual.aliadoSlug,
        aliado_nombre: borradorActual.aliadoNombre,
        titulo: borradorActual.titulo,
        tipo: borradorActual.tipo,
        descripcion: borradorActual.descripcion,
        imagen_url: borradorActual.imagenUrl,
        precio_original: borradorActual.precioOriginal,
        precio_promo: borradorActual.precioPromo,
        fecha_inicio: borradorActual.fechaInicioStr,
        fecha_fin: borradorActual.fechaFinStr,
        lugar: borradorActual.lugar,
        whatsapp_url: borradorActual.whatsappUrl,
        color_marca: borradorActual.colorMarca,
      });

      eliminarBorrador(numeroRemitente);
      marcarPublicacionHoy(aliado.id, promoId);

      // Enlace directo a la publicación generada
      const enlaceDirecto = `https://www.quecomerenloja.com/promos/${promoSlug}`;
      const msgConfirm = MSG_CONFIRMACION_PUBLICADO(aliado.nombre, borradorActual.titulo, borradorActual.precioPromo, enlaceDirecto);
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgConfirm });

      await registrarLog({
        aliado_nombre: aliado.nombre,
        numero: numeroRemitente,
        tipo: 'PUBLICADO',
        mensaje_in: rawText.slice(0, 500),
        respuesta_out: msgConfirm,
        promo_id: promoId,
      });

      console.log(`[WA Bot] ✅ Promo confirmada y publicada: ${enlaceDirecto}`);
      return NextResponse.json({ success: true, status: 'published', promoSlug, enlaceDirecto });
    }

    // Si hay un borrador y el usuario envía una corrección de precio directa (ej: "precio $3.00" o "$3.25")
    const matchPrecioCorreccion = textoUsuario.match(/\$?\s*(\d{1,2}(?:[.,]\d{2})?)/);
    if (borradorActual && matchPrecioCorreccion && textoUsuario.length < 25 && !hasImage) {
      const nuevoPrecio = `$${parseFloat(matchPrecioCorreccion[1].replace(',', '.')).toFixed(2)}`;
      borradorActual.precioPromo = nuevoPrecio;
      guardarBorrador(numeroRemitente, borradorActual);

      const msgUpdate = `✏️ *Precio actualizado a ${nuevoPrecio}*\n\n¿Deseas publicarlo ahora? Responde *SI* para confirmar.`;
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgUpdate });
      return NextResponse.json({ status: 'draft_updated', precio: nuevoPrecio });
    }

    // ── 5. Procesar Imagen (OCR + Subida a BunnyCDN) ──────────────────────
    let textoOcr = '';
    let imagenPublicadaUrl: string | null = null;

    if (hasImage && messageId) {
      try {
        console.log(`[WA Bot] Descargando imagen para OCR y CDN (id: ${messageId})...`);
        const base64Img = await getEvolutionMediaBase64(messageId);
        if (base64Img) {
          // Extraer texto mediante OCR
          textoOcr = await extraerTextoDeImagen(base64Img);

          // Subir a BunnyCDN para que sea la imagen de la card en la web
          imagenPublicadaUrl = await uploadBase64ToBunny(base64Img, aliadoSlug);
        }
      } catch (errMedia) {
        console.warn('[WA Bot] Error procesando imagen recibida:', errMedia);
      }
    }

    // Si no mandó imagen o falló la subida, se usa la imagen/logo del aliado registrado
    if (!imagenPublicadaUrl) {
      imagenPublicadaUrl = aliado.imagenUrl || null;
    }

    // Combinar texto del pie de foto con texto extraído de la imagen
    const textoCombinado = [rawText, textoOcr].filter(Boolean).join('\n\n');

    if (!textoCombinado.trim()) {
      return NextResponse.json({ status: 'ignored', reason: 'empty_content' });
    }

    // ── 6. Extraer detalles y parsear menú ───────────────────────────────
    const { textoLimpio, tipoDetectado } = extraerPrefijoMenu(textoCombinado);

    if (textoLimpio.length < 5 && !hasImage) {
      const msgAyuda = `Hola ${aliado.nombre} 👋\n\nPor favor envía el detalle de los platos del día o una foto del afiche de tu menú para poder publicarlo.`;
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgAyuda });
      return NextResponse.json({ status: 'handled', reason: 'prompted_for_details' });
    }

    // ── 7. Parsear menú con IA o fallback ────────────────────────────────
    const parsed = await parsearMenuConIA(textoLimpio, aliado.nombre, tipoDetectado);

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fechaInicioStr = `${yyyy}-${mm}-${dd} 00:00:00`;
    const fechaFinStr = `${yyyy}-${mm}-${dd} 23:59:59`;

    // ── 8. Guardar como BORRADOR pendiente de confirmación ───────────────
    const nuevoBorrador: BorradorMenu = {
      aliadoId: aliado.id,
      aliadoNombre: aliado.nombre,
      aliadoSlug,
      titulo: parsed.titulo,
      descripcion: parsed.descripcion,
      tipo: parsed.tipo,
      precioPromo: parsed.precioPromo,
      precioOriginal: parsed.precioOriginal,
      imagenUrl: imagenPublicadaUrl,
      whatsappUrl: aliado.telefono ? `https://wa.me/${normalizarTelefono(aliado.telefono)}` : null,
      lugar: aliado.ubicacion || 'Loja, Ecuador',
      colorMarca: '#153E3E',
      fechaInicioStr,
      fechaFinStr,
      createdAt: Date.now(),
    };

    guardarBorrador(numeroRemitente, nuevoBorrador);

    // Enviar mensaje de confirmación al aliado
    const msgPropuesta = MSG_PROPUESTA_BORRADOR(
      aliado.nombre,
      parsed.titulo,
      parsed.precioPromo,
      parsed.descripcion
    );

    await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgPropuesta });

    await registrarLog({
      aliado_nombre: aliado.nombre,
      numero: numeroRemitente,
      tipo: 'AYUDA',
      mensaje_in: rawText.slice(0, 500),
      respuesta_out: msgPropuesta,
    });

    console.log(`[WA Bot] Borrador propuesto a ${aliado.nombre}, esperando 'SI' para publicar.`);

    return NextResponse.json({
      success: true,
      status: 'draft_pending_confirmation',
      aliado: aliado.nombre,
      borrador: nuevoBorrador,
    });
  } catch (error: any) {
    console.error('[WA Bot Error]', error);
    // Intentar loguear el error si tenemos datos mínimos
    if (numeroRemitente) {
      await registrarLog({
        numero: numeroRemitente,
        tipo: 'ERROR',
        mensaje_in: rawText?.slice(0, 500) || '(sin texto)',
        respuesta_out: error?.message || 'Internal server error',
      }).catch(() => {});
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/whatsapp-promos
 * Health check del endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Qué Comer en Loja - WhatsApp Bot de Menús',
    version: '2.0',
    timestamp: new Date().toISOString(),
    comandos: ['MENU:', 'PROMO:', 'OFERTA:', 'EVENTO:'],
  });
}
