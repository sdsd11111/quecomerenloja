import type { Category } from "./types";

export const SITE = {
  name: "Qué Comer en Loja",
  tagline: "La Ruta Gastronómica de Loja, en tu bolsillo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quecomerenloja.com",
  businessWhatsApp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "",
  sisters: [
    { label: "guialoja.com", href: "https://guialoja.com" },
    { label: "agendaculturalloja.com", href: "https://agendaculturalloja.com" },
    { label: "agendaturisticaloja.com", href: "https://agendaturisticaloja.com" },
  ],
};

export const NAV = [
  { href: "/restaurantes", label: "Dónde comer" },
  { href: "/menu-del-dia", label: "Menú del día" },
  { href: "/cafe-de-loja", label: "Café de Loja" },
  { href: "/bares-y-noche", label: "Bares y noche" },
  { href: "/blog", label: "Blog" },
];

export const CATEGORIES: {
  key: Category;
  name: string;
  sub: string;
  icon: string;
  bg: string;
  href: string;
}[] = [
  { key: "alta", name: "Alta Cocina", sub: "Experiencias para recordar", icon: "🍽️", bg: "bg-clay", href: "/restaurantes?categoria=alta" },
  { key: "cafe", name: "Café de Loja", sub: "Origen, aroma y conversación", icon: "☕", bg: "bg-bronze", href: "/cafe-de-loja" },
  { key: "tradicional", name: "Comida Tradicional", sub: "Nuestras huecas, nuestra esencia", icon: "🌽", bg: "bg-green", href: "/restaurantes?categoria=tradicional" },
  { key: "noche", name: "Bares y Noche", sub: "La ciudad después del atardecer", icon: "🎵", bg: "bg-slate", href: "/bares-y-noche" },
];

export const PLANS = [
  { name: "Ficha Verificada", detail: "Bares, huecas y cafeterías", month: 40, year: 400 },
  { name: "Ficha Premium", detail: "Restaurantes y cafés grandes", month: 60, year: 600 },
];
