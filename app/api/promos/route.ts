import { NextResponse } from 'next/server';
import { getPromosActivas, createPromo, getAliadoNombreBySlug, getPromoBySlug } from '@/lib/promos-db';

// GET /api/promos -> lista de promos activas para calendario y slider
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const promos = await getPromosActivas(limit);
    return NextResponse.json({ success: true, promos });
  } catch (err: any) {
    console.error('Error al obtener promociones:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/promos -> crear nueva promo desde /publicar-promo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      aliado_slug,
      titulo,
      tipo,
      descripcion,
      imagen_url,
      video_url,
      video_orientacion,
      precio_original,
      precio_promo,
      fecha_inicio,
      fecha_fin,
      lugar,
      whatsapp_url,
      color_marca,
    } = body;

    if (!aliado_slug || !titulo || !tipo || !descripcion || !fecha_inicio) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (aliado, título, tipo, descripción, fecha de inicio)' },
        { status: 400 }
      );
    }

    // Verificar si aliado existe o resolver nombre
    let nombreAliado = await getAliadoNombreBySlug(aliado_slug);
    if (!nombreAliado) {
      // Si no está registrado en DB aún, capitalizar el slug amigablemente
      nombreAliado = aliado_slug
        .split('-')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    const newId = await createPromo({
      aliado_slug,
      aliado_nombre: nombreAliado || aliado_slug,
      titulo,
      tipo,
      descripcion,
      imagen_url: imagen_url || null,
      video_url: video_url || null,
      video_orientacion: video_orientacion || 'VERTICAL',
      precio_original: precio_original || null,
      precio_promo: precio_promo || null,
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      lugar: lugar || null,
      whatsapp_url: whatsapp_url || null,
      color_marca: color_marca || '#153E3E',
    });

    return NextResponse.json({
      success: true,
      id: newId,
      message: 'Promoción publicada correctamente',
    });
  } catch (err: any) {
    console.error('Error al crear promoción:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
