import { NextRequest, NextResponse } from 'next/server';
import { getBotLogs } from '@/lib/services/botState';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const AUTH_SECRET = 'authenticated_mi_sitio_admin_2026';
const AUTH_COOKIE = 'admin_session_token';

function isAuthenticated(req: NextRequest): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  return cookieHeader.includes(`${AUTH_COOKIE}=${AUTH_SECRET}`);
}

/**
 * GET /api/admin/bot-logs
 * Devuelve los últimos logs del bot de WhatsApp para el panel admin.
 * Requiere autenticación de admin.
 */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
  const offset = parseInt(searchParams.get('offset') || '0');

  const logs = await getBotLogs(limit, offset);
  return NextResponse.json({ logs, total: logs.length });
}
