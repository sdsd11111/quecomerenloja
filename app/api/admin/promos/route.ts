import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllPromosAdmin, updatePromo, deletePromo, getPromoBySlug } from '@/lib/promos-db';

const AUTH_COOKIE_NAME = 'admin_session_token';
const AUTH_SECRET_VALUE = 'authenticated_mi_sitio_admin_2026';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}

// GET: Listar todas las promos para admin
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const promos = await getAllPromosAdmin();
    return NextResponse.json({ success: true, promos });
  } catch (err: any) {
    console.error('Error al obtener promos admin:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Actualizar promo existente (estado, datos, destacado)
export async function PUT(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Falta el id de la promoción' }, { status: 400 });
    }

    await updatePromo(Number(id), data);
    return NextResponse.json({ success: true, message: 'Promoción actualizada con éxito' });
  } catch (err: any) {
    console.error('Error al actualizar promo admin:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Eliminar promo
export async function DELETE(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Falta el id de la promoción' }, { status: 400 });
    }

    await deletePromo(Number(id));
    return NextResponse.json({ success: true, message: 'Promoción eliminada' });
  } catch (err: any) {
    console.error('Error al eliminar promo admin:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
