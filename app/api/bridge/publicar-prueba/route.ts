import { NextRequest, NextResponse } from 'next/server';
import { getGastroPool, createAliado, getAliadoByTelefono } from '@/lib/aliados-db';
import { createPromo, PromoTipo } from '@/lib/promos-db';
import { normalizarTelefono } from '@/lib/services/evolutionService';
import { registrarLog } from '@/lib/services/botState';

export const dynamic = 'force-dynamic';

function verificarAuth(req: NextRequest): boolean {
  const bridgeKey = process.env.BRIDGE_API_KEY || 'qcel-bridge-2026-XkP9mRzLvW4qNjT';
  const pubKey = process.env.PUBLICACION_API_KEY;
  const headerKey = req.headers.get('x-bridge-key');
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (headerKey && (headerKey === bridgeKey || (pubKey && headerKey === pubKey))) return true;
  if (authHeader && (authHeader === bridgeKey || (pubKey && authHeader === pubKey))) return true;
  return false;
}

export async function POST(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const {
    telefono,
    restaurante,
    descripcion,
    precio,
    ubicacion,
    pedido_mismo_numero,
    pedido_otro_numero,
    datos,
  } = body;

  const nombreRestaurante = restaurante || datos?.nombre_restaurante || 'Restaurante';
  const telContacto = normalizarTelefono(telefono || '');
  const telPedidos = pedido_mismo_numero
    ? telContacto
    : normalizarTelefono(pedido_otro_numero || telContacto);

  if (!telContacto) {
    return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 });
  }

  try {
    // 1. Obtener o crear aliado en la base de datos
    let aliado = await getAliadoByTelefono(telContacto);
    const slugBase = nombreRestaurante
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!aliado) {
      const nuevoId = await createAliado({
        nombre: nombreRestaurante,
        telefono: telContacto,
        tipo: 'GASTRONOMIA',
        ubicacion: ubicacion || 'Loja, Ecuador',
        descripcion: descripcion || `Restaurante ${nombreRestaurante} en Loja`,
        activo: 1,
        destacado: 0,
      });
      aliado = {
        id: nuevoId,
        nombre: nombreRestaurante,
        tipo: 'GASTRONOMIA',
        imagenUrl: null,
        servicios: null,
        telefono: telContacto,
        destacado: false,
        activo: true,
        descripcion: descripcion || '',
        mapaUrl: null,
        rangoPrecio: null,
        redesUrl: null,
        ubicacion: ubicacion || 'Loja, Ecuador',
        websiteUrl: null,
        ubicacionLat: null,
        ubicacionLng: null,
        estrellas: 5,
      };
    }

    // 2. Determinar si es Cena Navideña o Menú del Día
    const textoDetectar = `${nombreRestaurante} ${descripcion || ''}`.toLowerCase();
    const esNavidad = /(cena\s*navide[ñn]a|pavo|pernil|navidad|navide[ñn]o|brindis|a[ñn]o\s*nuevo|fin\s*de\s*a[ñn]o)/i.test(textoDetectar);

    const tipoPromo: PromoTipo = esNavidad ? 'CENA_NAVIDENA' : 'PROMO';
    const tituloPromo = esNavidad
      ? `Cena Navideña: ${nombreRestaurante}`
      : `Menú del Día: ${nombreRestaurante}`;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fechaInicioStr = `${yyyy}-${mm}-${dd} 00:00:00`;
    const fechaFinStr = esNavidad ? `${yyyy}-12-31 23:59:59` : `${yyyy}-${mm}-${dd} 23:59:59`;

    // 3. Crear la publicación directa en la base de datos
    const { id: promoId, slug: promoSlug } = await createPromo({
      aliado_slug: slugBase || `restaurante-${aliado.id}`,
      aliado_nombre: nombreRestaurante,
      titulo: tituloPromo,
      tipo: tipoPromo,
      descripcion: descripcion || 'Menú y platos especiales preparados para hoy.',
      imagen_url: aliado.imagenUrl || null,
      precio_promo: precio || null,
      fecha_inicio: fechaInicioStr,
      fecha_fin: fechaFinStr,
      lugar: ubicacion || aliado.ubicacion || 'Loja, Ecuador',
      whatsapp_url: telPedidos ? `https://wa.me/${telPedidos}` : null,
      color_marca: '#153E3E',
    });

    const linkPublicacion = esNavidad
      ? `https://www.quecomerenloja.com/cenas-navidenas-loja`
      : `https://www.quecomerenloja.com/promos/${promoSlug}`;

    await registrarLog({
      aliado_nombre: nombreRestaurante,
      numero: telContacto,
      tipo: 'PUBLICADO',
      mensaje_in: `[BRIDGE-PUBLICAR-PRUEBA] ${descripcion || ''} (Precio: ${precio || 'N/A'})`,
      respuesta_out: `Publicación creada: ${linkPublicacion}`,
      promo_id: promoId,
    });

    return NextResponse.json({
      success: true,
      link: linkPublicacion,
      url: linkPublicacion,
      permalink: linkPublicacion,
      promoId,
      promoSlug,
    });
  } catch (err: any) {
    console.error('[BRIDGE:PUBLICAR_PRUEBA:ERROR]', err);
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}
