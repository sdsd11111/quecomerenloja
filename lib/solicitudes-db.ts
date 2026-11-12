import 'server-only';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getGastroPool } from '@/lib/aliados-db';
import {
  type ArchivoSolicitud,
  type EstadoSolicitud,
  type PlatoBorrador,
  type Solicitud,
  parsearJson,
  slugify,
} from '@/lib/formulario';

let tablasReady: Promise<void> | null = null;

/**
 * Crea las tablas del formulario si no existen (mismo patrón idempotente
 * que `initDb()` en lib/db.ts: no requiere migración manual).
 */
export function ensureTablasSolicitudes(): Promise<void> {
  if (!tablasReady) {
    tablasReady = (async () => {
      const pool = getGastroPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS solicitudes_alta (
          id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
          folio             VARCHAR(20) NOT NULL,
          slug              VARCHAR(120) NOT NULL,
          nombre_comercial  VARCHAR(160) NOT NULL,
          ruc               VARCHAR(20) NULL,
          propietario       VARCHAR(160) NULL,
          telefono          VARCHAR(30) NOT NULL,
          telefono_alt      VARCHAR(30) NULL,
          email             VARCHAR(160) NOT NULL,
          email_personal    VARCHAR(160) NULL,
          direccion         VARCHAR(255) NOT NULL,
          referencias       VARCHAR(255) NULL,
          lat               DECIMAL(9,6) NULL,
          lng               DECIMAL(9,6) NULL,
          horarios          VARCHAR(255) NULL,
          categorias        TEXT NULL,
          momentos          VARCHAR(120) NULL,
          rango_precio      VARCHAR(20) NULL,
          servicios         TEXT NULL,
          metodos_pago      VARCHAR(255) NULL,
          redes_url         VARCHAR(255) NULL,
          cuenta_bancaria   TEXT NULL,
          notas             TEXT NULL,
          carta_texto       MEDIUMTEXT NULL,
          estado            VARCHAR(20) NOT NULL DEFAULT 'recibido',
          motivo_rechazo    VARCHAR(255) NULL,
          borrador          MEDIUMTEXT NULL,
          aliado_id         INT NULL,
          creado_en         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          actualizado_en    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_solicitud_folio (folio),
          KEY idx_solicitud_estado (estado, creado_en)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS solicitud_archivos (
          id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
          solicitud_id  INT UNSIGNED NOT NULL,
          tipo          VARCHAR(20) NOT NULL DEFAULT 'carta',
          nombre        VARCHAR(255) NOT NULL,
          url           VARCHAR(500) NOT NULL,
          mime          VARCHAR(80) NULL,
          tamano        INT NULL,
          creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          KEY idx_archivo_solicitud (solicitud_id),
          CONSTRAINT fk_archivo_solicitud FOREIGN KEY (solicitud_id)
            REFERENCES solicitudes_alta (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Columnas añadidas después del primer despliegue
      await pool.query(
        'ALTER TABLE solicitudes_alta ADD COLUMN IF NOT EXISTS mapa_url VARCHAR(500) NULL AFTER referencias'
      );
      await pool.query(
        'ALTER TABLE solicitudes_alta ADD COLUMN IF NOT EXISTS aliado_id INT NULL AFTER borrador'
      );
    })().catch((err) => {
      tablasReady = null;
      throw err;
    });
  }
  return tablasReady;
}

interface FilaSolicitud extends RowDataPacket {
  id: number;
  folio: string;
  slug: string;
  nombre_comercial: string;
  ruc: string | null;
  propietario: string | null;
  telefono: string;
  telefono_alt: string | null;
  email: string;
  email_personal: string | null;
  direccion: string;
  referencias: string | null;
  mapaUrl: string | null;
  lat: number | null;
  lng: number | null;
  horarios: string | null;
  categorias: string | null;
  momentos: string | null;
  rango_precio: string | null;
  servicios: string | null;
  metodos_pago: string | null;
  redes_url: string | null;
  cuenta_bancaria: string | null;
  notas: string | null;
  carta_texto: string | null;
  estado: string;
  motivo_rechazo: string | null;
  borrador: string | null;
  aliado_id: number | null;
  creado_en: Date;
  actualizado_en: Date;
}

function mapearSolicitud(fila: FilaSolicitud, archivos: ArchivoSolicitud[] = []): Solicitud {
  return {
    id: fila.id,
    folio: fila.folio,
    slug: fila.slug,
    nombreComercial: fila.nombre_comercial,
    ruc: fila.ruc,
    propietario: fila.propietario,
    telefono: fila.telefono,
    telefonoAlt: fila.telefono_alt,
    email: fila.email,
    emailPersonal: fila.email_personal,
    direccion: fila.direccion,
    referencias: fila.referencias,
    mapaUrl: fila.mapa_url,
    lat: fila.lat === null ? null : Number(fila.lat),
    lng: fila.lng === null ? null : Number(fila.lng),
    horarios: fila.horarios,
    categorias: parsearJson<string[]>(fila.categorias, []),
    momentos: parsearJson<string[]>(fila.momentos, []),
    rangoPrecio: fila.rango_precio,
    servicios: parsearJson<string[]>(fila.servicios, []),
    metodosPago: parsearJson<string[]>(fila.metodos_pago, []),
    redesUrl: fila.redes_url,
    cuentaBancaria: fila.cuenta_bancaria,
    notas: fila.notas,
    cartaTexto: fila.carta_texto,
    estado: (fila.estado as EstadoSolicitud) || 'recibido',
    motivoRechazo: fila.motivo_rechazo,
    borrador: parsearJson<PlatoBorrador[] | null>(fila.borrador, null),
    aliadoId: fila.aliado_id,
    creadoEn: new Date(fila.creado_en).toISOString(),
    actualizadoEn: new Date(fila.actualizado_en).toISOString(),
    archivos,
  };
}

async function obtenerArchivos(solicitudIds: number[]): Promise<Map<number, ArchivoSolicitud[]>> {
  const mapa = new Map<number, ArchivoSolicitud[]>();
  if (solicitudIds.length === 0) return mapa;
  const pool = getGastroPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, solicitud_id, tipo, nombre, url, mime, tamano, creado_en
       FROM solicitud_archivos
      WHERE solicitud_id IN (?)
      ORDER BY id ASC`,
    [solicitudIds]
  );
  for (const r of rows) {
    const item: ArchivoSolicitud = {
      id: Number(r.id),
      tipo: String(r.tipo),
      nombre: String(r.nombre),
      url: String(r.url),
      mime: r.mime ? String(r.mime) : null,
      tamano: r.tamano ? Number(r.tamano) : null,
      creadoEn: new Date(r.creado_en).toISOString(),
    };
    const lista = mapa.get(Number(r.solicitud_id)) || [];
    lista.push(item);
    mapa.set(Number(r.solicitud_id), lista);
  }
  return mapa;
}

export interface NuevaSolicitud {
  nombreComercial: string;
  ruc?: string | null;
  propietario?: string | null;
  telefono: string;
  telefonoAlt?: string | null;
  email: string;
  emailPersonal?: string | null;
  direccion: string;
  referencias?: string | null;
  mapaUrl?: string | null;
  aliadoId?: number | null;
  lat?: number | null;
  lng?: number | null;
  horarios?: string | null;
  categorias?: string[];
  momentos?: string[];
  rangoPrecio?: string | null;
  servicios?: string[];
  metodosPago?: string[];
  redesUrl?: string | null;
  cuentaBancaria?: string | null;
  notas?: string | null;
  cartaTexto?: string | null;
  archivos: { tipo: string; nombre: string; url: string; mime?: string | null; tamano?: number | null }[];
}

export async function crearSolicitud(datos: NuevaSolicitud): Promise<{ id: number; folio: string }> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const anio = new Date().getFullYear();

  const [contador] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM solicitudes_alta WHERE folio LIKE ?",
    [`ALT-${anio}-%`]
  );
  const siguiente = Number(contador?.[0]?.total || 0) + 1;
  const folio = `ALT-${anio}-${String(siguiente).padStart(4, '0')}`;

  const [resultado] = await pool.query<ResultSetHeader>(
    `INSERT INTO solicitudes_alta (
       folio, slug, nombre_comercial, ruc, propietario, telefono, telefono_alt,
       email, email_personal, direccion, referencias, mapa_url, lat, lng, horarios,
       categorias, momentos, rango_precio, servicios, metodos_pago, redes_url,
       cuenta_bancaria, notas, carta_texto, estado, aliado_id
     ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      folio,
      slugify(datos.nombreComercial),
      datos.nombreComercial,
      datos.ruc || null,
      datos.propietario || null,
      datos.telefono,
      datos.telefonoAlt || null,
      datos.email,
      datos.emailPersonal || null,
      datos.direccion,
      datos.referencias || null,
      datos.mapaUrl || null,
      datos.lat ?? null,
      datos.lng ?? null,
      datos.horarios || null,
      JSON.stringify(datos.categorias || []),
      JSON.stringify(datos.momentos || []),
      datos.rangoPrecio || null,
      JSON.stringify(datos.servicios || []),
      JSON.stringify(datos.metodosPago || []),
      datos.redesUrl || null,
      datos.cuentaBancaria || null,
      datos.notas || null,
      datos.cartaTexto || null,
      'recibido',
      datos.aliadoId ?? null,
    ]
  );

  const id = resultado.insertId;

  for (const archivo of datos.archivos) {
    await pool.query(
      `INSERT INTO solicitud_archivos (solicitud_id, tipo, nombre, url, mime, tamano)
       VALUES (?,?,?,?,?,?)`,
      [id, archivo.tipo, archivo.nombre, archivo.url, archivo.mime || null, archivo.tamano || null]
    );
  }

  return { id, folio };
}

export async function listarSolicitudes(estado?: EstadoSolicitud): Promise<Solicitud[]> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const where = estado ? 'WHERE estado = ?' : '';
  const params = estado ? [estado] : [];
  const [rows] = await pool.query<FilaSolicitud[]>(
    `SELECT * FROM solicitudes_alta ${where} ORDER BY id DESC LIMIT 200`,
    params
  );
  const archivos = await obtenerArchivos(rows.map((r) => Number(r.id)));
  return rows.map((r) => mapearSolicitud(r, archivos.get(Number(r.id)) || []));
}

export async function obtenerSolicitud(id: number): Promise<Solicitud | null> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const [rows] = await pool.query<FilaSolicitud[]>(
    'SELECT * FROM solicitudes_alta WHERE id = ? LIMIT 1',
    [id]
  );
  if (!rows || rows.length === 0) return null;
  const archivos = await obtenerArchivos([id]);
  return mapearSolicitud(rows[0], archivos.get(id) || []);
}

