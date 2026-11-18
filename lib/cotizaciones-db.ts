import 'server-only';
import { getGastroPool } from '@/lib/aliados-db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface CotizacionDb {
  id: number;
  codigo: string;
  cliente_nombre: string;
  restaurante_nombre: string;
  telefono: string;
  email: string | null;
  direccion: string | null;
  plan: 'mensual' | 'anual';
  subtotal: number;
  iva: number;
  total: number;
  estado: 'EMITIDA' | 'ACEPTADA' | 'VENCIDA';
  createdAt: string;
}

export function numeroALetrasDolares(monto: number): string {
  const enteros = Math.floor(monto);
  const centavos = Math.round((monto - enteros) * 100);
  const centavosStr = `${String(centavos).padStart(2, '0')}/100 USD`;

  const UNIDADES = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const ESPECIALES = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const DECENAS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

  function traducirMenor100(n: number): string {
    if (n < 10) return UNIDADES[n];
    if (n >= 10 && n < 20) return ESPECIALES[n - 10];
    if (n === 20) return 'veinte';
    if (n > 20 && n < 30) return `veinti${UNIDADES[n - 20]}`;
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? DECENAS[d] : `${DECENAS[d]} y ${UNIDADES[u]}`;
  }

  function traducirCentenas(n: number): string {
    if (n === 100) return 'cien';
    if (n > 100 && n < 200) return `ciento ${traducirMenor100(n - 100)}`;
    return traducirMenor100(n);
  }

  let letras = traducirCentenas(enteros);
  if (!letras) letras = 'cero';
  return `${letras} con ${centavosStr}`.toUpperCase();
}

export async function getCotizacionByCodigo(codigo: string): Promise<CotizacionDb | null> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, codigo, cliente_nombre, restaurante_nombre, telefono, email, direccion,
              plan, subtotal, iva, total, estado,
              DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt
       FROM cotizaciones
       WHERE codigo = ?
       LIMIT 1`,
      [codigo.toUpperCase().trim()]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: Number(r.id),
      codigo: r.codigo,
      cliente_nombre: r.cliente_nombre,
      restaurante_nombre: r.restaurante_nombre,
      telefono: r.telefono,
      email: r.email || null,
      direccion: r.direccion || null,
      plan: r.plan,
      subtotal: Number(r.subtotal),
      iva: Number(r.iva),
      total: Number(r.total),
      estado: r.estado,
      createdAt: String(r.createdAt),
    };
  } catch (error) {
    console.error('[getCotizacionByCodigo:error]', error);
    return null;
  }
}

export async function createCotizacion(datos: {
  cliente_nombre: string;
  restaurante_nombre: string;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  plan?: 'mensual' | 'anual';
}): Promise<{ codigo: string; id: number }> {
  const pool = getGastroPool();
  const plan = datos.plan === 'anual' ? 'anual' : 'mensual';

  // Precios oficiales de Qué Comer en Loja
  // Mensual: $10.00 base
  // Anual: $107.00 base (1 mes gratis)
  const subtotal = plan === 'anual' ? 107.00 : 10.00;
  const iva = Number((subtotal * 0.15).toFixed(2)); // 15% Ecuador
  const total = Number((subtotal + iva).toFixed(2));

  // Generar correlativo COT-2026-XXX
  const [maxRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM cotizaciones`
  );
  const correlativo = (Number(maxRows[0]?.total || 0) + 1).toString().padStart(3, '0');
  const codigo = `COT-2026-${correlativo}`;

  const [res] = await pool.query<ResultSetHeader>(
    `INSERT INTO cotizaciones
       (codigo, cliente_nombre, restaurante_nombre, telefono, email, direccion, plan, subtotal, iva, total, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'EMITIDA')`,
    [
      codigo,
      datos.cliente_nombre.trim(),
      datos.restaurante_nombre.trim(),
      datos.telefono.trim(),
      datos.email?.trim() || null,
      datos.direccion?.trim() || null,
      plan,
      subtotal,
      iva,
      total,
    ]
  );

  return { codigo, id: res.insertId };
}
