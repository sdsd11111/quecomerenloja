import { NextRequest, NextResponse } from 'next/server';
import { createCotizacion } from '@/lib/cotizaciones-db';
import { normalizarTelefono } from '@/lib/services/evolutionService';

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
    restaurante,
    nombre,
    telefono,
    email,
    direccion,
    plan,
  } = body;

  const nombreRestaurante = restaurante || 'Restaurante';
  const nombreCliente = nombre || 'Propietario / Gerente';
  const telNorm = normalizarTelefono(telefono || '');

  if (!telNorm) {
    return NextResponse.json({ error: 'Teléfono requerido' }, { status: 400 });
  }

  try {
    const { codigo, id } = await createCotizacion({
      cliente_nombre: nombreCliente,
      restaurante_nombre: nombreRestaurante,
      telefono: telNorm,
      email: email || null,
      direccion: direccion || 'Loja, Ecuador',
      plan: plan === 'anual' ? 'anual' : 'mensual',
    });

    const link = `https://www.quecomerenloja.com/cotizaciones/${codigo}`;

    return NextResponse.json({
      success: true,
      id,
      codigo,
      link,
      url: link,
      permalink: link,
    });
  } catch (error: any) {
    console.error('[BRIDGE:COTIZACION:ERROR]', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
