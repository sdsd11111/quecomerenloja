import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Bolones en Loja | Bolones de Verde con Queso, Chicharrón y Mixtos",
  description: "Dónde comer los mejores bolones en Loja Ecuador: bolón de verde crujiente con quesillo lojano, chicharrón o mixto, acompañados de huevo frito y café de altura.",
  alternates: { canonical: "/platos/bolones-en-loja" },
  openGraph: {
    title: "Bolones en Loja: Bolón de Verde con Quesillo y Chicharrón | Qué Comer en Loja",
    description: "Guía de los mejores bolones de verde en Loja para el desayuno y media mañana. Huecas recomendadas y cafeterías.",
    url: "https://quecomerenloja.com/platos/bolones-en-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Bolones de verde en Loja Ecuador" }],
  },
};

const BOLONES_FAQS = [
  {
    q: "¿Dónde comer los mejores bolones en Loja?",
    a: "En Loja encuentras excelentes bolones en cafeterías del centro histórico, locales cercanos a las universidades y tradicionales huecas mañaneras en la Av. Cuxibamba y sector El Valle.",
  },
  {
    q: "¿Qué tipos de bolón se sirven en Loja?",
    a: "Los más pedidos son el bolón de quesillo (con el abundante quesillo lojano fresco), el de chicharrón crujiente y el bolón mixto que combina ambos.",
  },
  {
    q: "¿Con qué se acompaña tradicionalmente el bolón?",
    a: "Se acompaña siempre con café lojano de altura recién pasado, huevo frito a la plancha y un toque de ají criollo casero.",
  },
  {
    q: "¿Cuál es el precio promedio de un bolón en Loja?",
    a: "El bolón individual cuesta entre $1.75 y $2.50 USD. En combo con café y huevo suele costar entre $3.00 y $4.50 USD.",
  },
];

export default function BolonesLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Bolones en Loja | Bolón de Verde Tradicional",
        "url": "https://quecomerenloja.com/platos/bolones-en-loja",
        "description": "Guía de bolones de verde en Loja Ecuador: quesillo, chicharrón y mixtos.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": BOLONES_FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── 1. HERO AL 70% ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-10 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-loja.jpg"
            alt="Bolones de verde en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              DESAYUNOS · TRADICIÓN DE LA MAÑANA
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Bolones en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                Verde crocante con quesillo artesanal y chicharrón.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El desayuno ecuatoriano más contundente también tiene su sello en Loja: plátano verde recién majado, dorado a la perfección y relleno del auténtico quesillo lojano derretido.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/desayunos-en-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Desayunar en Loja
              </Link>
              <Link href="/platos/tamales-lojanos" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Tamales Lojanos →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-niebla bg-white">
        <Wrap className="py-3 text-xs text-muted">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li>/</li>
              <li><Link href="/desayunos-en-loja" className="hover:underline">Dónde Desayunar en Loja</Link></li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Bolones en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">DESAYUNOS CONTUNDENTES EN LOJA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La energía que arranca el día en el austro
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Junto a los tamales y humitas, el bolón de plátano verde es una de las opciones más solicitadas por estudiantes, trabajadores y turistas para comenzar la jornada con energía. En Loja, el secreto radica en el quesillo artesanal fresco que aporta una textura cremosa única.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍌 Plátano verde frito o cocinado</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🧀 Quesillo lojano derretido</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">☕ Con café de altura</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Bolones en Loja</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Variedad:</span>
                <strong className="text-grafito font-semibold">Queso · Chicharrón · Mixto</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario ideal:</span>
                <strong className="text-petroleo font-bold">06:30 AM – 11:30 AM</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Acompañamiento:</span>
                <strong className="text-grafito font-semibold">Café pasado + Huevo frito</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Zonas populares:</span>
                <strong className="text-grafito font-semibold">El Valle, Av. Cuxibamba, Centro</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Rango de precio:</span>
                <strong className="text-petroleo font-bold text-sm">$1.75 – $3.50</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS LIBRES ── */}
      <PlazasDisponiblesPlato nombrePlato="Bolones" horarioRecomendado="06:30 AM – 11:30 AM (Mañanas)" />

      {/* ── 4. MAPA REAL ── */}
      <MapaLeafletLoja nombrePlato="Bolones" />

      {/* ── 5. FAQ ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Bolones en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {BOLONES_FAQS.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-niebla/40 bg-white p-4">
                    <h4 className="font-serif text-sm font-bold text-grafito">{faq.q}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{faq.a}</p>
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">LA RUTA DEL CAFÉ</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Buscas el mejor café de altura para acompañar tu desayuno?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Descubre las cafeterías de especialidad de la Calle Lourdes y el centro histórico en nuestra guía.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link href="/cafe-de-loja" className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md">
                Guía de Café de Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
