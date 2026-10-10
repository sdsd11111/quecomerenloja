import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

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
    images: [
      {
        url: "/arveja-con-guineo.jpg",
        width: 1200,
        height: 630,
        alt: "Arveja con guineo sopa lojana",
      },
    ],
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

export default function ArvejaConGuineoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Arveja con Guineo Lojana",
        headline: "La sopa de entrada del almuerzo tradicional de Loja",
        description:
          "Caldo de arveja verde tierna con rodajas de guineo verde, quesillo artesanal y cilantro.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Sopas / Entradas",
        keywords: "arveja con guineo, sopa lojana, comida tipica loja, platos tipicos loja",
        recipeIngredient: [
          "Arveja verde tierna",
          "Guineo verde en rodajas",
          "Quesillo lojano fresco",
          "Cilantro picado",
          "Caldo de hueso o vegetal",
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

      {/* ── 1. HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-10 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/arveja-con-guineo.jpg"
            alt="Arveja con guineo sopa tradicional lojana"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              SOPA DEL MEDIODÍA · ALMUERZO LOJANO
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Arveja con Guineo:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                La sopa que abraza el alma lojana.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Caldo nutritivo de arveja verde tierna con rodajas de guineo
              verde, quesillo artesanal y cilantro fresco. La sopa más solicitada
              del menú del día en Loja.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/almuerzos-loja"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Guía de Almuerzos en Loja
              </Link>
              <Link
                href="/platos/repe-lojano"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Repe Lojano →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Breadcrumb SEO */}
      <div className="border-b border-niebla bg-white">
        <Wrap className="py-3 text-xs text-muted">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li>/</li>
              <li><Link href="/almuerzos-loja" className="hover:underline">Almuerzos en Loja</Link></li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Arveja con Guineo</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              TRADICIÓN DE CUCHARA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La sopa del almuerzo lojano más pedida
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              La arveja con guineo es un plato de cuchara que representa la
              cocina hogareña lojana en su máxima expresión. A diferencia del
              repe blanco que se machaca, aquí la arveja y el guineo se cuecen
              lentamente en caldo de hueso para lograr un sabor profundo y
              nutritivo.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El toque final es el quesillo lojano artesanal que se agrega al
              servir y que se derrite suavemente en el caldo caliente, creando
              esa experiencia cremosa y reconfortante que hace único a este
              plato de la gastronomía del sur del Ecuador.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🫛 Arveja verde tierna
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🍌 Guineo verde en rodajas
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🧀 Quesillo artesanal lojano
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha de la Arveja con Guineo
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Base del caldo:</span>
                <strong className="text-grafito font-semibold">
                  Hueso de res / caldo vegetal
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Textura:</span>
                <strong className="text-grafito font-semibold">
                  Caldo líquido (no cremoso)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-petroleo font-bold">
                  Almuerzo (sopa de entrada)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Dónde encontrarla:</span>
                <strong className="text-grafito font-semibold">
                  Mercados, comedores, huecas
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Días frecuentes:</span>
                <strong className="text-grafito font-semibold">
                  Todos los días en mercados
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $1.50 – $3.00 (en menú del día)
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Arveja con Guineo"
        horarioRecomendado="11:30 AM – 02:30 PM (almuerzo diario)"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Arveja con Guineo" />

      {/* ── 5. PREGUNTAS FRECUENTES ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">
                    FAQ
                  </span>
                  <span>Preguntas Frecuentes sobre Arveja con Guineo</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">
                  ▾
                </span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {FAQS.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-niebla/40 bg-white p-4"
                  >
                    <h4 className="font-serif text-sm font-bold text-grafito">
                      {faq.q}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </Wrap>
      </section>

      {/* ── 6. CTA ── */}
      <section className="py-12 bg-porcelana border-t border-niebla">
        <Wrap>
          <div className="rounded-3xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">
                SOPAS DE LOJA
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Conoces el repe lojano, el otro gran plato de cuchara?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                El repe blanco es la sopa insignia de Loja y el orgullo de nuestra gastronomía. Descubre su historia y dónde comerlo.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/platos/repe-lojano"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
              >
                Guía del Repe Lojano →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
