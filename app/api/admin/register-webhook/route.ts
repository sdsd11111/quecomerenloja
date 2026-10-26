import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AUTH_SECRET = 'authenticated_mi_sitio_admin_2026';
const AUTH_COOKIE = 'admin_session_token';

function isAuthenticated(req: NextRequest): boolean {
  const cookieHeader = req.headers.get('cookie') || '';
  return cookieHeader.includes(`${AUTH_COOKIE}=${AUTH_SECRET}`);
}

/**
 * POST /api/admin/register-webhook
 * Registra (o actualiza) el webhook en la instancia de Evolution API
 * apuntando a /api/webhooks/whatsapp-promos de este dominio.
 *
 * Body (opcional): { webhookUrl: string }
 * Si no se envía webhookUrl, se intenta detectar desde la petición.
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const baseUrl = process.env.EVOLUTION_API_URL || 'http://178.238.238.158:8080';
  const apiKey = process.env.EVOLUTION_API_KEY || '42a447c1-3d74-4b52-9571-042c174f7621';
  const instance = process.env.EVOLUTION_INSTANCE || 'agenda-cultural';

  // URL del webhook: puede venir en el body o se construye desde el host de la petición
  let webhookUrl: string = body.webhookUrl || '';
  if (!webhookUrl) {
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = host.startsWith('localhost') ? 'http' : 'https';
    webhookUrl = `${proto}://${host}/api/webhooks/whatsapp-promos`;
  }

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/webhook/set/${instance}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        url: webhookUrl,
        webhook_by_events: false,
        webhook_base64: false,
        events: [
          'MESSAGES_UPSERT',     // Mensajes entrantes (el principal)
          'MESSAGES_UPDATE',     // Actualizaciones de estado de mensajes
          'CONNECTION_UPDATE',   // Estado de la conexión
        ],
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[register-webhook] Error de Evolution API:', res.status, data);
      return NextResponse.json(
        { success: false, error: `Evolution API ${res.status}`, detail: data },
        { status: 502 }
      );
    }

    console.log('[register-webhook] Webhook registrado exitosamente:', webhookUrl);
    return NextResponse.json({
      success: true,
      webhookUrl,
      instance,
      response: data,
    });
  } catch (err: any) {
    console.error('[register-webhook] Excepción:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Error de conexión con Evolution API' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/register-webhook
 * Devuelve el estado actual del webhook registrado en Evolution API.
 */
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const baseUrl = process.env.EVOLUTION_API_URL || 'http://178.238.238.158:8080';
  const apiKey = process.env.EVOLUTION_API_KEY || '42a447c1-3d74-4b52-9571-042c174f7621';
  const instance = process.env.EVOLUTION_INSTANCE || 'agenda-cultural';

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/webhook/find/${instance}`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { apikey: apiKey },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ success: res.ok, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
