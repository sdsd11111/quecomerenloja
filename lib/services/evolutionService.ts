import 'server-only';

interface SendMessageOptions {
  number: string;
  text: string;
}

/**
 * Normaliza un número telefónico quitando caracteres no numéricos,
 * sufijos de WhatsApp (@s.whatsapp.net) y asegurando formato internacional de Ecuador (593...).
 */
export function normalizarTelefono(rawPhone: string): string {
  if (!rawPhone) return '';
  // Quitar @s.whatsapp.net o @g.us si viene del webhook
  const sinSufijo = rawPhone.split('@')[0];
  // Quitar todo lo que no sea dígito
  let limpio = sinSufijo.replace(/\D/g, '');

  // Si empieza con 09 (ej: 0991234567 de Ecuador), convertir a 5939...
  if (limpio.startsWith('09') && limpio.length === 10) {
    limpio = '593' + limpio.slice(1);
  }
  // Si empieza con 9 y tiene 9 dígitos (991234567), anteponer 593
  else if (limpio.startsWith('9') && limpio.length === 9) {
    limpio = '593' + limpio;
  }

  return limpio;
}

/**
 * Compara si dos números telefónicos corresponden al mismo destinatario
 * considerando variaciones locales (con o sin código 593).
 */
export function sonMismoTelefono(telA: string, telB: string): boolean {
  const normA = normalizarTelefono(telA);
  const normB = normalizarTelefono(telB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  // Comparar los últimos 8-9 dígitos por seguridad si uno tiene o no prefijo internacional
  const ultimosA = normA.slice(-9);
  const ultimosB = normB.slice(-9);
  return ultimosA === ultimosB && ultimosA.length >= 8;
}

/**
 * Envía un mensaje de texto por WhatsApp a través de Evolution API
 */
export async function sendEvolutionWhatsApp({ number, text }: SendMessageOptions): Promise<{ success: boolean; error?: string }> {
  const baseUrl = process.env.EVOLUTION_API_URL || 'http://178.238.238.158:8080';
  const apiKey = process.env.EVOLUTION_API_KEY || '42a447c1-3d74-4b52-9571-042c174f7621';
  const instance = process.env.EVOLUTION_INSTANCE || 'que comer loja';

  const cleanNumber = normalizarTelefono(number);
  if (!cleanNumber) {
    return { success: false, error: 'Número de WhatsApp inválido' };
  }

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/message/sendText/${encodeURIComponent(instance)}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: cleanNumber,
        text,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: true,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Evolution API Error]', res.status, errText);
      return { success: false, error: `Evolution API returned ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (error: any) {
    console.error('[Evolution API Exception]', error);
    return { success: false, error: error.message || 'Error de conexión con Evolution API' };
  }
}

/**
 * Descarga una imagen o medio recibido en WhatsApp mediante Evolution API en formato Base64
 */
export async function getEvolutionMediaBase64(messageKeyId: string): Promise<string | null> {
  const baseUrl = process.env.EVOLUTION_API_URL || 'http://178.238.238.158:8080';
  const apiKey = process.env.EVOLUTION_API_KEY || '42a447c1-3d74-4b52-9571-042c174f7621';
  const instance = process.env.EVOLUTION_INSTANCE || 'que comer loja';

  try {
    const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/getBase64FromMediaMessage/${encodeURIComponent(instance)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        message: {
          key: {
            id: messageKeyId,
          },
        },
        convertToMp4: false,
      }),
    });

    if (!res.ok) {
      console.warn(`[Evolution Media] Error obteniendo base64 (${res.status})`);
      return null;
    }

    const data = await res.json();
    return data.base64 || null;
  } catch (err) {
    console.warn('[Evolution Media] Excepción descargando media:', err);
    return null;
  }
}

