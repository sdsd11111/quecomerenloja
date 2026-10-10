import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Chifas en Loja | Comida China, Chaulafán y Wantán",
  description: "Guía completa de chifas en Loja Ecuador: chaulafán, tallarín saltado, sopa wantán y banquetes familiares. Chifa Dragón Rojo, Hong Kong, Oriental y más opciones populares.",
  alternates: { canonical: "/platos/chifa-loja" },
  openGraph: {
    title: "Chifas en Loja: Chaulafán y Comida China | Qué Comer en Loja",
    description: "Los mejores chifas y comida china en Loja Ecuador. Almuerzos y cenas abundantes en familia o a domicilio.",
    url: "https://quecomerenloja.com/platos/chifa-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Chifas en Loja Ecuador" }],
  },
};

const CHIFA_FAQS = [
  {
    q: "¿Cuáles son los chifas más conocidos en Loja?",
    a: "Entre los chifas con mayor trayectoria y preferencia en Loja destacan Chifa Dragón Rojo, Chifa Hong Kong y Chifa Oriental, ubicados estratégicamente cerca del centro histórico y avenidas principales.",
  },
  {
    q: "¿Cuáles son los platos más pedidos en los chifas de Loja?",
    a: "El chaulafán especial de pollo, cerdo o mixto es el favorito indiscutible, seguido por el tallarín saltado, la sopa wantán y el lomo saltado con papas fritas.",
  },
  {
    q: "¿Cuál es el costo promedio de comer en un chifa en Loja?",
    a: "Un plato individual o combo ejecutivo de chifa suele costar entre $4.00 y $6.50 USD. Para grupos y familias, los combos o banquetes familiares oscilan entre $12 y $25 USD.",
  },
  {
    q: "¿Tienen servicio a domicilio los chifas en Loja?",
    a: "Sí, la gran mayoría de chifas en Loja cuentan con servicio de entrega a domicilio o retiro en local (takeaway), siendo especialmente demandados en noches de viernes y domingos.",
  },
];

export default function ChifaLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Chifas en Loja | Comida China y Chaulafán",
        "url": "https://quecomerenloja.com/platos/chifa-loja",
        "description": "Guía de chifas y gastronomía china-ecuatoriana en Loja Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": CHIFA_FAQS.map((f) => ({
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
            alt="Chifas y comida china en Loja Ecuador"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              BANQUETES Y FAMILIA · ALMUERZO Y CENA
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Chifas en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El mejor chaulafán, tallarines y banquetes familiares.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La cocina china-ecuatoriana es una de las opciones más populares para almorzar y cenar en Loja. Descubre los chifas más recomendados y opciones con entrega a domicilio.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/comida-rapida-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Cenar en Loja
              </Link>
              <Link href="/almuerzos-loja" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Almuerzos en Loja →
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
              <li><Link href="/comida-rapida-loja" className="hover:underline">Dónde Cenar en Loja</Link></li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Chifas en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">GASTRONOMÍA FUSIÓN EN LOJA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              Generaciones compartiendo el sabor del chifa
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Con locales emblemáticos en el centro histórico y avenidas principales, los chifas representan una opción insustituible para reuniones familiares y comidas abundantes en la urbe lojana.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Desde porciones individuales hasta banquetes completos, estos locales destacan por su rapidez de servicio, porciones generosas y excelente relación calidad-precio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🥢 Chaulafán artesanal</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍲 Sopa Wantán y caldos</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🛵 Entregas a domicilio rápidas</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Chifas en Loja</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Plato estrella:</span>
                <strong className="text-grafito font-semibold">Chaulafán especial / Tallarín mixto</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-grafito font-semibold">Almuerzos y Cenas familiares</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">11:30 AM – 10:30 PM (continuo)</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Sectores:</span>
                <strong className="text-grafito font-semibold">Centro Histórico, Av. Manuel Agustín Aguirre</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Modalidad:</span>
                <strong className="text-petroleo font-bold">Salón, para llevar y delivery</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Rango de precios:</span>
                <strong className="text-petroleo font-bold text-sm">$4.00 – $9.00</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS LIBRES ── */}
      <PlazasDisponiblesPlato nombrePlato="Chifas" horarioRecomendado="11:30 AM – 10:30 PM (Almuerzos y Cenas)" />

      {/* ── 4. MAPA REAL ── */}
      <MapaLeafletLoja nombrePlato="Chifas" />

      {/* ── 5. FAQ ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Chifas en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {CHIFA_FAQS.map((faq) => (
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">VARIEDAD GASTRONÓMICA</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Prefieres explorar otras alternativas para cenar?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Descubre pizzerías artesanales, alitas BBQ, hamburguesas y comida tradicional en nuestra guía nocturna.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link href="/comida-rapida-loja" className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md">
                Guía de Cenas en Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
