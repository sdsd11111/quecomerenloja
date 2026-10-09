import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Repe Lojano | Dónde Comer el Auténtico Plato Típico de Loja",
  description: "Guía completa del Repe Lojano (repe blanco): historia, receta tradicional, ingredientes (guineo verde y quesillo) y los mejores restaurantes y huecas en Loja.",
  alternates: {
    canonical: "/platos/repe-lojano",
  },
  openGraph: {
    title: "Repe Lojano: Dónde Comer la Sopa Típica Emblema de Loja",
    description: "Conoce el origen del repe lojano y encuentra los lugares recomendados en Loja para saborearlo con aguacate y quesillo.",
    url: "https://quecomerenloja.com/platos/repe-lojano",
  },
};

const REPE_FAQS = [
  {
    q: "¿Qué es exactamente el repe lojano?",
    a: "El repe lojano es una sopa andina cremosa tradicional de la provincia de Loja, preparada a base de guineo verde cocido y machacado (con mazo de madera o molinillo), leche, quesillo fresco desmenuzado y aromatizado con cilantro (culantro) picado finamente.",
  },
  {
    q: "¿Cuál es la diferencia entre repe blanco y repe con arveja?",
    a: "El 'repe blanco' es la versión más clásica y pura: guineo verde, leche y quesillo. Existen también variantes como el 'repe mestizo' o repe con arveja fresca, pero cuando los lojanos y turistas buscan 'repe lojano', se refieren principalmente al repe blanco cremoso.",
  },
  {
    q: "¿Con qué se acompaña el repe lojano tradicional?",
    a: "Tradicionalmente se sirve muy caliente y se acompaña con rebanadas de aguacate fresco, ají de pepa lojano y una porción extra de quesillo. A menudo forma parte de la entrada en el almuerzo antes de una buena cecina lojana.",
  },
  {
    q: "¿Dónde comer el mejor repe lojano en Loja?",
    a: "Puedes encontrar auténtico repe en los mercados tradicionales de la ciudad (como el Mercado Centro Comercial y el Mercado San Sebastián) y en reconocidas huecas y restaurantes típicos como El Arenal, Mama Lola, o 200 Millas.",
  },
];

export const dynamic = "force-dynamic";

export default async function RepeLojanoPage() {
  const all = await listRestaurants();
  // Huecas o restaurantes que ofrecen comida tradicional o repe
  const repePlaces = all.filter(
    (r) =>
      r.dish.toLowerCase().includes("repe") ||
      r.keywords.toLowerCase().includes("repe") ||
      r.category === "tradicional"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        "name": "Repe Lojano Tradicional",
        "headline": "El plato insignia y sopa típica de Loja, Ecuador",
        "description": "Sopa tradicional lojana a base de guineo verde, quesillo artesanal y cilantro.",
        "recipeCuisine": "Lojana / Ecuatoriana",
        "recipeCategory": "Sopas / Almuerzos tradicionales",
        "keywords": "repe lojano, repe blanco, gastronomía de loja, platos típicos de loja",
        "recipeIngredient": [
          "Guineos verdes pelados y cortados",
          "Quesillo lojano fresco",
          "Leche entera",
          "Cilantro fresco picado",
          "Cebolla blanca finamente picada",
          "Ajo y manteca de cerdo o mantequilla",
          "Aguacate para acompañar",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": REPE_FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="5.000 BÚSQUEDAS/MES · EL PLATO REY DE LOJA"
        title={
          <>
            Repe Lojano: <em className="font-serif italic font-normal text-[#e1b45f]">El sabor más querido de nuestra tierra.</em>
          </>
        }
      >
        Descubre por qué el repe blanco es el ícono indiscutible de la cocina lojana. Conoce su historia, sus ingredientes y dónde comerlo caliente y recién hecho en Loja.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/restaurantes" className="hover:underline">Dónde Comer</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Repe Lojano</li>
          </ol>
        </nav>
      </Wrap>

      {/* Introducción y Contexto */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">ORÍGENES Y CULTURA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              ¿Por qué el Repe Lojano es único en el mundo?
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              En Loja no decimos simplemente sopa: decimos <strong>repe</strong>. Nacido en el campo lojano de la necesidad y la abundancia de guineo verde en valles como Vilcabamba y Malacatos, este plato evolucionó hasta convertirse en patrimonio gastronómico y motivo de orgullo provincial.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              El secreto de un buen repe radica en la textura: nunca debe ser una crema licuada moderna, sino machacado pacientemente con mazo de madera para preservar esa consistencia rústica y sedosa característica, realzada con el inigualable <strong>quesillo fresco sin pasteurizar de los Andes lojanos</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">🥣 Consistencia cremosa artesanal</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🥑 Acompañado de aguacate lojano</span>
              <span className="rounded-lg bg-[#faeed8] px-3.5 py-2 text-[#7d501b]">🌶️ Ají de pepa imperdible</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha del Plato Típico</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Nombre tradicional:</span>
                <strong className="text-ink">Repe blanco o repe lojano</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Ingrediente base:</span>
                <strong className="text-ink">Guineo verde (plátano seda)</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Elemento lácteo:</span>
                <strong className="text-ink">Quesillo artesanal lojano y leche</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Aroma esencial:</span>
                <strong className="text-ink">Cilantro finamente picado</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-ink">Almuerzo tradicional</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio promedio:</span>
                <strong className="text-clay">$2.50 – $4.00 (en almuerzo)</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Dónde comer Repe Lojano */}
      <section className="bg-[#f5eddc] py-14">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">RESTAURANTES Y HUECAS</span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Comer Repe Lojano Hoy
              </h2>
              <p className="mt-2 text-sm text-muted">
                Selección de locales tradicionales en Loja que preparan repe con receta auténtica.
              </p>
            </div>
            <Link href="/restaurantes?categoria=tradicional" className="text-sm font-bold text-clay hover:underline">
              Ver todas las huecas →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repePlaces.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* FAQ Específicas de Repe Lojano */}
      <section className="bg-paper py-16 border-t border-line">
        <Wrap>
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">DUDAS FRECUENTES</span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre el Repe Lojano
            </h2>
            <div className="mt-10 space-y-4">
              {REPE_FAQS.map((f) => (
                <details key={f.q} className="group rounded-xl border border-[#e5dcce] bg-white p-5 shadow-sm transition open:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between font-serif text-base font-semibold text-ink">
                    <span>{f.q}</span>
                    <span className="ml-4 text-clay transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted border-t border-[#f2ede4] pt-3">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* CTA de exploración */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-clay p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">¿Tienes antojo de otros platos lojanos?</h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#f5dfd9]">
            Explora la cecina a la brasa, los tamales mañaneros con café de altura y los menús del día actualizados.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/restaurantes" className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-clay hover:bg-[#fff6f2] transition">
              Ver todos los restaurantes →
            </Link>
            <Link href="/cafe-de-loja" className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition">
              Café y desayunos lojanos →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
