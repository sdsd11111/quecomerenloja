import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllAliadosAdmin, createAliado, updateAliado, deleteAliado, getAliadoById } from '@/lib/aliados-db';
import { catalogoActivo, vincularPlatosAliado } from '@/lib/publicar-solicitud';
import { slugify } from '@/lib/formulario';

export const dynamic = 'force-dynamic';

const AUTH_COOKIE_NAME = 'admin_session_token';
const AUTH_SECRET_VALUE = 'authenticated_mi_sitio_admin_2026';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}

// GET: Listar todos los aliados para el panel admin
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const aliados = await getAllAliadosAdmin();

    // Anexar la solicitud de alta relacionada (carta, fotos y menú leído por IA)
    let porAliado: Record<number, any> = {};
    try {
      const { listarSolicitudes } = await import('@/lib/solicitudes-db');
      const solicitudes = await listarSolicitudes();
      for (const s of solicitudes) {
        if (!s.aliadoId) continue;
        porAliado[s.aliadoId] = {
          folio: s.folio,
          estado: s.estado,
          cartaTexto: s.cartaTexto,
          borrador: s.borrador,
          nombreComercial: s.nombreComercial,
          direccion: s.direccion,
          horarios: s.horarios,
          lat: s.lat,
          lng: s.lng,
          mapaUrl: s.mapaUrl,
          archivos: s.archivos.map((a) => ({
            id: a.id,
            tipo: a.tipo,
            nombre: a.nombre,
            url: a.url,
          })),
        };
      }
    } catch (e: any) {
      console.warn('[admin/aliados] No se pudieron anexar las solicitudes:', e?.message);
    }

    const conSolicitud = aliados.map((a) => ({
      ...a,
      solicitud: a.id ? porAliado[a.id] || null : null,
    }));

    // Catálogo de platos del sitio: sirve para emparejar los platos leídos por
    // la IA con las páginas /platos/<slug> que ya existen.
    let catalogo: { slug: string; nombre: string }[] = [];
    try {
      catalogo = (await catalogoActivo()).map((p) => ({ slug: p.slug, nombre: p.nombre }));
    } catch (e: any) {
      console.warn('[admin/aliados] No se pudo cargar el catálogo de platos:', e?.message);
    }

    return NextResponse.json(
      { success: true, aliados: conSolicitud, catalogo },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Error al obtener aliados admin:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Crear nuevo aliado
export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { nombre, tipo, descripcion, ubicacion } = data;

    if (!nombre || !tipo || !descripcion || !ubicacion) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes: nombre, tipo, descripción o ubicación' },
        { status: 400 }
      );
    }

    const newId = await createAliado(data);
    const created = await getAliadoById(newId);
    return NextResponse.json({ success: true, aliado: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error al crear aliado:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Actualizar aliado existente
export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID de aliado es requerido' }, { status: 400 });
    }

    // El nombre es obligatorio: sin él el aliado no aparece en la web.
    if (typeof updateData?.nombre === 'string' && !updateData.nombre.trim()) {
      return NextResponse.json(
        { error: 'El aliado necesita un nombre para aparecer en /platos, /restaurantes y el chatbot' },
        { status: 400 }
      );
    }

    const ok = await updateAliado(Number(id), updateData);
    if (!ok) {
      return NextResponse.json({ error: 'Aliado no encontrado o sin cambios' }, { status: 404 });
    }

    const updated = await getAliadoById(Number(id));

    // Si el editor marcó platos del catálogo, se crean los enlaces en
    // `plato_restaurantes` (los que hacen aparecer el restaurante en /platos/<slug>).
    let vinculacion: Awaited<ReturnType<typeof vincularPlatosAliado>> | null = null;
    try {
      const detalle = Array.isArray(updateData?.platosDetalle) ? updateData.platosDetalle : null;
      const slugs: string[] = Array.isArray(updateData?.platos) ? updateData.platos : [];

      if ((detalle && detalle.length > 0) || slugs.length > 0) {
        const { listarSolicitudes } = await import('@/lib/solicitudes-db');
        const solicitudes = await listarSolicitudes();
        const sol = solicitudes.find((s) => s.aliadoId === Number(id));

        let aVincular: any[] = [];
        if (detalle && detalle.length > 0) {
          // El panel ya eligió la página del catálogo para cada plato.
          aVincular = detalle;
        } else {
          const borrador = sol?.borrador || [];
          aVincular = borrador.filter((p: any) => slugs.includes(slugify(p.nombre)));
        }

        if (aVincular.length > 0) {
          vinculacion = await vincularPlatosAliado({
            aliadoId: Number(id),
            nombreComercial: sol?.nombreComercial || updated?.nombre || '',
            direccion: sol?.direccion || updated?.ubicacion || '',
            categoria: sol?.categorias?.[0] || null,
            platos: aVincular,
          });

          // Guardar los slugs reales del catálogo en la ficha del aliado.
          const slugsReales = Array.from(
            new Set(vinculacion.platosEnlazados.map((p) => p.slug))
          );
          if (slugsReales.length > 0 || slugs.length > 0) {
            const { platosDetalle: _ignorado, ...resto } = updateData as any;
            const todosLosSlugs = Array.from(new Set([...slugs, ...slugsReales]));
            await updateAliado(Number(id), { ...resto, platos: todosLosSlugs });
          }
        }
      }
    } catch (e: any) {
      console.warn('[admin/aliados] No se pudieron vincular los platos:', e?.message);
    }

    return NextResponse.json({ success: true, aliado: updated, vinculacion });
  } catch (err: any) {
    console.error('Error al actualizar aliado:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Eliminar aliado
export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de aliado es requerido' }, { status: 400 });
    }

    const ok = await deleteAliado(Number(id));
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    console.error('Error al eliminar aliado:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
