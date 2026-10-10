import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Alitas en Loja | Alitas BBQ, Búfalo y Picantes · Los Mejores Locales",
  description: "Guía de las mejores alitas en Loja Ecuador: alitas BBQ, picantes, de búfalo y wings. Descubre los locales más populares y dónde pedir alitas los fines de semana.",
  alternates: { canonical: "/platos/alitas-loja" },
  openGraph: {
    title: "Alitas en Loja: BBQ, Búfalo y Wings | Qué Comer en Loja",
    description: "Las mejores alitas de Loja Ecuador: alitas BBQ, búfalo y picantes. 500 búsquedas/mes. Los locales más populares para las noches lojanas.",
    url: "https://quecomerenloja.com/platos/alitas-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Alitas BBQ en Loja Ecuador" }],
  },
};

const ALITAS_FAQS = [
  {
    q: "¿Dónde comer las mejores alitas en Loja?",
    a: "Los mejores locales de alitas en Loja se concentran en el centro histórico, la Av. Universitaria y el sector de Zamora Huayco. Las opciones más buscadas son locales especializados en alitas BBQ con salsas artesanales y acompañamiento de papas fritas.",
  },
  {
    q: "¿Qué tipos de alitas hay en Loja?",
    a: "En Loja puedes encontrar alitas BBQ clásicas, alitas de búfalo picantes, alitas miel-mostaza, alitas teriyaki y las especiales de cada local. Generalmente se sirven por docenas (12 unidades) con papas fritas y salsas dip.",
  },
  {
    q: "¿Cuánto cuestan las alitas en Loja?",
    a: "Una docena de alitas en Loja ronda entre $8 y $14 USD dependiendo del local y el tipo de salsa. Muchos locales ofrecen combos de 6 unidades desde $5 USD como opción individual.",
  },
  {
    q: "¿Cuál es el mejor día para comer alitas en Loja?",
    a: "Los jueves, viernes y sábados son los días de mayor demanda de alitas en Loja. Algunos locales ofrecen promociones especiales los jueves ('Alitas Night') con descuentos en combos de docenas.",
  },
];

export default function AlitasLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Alitas en Loja | BBQ y Wings",
        "url": "https://quecomerenloja.com/platos/alitas-loja",
        "description": "Guía de las mejores alitas BBQ y wings en Loja Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": ALITAS_FAQS.map((f) => ({
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
          <Image src="/hero-loja.jpg" alt="Alitas BBQ en Loja Ecuador" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              500 BÚSQUEDAS/MES · EL SNACK REY DE LOJA
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Alitas en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                BBQ, búfalo y picantes para las noches lojanas.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Las alitas de pollo son el snack rey de las noches lojanas. Descubre los mejores locales para disfrutar alitas BBQ, de búfalo y picantes en Loja.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/comida-rapida-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Cenar en Loja
              </Link>
              <Link href="/platos/pizza-loja" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Pizzas en Loja →
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
              <li className="font-semibold text-petroleo">Alitas en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">500 BÚSQUEDAS MENSUALES EN GOOGLE</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              Las alitas conquistan las noches de Loja
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Con más de <strong>500 búsquedas mensuales</strong>, las alitas en Loja son uno de los alimentos nocturnos más buscados de la ciudad. La popularidad de las "alitas BBQ loja" y "alitas wings loja" refleja una demanda real de turistas y residentes que buscan un lugar donde comer alitas los fines de semana.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Los locales más exitosos son aquellos que combinan alitas crujientes con salsas artesanales propias y un ambiente social animado. Las promociones de jueves en "alitas night" son una estrategia muy efectiva para aumentar el flujo entre semana.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🔥 BBQ artesanal</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🌶️ Picantes y de búfalo</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍟 Con papas fritas</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Alitas en Loja</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Variedad popular:</span>
                <strong className="text-grafito font-semibold">BBQ · Búfalo · Picantes · Honey mustard</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Presentación:</span>
                <strong className="text-grafito font-semibold">Por docenas (6 o 12 unidades)</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">5:00 PM – 11:00 PM</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Mejor día:</span>
                <strong className="text-grafito font-semibold">Jueves, Viernes y Sábado</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Acompañamiento:</span>
                <strong className="text-grafito font-semibold">Papas fritas + salsas dip</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">$5.00 – $12.00</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      <PlazasDisponiblesPlato nombrePlato="Alitas" horarioRecomendado="05:00 PM – 11:00 PM (Jueves a Domingo)" />
      <MapaLeafletLoja nombrePlato="Alitas" />

      {/* FAQ */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Alitas en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {ALITAS_FAQS.map((faq) => (
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

      {/* CTA */}
      <section className="py-12 bg-porcelana border-t border-niebla">
        <Wrap>
          <div className="rounded-3xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">MÁS OPCIONES NOCTURNAS</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Quieres ver más opciones de cenas en Loja?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Explora pizzas artesanales, hamburguesas, chifas y más en la guía completa de dónde cenar en Loja.
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
