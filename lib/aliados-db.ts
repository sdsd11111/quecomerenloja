import 'server-only';
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import { conReintento } from './db';

declare global {
  var __gastroPool: Pool | undefined;
}

export interface AliadoMetadata {
  momentos?: ('desayuno' | 'almuerzo' | 'cena')[];
  platos?: string[]; // Slugs de platos: 'repe-lojano', 'tamales-lojanos', 'cecina-lojana', etc.
}

export interface AliadoDb {
  id: number;
  nombre: string;
  tipo: 'GASTRONOMIA' | 'CAFETERIA' | string;
  imagenUrl: string | null;
  servicios: string | null;
  telefono: string | null;
  destacado: boolean | number;
  activo: boolean | number;
  createdAt?: string | Date;
  cuartos?: string | null; // Almacena JSON string de AliadoMetadata
  descripcion: string;
  mapaUrl: string | null;
  rangoPrecio: string | null;
  redesUrl: string | null;
  ubicacion: string;
  websiteUrl: string | null;
  ubicacionLat: number | null;
  ubicacionLng: number | null;
  estrellas: number | null;
  numeroCuartos?: number | null;
  // Campos computados / parseados
  momentos?: ('desayuno' | 'almuerzo' | 'cena')[];
  platos?: string[];
}

export function parseAliadoMeta(rawCuartos: string | null | undefined): AliadoMetadata {
  if (!rawCuartos) return { momentos: [], platos: [] };
  try {
    const parsed = JSON.parse(rawCuartos);
    return {
      momentos: Array.isArray(parsed.momentos) ? parsed.momentos : [],
      platos: Array.isArray(parsed.platos) ? parsed.platos : [],
    };
  } catch {
    return { momentos: [], platos: [] };
  }
}

export function formatAliado(r: RowDataPacket | any): AliadoDb {
  const meta = parseAliadoMeta(r.cuartos);
  return {
    ...r,
    destacado: Boolean(r.destacado),
    activo: Boolean(r.activo),
    momentos: meta.momentos,
    platos: meta.platos,
  };
}

export function getGastroPool(): Pool {
  if (globalThis.__gastroPool) return globalThis.__gastroPool;

  const dbUrl = process.env.GASTRONOMIA_DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('GASTRONOMIA_DB_URL no está configurada');
  }

  globalThis.__gastroPool = mysql.createPool({
    uri: dbUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'Z',
  });

  return globalThis.__gastroPool;
}

/**
 * Obtener todos los aliados activos para la web pública
 */
export async function getAliadosActivos(tipo?: 'GASTRONOMIA' | 'CAFETERIA'): Promise<AliadoDb[]> {
  const pool = getGastroPool();
  let query = 'SELECT * FROM aliados WHERE activo = 1';
  const params: any[] = [];

  if (tipo) {
    query += ' AND tipo = ?';
    params.push(tipo);
  }

  query += ' ORDER BY destacado DESC, createdAt DESC';

  const [rows] = await conReintento(() => pool.query<RowDataPacket[]>(query, params));
  return rows.map(formatAliado);
}

/**
 * Obtener aliados activos filtrados por momento ('desayuno', 'almuerzo', 'cena')
 */
export async function getAliadosByMomento(momento: 'desayuno' | 'almuerzo' | 'cena'): Promise<AliadoDb[]> {
  const todos = await getAliadosActivos();
  return todos.filter((a) => {
    // Si tiene momentos asignados en metadata
    if (a.momentos && a.momentos.length > 0) {
      return a.momentos.includes(momento);
    }
    // Fallback inteligente si aún no tiene tags:
    if (momento === 'desayuno') return a.tipo === 'CAFETERIA' || (a.descripcion || '').toLowerCase().includes('desayun') || (a.descripcion || '').toLowerCase().includes('tamal');
    if (momento === 'almuerzo') return a.tipo === 'GASTRONOMIA';
    if (momento === 'cena') return (a.servicios || '').toLowerCase().includes('cena') || (a.descripcion || '').toLowerCase().includes('noche') || a.tipo === 'GASTRONOMIA';
    return true;
  });
}

/**
 * Obtener aliados afines a un plato específico por slug o coincidencia semántica
 */
