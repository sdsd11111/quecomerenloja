import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Cecina Lojana | Dónde Comer la Auténtica Cecina a la Brasa en Loja",
  description:
    "Guía completa de la Cecina Lojana: corte tradicional de cerdo, marinado al sol, asado al carbón con yuca y mote. Los mejores asaderos y restaurantes en Loja.",
  alternates: { canonical: "/platos/cecina-lojana" },
  openGraph: {
    title: "Cecina Lojana: El Asado Tradicional de Loja",
    description:
      "Conoce el secreto de la cecina lojana asada a la brasa con yuca, mote y curtido de cebolla. Asaderos recomendados en Loja.",
    url: "https://quecomerenloja.com/platos/cecina-lojana",
    images: [
      {
        url: "/cecina-lojana.jpg",
        width: 1200,
        height: 630,
        alt: "Cecina Lojana a la brasa con yuca y mote",
      },
    ],
  },
};

const CECINA_FAQS = [
  {
    q: "¿Qué es la cecina lojana y cómo se prepara?",
    a: "La cecina lojana es un plato típico preparado con finos filetes de lomo de cerdo (cortados con precisión de bistec muy delgado), marinados con ajo, comino, sal y especias andinas, oreteados al aire o al sol de la mañana y finalmente asados rápidamente al carbón o a la leña.",
  },
  {
    q: "¿Con qué guarniciones se sirve la cecina en Loja?",
    a: "El plato tradicional se sirve acompañado de generosas porciones de yuca cocida tierna, mote recién cocido, curtido de cebolla colorada con tomate y cilantro, y una porción de ají lojano molido con queso o pepa de zambo.",
  },
  {
    q: "¿Cuál es el mejor momento para comer cecina lojana?",
    a: "Es el plato fuerte por excelencia para el almuerzo y los fines de semana. Frecuentemente se pide después de una entrada de repe blanco lojano para una experiencia culinaria 100% auténtica.",
  },
  {
    q: "¿Dónde comer la mejor cecina lojana?",
    a: "El sector del Valle de Catamayo y los asaderos tradicionales de la vía a Vilcabamba y el centro de Loja son mundialmente famosos por sus asados de cecina jugosa y dorada al fuego de leña.",
  },
];

export default function CecinaLojanaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Cecina Lojana Tradicional a la Brasa",
        headline: "El asado insignia de Loja y Catamayo",
        description:
          "Carne de cerdo finamente fileteada, marinada y asada al carbón acompañada de yuca, mote y ají.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Platos fuertes / Asados",
        keywords: "cecina lojana, cecina asada, comida tipica loja, asados en loja",
        recipeIngredient: [
          "Filetes delgados de pierna o lomo de cerdo",
          "Ajo machacado, comino y sal en grano",
          "Yuca cocida suave",
          "Mote cocido caliente",
          "Curtido de cebolla colorada y tomate",
          "Ají de pepa lojano",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: CECINA_FAQS.map((f) => ({
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
            src="/cecina-lojana.jpg"
            alt="Cecina lojana a la brasa con yuca y mote"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              TRADICIÓN A LA BRASA · ALMUERZO LOJANO
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Cecina Lojana:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El sabor de la brasa y la leña.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Delgados filetes de cerdo asados al carbón con yuca tierna y mote
              caliente. Conoce su tradición y los mejores asaderos para
              saborearla en Loja y sus alrededores.
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
              <li className="font-semibold text-petroleo">Cecina Lojana</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA GASTRONÓMICA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              TRADICIÓN GASTRONÓMICA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              El secreto de una auténtica Cecina Lojana
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              La cecina lojana no es carne seca ni deshidratada dura: es un
              arte de corte milimétrico en sábana donde la carne de cerdo
              absorbe el aliño casero antes de recibir el golpe de calor
              directo sobre las brasas de carbón vegetal.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              En cada bocado se siente el toque ahumado característico, que
              equilibra a la perfección con la suavidad de la yuca lojana
              recién sancochada y la frescura del curtido de cebolla colorada.
              Para la experiencia completa, un{" "}
              <strong>
                <Link
                  href="/platos/repe-lojano"
                  className="text-petroleo underline font-semibold"
                >
                  repe lojano
                </Link>
              </strong>{" "}
              de entrada es la combinación obligatoria.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🔥 Asado rápido al carbón
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🥔 Yuca tierna y mote caliente
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🧅 Curtido de cebolla criolla
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha de la Cecina Lojana
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Corte de carne:</span>
                <strong className="text-grafito font-semibold">
                  Lomo o pierna de cerdo en sábana
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Cocción:</span>
                <strong className="text-grafito font-semibold">
                  Parrilla a la brasa / carbón
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Guarnición reina:</span>
                <strong className="text-grafito font-semibold">
                  Yuca sancochada y mote
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Salsa acompañante:</span>
                <strong className="text-grafito font-semibold">
                  Ají de pepa lojano
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Zonas famosas:</span>
                <strong className="text-grafito font-semibold">
                  Catamayo, El Valle, Loja Centro
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $4.50 – $7.50 el plato completo
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES PARA ALIADOS ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Cecina Lojana"
        horarioRecomendado="12:00 PM – 04:00 PM (almuerzo) y fines de semana"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Cecina Lojana" />

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
                  <span>Preguntas Frecuentes sobre la Cecina Lojana</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">
                  ▾
                </span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {CECINA_FAQS.map((faq) => (
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
                ¿Buscas el repe lojano para acompañar tu cecina?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Repe de entrada + cecina a la brasa = el almuerzo más lojano que
                puedas imaginar. Conoce nuestra guía completa.
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
