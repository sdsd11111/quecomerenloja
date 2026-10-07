import type { Category, Meal, Restaurant } from "./types";

export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export interface Filters {
  q: string;
  category: Category | "";
  meal: Meal | "";
}

export function filterRestaurants(items: Restaurant[], f: Filters): Restaurant[] {
  const words = normalize(f.q).split(/\s+/).filter(Boolean);
  return items.filter((r) => {
    const hay = normalize([r.name, r.menu, r.zone, r.keywords, r.dish].join(" "));
    const okWords = words.every((w) => hay.includes(w));
    const okCat = !f.category || r.category === f.category;
    const okMeal = !f.meal || r.meal === f.meal;
    return okWords && okCat && okMeal;
  });
}

export interface Coords {
  latitude: number;
  longitude: number;
}

export const hasCoords = (r: Restaurant): r is Restaurant & { lat: number; lng: number } =>
  Number.isFinite(r.lat) && Number.isFinite(r.lng);

/** Distancia en línea recta (Haversine), en km. Aproximada: no es tiempo ni ruta. */
export function distanceKm(r: Restaurant, from: Coords | null): number {
  if (!from || !hasCoords(r)) return Infinity;
  const rad = (n: number) => (n * Math.PI) / 180;
  const a =
    Math.sin(rad(r.lat - from.latitude) / 2) ** 2 +
    Math.cos(rad(from.latitude)) * Math.cos(rad(r.lat)) * Math.sin(rad(r.lng - from.longitude) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

const ymd = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Guayaquil",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

export function isVerifiedToday(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && ymd(d) === ymd(new Date());
}
