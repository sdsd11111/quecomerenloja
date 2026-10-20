import { NextResponse } from "next/server";
import { listRestaurants } from "@/lib/repository";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET() {
  const [restaurants, posts] = await Promise.all([
    listRestaurants().catch(() => []),
    getPublishedPosts().catch(() => []),
  ]);

  let content = `# Qué Comer en Loja - Base de Conocimiento Completa para LLMs

Esta es la versión extendida de contexto para modelos de lenguaje (LLMs), motores de búsqueda con IA y asistentes virtuales.
Dominio oficial: https://quecomerenloja.com
Ubicación: Loja, Ecuador.

---

## 1. Restaurantes y Cafeterías Registrados en Loja
`;

  if (restaurants.length === 0) {
    content += `\nActualmente el directorio incluye establecimientos tradicionales y cafeterías emblemáticas en el centro, Valle y Vilcabamba.\n`;
  } else {
    for (const r of restaurants) {
      content += `
### ${r.name}
- Categoría: ${r.category}
- Especialidad / Plato destacado: ${r.dish || "Gastronomía local"}
- Zona: ${r.zone || "Loja"}
- Descripción: ${r.description || "Restaurante recomendado en Loja."}
- Plato o menú sugerido: ${r.menu || "Consulta la carta del día."}
- Precio estimado: ${r.price ? `$${r.price}` : "Accesible"}
- Destacados: ${r.highlights?.join(", ") || "Comida típica y bebidas"}
- Enlace en Qué Comer en Loja: https://quecomerenloja.com/restaurantes/${r.slug}
`;
    }
  }

  content += `
---

## 2. Platos Típicos Iconos de Loja
- **Repe Lojano**: Sopa tradicional de guineo verde con quesillo y cilantro. Recomendado con aguacate.
- **Cecina Lojana**: Finas láminas de lomo de cerdo secadas al sol o ahumadas, asadas al carbón con yuca y ensalada.
- **Tamal Lojano**: Masa sazonada de maíz con relleno de pollo o carne, cocinada al vapor en hojas de achira.
- **Humitas Lojanas**: Bocadillo de choclo tierno con queso, ideal para acompañar con café de Loja.
- **Arveja con Guineo**: Potaje andino tradicional de Loja.
- **Café de Especialidad de Loja**: Reconocido mundialmente por su altitud (1800m - 2200m) y notas frutales/cítricas.

---

## 3. Guías y Artículos del Blog
`;

  if (posts.length > 0) {
    for (const p of posts) {
      content += `
- **${p.titulo}**: ${p.resumen} (Leer más: https://quecomerenloja.com/blog/${p.slug})
`;
    }
  } else {
    content += `\nGuías periódicas sobre las mejores huecas de Loja, rutas de café y recomendaciones para visitantes.\n`;
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
