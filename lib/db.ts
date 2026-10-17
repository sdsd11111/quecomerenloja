import 'server-only';
import mysql, { type Pool } from 'mysql2/promise';

declare global {
  var __qcelPool: Pool | undefined;
  var __blogPool: Pool | undefined;
}

export const dbEnabled = Boolean(process.env.DATABASE_URL);

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no esta configurada');
  globalThis.__qcelPool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    timezone: 'Z',
  });
  return globalThis.__qcelPool;
}

export function getBlogPool(): Pool {
  if (globalThis.__blogPool) return globalThis.__blogPool;

  if (process.env.BLOG_DB_HOST) {
    globalThis.__blogPool = mysql.createPool({
      host: process.env.BLOG_DB_HOST,
      port: Number(process.env.BLOG_DB_PORT || 3306),
      user: process.env.BLOG_DB_USER,
      password: process.env.BLOG_DB_PASS,
      database: process.env.BLOG_DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 7000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
    return globalThis.__blogPool;
  }

  return getPool();
}

export async function initDb() {
  try {
    const db = getBlogPool();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        titulo VARCHAR(255) NOT NULL,
        resumen TEXT NOT NULL,
        contenido LONGTEXT NOT NULL,
        imagen LONGTEXT NOT NULL,
        imagen_alt VARCHAR(255) NOT NULL DEFAULT '',
        video_url TEXT NULL,
        categoria VARCHAR(100) NOT NULL DEFAULT 'Gastronomia',
        etiquetas JSON NULL,
        canton_slug VARCHAR(100) NULL,
        autor VARCHAR(100) NOT NULL DEFAULT 'Que Comer en Loja',
        fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_modificacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
        publicado TINYINT(1) NOT NULL DEFAULT 1,
        tiempo_lectura INT NOT NULL DEFAULT 5,
        INDEX idx_slug (slug),
        INDEX idx_publicado (publicado),
        INDEX idx_fecha (fecha_publicacion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(createTableQuery);
  } catch (err: any) {
    console.warn('Error inicializando tabla blog_posts:', err.message);
  }
}

export const getDbPool = getBlogPool;
