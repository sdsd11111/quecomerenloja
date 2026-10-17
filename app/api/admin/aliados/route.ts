import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllAliadosAdmin, createAliado, updateAliado, deleteAliado, getAliadoById } from '@/lib/aliados-db';

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
    return NextResponse.json({ success: true, aliados });
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

    const ok = await updateAliado(Number(id), updateData);
    if (!ok) {
      return NextResponse.json({ error: 'Aliado no encontrado o sin cambios' }, { status: 404 });
    }

    const updated = await getAliadoById(Number(id));
    return NextResponse.json({ success: true, aliado: updated });
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