export async function getAliadosByPlato(platoSlug: string, platoNombre?: string): Promise<AliadoDb[]> {
  const todos = await getAliadosActivos();
  const slugLower = platoSlug.toLowerCase();
  const nombreLower = (platoNombre || '').toLowerCase();

  return todos.filter((a) => {
    // 1. Verificación directa por etiqueta de plato
    if (a.platos && a.platos.includes(slugLower)) return true;

    // 2. Coincidencia en descripción o servicios
    const texto = `${a.nombre} ${a.descripcion || ''} ${a.servicios || ''}`.toLowerCase();
    const palabras = nombreLower ? nombreLower.split(' ') : slugLower.split('-');
    return palabras.some((p) => p.length > 3 && texto.includes(p));
  });
}

/**
 * Obtener todos los aliados (activos e inactivos) para el panel de administración
 */
export async function getAllAliadosAdmin(): Promise<AliadoDb[]> {
  const pool = getGastroPool();
  const query = 'SELECT * FROM aliados ORDER BY id DESC';
  const [rows] = await pool.query<RowDataPacket[]>(query);
  return rows.map(formatAliado);
}

/**
 * Obtener un aliado por ID
 */
export async function getAliadoById(id: number): Promise<AliadoDb | null> {
  const pool = getGastroPool();
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM aliados WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return formatAliado(rows[0]);
}

/**
 * Buscar un aliado activo por su número de teléfono o WhatsApp
 */
export async function getAliadoByTelefono(rawPhone: string): Promise<AliadoDb | null> {
  const limpio = (rawPhone || '').replace(/\D/g, '');
  if (!limpio || limpio.length < 7) return null;

  const ultimos8 = limpio.slice(-8);

  const pool = getGastroPool();
  // Traer aliados activos que tengan teléfono
  const [rows] = await conReintento(() =>
    pool.query<RowDataPacket[]>(
      'SELECT * FROM aliados WHERE activo = 1 AND telefono IS NOT NULL AND TRIM(telefono) != ""'
    )
  );

  for (const row of rows) {
    const telDb = (row.telefono || '').replace(/\D/g, '');
    if (!telDb) continue;

    // Coincidencia exacta o por los últimos 8-9 dígitos
    if (telDb === limpio || telDb.endsWith(ultimos8) || limpio.endsWith(telDb.slice(-8))) {
      return formatAliado(row);
    }
  }

  return null;
}

/**
 * Crear un nuevo aliado en GASTRONOMIA_DB_URL y sincronizar con CHATBOT_DB_URL
 */
export async function createAliado(data: Partial<AliadoDb>): Promise<number> {
  const pool = getGastroPool();
  
  // Serializar momentos y platos en el campo 'cuartos'
  const meta: AliadoMetadata = {
    momentos: data.momentos || [],
    platos: data.platos || [],
  };
  const cuartosJson = JSON.stringify(meta);

  const query = `
    INSERT INTO aliados (
      nombre, tipo, imagenUrl, servicios, telefono, destacado, activo,
      descripcion, mapaUrl, rangoPrecio, redesUrl, ubicacion, websiteUrl,
      ubicacionLat, ubicacionLng, estrellas, cuartos
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.nombre ?? '',
    data.tipo ?? 'GASTRONOMIA',
    data.imagenUrl ?? null,
    data.servicios ?? null,
    data.telefono ?? null,
    data.destacado ? 1 : 0,
    data.activo !== false ? 1 : 0,
    data.descripcion ?? '',
    data.mapaUrl ?? null,
    data.rangoPrecio ?? null,
    data.redesUrl ?? null,
    data.ubicacion ?? '',
    data.websiteUrl ?? null,
    data.ubicacionLat ?? null,
    data.ubicacionLng ?? null,
    data.estrellas ?? 5,
    cuartosJson,
  ];

  const [result] = await pool.query<ResultSetHeader>(query, params);
  const newId = result.insertId;

  // Sincronizar con CHATBOT_DB_URL si está disponible
  if (process.env.CHATBOT_DB_URL) {
    try {
      const botPool = mysql.createPool({ uri: process.env.CHATBOT_DB_URL });
      await botPool.query(
        `INSERT INTO aliados (
          nombre, tipo, imagenUrl, servicios, telefono, destacado, activo,
          descripcion, mapaUrl, rangoPrecio, redesUrl, ubicacion, websiteUrl,
          ubicacionLat, ubicacionLng, estrellas, cuartos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );
      await botPool.end();
    } catch (e: any) {
      console.warn('Advertencia: no se pudo replicar aliado a CHATBOT_DB_URL:', e.message);
    }
  }

  return newId;
}