export async function actualizarSolicitud(
  id: number,
  campos: Partial<{
    estado: EstadoSolicitud;
    motivoRechazo: string | null;
    borrador: PlatoBorrador[] | null;
    aliadoId: number | null;
    horarios: string | null;
    notas: string | null;
  }>
): Promise<boolean> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const sets: string[] = [];
  const params: any[] = [];

  if (campos.estado !== undefined) {
    sets.push('estado = ?');
    params.push(campos.estado);
  }
  if (campos.motivoRechazo !== undefined) {
    sets.push('motivo_rechazo = ?');
    params.push(campos.motivoRechazo);
  }
  if (campos.borrador !== undefined) {
    sets.push('borrador = ?');
    params.push(campos.borrador ? JSON.stringify(campos.borrador) : null);
  }
  if (campos.aliadoId !== undefined) {
    sets.push('aliado_id = ?');
    params.push(campos.aliadoId);
  }
  if (campos.horarios !== undefined) {
    sets.push('horarios = ?');
    params.push(campos.horarios);
  }
  if (campos.notas !== undefined) {
    sets.push('notas = ?');
    params.push(campos.notas);
  }

  if (sets.length === 0) return false;
  params.push(id);
  const [resultado] = await pool.query<ResultSetHeader>(
    `UPDATE solicitudes_alta SET ${sets.join(', ')} WHERE id = ?`,
    params
  );
  return resultado.affectedRows > 0;
}

export async function guardarOcrEnSolicitud(
  id: number,
  texto: string | null,
  platos: PlatoBorrador[] | null
): Promise<void> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  await pool.query(
    'UPDATE solicitudes_alta SET carta_texto = COALESCE(?, carta_texto), borrador = ? WHERE id = ?',
    [texto, platos ? JSON.stringify(platos) : null, id]
  );
}

export async function eliminarSolicitud(id: number): Promise<boolean> {
  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const [resultado] = await pool.query<ResultSetHeader>(
    'DELETE FROM solicitudes_alta WHERE id = ?',
    [id]
  );
  return resultado.affectedRows > 0;
}

export async function contarSolicitudesPorEstado(): Promise<Record<string, number>> {  await ensureTablasSolicitudes();
  const pool = getGastroPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT estado, COUNT(*) AS total FROM solicitudes_alta GROUP BY estado'
  );
  const salida: Record<string, number> = {};
  for (const r of rows) salida[String(r.estado)] = Number(r.total);
  return salida;
}
