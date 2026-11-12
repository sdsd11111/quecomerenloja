// ─────────────────────────────────────────────────────────
// Tipos y utilidades compartidas del formulario de alta
// (usable tanto en el navegador como en el servidor)
// ─────────────────────────────────────────────────────────

export type EstadoSolicitud =
  | 'recibido'
  | 'en_revision'
  | 'aprobado'
  | 'publicado'
  | 'rechazado';

export type CategoriaSlug = 'tradicional' | 'cafe' | 'alta' | 'noche';

export const CATEGORIAS_FORMULARIO: { slug: CategoriaSlug; nombre: string; ejemplo: string }[] = [
  { slug: 'tradicional', nombre: 'Platos típicos y huecas', ejemplo: 'Repe, cecina, menestra' },
  { slug: 'cafe', nombre: 'Cafetería o desayuno', ejemplo: 'Café de altura, tamales, humitas' },
  { slug: 'alta', nombre: 'Restaurante o cocina especial', ejemplo: 'Pizzería, sushi, hamburger gourmet' },
  { slug: 'noche', nombre: 'Comida rápida o nightlife', ejemplo: 'Alitas, chifas, pizza nocturna' },
];

export const MOMENTOS_FORMULARIO = [
  { slug: 'desayuno', nombre: 'Desayuno' },
  { slug: 'almuerzo', nombre: 'Almuerzo' },
  { slug: 'cena', nombre: 'Cena' },
  { slug: 'noche', nombre: 'Noche' },
];

export const RANGOS_PRECIO = ['$', '$$', '$$$'];

export const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta'];

export const TIPOS_ARCHIVO = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
];

export const MAX_ARCHIVO_MB = 6;
export const MAX_ARCHIVOS = 10;

export interface PlatoBorrador {
  nombre: string;
  descripcion?: string;
  precio?: number | null;
  momento?: string;
  palabrasClave?: string;
}

export interface ArchivoSolicitud {
  id: number;
  tipo: string;
  nombre: string;
  url: string;
  mime: string | null;
  tamano: number | null;
  creadoEn: string;
}

export interface Solicitud {
  id: number;
  folio: string;
  slug: string;
  nombreComercial: string;
  ruc: string | null;
  propietario: string | null;
  telefono: string;
  telefonoAlt: string | null;
  email: string;
  emailPersonal: string | null;
  direccion: string;
  referencias: string | null;
  mapaUrl: string | null;
  lat: number | null;
  lng: number | null;
  horarios: string | null;
  categorias: string[];
  momentos: string[];
  rangoPrecio: string | null;
  servicios: string[];
  metodosPago: string[];
  redesUrl: string | null;
  cuentaBancaria: string | null;
  notas: string | null;
  cartaTexto: string | null;
  estado: EstadoSolicitud;
  motivoRechazo: string | null;
  borrador: PlatoBorrador[] | null;
  aliadoId: number | null;
  creadoEn: string;
  actualizadoEn: string;
  archivos: ArchivoSolicitud[];
}

// ─────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────

export function slugify(texto: string): string {
  return (texto || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/**
 * Normaliza un teléfono ecuatoriano a formato internacional sin guiones.
 * 0984222336 → 0984222336 · +593 98 422 2336 → 0984222336 · 593984222336 → 0984222336
 */
export function normalizarTelefonoEC(input: string): string {
  const crudo = (input || '').trim();
  if (!crudo) return '';
  let digitos = crudo.replace(/\D/g, '');
  if (digitos.startsWith('593')) digitos = digitos.slice(3);
  if (digitos.startsWith('0')) digitos = digitos.slice(1);
  if (digitos.length !== 9) return digitos;
  return `0${digitos}`;
}

/** Igual que normalizarTelefonoEC pero en formato internacional (+593...). */
export function telefonoInternacional(input: string): string {
  const nacio = normalizarTelefonoEC(input);
  if (!nacio) return '';
  if (nacio.startsWith('0')) return `+593${nacio.slice(1)}`;
  return `+593${nacio}`;
}

export function formatearTelefonoEC(input: string): string {
  const n = normalizarTelefonoEC(input);
  if (n.length !== 10) return input || '';
  return `${n.slice(0, 4)} ${n.slice(4, 8)} ${n.slice(8, 10)}`;
}

export function esEmailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || '').trim());
}

/** Acepta RUC (13 dígitos) o cédula (10 dígitos). */
export function esDocumentoValido(doc: string): boolean {
  const d = (doc || '').replace(/\D/g, '');
  return d.length === 13 || d.length === 10;
}

export function esTelefonoValido(tel: string): boolean {
  return normalizarTelefonoEC(tel).length === 10;
}

export function parsearJson<T>(valor: string | null | undefined, porDefecto: T): T {
  if (!valor) return porDefecto;
  try {
    const parsed = JSON.parse(valor);
    return parsed ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

export function listaLegible(items: string[]): string {
  if (!items || items.length === 0) return '';
  return items.join(', ');
}
