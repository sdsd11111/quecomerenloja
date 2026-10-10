import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Humitas de Loja | Dónde Comer Humitas Tradicionales en Loja Ecuador",
  description:
    "Las humitas lojanas son un desayuno clásico de choclo tierno con quesillo artesanal derretido, cocidas al vapor en sus pancas. Guía de dónde comerlas en el centro histórico de Loja.",
  alternates: { canonical: "/platos/humitas-loja" },
  openGraph: {
    title: "Humitas de Loja: Dónde Comer el Clásico Desayuno de Choclo",
    description:
      "Choclo tierno molido con quesillo lojano derretido, cocidas en sus pancas. Descubre las mejores humitas en el centro de Loja.",
    url: "https://quecomerenloja.com/platos/humitas-loja",
    images: [
      {
        url: "/tamales-humitas.jpg",
        width: 1200,
        height: 630,
        alt: "Humitas de Loja Ecuador",
      },
    ],
  },
};

const FAQS = [
  {
    q: "¿Qué son las humitas lojanas?",
    a: "Las humitas son una preparación andina elaborada con choclo (maíz tierno) fresco molido en piedra o licuadora, mezclado con quesillo fresco, mantequilla y una pizca de sal o azúcar según el gusto. La masa se envuelve en las propias pancas del choclo y se cocina al vapor hasta que queda suave y ligeramente firme. En Loja se sirven calientes en el desayuno.",
  },
  {
    q: "¿Cuál es la diferencia entre humita y tamal en Loja?",
    a: "La humita se hace con choclo (maíz tierno fresco), tiene una textura húmeda y suave y es de sabor neutro con quesillo. El tamal lojano se hace con masa de maíz seco (mote) remojado y molido, tiene relleno de carne de pollo o cerdo con condumio, y se envuelve en hoja de achira. Ambos se cocinan al vapor y se consumen en el desayuno.",
  },
  {
    q: "¿A qué hora se consiguen humitas en Loja?",
    a: "Las humitas son un producto mañanero. Los puestos y panaderías tradicionales las tienen listas desde las 07:00 AM. Para las 10:00 AM suelen ya agotarse en los puestos del mercado y la calle. Lo mejor es ir temprano al Mercado Centro Comercial o los locales de la Calle Lourdes.",
  },
  {
    q: "¿Cuánto cuesta una humita en Loja?",
    a: "Una humita individual cuesta entre $0.75 y $1.25 USD. Generalmente se venden por pares o junto a una taza de café de altura para hacer el desayuno completo por $2.00 a $2.50 USD.",
  },
];

export default function HumitasLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Humitas de Loja Tradicionales",
        headline: "Choclo tierno con quesillo lojano al vapor en pancas",
        description:
          "Masa de choclo tierno molido con quesillo fresco, cocinada al vapor dentro de las pancas del maíz.",
        recipeCuisine: "Lojana / Ecuatoriana",
        recipeCategory: "Desayunos / Tradición",
        keywords: "humitas loja, humitas ecuatorianas, desayuno lojano, choclo loja",
        recipeIngredient: [
          "Choclo tierno fresco molido",
          "Quesillo lojano artesanal",
          "Mantequilla o manteca",
          "Sal o azúcar al gusto",
          "Pancas de choclo para envolver",
          "Café de Loja para acompañar",
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
            src="/tamales-humitas.jpg"
            alt="Humitas lojanas y tamales de choclo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              TRADICIÓN MATUTINA · DESAYUNOS DE LOJA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Humitas en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                Choclo tierno al vapor con quesillo.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El sabor dulce y húmedo del choclo tierno molido con quesillo
              lojano derretido, envuelto en sus propias pancas y cocido al
              vapor. El desayuno más tradicional de Loja junto con el tamal.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/desayunos-en-loja"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Guía de Desayunos en Loja
              </Link>
              <Link
                href="/platos/tamales-lojanos"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Tamales Lojanos →
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
              <li><Link href="/desayunos-en-loja" className="hover:underline">Desayunos en Loja</Link></li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Humitas de Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              SABOR Y TRADICIÓN MAÑANERA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La humita lojana: maíz tierno en su máxima expresión
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              La humita lojana se diferencia de las versiones de otras regiones
              por el generoso uso de quesillo fresco artesanal local, que
              aporta un sabor cremoso y salado que contrasta con la dulzura
              natural del choclo tierno recién molido.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Se acostumbra comerla muy caliente, recién sacada de la vaporera,
              acompañada siempre de una taza de café de Loja pasado lentamente
              en filtro de tela. Esta combinación es el desayuno mañanero más
              querido del centro histórico de la ciudad.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🌽 Choclo tierno fresco
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🧀 Quesillo lojano derretido
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                ☕ Con café de altura
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha de las Humitas Lojanas
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Ingrediente base:</span>
                <strong className="text-grafito font-semibold">
                  Choclo tierno (maíz fresco dulce)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Envoltorio:</span>
                <strong className="text-grafito font-semibold">
                  Pancas del propio choclo
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Cocción:</span>
                <strong className="text-grafito font-semibold">
                  Al vapor en tamalera
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">
                  7:00 AM – 10:00 AM
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Maridaje perfecto:</span>
                <strong className="text-grafito font-semibold">
                  Café de Loja filtrado
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $0.75 – $1.25 por unidad
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Humitas de Loja"
        horarioRecomendado="07:00 AM – 10:00 AM (desayuno mañanero)"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Humitas de Loja" />

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
                  <span>Preguntas Frecuentes sobre Humitas en Loja</span>
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
                MARIDAJE TRADICIONAL
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Buscas el café perfecto para acompañar tu humita?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Loja produce café de altura premiado internacionalmente. Conoce
                las mejores cafeterías de especialidad de la ciudad.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/cafe-de-loja"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
              >
                Guía de Cafeterías en Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
