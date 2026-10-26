import { NextRequest, NextResponse } from 'next/server';
import { getAliadoByTelefono } from '@/lib/aliados-db';
import { createPromo } from '@/lib/promos-db';
import { extraerPrefijoMenu, parsearMenuConIA } from '@/lib/services/menuParser';
import { sendEvolutionWhatsApp, normalizarTelefono } from '@/lib/services/evolutionService';
import {
  yaPublicoHoyEnMemoria,
  yaPublicoHoyEnBD,
  marcarPublicacionHoy,
  esPrimerContacto,
  registrarLog,
} from '@/lib/services/botState';

export const dynamic = 'force-dynamic';

// ─── Mensajes del bot ──────────────────────────────────────────────────────
const MSG_BIENVENIDA = (nombre: string) =>
  `¡Hola *${nombre}*! 👋🍽️

¡Bienvenido al sistema automático de menús de *Qué Comer en Loja*!

Con este número podrás publicar tu menú o promoción diaria de forma rápida y directa en nuestra plataforma.

📌 *¿Cómo funciona?*
Solo escribe tu menú empezando con la palabra clave:

*MENU:* Sopa de Repe Lojano + Cecina con Yuca + Jugo - $4.00

*PROMO:* 2x1 en almuerzos los martes hasta las 2pm

*OFERTA:* Cuy asado con papas y ensalada - $8.00 (antes $10)

*EVENTO:* Degustación de tamales lojanos este sábado 12h00

📲 Tu publicación aparecerá de inmediato en *quecomerenloja.com* para que miles de personas en Loja te encuentren.

¡Empieza ya enviando tu menú del día! 🚀`;

const MSG_AYUDA_FORMATO = (nombre: string) =>
  `Hola ${nombre} 👋

Para publicar tu menú, necesito que escribas un poco más de detalle.

*Ejemplo válido:*
MENU: Sopa de Repe Lojano, Segundo de Cecina con Yuca y Ají, Jugo de Naranja - $4.50

También puedes usar: *PROMO:*, *OFERTA:* o *EVENTO:*

¿Necesitas ayuda? Escribe *AYUDA* y te explico.`;

const MSG_DUPLICADO = (nombre: string, titulo: string, enlace: string) =>
  `Hola *${nombre}* 👋

Tu menú de hoy ya fue publicado anteriormente:
🍽️ *${titulo}*

📲 Sigue visible en:
${enlace}

Si quieres *actualizar* el menú de hoy, responde:
_ACTUALIZAR: [tu nuevo menú]_

¡Muchos éxitos en las ventas! 🙌`;

