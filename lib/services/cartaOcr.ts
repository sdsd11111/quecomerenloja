import 'server-only';
import os from 'node:os';
import path from 'node:path';
import { createWorker, type Worker } from 'tesseract.js';
import type { PlatoBorrador } from '@/lib/formulario';

/**
 * Lectura de la carta del restaurante.
 *
 * Pipeline real (sin depender de modelos de visión, que hoy no están
 * disponibles en la cuenta de Groq del proyecto):
 *
 *   foto de la carta → Tesseract.js (OCR local, español) → texto
 *                     → modelo de texto de Groq (JSON) → borrador de platos
 *                     → fallback determinista si la IA no responde
 *
 * El resultado SIEMPRE es un borrador para revisión humana en
 * /admin/solicitudes. Nunca se publica directo.
 */

const MODELOS_TEXTO = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
];

const CACHE_TESSDATA = process.env.TESSDATA_CACHE || path.join(os.tmpdir(), 'qccl-tessdata');

// Un solo worker reutilizable: crearlo es caro (~1 s) y las cartas llegan de a uno.
let workerPromise: Promise<Worker> | null = null;
let cola: Promise<string> = Promise.resolve('');

async function obtenerWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker('spa+eng', 1, {
      cachePath: CACHE_TESSDATA,
      logger: () => {},
    }).catch((e) => {
      workerPromise = null;
      throw e;
    });
  }
  return workerPromise;
}

export interface ResultadoLectura {
  texto: string;
  platos: PlatoBorrador[];
  motor: 'ocr+ia' | 'ocr+reglas' | 'indisponible';
}

function limpiarPrecio(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  const limpio = String(valor).replace(/[^\d.,]/g, '');
  if (!limpio) return null;
  const normalizado = limpio.replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const num = Number.parseFloat(normalizado);
  if (!Number.isFinite(num)) return null;
  return num >= 0 && num <= 500 ? num : null;
}

function normalizarPlatos(raw: unknown): PlatoBorrador[] {
  if (!Array.isArray(raw)) return [];
  const salida: PlatoBorrador[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const p = item as Record<string, unknown>;
    const nombre = String(p.nombre ?? '').trim();
    if (!nombre || nombre.length < 3) continue;
    if (/^(men[úu]|carta|menu del d[ií]a|lista|precios?|nuestro)/i.test(nombre)) continue;
    salida.push({
      nombre: nombre.slice(0, 160),
      descripcion: p.descripcion ? String(p.descripcion).slice(0, 500) : undefined,
      precio: limpiarPrecio(p.precio),
      momento: p.momento ? String(p.momento).toLowerCase() : undefined,
      palabrasClave: p.palabrasClave ? String(p.palabrasClave).slice(0, 500) : undefined,
    });
    if (salida.length >= 60) break;
  }
  return salida;
}

/** Reglas simples para cuando la IA no está disponible: "Plato ... $ 6.50". */
export function parsearCartaReglas(texto: string): PlatoBorrador[] {
  const platos: PlatoBorrador[] = [];
  for (const linea of texto.split('\n')) {
    const limpio = linea.replace(/\s+/g, ' ').trim();
    if (limpio.length < 5) continue;
    const m = limpio.match(/^(.+?)[.\s]*\$?\s*(\d{1,3}(?:[.,]\d{2}))?$/);
    if (!m) continue;
    const nombre = m[1].replace(/[.\s]+$/, '').trim();
    const precio = m[2] ? limpiarPrecio(m[2]) : null;
    if (nombre.length < 4 || nombre.length > 120) continue;
    if (!/[a-zA-ZáéíóúñÑ]/.test(nombre)) continue;
    if (!precio && !/\b\w+\b\s+\w+/.test(nombre)) continue;
    platos.push({
      nombre,
      precio,
      momento: 'almuerzo',
      palabrasClave: nombre.toLowerCase(),
    });
    if (platos.length >= 60) break;
  }
  return platos;
}

async function estructurarConIA(
  texto: string,
  nombreRestaurante: string
): Promise<{ texto: string; platos: PlatoBorrador[] } | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !texto.trim()) return null;

  const prompt = `Eres el asistente gastronómico de "Qué Comer en Loja" (Loja, Ecuador).
Esta es la carta leída del restaurante "${nombreRestaurante}":

"""
${texto.slice(0, 6000)}
"""

Devuelve SOLO un JSON válido con esta forma:
{
  "texto": "el texto de la carta tal cual lo leíste",
  "platos": [
    { "nombre": "", "descripcion": "", "precio": null, "momento": "desayuno|almuerzo|cena|noche", "palabrasClave": "" }
  ]
}

Reglas:
- Un plato por fila de la carta. Ignora encabezados como "MENÚ DEL DÍA", "CARTAS" o precios sueltos.
- "precio": número o null. No inventes precios.
- "descripcion": solo si el texto la da; si no, cadena vacía.
- "palabrasClave": ingredientes o sinónimos para que nos encuentren al buscar (ej: "repe, cecina, menestra").
- "momento": según el texto; si no se puede saber, "almuerzo".`;

  for (const modelo of MODELOS_TEXTO) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelo,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 1800,
          response_format: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        const detalle = await res.text().catch(() => '');
        console.warn(`[cartaOcr] ${modelo} respondió ${res.status}: ${detalle.slice(0, 160)}`);
        continue;
      }

      const data = await res.json();
      let contenido: string = data?.choices?.[0]?.message?.content || '';
      if (!contenido) continue;

      // Algunos modelos devuelven razonamiento + JSON: nos quedamos con el bloque JSON.
      if (!contenido.trim().startsWith('{')) {
        const match = contenido.match(/\{[\s\S]*\}/);
        if (match) contenido = match[0];
      }

      let json: any;
      try {
        json = JSON.parse(contenido);
      } catch {
        continue;
      }

      const platos = normalizarPlatos(json.platos);
      if (platos.length > 0) {
        return { texto: String(json.texto ?? texto).slice(0, 8000), platos };
      }
    } catch (e: any) {
      console.warn('[cartaOcr] error con', modelo, e?.message);
    }
  }
  return null;
}

/**
 * Lee la carta desde los bytes de una imagen (JPG/PNG/WEBP).
 * `buffer` se pasa porque el archivo recién subido ya está en memoria.
 */
export async function leerCartaDesdeImagen(
  buffer: Buffer,
  nombreRestaurante: string
): Promise<ResultadoLectura | null> {
  // 1) OCR local
  cola = cola.then(async (): Promise<string> => {
    const worker = await obtenerWorker();
    const { data } = await worker.recognize(buffer);
    return data?.text || '';
  });

  let texto = '';
  try {
    texto = await cola;
  } catch (e: any) {
    console.warn('[cartaOcr] OCR falló:', e?.message);
    return null;
  }

  if (!texto || texto.replace(/\s/g, '').length < 12) {
    console.warn('[cartaOcr] La imagen no entregó texto legible.');
    return null;
  }

  // 2) Estructurar con IA
  const conIA = await estructurarConIA(texto, nombreRestaurante);
  if (conIA) {
    return { texto: conIA.texto, platos: conIA.platos, motor: 'ocr+ia' };
  }

  // 3) Fallback de reglas
  const platos = parsearCartaReglas(texto);
  return { texto, platos, motor: 'ocr+reglas' };
}
