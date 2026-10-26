import 'server-only';
import { getGastroPool } from '@/lib/aliados-db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BOT STATE SERVICE
 * Gestiona el estado y la memoria del bot WhatsApp de menús diarios.
 * Funciones principales:
 *   - Anti-duplicados: evita que el mismo aliado publique 2 veces el mismo día
 *   - Logs de auditoría: registra cada publicación exitosa o fallida
 *   - Bienvenida de primera vez: detecta si es el primer contacto
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Anti-duplicados en memoria (capa rápida, se resetea en cada deploy) ───
// Formato: `${aliadoId}_${YYYY-MM-DD}` → true
const publicacionesHoy = new Map<string, number>(); // → promoId

/**
 * Genera la clave única de publicación diaria para un aliado.
 */
function clavePublicacion(aliadoId: number): string {
  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${aliadoId}_${hoy}`;
}

/**
 * Verifica si el aliado ya publicó su menú HOY en memoria (capa rápida).
 */
export function yaPublicoHoyEnMemoria(aliadoId: number): { yaPublico: boolean; promoId?: number } {
  const clave = clavePublicacion(aliadoId);
  const promoId = publicacionesHoy.get(clave);
  return { yaPublico: promoId !== undefined, promoId };
}

/**
 * Marca en memoria que el aliado ya publicó hoy.
 */
export function marcarPublicacionHoy(aliadoId: number, promoId: number): void {
  const clave = clavePublicacion(aliadoId);
  publicacionesHoy.set(clave, promoId);
  // Limpiar entradas de días anteriores (evitar memory leak)
  const hoy = new Date().toISOString().slice(0, 10);
  for (const [k] of publicacionesHoy) {
    if (!k.endsWith(`_${hoy}`)) {
      publicacionesHoy.delete(k);
    }
  }
}

/**
 * Verifica en BD si el aliado ya tiene una promo publicada HOY.
 * Esta es la capa persistente (funciona tras reinicios del servidor).
 */
export async function yaPublicoHoyEnBD(aliadoSlug: string): Promise<{ yaPublico: boolean; promoId?: number; titulo?: string }> {
  try {
    const pool = getGastroPool();
    const hoy = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, titulo FROM promociones_aliados
       WHERE aliado_slug = ?
         AND DATE(fecha_inicio) = ?
         AND estado IN ('ACTIVO', 'PENDIENTE')
       ORDER BY id DESC LIMIT 1`,
      [aliadoSlug, hoy]
    );
    if (rows.length > 0) {
      return { yaPublico: true, promoId: rows[0].id, titulo: rows[0].titulo };
    }
    return { yaPublico: false };
  } catch (e) {
    console.error('[botState.yaPublicoHoyEnBD]', e);
    return { yaPublico: false };
  }
}

// ─── Tabla bot_wa_logs (se crea auto si no existe) ───────────────────────────
export type BotLogTipo = 'PUBLICADO' | 'DUPLICADO' | 'NO_AUTORIZADO' | 'ERROR' | 'BIENVENIDA' | 'AYUDA';

export interface BotLog {
  id: number;
  aliado_nombre: string | null;
  numero: string;
  tipo: BotLogTipo;
  mensaje_in: string;
  respuesta_out: string | null;
  promo_id: number | null;
  createdAt: string;
}

/**
 * Asegura que la tabla de logs exista en la BD.
 * Se llama lazy al primer log para no bloquear el inicio.
 */
let tablaLogsCreada = false;
export async function ensureLogsTable(): Promise<void> {
  if (tablaLogsCreada) return;
  try {
    const pool = getGastroPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bot_wa_logs (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        aliado_nombre VARCHAR(200) NULL,
        numero       VARCHAR(30)  NOT NULL,
        tipo         ENUM('PUBLICADO','DUPLICADO','NO_AUTORIZADO','ERROR','BIENVENIDA','AYUDA') NOT NULL,
        mensaje_in   TEXT NOT NULL,
        respuesta_out TEXT NULL,
        promo_id     INT NULL,
        createdAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_numero (numero),
        INDEX idx_tipo (tipo),
        INDEX idx_fecha (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    tablaLogsCreada = true;
  } catch (e) {
    console.warn('[botState.ensureLogsTable]', e);
  }
}

/**
 * Registra un evento del bot en la tabla de logs.
 */
export async function registrarLog(data: {
  aliado_nombre?: string | null;
  numero: string;
  tipo: BotLogTipo;
  mensaje_in: string;
  respuesta_out?: string | null;
  promo_id?: number | null;
}): Promise<void> {
  try {
    await ensureLogsTable();
    const pool = getGastroPool();
    await pool.query<ResultSetHeader>(
      `INSERT INTO bot_wa_logs (aliado_nombre, numero, tipo, mensaje_in, respuesta_out, promo_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.aliado_nombre ?? null,
        data.numero,
        data.tipo,
        data.mensaje_in.slice(0, 2000),
        data.respuesta_out ? data.respuesta_out.slice(0, 2000) : null,
        data.promo_id ?? null,
      ]
    );
  } catch (e) {
    console.error('[botState.registrarLog]', e);
  }
}

/**
 * Obtiene los últimos N logs del bot para el panel admin.
 */
export async function getBotLogs(limit = 100, offset = 0): Promise<BotLog[]> {
  try {
    await ensureLogsTable();
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, aliado_nombre, numero, tipo, mensaje_in, respuesta_out, promo_id,
              DATE_FORMAT(createdAt, '%Y-%m-%dT%H:%i:%sZ') as createdAt
       FROM bot_wa_logs
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows as BotLog[];
  } catch (e) {
    console.error('[botState.getBotLogs]', e);
    return [];
  }
}

/**
 * Verifica si es la primera vez que este número nos escribe (para la bienvenida).
 * "Primera vez" = no tiene ningún log previo de tipo PUBLICADO o BIENVENIDA.
 */
export async function esPrimerContacto(numero: string): Promise<boolean> {
  try {
    await ensureLogsTable();
    const pool = getGastroPool();
    const ultimos8 = numero.replace(/\D/g, '').slice(-8);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM bot_wa_logs
       WHERE numero LIKE ? AND tipo IN ('PUBLICADO', 'BIENVENIDA')
       LIMIT 1`,
      [`%${ultimos8}`]
    );
    return rows.length === 0;
  } catch {
    return false; // En caso de error, asumir que no es primera vez para no enviar doble bienvenida
  }
}
