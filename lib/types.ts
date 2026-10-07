export type Category = "alta" | "cafe" | "tradicional" | "noche";
export type Meal = "desayuno" | "almuerzo" | "cena";
export type DishStyle = "plate" | "coffee" | "traditional" | "night" | "fine";

export interface Restaurant {
  slug: string;
  name: string;
  category: Category;
  meal: Meal;
  zone: string;
  dish: string;
  menu: string;
  /** null = el negocio aún no publicó precio. */
  price: number | null;
  style: DishStyle;
  keywords: string;
  description: string;
  highlights: string[];
  /** Solo dígitos, sin "+". Vacío = aún no configurado. */
  whatsapp: string;
  lat: number | null;
  lng: number | null;
  /** ISO 8601. null = sin verificación real. */
  verifiedAt: string | null;
  demo: boolean;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  tag: string;
  body: { h?: string; p: string }[];
}
