import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Repe Lojano | Dónde Comer el Auténtico Plato Típico de Loja",
  description:
    "Guía completa del Repe Lojano (repe blanco): historia, receta tradicional, ingredientes (guineo verde y quesillo) y los mejores restaurantes y huecas en Loja.",
  alternates: { canonical: "/platos/repe-lojano" },
  openGraph: {
    title: "Repe Lojano: Dónde Comer la Sopa Típica Emblema de Loja",
    description:
      "Conoce el origen del repe lojano y encuentra los lugares recomendados en Loja para saborearlo con aguacate y quesillo.",
    url: "https://quecomerenloja.com/platos/repe-lojano",
    images: [
      {
        url: "/repe-lojano.jpg",
        width: 1200,
        height: 630,
        alt: "Repe Lojano tradicional con aguacate y quesillo",
      },
    ],
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
    a: "Puedes encontrar auténtico repe en los mercados tradicionales de la ciudad (como el Mercado Centro Comercial y el Mercado San Sebastián) y en reconocidas huecas y restaurantes típicos del centro histórico y el sector San Sebastián.",
  },
];

export default function RepeLojanoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Repe Lojano Tradicional",
        headline: "El plato insignia y sopa típica de Loja, Ecuador",
        description:
          "Sopa tradicional lojana a base de guineo verde, quesillo artesanal y cilantro.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Sopas / Almuerzos tradicionales",
        keywords:
          "repe lojano, repe blanco, gastronomía de loja, platos típicos de loja",
        recipeIngredient: [
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
        mainEntity: REPE_FAQS.map((f) => ({
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
            src="/repe-lojano.jpg"
            alt="Repe lojano tradicional con aguacate y quesillo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              PLATO INSIGNIA · GASTRONOMÍA LOJANA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Repe Lojano:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El plato rey de la cocina lojana.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Sopa cremosa de guineo verde con quesillo artesanal y cilantro.
              Descubre por qué el repe blanco es el ícono indiscutible de Loja
              y dónde comerlo caliente y recién hecho.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/almuerzos-loja"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Guía de Almuerzos en Loja
              </Link>
              <Link
                href="/platos/cecina-lojana"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Cecina Lojana →
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
              <li className="font-semibold text-petroleo">Repe Lojano</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              ORÍGENES Y CULTURA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              ¿Por qué el Repe Lojano es único en el mundo?
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              En Loja no decimos simplemente sopa: decimos{" "}
              <strong>repe</strong>. Nacido en el campo lojano de la necesidad y
              la abundancia de guineo verde en valles como Vilcabamba y
              Malacatos, este plato evolucionó hasta convertirse en patrimonio
              gastronómico y motivo de orgullo provincial.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El secreto de un buen repe radica en la textura: nunca debe ser
              una crema licuada moderna, sino machacado pacientemente con mazo
              de madera para preservar esa consistencia rústica y sedosa
              característica, realzada con el inigualable{" "}
              <strong>quesillo fresco sin pasteurizar de los Andes lojanos</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🥣 Consistencia cremosa artesanal
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🥑 Acompañado de aguacate lojano
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🌶️ Ají de pepa imperdible
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha del Repe Lojano
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Nombre tradicional:</span>
                <strong className="text-grafito font-semibold">
                  Repe blanco o repe lojano
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Ingrediente base:</span>
                <strong className="text-grafito font-semibold">
                  Guineo verde (plátano seda)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Elemento lácteo:</span>
                <strong className="text-grafito font-semibold">
                  Quesillo artesanal lojano y leche
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Aroma esencial:</span>
                <strong className="text-grafito font-semibold">
                  Cilantro finamente picado
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-petroleo font-bold">
                  Almuerzo tradicional (entrada)
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio promedio:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $2.50 – $4.00 (en almuerzo)
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Repe Lojano"
        horarioRecomendado="11:30 AM – 03:00 PM (almuerzo tradicional)"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Repe Lojano" />

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
                  <span>Preguntas Frecuentes sobre el Repe Lojano</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">
                  ▾
                </span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {REPE_FAQS.map((faq) => (
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

      {/* ── 6. CTA TRANSVERSAL ── */}
      <section className="py-12 bg-porcelana border-t border-niebla">
        <Wrap>
          <div className="rounded-3xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">
                LA DUPLA PERFECTA
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Quieres completar el almuerzo lojano?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Repe de entrada + cecina a la brasa con yuca y mote = el
                almuerzo más auténtico que puedas probar en Loja.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/platos/cecina-lojana"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
              >
                Guía de la Cecina Lojana →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
