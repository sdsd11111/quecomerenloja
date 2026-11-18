import { NextRequest, NextResponse } from 'next/server';
import { getGastroPool } from '@/lib/aliados-db';
import { getAliadoByTelefono } from '@/lib/aliados-db';
import { sendEvolutionWhatsApp, normalizarTelefono } from '@/lib/services/evolutionService';
import { registrarLog } from '@/lib/services/botState';
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

// ─── Duración del trial: 7 días ──────────────────────────────────────────────
const TRIAL_DIAS = 7;

// ─── API Key del puente (el bot externo debe enviarla en el header) ───────────
// Guardada en BRIDGE_API_KEY en .env.local — si no está configurada, se
// usa el fallback para no bloquear el desarrollo.
function verificarApiKey(req: NextRequest): boolean {
  const keyEnv = process.env.BRIDGE_API_KEY;
  if (!keyEnv) return true; // sin restricción si no está configurada
  const keyHeader = req.headers.get('x-bridge-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  return keyHeader === keyEnv;
}

// ─── Mensaje de bienvenida al aliado trial ────────────────────────────────────
function msgBienvenidaTrial(nombre: string, diasTrial: number, tipoSugerido?: string): string {
  const esCena = tipoSugerido === 'CENA_NAVIDENA';
  return `🎉 *¡Hola ${nombre}!*

Te damos la bienvenida a tu *prueba gratuita de ${diasTrial} días* en *Qué Comer en Loja* 🍽️

Ya estás activado. Así de simple es publicar:

${esCena
    ? `🎄 *Para tu Cena Navideña:*\nEscribe: \`CENA NAVIDEÑA:\` y describe tu menú, precio y paquetes.\n\nEjemplo:\n_Cena Navideña: Pavo al horno, ensalada, postre y bebida. Precio $25 por persona. Mínimo 10 personas._`
    : `🍽️ *Para tu Menú del Día:*\nEscribe: \`MENU:\` y describe los platos del día.\n\nEjemplo:\n_MENU: Sopa de pollo, arroz, menestra, jugo y postre. Precio $3.50_`
}

📸 O simplemente *envía una foto* de tu afiche/pizarrón y lo publicamos directo.

Te mostraré un borrador antes de publicar. Solo escribe *SI* para confirmar. ✅

¿Tienes dudas? Solo escríbeme aquí mismo. 👋`;
}

// ─── POST /api/bridge/activar-trial ──────────────────────────────────────────
/**
 * El bot externo llama a este endpoint cuando un restaurante acepta la prueba.
 *
 * Body JSON esperado:
 * {
 *   "nombre": "Restaurante Don Pepe",
 *   "telefono": "0991234567",        // formato local 09... o internacional 593...
 *   "tipo": "MENU" | "CENA_NAVIDENA" // opcional, por defecto MENU
 *   "ubicacion": "Loja, Ecuador"     // opcional
 *   "descripcion": "..."             // opcional, descripción corta del negocio
 * }
 *
 * Headers requeridos:
 *   x-bridge-key: <BRIDGE_API_KEY>
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "aliadoId": 42,
 *   "telefono": "593991234567",
 *   "trial": true,
 *   "expiraEn": "2026-11-25",
 *   "mensaje": "Trial activado y bienvenida enviada por WhatsApp"
 * }
 */
export async function POST(req: NextRequest) {
  // ── 1. Verificar API key ──────────────────────────────────────────────────
  if (!verificarApiKey(req)) {
    return NextResponse.json({ success: false, error: 'API key inválida' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Body JSON inválido' }, { status: 400 });
  }

  const { nombre, telefono, tipo, ubicacion, descripcion } = body;

  // ── 2. Validar campos requeridos ──────────────────────────────────────────
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
    return NextResponse.json({ success: false, error: 'Campo "nombre" requerido (mínimo 2 caracteres)' }, { status: 400 });
  }
  if (!telefono || typeof telefono !== 'string') {
    return NextResponse.json({ success: false, error: 'Campo "telefono" requerido' }, { status: 400 });
  }

  const telefonoNorm = normalizarTelefono(telefono);
  if (!telefonoNorm || telefonoNorm.length < 7) {
    return NextResponse.json({ success: false, error: `Teléfono inválido: "${telefono}"` }, { status: 400 });
  }

  const tipoSugerido: string = (tipo === 'CENA_NAVIDENA' || tipo === 'NAVIDAD') ? 'CENA_NAVIDENA' : 'MENU';

  try {
    const pool = getGastroPool();

    // ── 3. Verificar si ya existe un aliado con ese teléfono ─────────────────
    const aliadoExistente = await getAliadoByTelefono(telefonoNorm);

    if (aliadoExistente) {
      // Ya existe y está activo → solo enviar bienvenida de recordatorio
      await sendEvolutionWhatsApp({
        number: telefonoNorm,
        text: msgBienvenidaTrial(aliadoExistente.nombre, TRIAL_DIAS, tipoSugerido),
      });

      await registrarLog({
        aliado_nombre: aliadoExistente.nombre,
        numero: telefonoNorm,
        tipo: 'BIENVENIDA',
        mensaje_in: `[BRIDGE] Trial re-activado. Tipo sugerido: ${tipoSugerido}`,
        respuesta_out: `Aliado ya existente (id=${aliadoExistente.id}). Bienvenida reenviada.`,
      });

      return NextResponse.json({
        success: true,
        aliadoId: aliadoExistente.id,
        telefono: telefonoNorm,
        trial: false,
        yaExistia: true,
        mensaje: 'Aliado ya registrado. Bienvenida de recordatorio enviada por WhatsApp.',
      });
    }

    // ── 4. Asegurar que la tabla aliados tiene la columna trial ──────────────
    // La columna se crea de forma idempotente si no existe.
    await ensureTrialColumns(pool);

    // ── 5. Calcular fecha de expiración del trial ─────────────────────────────
    const expira = new Date();
    expira.setDate(expira.getDate() + TRIAL_DIAS);
    const expiraStr = expira.toISOString().slice(0, 10); // YYYY-MM-DD

    // ── 6. Crear el aliado trial en la BD ─────────────────────────────────────
    const metaJson = JSON.stringify({ momentos: ['almuerzo', 'cena'], platos: [] });
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO aliados
         (nombre, tipo, telefono, activo, destacado, descripcion, ubicacion,
          imagenUrl, servicios, mapaUrl, rangoPrecio, redesUrl, websiteUrl,
          ubicacionLat, ubicacionLng, estrellas, cuartos,
          trial, trial_expira, trial_tipo_sugerido)
       VALUES (?, 'GASTRONOMIA', ?, 1, 0, ?, ?, NULL, 'trial', NULL, NULL, NULL, NULL, NULL, NULL, 5, ?, 1, ?, ?)`,
      [
        nombre.trim(),
        telefonoNorm,
        descripcion?.trim() || `Restaurante en prueba gratuita — ${nombre.trim()}`,
        ubicacion?.trim() || 'Loja, Ecuador',
        metaJson,
        expiraStr,
        tipoSugerido,
      ]
    );

    const aliadoId = result.insertId;

    // ── 7. Enviar mensaje de bienvenida por WhatsApp ──────────────────────────
    const { success: waSent, error: waError } = await sendEvolutionWhatsApp({
      number: telefonoNorm,
      text: msgBienvenidaTrial(nombre.trim(), TRIAL_DIAS, tipoSugerido),
    });

    // ── 8. Registrar en logs ──────────────────────────────────────────────────
    await registrarLog({
      aliado_nombre: nombre.trim(),
      numero: telefonoNorm,
      tipo: 'BIENVENIDA',
      mensaje_in: `[BRIDGE] Trial activado. Tipo: ${tipoSugerido}. Expira: ${expiraStr}`,
      respuesta_out: waSent
        ? `Bienvenida enviada OK. aliadoId=${aliadoId}`
        : `WA falló (${waError}). aliadoId=${aliadoId}`,
    });

    console.log(`[Bridge] ✅ Trial activado: ${nombre} (${telefonoNorm}) id=${aliadoId} expira=${expiraStr}`);

    return NextResponse.json({
      success: true,
      aliadoId,
      telefono: telefonoNorm,
      trial: true,
      expiraEn: expiraStr,
      whatsappEnviado: waSent,
      mensaje: waSent
        ? 'Trial activado y bienvenida enviada por WhatsApp ✅'
        : `Trial activado pero el WA falló (${waError}) — el restaurante ya puede escribir al bot.`,
    });
  } catch (error: any) {
    console.error('[Bridge /activar-trial]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ─── GET /api/bridge/activar-trial?telefono=... ──────────────────────────────
/**
 * Consultar si un número ya tiene trial activo.
 */
export async function GET(req: NextRequest) {
  if (!verificarApiKey(req)) {
    return NextResponse.json({ success: false, error: 'API key inválida' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const telefono = searchParams.get('telefono');

  if (!telefono) {
    return NextResponse.json({ success: false, error: 'Parámetro "telefono" requerido' }, { status: 400 });
  }

  const telefonoNorm = normalizarTelefono(telefono);
  const aliado = await getAliadoByTelefono(telefonoNorm);

  if (!aliado) {
    return NextResponse.json({ activo: false, trial: false, mensaje: 'Número no registrado' });
  }

  const pool = getGastroPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT trial, trial_expira, trial_tipo_sugerido FROM aliados WHERE id = ? LIMIT 1',
    [aliado.id]
  );
  const row = rows[0];

  return NextResponse.json({
    activo: true,
    aliadoId: aliado.id,
    nombre: aliado.nombre,
    telefono: telefonoNorm,
    trial: Boolean(row?.trial),
    expiraEn: row?.trial_expira || null,
    tipoSugerido: row?.trial_tipo_sugerido || 'MENU',
  });
}

// ─── Helper: crear columnas trial si no existen (idempotente) ─────────────────
async function ensureTrialColumns(pool: any): Promise<void> {
  // MySQL ignora el ALTER si la columna ya existe cuando usamos IF NOT EXISTS
  await pool.query(`
    ALTER TABLE aliados
      ADD COLUMN IF NOT EXISTS trial              TINYINT(1) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS trial_expira       DATE NULL,
      ADD COLUMN IF NOT EXISTS trial_tipo_sugerido VARCHAR(30) NULL
  `).catch(() => {
    // MySQL < 8.0 no soporta IF NOT EXISTS en ALTER — intentar columna a columna
    return Promise.all([
      pool.query(`ALTER TABLE aliados ADD COLUMN trial TINYINT(1) NOT NULL DEFAULT 0`)
        .catch(() => {}),
      pool.query(`ALTER TABLE aliados ADD COLUMN trial_expira DATE NULL`)
        .catch(() => {}),
      pool.query(`ALTER TABLE aliados ADD COLUMN trial_tipo_sugerido VARCHAR(30) NULL`)
        .catch(() => {}),
    ]);
  });
}
