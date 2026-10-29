import 'server-only';
import { getGastroPool } from '@/lib/aliados-db';
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';

export type PromoTipo = 'PROMO' | 'EVENTO' | 'NOVEDAD' | 'OFERTA';
export type PromoEstado = 'PENDIENTE' | 'ACTIVO' | 'VENCIDO' | 'CANCELADO';

export interface PromoAliado {
  id: number;
  aliado_slug: string;
  aliado_nombre: string;
  titulo: string;
  slug: string;
  tipo: PromoTipo;
  descripcion: string;
  imagen_url: string | null;
  video_url: string | null;
  video_orientacion: 'VERTICAL' | 'HORIZONTAL';
  precio_original: string | null;
  precio_promo: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  lugar: string | null;
  estado: PromoEstado;
  destacado: boolean;
  whatsapp_url: string | null;
  color_marca: string;
  createdAt: string;
  updatedAt: string;
}

function formatPromo(r: RowDataPacket | any): PromoAliado {
  const fmt = (d: any) => {
    if (!d) return null;
    if (d instanceof Date) return d.toISOString();
    return String(d);
  };
  return {
    id: r.id,
    aliado_slug: r.aliado_slug,
    aliado_nombre: r.aliado_nombre,
    titulo: r.titulo,
    slug: r.slug,
    tipo: r.tipo,
    descripcion: r.descripcion,
    imagen_url: r.imagen_url || null,
    video_url: r.video_url || null,
    video_orientacion: r.video_orientacion || 'VERTICAL',
    precio_original: r.precio_original || null,
    precio_promo: r.precio_promo || null,
    fecha_inicio: fmt(r.fecha_inicio)!,
    fecha_fin: fmt(r.fecha_fin),
    lugar: r.lugar || null,
    estado: r.estado,
    destacado: Boolean(r.destacado),
    whatsapp_url: r.whatsapp_url || null,
    color_marca: r.color_marca || '#153E3E',
    createdAt: fmt(r.createdAt)!,
    updatedAt: fmt(r.updatedAt)!,
  };
}

/** Genera slug único para una promo */
export function slugifyPromo(titulo: string, aliado: string): string {
  const base = `${aliado}-${titulo}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return `${base}-${Date.now().toString(36)}`;
}

/** Promos ACTIVAS de hoy en adelante (para Home) */
export async function getPromosActivas(limit = 50): Promise<PromoAliado[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM promociones_aliados
       WHERE estado = 'ACTIVO'
       ORDER BY destacado DESC, fecha_inicio ASC
       LIMIT ?`,
      [limit]
    );
    return rows.map(formatPromo);
  } catch (e) {
    console.error('[getPromosActivas]', e);
    return [];
  }
}

/** Promos ACTIVAS vigentes específicamente HOY (para /que-comer-hoy) */
export async function getPromosDelDia(limit = 50): Promise<PromoAliado[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM promociones_aliados
       WHERE estado = 'ACTIVO'
         AND (
           (fecha_fin IS NOT NULL AND CURDATE() BETWEEN DATE(fecha_inicio) AND DATE(fecha_fin))
           OR
           (fecha_fin IS NULL AND DATE(fecha_inicio) = CURDATE())
         )
       ORDER BY destacado DESC, fecha_inicio ASC
       LIMIT ?`,
      [limit]
    );
    return rows.map(formatPromo);
  } catch (e) {
    console.error('[getPromosDelDia]', e);
    return [];
  }
}

/** Todas las promos para admin */
export async function getAllPromosAdmin(): Promise<PromoAliado[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM promociones_aliados ORDER BY createdAt DESC`
    );
    return rows.map(formatPromo);
  } catch (e) {
    console.error('[getAllPromosAdmin]', e);
    return [];
  }
}

