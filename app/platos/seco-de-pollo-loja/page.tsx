import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Seco de Pollo en Loja | El Plato Fuerte del Almuerzo Lojano",
  description:
    "El seco de pollo lojano es el segundo más pedido del menú del día en Loja: pollo estofado en salsa de tomate y especias con arroz, menestra de lenteja y aguacate. Guía completa.",
  alternates: { canonical: "/platos/seco-de-pollo-loja" },
  openGraph: {
    title: "Seco de Pollo en Loja | Plato del Día Tradicional",
    description:
      "Pollo estofado con arroz, menestra y aguacate. El segundo estrella del almuerzo lojano. Guía de restaurantes y huecas en Loja.",
    url: "https://quecomerenloja.com/platos/seco-de-pollo-loja",
    images: [
      {
        url: "/hero-loja.jpg",
        width: 1200,
        height: 630,
        alt: "Seco de pollo lojano con arroz y menestra",
      },
    ],
  },
};

const FAQS = [
  {
    q: "¿Qué es el seco de pollo lojano?",
    a: "El seco de pollo es un estofado tradicional ecuatoriano muy popular en Loja: trozos de pollo cocinados lentamente en una salsa de tomate riñón, cebolla, ajo, comino, cilantro y cerveza o chicha, hasta que la carne queda jugosa y tierna. Se sirve como plato fuerte del almuerzo con arroz blanco, menestra de lenteja o fréjol y aguacate en rodajas.",
  },
  {
    q: "¿Qué diferencia tiene el seco de pollo lojano del de otras ciudades?",
    a: "En Loja, el seco de pollo lleva tomate de árbol adicional en la salsa (que le da un sabor más ácido y frutal), y se acompaña con frecuencia de yuca sancochada en vez de papas. También es común que las huecas lojanas lo sirvan con ají de pepa o ají molido criollo al lado.",
  },
  {
    q: "¿Cuánto cuesta el seco de pollo en Loja?",
    a: "Como parte del menú del día (entrada + segundo + jugo), el precio varía entre $2.50 y $4.00 USD. Si se pide a la carta en restaurantes formales, puede costar entre $4.50 y $6.50 USD con guarniciones completas.",
  },
  {
    q: "¿Dónde comer el mejor seco de pollo en Loja?",
    a: "Los mercados tradicionales (Mercado Centro Comercial, Mercado San Sebastián) ofrecen la versión más auténtica y económica. Los comedores populares del sector universitario y las huecas del centro histórico también lo incluyen diariamente en el menú del día.",
  },
];

export default function SecoDePolloLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Seco de Pollo Lojano Tradicional",
        headline: "El plato fuerte del almuerzo lojano",
        description:
          "Pollo estofado en salsa de tomate, cebolla y especias, acompañado de arroz blanco, menestra y aguacate.",
        recipeCuisine: "Ecuatoriana / Lojana",
        recipeCategory: "Platos fuertes / Almuerzo",
        keywords:
          "seco de pollo loja, seco de pollo ecuatoriano, almuerzo loja, donde almorzar loja",
        recipeIngredient: [
          "Pollo entero troceado",
          "Tomate riñón y tomate de árbol",
          "Cebolla perla, ajo, comino y cilantro",
          "Cerveza o chicha de jora",
          "Arroz blanco cocido",
          "Menestra de lenteja",
          "Aguacate maduro en rodajas",
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
            src="/hero-loja.jpg"
            alt="Seco de pollo lojano con arroz blanco y menestra"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              PLATO DEL DÍA · ALMUERZO LOJANO
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Seco de Pollo Lojano:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El segundo más pedido del menú del día.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Jugoso pollo estofado en salsa de tomate, cebolla y especias
              lojanas con arroz blanco, menestra de lenteja y aguacate. El
              plato fuerte que no falta en ningún comedor lojano.
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
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/almuerzos-loja" className="hover:underline">
                  Almuerzos en Loja
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-petroleo">
                Seco de Pollo Lojano
              </li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              COCINA CASERA LOJANA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La receta familiar del seco de pollo al estilo lojano
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              El seco de pollo lojano destaca por su salsa concentrada que
              combina el tomate riñón con tomate de árbol, dándole un sabor
              más complejo y ligeramente ácido que lo diferencia de otras
              versiones del país. La cocción lenta en olla de barro o paila
              es el secreto de su textura jugosa.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              En los comedores populares del mercado, el seco de pollo forma
              parte del menú del día junto con el repe o la arveja de sopa.
              En los restaurantes del centro, se sirve con arroz amarillo,
              ensalada fresca de temporada y tostadas de pan casero.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🍗 Pollo estofado en salsa criolla
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🍚 Arroz blanco y menestra
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🥑 Con aguacate lojano
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha del Seco de Pollo
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Tipo de preparación:</span>
                <strong className="text-grafito font-semibold">
                  Estofado lento en salsa criolla
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Guarnición principal:</span>
                <strong className="text-grafito font-semibold">
                  Arroz blanco + menestra de lenteja
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Toque lojano:</span>
                <strong className="text-grafito font-semibold">
                  Tomate de árbol en la salsa
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">
                  12:00 PM – 02:30 PM (menú del día)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Mejor lugar:</span>
                <strong className="text-grafito font-semibold">
                  Mercados, comedores, huecas
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $2.50 – $5.00 (con menú completo)
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Seco de Pollo"
        horarioRecomendado="12:00 PM – 02:30 PM (almuerzo diario de lunes a sábado)"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Seco de Pollo Lojano" />

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
                  <span>Preguntas Frecuentes sobre el Seco de Pollo en Loja</span>
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
                EL ALMUERZO LOJANO COMPLETO
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Quieres el almuerzo lojano más auténtico?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Seco de pollo de segundo + repe lojano de entrada + jugo de
                horchata = el menú del día lojano más completo y auténtico.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/almuerzos-loja"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
              >
                Guía de Almuerzos en Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
