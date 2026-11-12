import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { listarSolicitudes, contarSolicitudesPorEstado } from '@/lib/solicitudes-db';
import { descifrarTexto } from '@/lib/cifrado';

const AUTH_COOKIE_NAME = 'admin_session_token';
const AUTH_SECRET_VALUE = 'authenticated_mi_sitio_admin_2026';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const solicitudes = await listarSolicitudes();
    const resumen = await contarSolicitudesPorEstado();

    // La cuenta bancaria viaja cifrada; solo el panel la puede ver.
    const seguras = solicitudes.map((s) => ({
      ...s,
      cuentaBancaria: s.cuentaBancaria ? descifrarTexto(s.cuentaBancaria) : null,
    }));

    return NextResponse.json({ success: true, solicitudes: seguras, resumen });
  } catch (err: any) {
    console.error('[admin/solicitudes] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'No se pudieron cargar las solicitudes' },
      { status: 500 }
    );
  }
}
