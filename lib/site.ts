import type { Category } from "./types";

export const SITE = {
  name: "Qué Comer en Loja",
  tagline: "La Ruta Gastronómica de Loja, en tu bolsillo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quecomerenloja.com",
  businessWhatsApp: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "",
  sisters: [
    { label: "agendaculturalloja.com", href: "https://agendaculturalloja.com" },
    { label: "agendaturisticaloja.com", href: "https://agendaturisticaloja.com" },
  ],
};

export const NAV = [
  { href: "/que-comer-hoy", label: "⭐ Qué comer hoy" },
  { href: "/desayunos-en-loja", label: "Desayunos" },
  { href: "/almuerzos-loja", label: "Almuerzos" },
  { href: "/comida-rapida-loja", label: "Dónde cenar" },
  { href: "/eventos-gastronomicos", label: "Eventos & Ferias 🎪" },
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/blog", label: "Blog" },
];

export const CATEGORIES: {
  key: Category;
  name: string;
  sub: string;
  icon: string;
  bg: string;
  href: string;
  badge?: string;
}[] = [
  { key: "tradicional", name: "Platos Típicos & Huecas", sub: "Repe lojano, cecina asada y tamales", icon: "🌽", bg: "bg-petroleo", href: "/restaurantes?categoria=tradicional", badge: "Más buscado" },
  { key: "cafe", name: "Desayunos & Cafeterías", sub: "Café de altura, tamales y humitas", icon: "☕", bg: "bg-[#1A4545]", href: "/cafe-de-loja", badge: "Favoritos" },
  { key: "alta", name: "Mejores Restaurantes", sub: "Cenas, gastronomía de autor y tradición", icon: "🍽️", bg: "bg-[#205252]", href: "/restaurantes", badge: "Recomendados" },
  { key: "noche", name: "Pizzas, Alitas & Noche", sub: "Alitas, pizzas artesanales, burgers y chifas", icon: "🍕", bg: "bg-grafito", href: "/comida-rapida-loja", badge: "Comida rápida" },
];

export const PLANS = [
  { name: "Ficha Verificada", detail: "Bares, huecas y cafeterías", month: 40, year: 400 },
  { name: "Ficha Premium", detail: "Restaurantes y cafés grandes", month: 60, year: 600 },
];
