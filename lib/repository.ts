import "server-only";
import type { RowDataPacket } from "mysql2";
import { dbEnabled, getPool } from "./db";
import { RESTAURANTS as DEMO } from "./data";
import type { Category, DishStyle, Meal, Restaurant } from "./types";

/**
 * Capa de acceso a datos. Con DATABASE_URL usa MySQL; sin ella, cae a los datos de
 * demostración para poder desarrollar sin base de datos. Si hay DATABASE_URL y la
 * consulta falla, el error se propaga (no se ocultan fallos de producción).
 */

interface Row extends RowDataPacket {
  slug: string;
  nombre: string;
  categoria: Category;
  zona: string;
  descripcion: string | null;
  telefono_whatsapp: string | null;
  lat: string | number | null;
  lng: string | number | null;
  titulo_plato: string | null;
  menu: string | null;
  precio: string | number | null;
  momento: Meal | null;
  palabras_clave: string | null;
  verificado_en: Date | null;
}

interface PlatoRow extends RowDataPacket {
  slug: string;
  nombre: string;
}

const STYLE: Record<Category, DishStyle> = { alta: "fine", cafe: "coffee", tradicional: "traditional", noche: "night" };
const DEFAULT_MEAL: Record<Category, Meal> = { alta: "cena", cafe: "desayuno", tradicional: "almuerzo", noche: "cena" };
const num = (v: string | number | null) => (v === null || v === undefined ? null : Number(v));

const SELECT = `
  SELECT a.slug, a.nombre, c.slug AS categoria, a.zona, a.descripcion,
         a.telefono_whatsapp, a.lat, a.lng,
         m.titulo_plato, m.descripcion AS menu, m.precio, m.momento, m.palabras_clave, m.verificado_en
  FROM aliados_gastronomia a
  JOIN categorias_gastronomicas c ON c.id = a.categoria_id
  LEFT JOIN menus_dia m ON m.id = (
    SELECT x.id FROM menus_dia x WHERE x.aliado_id = a.id ORDER BY x.fecha DESC, x.id DESC LIMIT 1
  )
  WHERE a.activo = 1`;

async function loadHighlights(slugs: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (!slugs.length) return map;
  const [rows] = await getPool().query<PlatoRow[]>(
    `SELECT a.slug, p.nombre FROM platos_menu p
     JOIN aliados_gastronomia a ON a.id = p.aliado_id
     WHERE p.disponible = 1 AND a.slug IN (?) ORDER BY p.id`,
    [slugs],
  );
  for (const r of rows) map.set(r.slug, [...(map.get(r.slug) ?? []), r.nombre]);
  return map;
}

function toRestaurant(r: Row, highlights: string[]): Restaurant {
  return {
    slug: r.slug,
    name: r.nombre,
    category: r.categoria,
    meal: r.momento ?? DEFAULT_MEAL[r.categoria],
    zone: r.zona,
    dish: r.titulo_plato ?? "Consulta la carta",
    menu: r.menu ?? "El menú de hoy aún no ha sido publicado.",
    price: num(r.precio),
    style: STYLE[r.categoria],
    keywords: r.palabras_clave ?? "",
    description: r.descripcion ?? "",
    highlights,
    whatsapp: r.telefono_whatsapp ?? "",
    lat: num(r.lat),
    lng: num(r.lng),
    verifiedAt: r.verificado_en ? r.verificado_en.toISOString() : null,
    demo: false,
  };
}

async function query(extra = "", params: unknown[] = []): Promise<Restaurant[]> {
  const [rows] = await getPool().query<Row[]>(`${SELECT} ${extra} ORDER BY a.destacado DESC, a.nombre`, params);
  const hl = await loadHighlights(rows.map((r) => r.slug));
  return rows.map((r) => toRestaurant(r, hl.get(r.slug) ?? []));
}

export async function listRestaurants(): Promise<Restaurant[]> {
  return dbEnabled ? query() : DEMO;
}

export async function listByCategory(category: Category): Promise<Restaurant[]> {
  return dbEnabled ? query("AND c.slug = ?", [category]) : DEMO.filter((r) => r.category === category);
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
  if (!dbEnabled) return DEMO.find((r) => r.slug === slug);
  return (await query("AND a.slug = ?", [slug]))[0];
}
