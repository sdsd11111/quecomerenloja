import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Cuy Asado en Loja | Dónde Comer Cuy y Cuánto Cuesta en Loja",
  description:
    "Guía completa del cuy asado en Loja: dónde comerlo, cuánto cuesta, cómo se prepara y cuál es el mejor sector para probar esta delicadeza andina en la Sierra Sur del Ecuador.",
  alternates: { canonical: "/platos/cuy-asado-loja" },
  openGraph: {
    title: "Cuy Asado en Loja | Guía Completa de la Delicadeza Andina",
    description:
      "Dónde comer cuy en Loja: restaurantes, precios ($8–$14), preparación tradicional al horno y las zonas gastronómicas donde encontrarlo.",
    url: "https://quecomerenloja.com/platos/cuy-asado-loja",
    images: [
      {
        url: "/cuy-asado-loja.jpg",
        width: 1200,
        height: 630,
        alt: "Cuy asado tradicional en Loja Ecuador",
      },
    ],
  },
};

const FAQS = [
  {
    q: "¿Dónde comer cuy en Loja?",
    a: "Los mejores locales para comer cuy en Loja se concentran en el sector de El Valle, la vía a Catamayo y los restaurantes tradicionales del centro histórico. Algunos locales también lo preparan bajo pedido (se recomienda llamar con 1-2 horas de anticipación en días de semana, ya que la cocción al horno toma tiempo).",
  },
  {
    q: "¿Cuánto cuesta un plato de cuy en Loja?",
    a: "El cuy asado completo oscila entre $8.00 y $14.00 USD por porción individual, incluyendo las guarniciones tradicionales (papa con cuy en salsa de maní, mote, encurtidos andinos). En algunos restaurantes se vende medio cuy o por porciones desde $5.00.",
  },
  {
    q: "¿Cómo se prepara el cuy asado en Loja?",
    a: "El método más tradicional en la Sierra Sur ecuatoriana es el asado al palo sobre brasas o en horno de leña. El cuy se adobe previamente con ajo, comino, sal y ají, se ensarta en una caña y se gira lentamente sobre el fuego durante 45-60 minutos. Resulta en una piel dorada y crocante con carne jugosa y de sabor intenso.",
  },
  {
    q: "¿Es difícil encontrar cuy en Loja todos los días?",
    a: "No es tan difícil si se va a los restaurantes especializados del sector El Valle o los asaderos de la vía a Catamayo. En el centro histórico, algunos locales tradicionales lo preparan bajo pedido o los fines de semana. Se recomienda confirmar disponibilidad por WhatsApp antes de ir.",
  },
];

export default function CuyAsadoLoja() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Cuy Asado al Palo Lojano",
        headline: "La delicadeza andina de la Sierra Sur del Ecuador",
        description:
          "Cuy entero adobado con ajo, comino y ají, asado lentamente al palo sobre brasas de leña.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Platos fuertes / Gastronomía andina",
        keywords: "cuy asado loja, cuy en loja, donde comer cuy loja",
        recipeIngredient: [
          "Cuy entero limpio",
          "Ajo machacado y comino",
          "Sal en grano y ají",
          "Papa en salsa de maní",
          "Mote cocido",
          "Encurtido andino de cebolla",
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
            src="/cuy-asado-loja.jpg"
            alt="Cuy asado al palo en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              DELICADEZA ANDINA · GASTRONOMÍA DE LOJA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Cuy Asado en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                La joya gastronómica de los Andes.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Piel dorada y crujiente, carne jugosa e intensa. El cuy asado al
              palo es la delicadeza andina más representativa de la Sierra Sur
              del Ecuador. Descubre dónde comerlo y cuánto cuesta en Loja.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/restaurantes"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Restaurantes en Loja
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
              <li><Link href="/restaurantes" className="hover:underline">Restaurantes Loja</Link></li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Cuy Asado en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              GASTRONOMÍA ANDINA PREMIUM
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              El cuy asado: tradición ancestral de los Andes lojanos
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              En las culturas andinas, el cuy no es simplemente un plato: es un
              símbolo de celebración, hospitalidad y abundancia. En la Sierra
              Sur ecuatoriana, el método del asado al palo sobre brasas de leña
              es el más respetado y auténtico.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El secreto está en el marinado previo con ajo, comino y ají
              criollo, y en la paciencia de la cocción lenta que logra esa piel
              dorada y crujiente que hace tan especial a este plato en la región.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🔥 Asado al palo sobre brasas
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🥔 Papa en salsa de maní
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🌽 Mote y encurtidos andinos
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha del Cuy Asado
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Método de cocción:</span>
                <strong className="text-grafito font-semibold">
                  Asado al palo / horno de leña
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Tiempo de cocción:</span>
                <strong className="text-grafito font-semibold">
                  45 – 60 minutos sobre brasas
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Guarnición típica:</span>
                <strong className="text-grafito font-semibold">
                  Papa en maní, mote, encurtido
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Zonas recomendadas:</span>
                <strong className="text-grafito font-semibold">
                  El Valle, Catamayo, Centro
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Disponibilidad:</span>
                <strong className="text-petroleo font-bold">
                  Fines de semana (fines de semana siempre)
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $8.00 – $14.00 por porción
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Cuy Asado"
        horarioRecomendado="12:00 PM – 04:00 PM (especialmente fines de semana)"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Cuy Asado en Loja" />

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
                  <span>Preguntas Frecuentes sobre el Cuy Asado en Loja</span>
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
                GASTRONOMÍA LOJANA COMPLETA
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Quieres conocer todos los platos típicos de Loja?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Descubre el repe blanco, la cecina a la brasa, los tamales en
                hoja de achira y mucho más en nuestra guía gastronómica completa.
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
