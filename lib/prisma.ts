import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const url = new URL(process.env.DATABASE_URL);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace('/', ''),
    connectionLimit: 25,
    acquireTimeout: 30000,
    connectTimeout: 20000,
  });
  return new PrismaClient({ adapter, log: ["error"] });
}

const g = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (!g.prisma) {
      g.prisma = createPrismaClient();
    }
    return Reflect.get(g.prisma, prop, receiver);
  },
});

if (process.env.NODE_ENV !== "production") g.prisma = undefined;