import type { MetadataRoute } from "next";
import { listRestaurants } from "@/lib/repository";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hoy = new Date().toISOString().split("T")[0];

  // Páginas estáticas y estratégicas con prioridades y frecuencias de actualización
  const estaticas = [
    { ruta: "", prioridad: 1.0, freq: "daily" as const },
    { ruta: "/restaurantes", prioridad: 0.95, freq: "daily" as const },
    { ruta: "/eventos-gastronomicos", prioridad: 0.9, freq: "daily" as const },
    // Hubs de momento
    { ruta: "/desayunos-en-loja", prioridad: 0.9, freq: "weekly" as const },
    { ruta: "/almuerzos-loja", prioridad: 0.9, freq: "weekly" as const },
    { ruta: "/comida-rapida-loja", prioridad: 0.85, freq: "weekly" as const },
    // Spokes - Platos individuales
    { ruta: "/platos/repe-lojano", prioridad: 0.9, freq: "weekly" as const },
    { ruta: "/platos/cecina-lojana", prioridad: 0.9, freq: "weekly" as const },
    { ruta: "/platos/tamales-lojanos", prioridad: 0.9, freq: "weekly" as const },
    { ruta: "/platos/humitas-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/bolones-en-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/quimbolitos-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/arveja-con-guineo", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/cuy-asado-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/parihuela-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/pizza-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/alitas-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/hamburguesas-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/chifa-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/platos/seco-de-pollo-loja", prioridad: 0.85, freq: "weekly" as const },
    // Temáticas y transversales
    { ruta: "/cafe-de-loja", prioridad: 0.85, freq: "weekly" as const },
    { ruta: "/bares-y-noche", prioridad: 0.8, freq: "weekly" as const },
    { ruta: "/blog", prioridad: 0.8, freq: "weekly" as const },
    { ruta: "/para-negocios", prioridad: 0.7, freq: "monthly" as const },
  ];

  const restaurants = await listRestaurants();

  return [
    // URLs principales de navegación y temáticas
    ...estaticas.map((e) => ({
      url: `${SITE.url}${e.ruta}`,
      lastModified: hoy,
      changeFrequency: e.freq,
      priority: e.prioridad,
    })),

    // Restaurantes dinámicos de la base de datos
    ...restaurants.map((r) => ({
      url: `${SITE.url}/restaurantes/${r.slug}`,
      lastModified: hoy,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // Artículos de blog y guías de contenido
    ...POSTS.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: p.date ?? hoy,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
