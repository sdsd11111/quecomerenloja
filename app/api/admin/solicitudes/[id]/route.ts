import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { obtenerSolicitud, actualizarSolicitud } from '@/lib/solicitudes-db';
import { publicarSolicitud } from '@/lib/publicar-solicitud';
import { descifrarTexto } from '@/lib/cifrado';
import type { EstadoSolicitud, PlatoBorrador } from '@/lib/formulario';

const AUTH_COOKIE_NAME = 'admin_session_token';
const AUTH_SECRET_VALUE = 'authenticated_mi_sitio_admin_2026';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const solicitud = await obtenerSolicitud(Number(id));
    if (!solicitud) return NextResponse.json({ error: 'No existe' }, { status: 404 });
    return NextResponse.json({
      success: true,
      solicitud: {
        ...solicitud,
        cuentaBancaria: solicitud.cuentaBancaria ? descifrarTexto(solicitud.cuentaBancaria) : null,
      },
    });
  } catch (err: any) {
    console.error('[admin/solicitudes/:id] Error:', err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { eliminarSolicitud } = await import('@/lib/solicitudes-db');
    const ok = await eliminarSolicitud(Number(id));
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    console.error('[admin/solicitudes/:id] Error al borrar:', err);
    return NextResponse.json({ error: err?.message || 'Error al borrar' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const idNum = Number(id);
    const solicitud = await obtenerSolicitud(idNum);
    if (!solicitud) return NextResponse.json({ error: 'No existe' }, { status: 404 });

    const body = await request.json();
    const accion = String(body?.accion || '');

    if (accion === 'borrador') {
      const platos: PlatoBorrador[] = Array.isArray(body.platos) ? body.platos : [];
      await actualizarSolicitud(idNum, { borrador: platos });
      return NextResponse.json({ success: true });
    }

    if (accion === 'estado') {
      const estado = String(body.estado || '') as EstadoSolicitud;
      const validos: EstadoSolicitud[] = ['recibido', 'en_revision', 'aprobado', 'publicado', 'rechazado'];
      if (!validos.includes(estado)) {
        return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
      }
      await actualizarSolicitud(idNum, {
        estado,
        motivoRechazo: body.motivo ?? null,
      });
      return NextResponse.json({ success: true });
    }

    if (accion === 'publicar') {
      const platos: PlatoBorrador[] = Array.isArray(body.platos)
        ? body.platos
        : solicitud.borrador || [];
      const imagenUrl =
        solicitud.archivos.find((a) => a.tipo === 'foto')?.url ||
        solicitud.archivos.find((a) => a.tipo === 'carta')?.url ||
        null;

      const resultado = await publicarSolicitud(solicitud, platos, { imagenUrl });
      await actualizarSolicitud(idNum, {
        estado: 'publicado',
        aliadoId: resultado.aliadoId,
        borrador: platos,
      });
      return NextResponse.json({ success: true, ...resultado });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (err: any) {
    console.error('[admin/solicitudes/:id] Error:', err);
    return NextResponse.json({ error: err?.message || 'Error al procesar' }, { status: 500 });
  }
}
