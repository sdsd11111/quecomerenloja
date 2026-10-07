import "server-only";
import mysql, { type Pool } from "mysql2/promise";

declare global {
  // Reutiliza el pool entre recargas en desarrollo.
  var __qcelPool: Pool | undefined;
}

/** true cuando hay DATABASE_URL (ej: mysql://usuario:clave@host:3306/quecomerenloja). */
export const dbEnabled = Boolean(process.env.DATABASE_URL);

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está configurada");
  globalThis.__qcelPool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "Z",
  });
  return globalThis.__qcelPool;
}
