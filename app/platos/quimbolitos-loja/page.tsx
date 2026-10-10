import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Quimbolitos en Loja | El Bizcocho Tradicional en Hoja de Achira",
  description: "Dónde probar los mejores quimbolitos en Loja: esponjosos bizcochos tradicionales al vapor con pasas y queso, el maridaje perfecto con café lojano.",
  alternates: { canonical: "/platos/quimbolitos-loja" },
  openGraph: {
    title: "Quimbolitos Lojanos Tradicionales | Qué Comer en Loja",
    description: "La tradición del quimbolito en Loja: esponjoso, dulce y cocinado al vapor en hoja de achira. Cafeterías y panaderías recomendadas.",
    url: "https://quecomerenloja.com/platos/quimbolitos-loja",
    images: [{ url: "/tamales-humitas.jpg", width: 1200, height: 630, alt: "Quimbolitos en Loja Ecuador" }],
  },
};

const QUIMBOLITOS_FAQS = [
  {
    q: "¿Qué diferencia al quimbolito del tamal y la humita?",
    a: "El quimbolito es un pastel o bizcochuelo dulce esponjoso a base de harina de trigo, maíz, mantequilla, huevos, pasas y un toque de licor, mientras que el tamal y la humita son preparaciones saladas a base de maíz.",
  },
  {
    q: "¿En qué hoja se cocina el quimbolito en Loja?",
    a: "Tradicionalmente se envuelve y cocina al vapor en hojas de achira, lo cual le confiere su aroma silvestre característico.",
  },
  {
    q: "¿Cuál es el mejor momento para comer quimbolitos?",
    a: "Son ideales para el desayuno tardío, el café de media mañana (10:00 AM) o la tradicional merienda/tarde lojana (4:00 PM - 6:00 PM).",
  },
  {
    q: "¿Cuánto cuesta un quimbolito en Loja?",
    a: "Suele costar entre $1.00 y $1.75 USD por unidad en panaderías y cafeterías tradicionales.",
  },
];

export default function QuimbolitosLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Quimbolitos en Loja | Dulce Tradicional al Vapor",
        "url": "https://quecomerenloja.com/platos/quimbolitos-loja",
        "description": "Guía de quimbolitos tradicionales en Loja Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": QUIMBOLITOS_FAQS.map((f) => ({
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
            src="/tamales-humitas.jpg"
            alt="Quimbolitos tradicionales en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              REPOSTERÍA TRADICIONAL · MAÑANAS Y TARDES
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Quimbolitos en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                Bizcocho suave y esponjoso al vapor en hoja de achira.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La dulzura que acompaña los mejores cafés de Loja. Esponjoso, aromático y con pasas, cocido lentamente al vapor en las tradicionales panaderías y cafeterías lojanas.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/desayunos-en-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Desayunar en Loja
              </Link>
              <Link href="/platos/humitas-loja" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Humitas de Loja →
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
              <li className="font-semibold text-petroleo">Quimbolitos en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">TRADICIÓN DULCE DE LA SIERRA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              El dulce compañero de la tertulia lojana
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Junto con las humitas y tamales, el quimbolito completa la trilogía de masas cocinadas en hoja de la gastronomía lojana. Su textura aireada y perfume a vainilla y hoja verde lo convierten en la opción dulce favorita para la media mañana.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍃 Hoja de achira fresca</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍇 Pasas y toque dulce</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">☕ Ideal con café filtrado</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Quimbolitos Lojanos</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Tipo:</span>
                <strong className="text-grafito font-semibold">Bizcocho dulce al vapor</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Envoltura:</span>
                <strong className="text-grafito font-semibold">Hoja de achira</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Momento del día:</span>
                <strong className="text-petroleo font-bold">Desayuno, 10:00 AM y 04:30 PM</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Maridaje:</span>
                <strong className="text-grafito font-semibold">Café negro filtrado o chocolate</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio aproximado:</span>
                <strong className="text-petroleo font-bold text-sm">$1.00 – $1.75</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS LIBRES ── */}
      <PlazasDisponiblesPlato nombrePlato="Quimbolitos" horarioRecomendado="07:00 AM – 11:30 AM & 04:00 PM – 07:00 PM" />

      {/* ── 4. MAPA REAL ── */}
      <MapaLeafletLoja nombrePlato="Quimbolitos" />

      {/* ── 5. FAQ ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Quimbolitos en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {QUIMBOLITOS_FAQS.map((faq) => (
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">CAFETERÍAS DE ESPECIALIDAD</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">Acompaña tu quimbolito con café premiado</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Descubre dónde probar cafés lojanos con notas achocolatadas y florales en el corazón de Loja.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link href="/cafe-de-loja" className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md">
                Guía de Cafeterías en Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