/**
 * Actualizar un aliado existente
 */
const CAMPOS_ALIADO: Array<[string, string]> = [
  ["nombre", "nombre"],
  ["tipo", "tipo"],
  ["imagenUrl", "imagenUrl"],
  ["servicios", "servicios"],
  ["telefono", "telefono"],
  ["descripcion", "descripcion"],
  ["mapaUrl", "mapaUrl"],
  ["rangoPrecio", "rangoPrecio"],
  ["redesUrl", "redesUrl"],
  ["ubicacion", "ubicacion"],
  ["websiteUrl", "websiteUrl"],
  ["ubicacionLat", "ubicacionLat"],
  ["ubicacionLng", "ubicacionLng"],
  ["estrellas", "estrellas"],
];

/**
 * Actualizar un aliado existente.
 *
 * IMPORTANTE: solo se escriben los campos que llegan en `data`. Antes se
 * enviaba un UPDATE con todas las columnas y cualquier llamada parcial (por
 * ejemplo el interruptor Activo/Inactivo del panel) borraba el nombre, la
 * descripcion, el telefono y la ubicacion del aliado.
 */
export async function updateAliado(id: number, data: Partial<AliadoDb>): Promise<boolean> {
  const pool = getGastroPool();
  const actual = await getAliadoById(id);
  if (!actual) return false;

  const sets: string[] = [];
  const params: any[] = [];
  const agregar = (columna: string, valor: any) => {
    sets.push(`${columna} = ?`);
    params.push(valor);
  };

  for (const [campo, columna] of CAMPOS_ALIADO) {
    const valor = (data as any)[campo];
    if (valor !== undefined) agregar(columna, valor ?? null);
  }
  if (data.destacado !== undefined) agregar("destacado", data.destacado ? 1 : 0);
  if (data.activo !== undefined) agregar("activo", data.activo ? 1 : 0);

  // Si se envían momentos o platos, actualizamos el JSON en 'cuartos'
  if (data.momentos !== undefined || data.platos !== undefined) {
    const meta: AliadoMetadata = {
      momentos: data.momentos !== undefined ? data.momentos : (actual.momentos || []),
      platos: data.platos !== undefined ? data.platos : (actual.platos || []),
    };
    agregar("cuartos", JSON.stringify(meta));
  } else if (typeof data.cuartos === "string" && data.cuartos) {
    agregar("cuartos", data.cuartos);
  }

  // Nada que actualizar: no tocamos la fila (evita borrados accidentales).
  if (sets.length === 0) return false;

  params.push(id);
  await conReintento(() =>
    pool.query<ResultSetHeader>(`UPDATE aliados SET ${sets.join(", ")} WHERE id = ?`, params)
  );

  // Sincronizar con CHATBOT_DB_URL buscando por nombre o id
  if (process.env.CHATBOT_DB_URL) {
    try {
      const botPool = mysql.createPool({ uri: process.env.CHATBOT_DB_URL });
      await botPool.query(
        `UPDATE aliados SET ${sets.join(", ")} WHERE nombre = ? OR (id = ? AND tipo = ?)`,
        [...params.slice(0, -1), actual.nombre, id, actual.tipo]
      );
      await botPool.end();
    } catch (e: any) {
      console.warn("Advertencia: no se pudo replicar actualizacion a CHATBOT_DB_URL:", e.message);
    }
  }

  return true;
}

/**
 * Eliminar un aliado
 */
export async function deleteAliado(id: number): Promise<boolean> {
  const pool = getGastroPool();
  const current = await getAliadoById(id);
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM aliados WHERE id = ?', [id]);

  if (current && process.env.CHATBOT_DB_URL) {
    try {
      const botPool = mysql.createPool({ uri: process.env.CHATBOT_DB_URL });
      await botPool.query('DELETE FROM aliados WHERE nombre = ? AND tipo = ?', [current.nombre, current.tipo]);
      await botPool.end();
    } catch (e: any) {
      console.warn('Advertencia: no se pudo replicar delete a CHATBOT_DB_URL:', e.message);
    }
  }

  return result.affectedRows > 0;
}
