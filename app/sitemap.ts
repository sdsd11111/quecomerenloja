import type { MetadataRoute } from "next";
import { listRestaurants } from "@/lib/repository";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = [
    "",
    "/restaurantes",
    "/menu-del-dia",
    "/cafe-de-loja",
    "/bares-y-noche",
    "/platos/repe-lojano",
    "/platos/cecina-lojana",
    "/platos/tamales-lojanos",
    "/comida-rapida-loja",
    "/para-negocios",
    "/blog",
    "/contacto",
  ];
  const restaurants = await listRestaurants();
  return [
    ...fixed.map((p) => ({ url: `${SITE.url}${p}` })),
    ...restaurants.map((r) => ({ url: `${SITE.url}/restaurantes/${r.slug}` })),
    ...POSTS.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