const MSG_CONFIRMACION = (nombre: string, titulo: string, precio: string | null, enlace: string) =>
  `✅ ¡Listo, *${nombre}*!

Tu menú ha sido publicado con éxito en *Qué Comer en Loja*:

🍽️ *${titulo}*${precio ? `\n💰 *Precio:* ${precio}` : ''}

📲 Ya está visible para miles de personas en Loja:
${enlace}

¡Muchos éxitos en las ventas de hoy! 🙌🍴`;

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

    // ── 2. Extraer texto del mensaje ─────────────────────────────────────
    const msg = messageData.message || {};
    rawText =
      msg.conversation ||
      msg.extendedTextMessage?.text ||
      msg.imageMessage?.caption ||
      msg.videoMessage?.caption ||
      '';

    if (!rawText?.trim()) {
      return NextResponse.json({ status: 'ignored', reason: 'empty_text' });
    }

    numeroRemitente = normalizarTelefono(remoteJid);

    // ── 3. Detectar prefijo ──────────────────────────────────────────────
    const { tienePrefijo, textoLimpio, tipoDetectado } = extraerPrefijoMenu(rawText);

    if (!tienePrefijo) {
      // Silencio absoluto si no es un aliado escribiendo un menú
      return NextResponse.json({ status: 'ignored', reason: 'no_prefix' });
    }

    // ── 4. Verificar aliado autorizado ───────────────────────────────────
    const aliado = await getAliadoByTelefono(numeroRemitente);

    if (!aliado) {
      console.warn(`[WA Bot] Número NO autorizado intentó publicar: ${numeroRemitente}`);
      await registrarLog({
        numero: numeroRemitente,
        tipo: 'NO_AUTORIZADO',
        mensaje_in: rawText.slice(0, 500),
      });
      // Sin respuesta: silencio absoluto para no-aliados
      return NextResponse.json({ status: 'ignored', reason: 'unauthorized_sender' });
    }

    // ── 5. Bienvenida en el primer contacto ─────────────────────────────
    const primerContacto = await esPrimerContacto(numeroRemitente);
    if (primerContacto) {
      const msgBienvenida = MSG_BIENVENIDA(aliado.nombre);
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgBienvenida });
      await registrarLog({
        aliado_nombre: aliado.nombre,
        numero: numeroRemitente,
        tipo: 'BIENVENIDA',
        mensaje_in: rawText.slice(0, 500),
        respuesta_out: msgBienvenida,
      });
      // Después de la bienvenida, seguimos procesando el menú si tiene contenido
      if (textoLimpio.length < 5) {
        return NextResponse.json({ status: 'handled', reason: 'welcome_sent' });
      }
    }

    // ── 6. Solicitar más detalle si el texto es muy corto ────────────────
    if (textoLimpio.length < 5) {
      const msgAyuda = MSG_AYUDA_FORMATO(aliado.nombre);
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgAyuda });
      await registrarLog({
        aliado_nombre: aliado.nombre,
        numero: numeroRemitente,
        tipo: 'AYUDA',
        mensaje_in: rawText.slice(0, 500),
        respuesta_out: msgAyuda,
      });
      return NextResponse.json({ status: 'handled', reason: 'prompted_for_details' });
    }

    // ── 7. Anti-duplicados ───────────────────────────────────────────────
    // Primero capa rápida en memoria
    const aliadoSlug = aliado.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { yaPublico: yaEnMem, promoId: promoIdMem } = yaPublicoHoyEnMemoria(aliado.id);

    if (yaEnMem && promoIdMem) {
      // Obtener título para el mensaje de duplicado
      const enlaceWeb = `https://www.quecomerenloja.com#promos`;
      const msgDup = MSG_DUPLICADO(aliado.nombre, 'tu menú del día', enlaceWeb);
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgDup });
      await registrarLog({
        aliado_nombre: aliado.nombre,
        numero: numeroRemitente,
        tipo: 'DUPLICADO',
        mensaje_in: rawText.slice(0, 500),
        respuesta_out: msgDup,
        promo_id: promoIdMem,
      });
      return NextResponse.json({ status: 'handled', reason: 'duplicate_in_memory', promoId: promoIdMem });
    }

    // Capa persistente en BD (necesaria tras reinicios)
    const { yaPublico: yaEnBD, promoId: promoIdBD, titulo: tituloExistente } = await yaPublicoHoyEnBD(aliadoSlug);

    if (yaEnBD && promoIdBD) {
      marcarPublicacionHoy(aliado.id, promoIdBD); // Repoblar caché en memoria
      const enlaceWeb = `https://www.quecomerenloja.com#promos`;
      const msgDup = MSG_DUPLICADO(aliado.nombre, tituloExistente || 'tu menú del día', enlaceWeb);
      await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgDup });
      await registrarLog({
        aliado_nombre: aliado.nombre,
        numero: numeroRemitente,
        tipo: 'DUPLICADO',
        mensaje_in: rawText.slice(0, 500),
        respuesta_out: msgDup,
        promo_id: promoIdBD,
      });
      return NextResponse.json({ status: 'handled', reason: 'duplicate_in_db', promoId: promoIdBD });
    }

    // ── 8. Parsear menú con IA ───────────────────────────────────────────
    const parsed = await parsearMenuConIA(textoLimpio, aliado.nombre, tipoDetectado);

    // Fechas Ecuador (UTC-5), vigentes hoy
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fechaInicioStr = `${yyyy}-${mm}-${dd} 00:00:00`;
    const fechaFinStr = `${yyyy}-${mm}-${dd} 23:59:59`;

    // ── 9. Guardar en BD ─────────────────────────────────────────────────
    const promoId = await createPromo({
      aliado_slug: aliadoSlug,
      aliado_nombre: aliado.nombre,
      titulo: parsed.titulo,
      tipo: parsed.tipo,
      descripcion: parsed.descripcion,
      imagen_url: aliado.imagenUrl || null,
      precio_original: parsed.precioOriginal || null,
      precio_promo: parsed.precioPromo || null,
      fecha_inicio: fechaInicioStr,
      fecha_fin: fechaFinStr,
      lugar: aliado.ubicacion || 'Loja, Ecuador',
      whatsapp_url: aliado.telefono
        ? `https://wa.me/${normalizarTelefono(aliado.telefono)}`
        : null,
      color_marca: '#153E3E',
    });

    // Marcar anti-duplicados en memoria
    marcarPublicacionHoy(aliado.id, promoId);

    // ── 10. Confirmar al aliado ──────────────────────────────────────────
    const enlaceWeb = `https://www.quecomerenloja.com#promos`;
    const msgConfirm = MSG_CONFIRMACION(aliado.nombre, parsed.titulo, parsed.precioPromo, enlaceWeb);
    await sendEvolutionWhatsApp({ number: numeroRemitente, text: msgConfirm });

    await registrarLog({
      aliado_nombre: aliado.nombre,
      numero: numeroRemitente,
      tipo: 'PUBLICADO',
      mensaje_in: rawText.slice(0, 500),
      respuesta_out: msgConfirm,
      promo_id: promoId,
    });

    console.log(`[WA Bot] ✅ Menú publicado: ${aliado.nombre} → promoId=${promoId}`);

    return NextResponse.json({
      success: true,
      promoId,
      aliado: aliado.nombre,
      titulo: parsed.titulo,
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
