import 'server-only';
import type { PromoTipo } from '@/lib/promos-db';

export interface MenuParsed {
  titulo: string;
  descripcion: string;
  tipo: PromoTipo;
  precioPromo: string | null;
  precioOriginal: string | null;
}

/**
 * Valida si el texto comienza con uno de los prefijos autorizados de menú/promo.
 * Ejemplos aceptados:
 * - "MENU: ..."
 * - "MENU ..."
 * - "#MENU ..."
 * - "PROMO: ..."
 * - "MENÚ DEL DÍA: ..."
 */
export function extraerPrefijoMenu(texto: string): { tienePrefijo: boolean; textoLimpio: string; tipoDetectado: PromoTipo } {
  if (!texto) return { tienePrefijo: false, textoLimpio: '', tipoDetectado: 'PROMO' };

  const textoTrim = texto.trim();
  const lower = textoTrim.toLowerCase();

  // Expresiones regulares para los comandos de inicio
  const menuRegex = /^(#?men[uú](\s*del\s*d[ií]a)?\s*:?\s*)/i;
  const promoRegex = /^(#?promo(ci[oó]n)?\s*:?\s*)/i;
  const ofertaRegex = /^(#?oferta\s*:?\s*)/i;
  const eventoRegex = /^(#?evento\s*:?\s*)/i;

  if (menuRegex.test(lower)) {
    const textoLimpio = textoTrim.replace(menuRegex, '').trim();
    return { tienePrefijo: true, textoLimpio, tipoDetectado: 'PROMO' };
  }

  if (promoRegex.test(lower)) {
    const textoLimpio = textoTrim.replace(promoRegex, '').trim();
    return { tienePrefijo: true, textoLimpio, tipoDetectado: 'PROMO' };
  }

  if (ofertaRegex.test(lower)) {
    const textoLimpio = textoTrim.replace(ofertaRegex, '').trim();
    return { tienePrefijo: true, textoLimpio, tipoDetectado: 'OFERTA' };
  }

  if (eventoRegex.test(lower)) {
    const textoLimpio = textoTrim.replace(eventoRegex, '').trim();
    return { tienePrefijo: true, textoLimpio, tipoDetectado: 'EVENTO' };
  }

  // Detección contextual: si menciona palabras gastronómicas típicas de un menú
  const esContextual =
    lower.includes('almuerzo') ||
    lower.includes('sopa') ||
    lower.includes('segundo') ||
    lower.includes('repe') ||
    lower.includes('cecina') ||
    lower.includes('arveja') ||
    lower.includes('sazón') ||
    lower.includes('plato') ||
    lower.includes('menú') ||
    lower.includes('menu');

  if (esContextual) {
    return { tienePrefijo: true, textoLimpio: textoTrim, tipoDetectado: 'PROMO' };
  }

  return { tienePrefijo: false, textoLimpio: textoTrim, tipoDetectado: 'PROMO' };
}

/**
 * Parsea el texto del menú usando Groq AI (Llama 3.3 70B) con fallback determinista
 */
export async function parsearMenuConIA(textoCrudo: string, nombreAliado: string, tipoDetectado: PromoTipo = 'PROMO'): Promise<MenuParsed> {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Eres el asistente gastronómico oficial de "Qué Comer en Loja" (Ecuador).
Un restaurante aliado llamado "${nombreAliado}" acaba de enviar su menú o promoción diaria por WhatsApp:

"""
${textoCrudo}
"""

Tu tarea es estructurar estos datos en formato JSON estricto con los siguientes campos:
1. "titulo": Título corto y apetitoso (máximo 70 caracteres). Ejemplo: "Menú del Día: Repe Lojano y Cecina", "Almuerzo Ejecutivo Completo", "Combo 2x1 en Alitas", etc.
2. "descripcion": Descripción bien formateada para la web, usando viñetas (•) para listar platos o detalles si corresponde. Conserva todos los platos que mencionó.
3. "precioPromo": Si menciona un precio de venta (ej: "$3.50", "3.00", "$4"), extráelo en formato "$X.XX". Si no hay, pon null.
4. "precioOriginal": Si menciona un precio anterior antes de descuento, extráelo; si no, pon null.
5. "tipo": Uno de estos valores exactos: "PROMO", "OFERTA", "EVENTO", "NOVEDAD". (Usa "${tipoDetectado}" por defecto).

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON válido, sin texto adicional ni bloques markdown.`;

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 600,
          response_format: { type: 'json_object' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.titulo && parsed.descripcion) {
            return {
              titulo: String(parsed.titulo).slice(0, 100),
              descripcion: String(parsed.descripcion),
              tipo: ['PROMO', 'EVENTO', 'NOVEDAD', 'OFERTA'].includes(parsed.tipo) ? parsed.tipo : tipoDetectado,
              precioPromo: parsed.precioPromo ? String(parsed.precioPromo) : null,
              precioOriginal: parsed.precioOriginal ? String(parsed.precioOriginal) : null,
            };
          }
        }
      }
    } catch (e) {
      console.warn('[parsearMenuConIA] Error llamando a Groq, usando fallback determinista:', e);
    }
  }

  // Fallback determinista si Groq no está disponible o falla
  return parsearMenuFallback(textoCrudo, tipoDetectado);
}

/**
 * Parser de respaldo determinista sin dependencias externas
 */
export function parsearMenuFallback(texto: string, tipoDetectado: PromoTipo = 'PROMO'): MenuParsed {
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);

  // Intentar detectar precio con Regex evitando capturar números de direcciones como '24 de Mayo'
  // Busca patrones explícitos de dinero: $3, $3.00, $3.25, 3.50$, o números precedidos de 'precio:' o 'valor:'
  const precioExpRegex = /(?:\$|usd)\s*(\d{1,2}(?:[.,]\d{2})?)|(?:precio|valor|costo)[:\s]*\$?\s*(\d{1,2}(?:[.,]\d{2})?)/i;
  let precioEncontrado: string | null = null;

  for (const linea of lineas) {
    // Si la línea parece ser una dirección (ej: "24 de Mayo"), saltarla para no confundir con $24
    if (/24\s*de\s*mayo|calle|av\.|avenida|entre/i.test(linea)) {
      continue;
    }
    const match = linea.match(precioExpRegex);
    if (match) {
      const val = match[1] || match[2];
      if (val) {
        const num = parseFloat(val.replace(',', '.'));
        if (num >= 1 && num <= 30) {
          precioEncontrado = `$${num.toFixed(2)}`;
          break;
        }
      }
    }
  }

  // Si aún no encontró precio, buscar cualquier $X.XX aislado que no sea 24
  if (!precioEncontrado) {
    const backupRegex = /\$\s*(\d{1,2}(?:[.,]\d{2})?)/g;
    let m;
    while ((m = backupRegex.exec(texto)) !== null) {
      const n = parseFloat(m[1].replace(',', '.'));
      if (n >= 1 && n <= 30 && n !== 24) {
        precioEncontrado = `$${n.toFixed(2)}`;
        break;
      }
    }
  }

  let titulo = 'Menú del Día';
  let descripcion = texto;

  // Extraer platos clave para un buen título
  const repeMatch = texto.match(/repe(?:\s+blanco)?/i);
  const secoMatch = texto.match(/seco\s+de\s+\w+/i);
  const pechugaMatch = texto.match(/pechuga\s+en\s+salsa\s+\w+/i);

  if (repeMatch && (secoMatch || pechugaMatch)) {
    const segundo = secoMatch ? secoMatch[0] : pechugaMatch![0];
    titulo = `Menú del Día: ${repeMatch[0]} y ${segundo}`;
  } else if (repeMatch) {
    titulo = `Menú del Día: ${repeMatch[0]}`;
  } else if (lineas.length > 0) {
    const primera = lineas.find((l) => !/^(menu|menú|¡?llegó)/i.test(l)) || lineas[0];
    titulo = primera.length <= 70 ? primera : primera.slice(0, 67) + '...';
  }

  return {
    titulo,
    descripcion,
    tipo: tipoDetectado,
    precioPromo: precioEncontrado,
    precioOriginal: null,
  };
}
