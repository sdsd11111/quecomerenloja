import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Parihuela en Loja | Dónde Comer Sopa de Mariscos en Loja Ecuador",
  description:
    "Guía de la Parihuela en Loja: caldo de mariscos con camarón, calamar y mejillón, aromatizado con ají amarillo y limón. Los mejores locales donde pedirla en la ciudad.",
  alternates: { canonical: "/platos/parihuela-loja" },
  openGraph: {
    title: "Parihuela en Loja: Dónde Comer Sopa de Mariscos",
    description:
      "Descubre dónde comer parihuela en Loja: restaurantes con mariscos frescos, precios y horarios.",
    url: "https://quecomerenloja.com/platos/parihuela-loja",
    images: [
      {
        url: "/parihuela-loja.jpg",
        width: 1200,
        height: 630,
        alt: "Parihuela sopa de mariscos en Loja",
      },
    ],
  },
};

const FAQS = [
  {
    q: "¿Qué es la parihuela y por qué se consigue en Loja?",
    a: "La parihuela es un caldo peruano-ecuatoriano de mariscos (camarón, calamar, mejillón, concha) cocinados en un caldo concentrado con ají amarillo, culantro, limón y tomate. Aunque Loja no tiene costa, los restaurantes de mariscos traen producto fresco de Machala, Puerto Bolívar o Guayaquil en transporte refrigerado, y la parihuela se ha convertido en un plato muy solicitado en la ciudad.",
  },
  {
    q: "¿Cuánto cuesta la parihuela en Loja?",
    a: "El precio varía según el tamaño y el tipo de mariscos incluidos. Una porción individual oscila entre $6.00 y $10.00 USD. Las versiones con langostino entero o concha pueden costar hasta $14.00 USD. Los restaurantes marinos de la ciudad ofrecen las mejores relaciones calidad-precio.",
  },
  {
    q: "¿En qué horario se sirve la parihuela en Loja?",
    a: "La mayoría de restaurantes de mariscos en Loja abren al mediodía (12:00 – 15:30) y en las noches (18:00 – 22:00). Para el almuerzo existe la opción del menú del día con sopa de mariscos. En las noches se puede pedir a la carta con mejores opciones.",
  },
  {
    q: "¿Es fresca la parihuela en Loja o es congelada?",
    a: "Varía por local. Los restaurantes más reconocidos reciben envíos de marisco refrigerado (no congelado) cada 2-3 días desde la costa ecuatoriana. Para saber si el producto del día es fresco, lo ideal es preguntar directamente o visitar en los días de mayor rotación (viernes y sábado), cuando el volumen de clientes garantiza mayor frescura.",
  },
];

export default function ParihulaLoja() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Parihuela de Mariscos en Loja",
        headline: "Caldo concentrado de mariscos al estilo lojano",
        description:
          "Caldo de camarón, calamar y mejillón con ají amarillo, culantro y limón al estilo serrano.",
        recipeCuisine: "Ecuatoriana / Peruana",
        recipeCategory: "Sopas / Mariscos",
        keywords: "parihuela loja, sopa mariscos loja, mariscos en loja",
        recipeIngredient: [
          "Camarones frescos",
          "Calamar en aros",
          "Mejillones",
          "Ají amarillo",
          "Culantro y limón",
          "Tomate riñón y cebolla",
          "Caldo concentrado de mariscos",
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
            src="https://mvps.b-cdn.net/quecomerenloja/almuerzos/parihuela-mariscos.webp"
            alt="Parihuela sopa de mariscos en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              MARISCOS · ALMUERZO Y CENA EN LOJA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Parihuela en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El mar en la sierra más al sur del Ecuador.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Caldo concentrado de camarones, calamar y mejillón con ají
              amarillo, cilantro y limón. Loja tiene sus propios restaurantes
              de mariscos que traen producto fresco de la costa ecuatoriana.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/almuerzos-loja"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Guía de Almuerzos en Loja
              </Link>
              <Link
                href="/restaurantes"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Restaurantes →
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
                Parihuela en Loja
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
              MARISCOS FRESCOS EN LA SIERRA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              ¿Por qué hay buena parihuela en Loja si no tiene costa?
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              La logística de transporte refrigerado moderno conecta a Loja con
              los puertos de Machala y Guayaquil en menos de 4 horas. Los
              mejores restaurantes de mariscos de la ciudad reciben entregas
              periódicas de camarón, calamar, mejillón y otros productos del
              mar con estándares de frescura excepcionales.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La parihuela lojana adopta el estilo peruano-ecuatoriano del
              caldo concentrado y picante, adaptado al paladar serrano con
              menos picor y más hierbas aromáticas propias de la sierra sur
              como el culantro fresco y el orégano lojano.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🦐 Camarón fresco de la costa
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🌶️ Ají amarillo y limón
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🌿 Culantro y orégano lojano
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA GASTRONÓMICA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha de la Parihuela
            </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Mariscos principales:</span>
                <strong className="text-grafito font-semibold">
                  Camarón, calamar, mejillón
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Base del caldo:</span>
                <strong className="text-grafito font-semibold">
                  Fumet concentrado + ají amarillo
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario:</span>
                <strong className="text-petroleo font-bold">
                  12:00 – 15:30 y 18:00 – 22:00
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Frescura producto:</span>
                <strong className="text-grafito font-semibold">
                  Traída de costa cada 2-3 días
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Mejor día para ir:</span>
                <strong className="text-grafito font-semibold">
                  Viernes y sábado (máximo frescura)
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">
                  $6.00 – $14.00 por porción
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS DISPONIBLES ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Parihuela y Mariscos"
        horarioRecomendado="12:00 PM – 03:30 PM y 06:00 PM – 10:00 PM"
      />

      {/* ── 4. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Parihuela y Mariscos en Loja" />

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
                  <span>Preguntas Frecuentes sobre Parihuela en Loja</span>
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
                ALMUERZOS COMPLETOS EN LOJA
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                ¿Buscas más opciones de almuerzo en Loja?
              </h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Menú del día, repe lojano, cecina a la brasa, cuy asado y más.
                Consulta nuestra guía completa de almuerzos en la ciudad.
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