/** Promo individual por slug */
export async function getPromoBySlug(slug: string): Promise<PromoAliado | null> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM promociones_aliados WHERE slug = ? LIMIT 1`,
      [slug]
    );
    if (!rows.length) return null;
    return formatPromo(rows[0]);
  } catch (e) {
    console.error('[getPromoBySlug]', e);
    return null;
  }
}

/** Verificar si aliado_slug existe en la tabla de aliados */
export async function aliadoExists(slug: string): Promise<boolean> {
  try {
    const pool = getGastroPool();
    // buscar por nombre normalizado en tabla aliados
    const slugLower = slug.toLowerCase();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, nombre FROM aliados WHERE activo = 1`
    );
    return rows.some((r: any) => {
      const normalizado = r.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return normalizado === slugLower;
    });
  } catch {
    return false;
  }
}

/** Obtener nombre real del aliado por su slug */
export async function getAliadoNombreBySlug(slug: string): Promise<string | null> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, nombre FROM aliados WHERE activo = 1`
    );
    const found = rows.find((r: any) => {
      const normalizado = r.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return normalizado === slug.toLowerCase();
    });
    return found ? (found as any).nombre : null;
  } catch {
    return null;
  }
}

/** Crear promo */
export async function createPromo(data: {
  aliado_slug: string;
  aliado_nombre: string;
  titulo: string;
  tipo: PromoTipo;
  descripcion: string;
  imagen_url?: string | null;
  video_url?: string | null;
  video_orientacion?: 'VERTICAL' | 'HORIZONTAL';
  precio_original?: string | null;
  precio_promo?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  lugar?: string | null;
  whatsapp_url?: string | null;
  color_marca?: string;
}): Promise<number> {
  const pool = getGastroPool();
  const slug = slugifyPromo(data.titulo, data.aliado_slug);
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO promociones_aliados
     (aliado_slug, aliado_nombre, titulo, slug, tipo, descripcion,
      imagen_url, video_url, video_orientacion, precio_original, precio_promo, fecha_inicio, fecha_fin,
      lugar, whatsapp_url, color_marca, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO')`,
    [
      data.aliado_slug,
      data.aliado_nombre,
      data.titulo,
      slug,
      data.tipo,
      data.descripcion,
      data.imagen_url ?? null,
      data.video_url ?? null,
      data.video_orientacion ?? 'VERTICAL',
      data.precio_original ?? null,
      data.precio_promo ?? null,
      data.fecha_inicio,
      data.fecha_fin ?? null,
      data.lugar ?? null,
      data.whatsapp_url ?? null,
      data.color_marca ?? '#153E3E',
    ]
  );
  return result.insertId;
}

/** Actualizar promo */
export async function updatePromo(id: number, data: Partial<PromoAliado>): Promise<void> {
  const pool = getGastroPool();
  await pool.query(
    `UPDATE promociones_aliados SET
       titulo = COALESCE(?, titulo),
       tipo = COALESCE(?, tipo),
       descripcion = COALESCE(?, descripcion),
       imagen_url = ?,
       video_url = ?,
       video_orientacion = COALESCE(?, video_orientacion),
       precio_original = ?,
       precio_promo = ?,
       fecha_inicio = COALESCE(?, fecha_inicio),
       fecha_fin = ?,
       lugar = ?,
       estado = COALESCE(?, estado),
       destacado = COALESCE(?, destacado),
       whatsapp_url = ?,
       color_marca = COALESCE(?, color_marca)
     WHERE id = ?`,
    [
      data.titulo ?? null,
      data.tipo ?? null,
      data.descripcion ?? null,
      data.imagen_url ?? null,
      data.video_url ?? null,
      data.video_orientacion ?? null,
      data.precio_original ?? null,
      data.precio_promo ?? null,
      data.fecha_inicio ?? null,
      data.fecha_fin ?? null,
      data.lugar ?? null,
      data.estado ?? null,
      data.destacado !== undefined ? (data.destacado ? 1 : 0) : null,
      data.whatsapp_url ?? null,
      data.color_marca ?? null,
      id,
    ]
  );
}

/** Eliminar promo */
export async function deletePromo(id: number): Promise<void> {
  const pool = getGastroPool();
  await pool.query(`DELETE FROM promociones_aliados WHERE id = ?`, [id]);
}
