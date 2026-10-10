import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Arveja con Guineo en Loja | Sopa Típica del Almuerzo Lojano",
  description:
    "La arveja con guineo es la sopa más solicitada del menú del día en Loja: arveja tierna, guineo verde en rodajas y quesillo. Descubre dónde comerla y su receta tradicional.",
  alternates: { canonical: "/platos/arveja-con-guineo" },
  openGraph: {
    title: "Arveja con Guineo Lojano | Sopa Típica del Almuerzo",
    description:
      "Caldo lojano de arveja verde con guineo, quesillo artesanal y cilantro. Descubre la receta y los restaurantes donde encontrarla en Loja.",
    url: "https://quecomerenloja.com/platos/arveja-con-guineo",
  },
};

const FAQS = [
  {
    q: "¿Qué es la arveja con guineo lojana?",
    a: "Es una sopa tradicional de la cocina lojana preparada con arveja verde tierna cocida lentamente en caldo de hueso o caldo vegetal, a la que se añaden rodajas de guineo verde sancochado. Se sirve con quesillo lojano fresco y cilantro picado, y es uno de los platos de cuchara más comunes en los menús del día de la ciudad.",
  },
  {
    q: "¿Cuándo se sirve la arveja con guineo en Loja?",
    a: "Principalmente como sopa de entrada del almuerzo del mediodía. Muchos comedores y restaurantes familiares la incluyen los martes y jueves en la rotación de su menú del día, aunque en las huecas tradicionales del mercado se consigue todos los días.",
  },
  {
    q: "¿Cuál es la diferencia con el repe lojano?",
    a: "El repe lojano se elabora con guineo verde machacado en mazo de madera con leche, quesillo y cilantro, logrando una textura cremosa y densa. La arveja con guineo es un caldo más líquido donde el guineo se corta en rodajas enteras y la arveja aporta el cuerpo sin machacar. Ambas son emblemas de la cocina de cuchara lojana.",
  },
  {
    q: "¿Dónde comer arveja con guineo en Loja?",
    a: "Los mercados tradicionales (Mercado Centro Comercial y Mercado San Sebastián) ofrecen la versión más auténtica. También los comedores populares del sector El Valle y los restaurantes tradicionales del centro histórico la incluyen con frecuencia en el menú del día.",
  },
];

export const dynamic = "force-dynamic";

export default async function ArvejaConGuineoPage() {
  const all = await listRestaurants();
  const places = all.filter(
    (r) =>
      r.keywords.toLowerCase().includes("arveja") ||
      r.keywords.toLowerCase().includes("sopa") ||
      r.category === "tradicional"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Arveja con Guineo Lojano",
        headline: "Sopa tradicional de arveja verde y guineo del menú del día en Loja",
        description:
          "Caldo lojano con arveja tierna, guineo en rodajas y quesillo artesanal.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Sopas / Almuerzos tradicionales",
        keywords: "arveja con guineo, sopa lojana, almuerzo loja, comida tipica loja",
        recipeIngredient: [
          "Arveja verde tierna",
          "Guineo verde en rodajas",
          "Quesillo lojano fresco",
          "Caldo de hueso o caldo vegetal",
          "Cilantro fresco picado",
          "Cebolla blanca y ajo",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
        eyebrow="SOPA DEL MENÚ DEL DÍA · ALMUERZO LOJANO"
        title={
          <>
            Arveja con Guineo:{" "}
            <em className="font-serif italic font-normal text-[#e1b45f]">
              El caldo que reconforta cada mediodía en Loja.
            </em>
          </>
        }
      >
        Sopa de arveja verde tierna con rodajas de guineo sancochado y quesillo
        artesanal lojano. La entrada obligatoria del menú del día que nunca falla
        en los comedores y huecas tradicionales de la ciudad.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/almuerzos-loja" className="hover:underline">Almuerzos en Loja</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Arveja con Guineo</li>
          </ol>
        </nav>
      </Wrap>

      {/* Descripción + Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              TRADICIÓN DE OLLA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              El caldo que Loja prepara desde siempre
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              En los mercados y comedores familiares de Loja, la arveja con guineo
              forma parte del imaginario gastronómico que define el mediodía. No
              es una moda: es la cocina de abuela escalada a centenares de platos
              diarios que se sirven desde las 12:00 hasta que se acaba la olla.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              A diferencia del{" "}
              <strong>
                <Link href="/platos/repe-lojano" className="text-clay underline font-semibold">
                  repe lojano
                </Link>
              </strong>{" "}
              (que se machaca), aquí el guineo se conserva en rodajas y la arveja
              aporta el color verde brillante característico del caldo. Con quesillo
              lojano por encima y un chorrito de limón, es pura alma lojana.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🫛 Arveja verde tierna</span>
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">🍌 Guineo verde en rodajas</span>
              <span className="rounded-lg bg-[#fdf2e0] px-3.5 py-2 text-[#7d501b]">🧀 Quesillo artesanal</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha del Plato</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Tipo de preparación:</span>
                <strong className="text-ink">Caldo / Sopa</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Base del caldo:</span>
                <strong className="text-ink">Hueso de res o caldo vegetal</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Ingrediente estrella:</span>
                <strong className="text-ink">Arveja tierna + Guineo verde</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Toque final:</span>
                <strong className="text-ink">Quesillo y cilantro fresco</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-ink">Almuerzo (mediodía)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio típico:</span>
                <strong className="text-clay">$2.00 – $3.50 (incluida en menú)</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Dónde comer */}
      <section className="bg-[#f5eddc] py-14">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
                HUECAS Y COMEDORES
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Comer Arveja con Guineo en Loja
              </h2>
              <p className="mt-2 text-sm text-muted">
                Comedores y restaurantes que sirven este caldo en el menú del día.
              </p>
            </div>
            <Link href="/almuerzos-loja" className="text-sm font-bold text-clay hover:underline">
              Ver guía completa de almuerzos →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {places.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* FAQs */}
      <section className="bg-paper py-16 border-t border-line">
        <Wrap>
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              DUDAS FRECUENTES
            </span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre la Arveja con Guineo
            </h2>
            <div className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-[#e5dcce] bg-white p-5 shadow-sm transition open:shadow-md"
                >
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

      {/* CTA Hub & Spoke */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-clay p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">
            ¿Quieres más opciones para el almuerzo en Loja?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#f5dfd9]">
            Explora el repe lojano, la cecina a la brasa o los menús del día con precios actualizados.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/almuerzos-loja"
              className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-clay hover:bg-[#fff6f2] transition"
            >
              Guía de Almuerzos en Loja →
            </Link>
            <Link
              href="/platos/repe-lojano"
              className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition"
            >
              Ver el Repe Lojano →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
