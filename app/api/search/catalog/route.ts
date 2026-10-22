import { NextResponse } from 'next/server';
import { getAllPlatos } from '@/lib/platos-db';
import { getAliadosActivos } from '@/lib/aliados-db';

export const revalidate = 3600; // Cache 1 hora

export async function GET() {
  try {
    const [platos, aliados] = await Promise.all([
      getAllPlatos(),
      getAliadosActivos(),
    ]);

    const platosFormatted = platos.map((p) => ({
      type: 'plato' as const,
      id: `plato-${p.id}`,
      title: p.nombre,
      subtitle: `${p.seccion} · ${p.rango_precio_loja || 'Precio accesible'}`,
      slug: p.slug,
      href: `/platos/${p.slug}`,
      category: p.seccion,
      image: p.hero_imagen_url || null,
      keywords: [
        p.nombre.toLowerCase(),
        p.seccion.toLowerCase(),
        ...(p.ingredientes_clave || []).map((i) => i.toLowerCase()),
        'loja',
        'plato',
        'comida',
      ],
      price: p.rango_precio_loja,
    }));

    const aliadosFormatted = aliados.map((a) => {
      const telLimpio = (a.telefono || '').replace(/\D/g, '');
      const whatsappUrl = telLimpio
        ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
            `Hola ${a.nombre}, los vi en Qué Comer en Loja y deseo consultar su menú de hoy.`
          )}`
        : null;

      return {
        type: 'aliado' as const,
        id: `aliado-${a.id}`,
        title: a.nombre,
        subtitle: `${a.tipo === 'CAFETERIA' ? '☕ Cafetería' : '🍽️ Restaurante'} · ${a.ubicacion}`,
        href: `/restaurantes#aliado-${a.id}`,
        category: a.tipo === 'CAFETERIA' ? 'Cafetería' : 'Restaurante',
        image: a.imagenUrl || null,
        whatsappUrl,
        momentos: a.momentos || [],
        platosRelacionados: a.platos || [],
        price: a.rangoPrecio,
        keywords: [
          a.nombre.toLowerCase(),
          a.ubicacion.toLowerCase(),
          (a.servicios || '').toLowerCase(),
          (a.descripcion || '').toLowerCase(),
          ...(a.platos || []),
          ...(a.momentos || []),
          'restaurante',
          'aliado',
          'hoy',
          'menu',
        ],
      };
    });

    const momentosFormatted = [
      {
        type: 'momento' as const,
        id: 'momento-hoy',
        title: '¿Qué comer hoy en Loja?',
        subtitle: 'Platos del día, menús ejecutivos y promociones activas hoy',
        href: '/que-comer-hoy',
        category: 'Menú de Hoy',
        keywords: ['hoy', 'que comer hoy', 'menu del dia', 'platos de hoy', 'almuerzo hoy', 'desayuno hoy'],
      },
      {
        type: 'momento' as const,
        id: 'momento-desayunos',
        title: 'Desayunos en Loja & Café de Altura',
        subtitle: 'Tamales, humitas, bolones y tigrillo tradicional',
        href: '/desayunos-en-loja',
        category: 'Momento',
        keywords: ['desayuno', 'desayunos', 'tamales', 'humitas', 'bolon', 'bolones', 'tigrillo', 'cafe'],
      },
      {
        type: 'momento' as const,
        id: 'momento-almuerzos',
        title: 'Almuerzos & Menú Ejecutivo en Loja',
        subtitle: 'Menú del día completo desde $2.50 a $5.00',
        href: '/almuerzos-loja',
        category: 'Momento',
        keywords: ['almuerzo', 'almuerzos', 'menu ejecutivo', 'menu diario', 'sopa', 'segundo', 'economico'],
      },
      {
        type: 'momento' as const,
        id: 'momento-cena',
        title: 'Dónde Cenar en Loja: Alitas, Pizzas & Brasas',
        subtitle: 'Comida rápida nocturna, hamburguesas y parrilladas',
        href: '/comida-rapida-loja',
        category: 'Momento',
        keywords: ['cena', 'cenar', 'alitas', 'pizzas', 'hamburguesas', 'noche', 'chifa', 'salchipapas'],
      },
      {
        type: 'momento' as const,
        id: 'momento-bares',
        title: 'Bares & Vida Nocturna en Loja',
        subtitle: 'Cócteles de autor, cervecerías artesanales y música',
        href: '/bares-y-noche',
        category: 'Momento',
        keywords: ['bar', 'bares', 'noche', 'cocteles', 'cerveza artesanal', 'discoteca', 'tragos'],
      },
    ];

    return NextResponse.json(
      {
        platos: platosFormatted,
        aliados: aliadosFormatted,
        momentos: momentosFormatted,
        total: platosFormatted.length + aliadosFormatted.length + momentosFormatted.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error en /api/search/catalog:', error);
    return NextResponse.json(
      { error: 'Error al consultar catálogo' },
      { status: 500 }
    );
  }
}
