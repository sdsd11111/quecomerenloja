import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Hamburguesas en Loja | Las Mejores Smash Burgers y Clásicas Artesanales",
  description: "Guía de hamburguesas en Loja Ecuador: smash burgers, clásicas artesanales y opciones a domicilio. Los mejores locales de Loja para cenar.",
  alternates: { canonical: "/platos/hamburguesas-loja" },
  openGraph: {
    title: "Hamburguesas en Loja: Smash Burgers y Artesanales | Qué Comer en Loja",
    description: "Descubre las mejores hamburguesas de Loja Ecuador. Smash burgers artesanales, hamburguesas cuadradas y clásicas con papas fritas.",
    url: "https://quecomerenloja.com/platos/hamburguesas-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Hamburguesas artesanales en Loja Ecuador" }],
  },
};

const HAMBUR_FAQS = [
  {
    q: "¿Dónde comer las mejores hamburguesas en Loja?",
    a: "Los mejores locales de hamburguesas en Loja se encuentran en el centro histórico y la zona universitaria. Destacan las hamburguesas artesanales con carne de res local, los smash burgers y las hamburguesas cuadradas que han ganado popularidad en redes sociales.",
  },
  {
    q: "¿Qué son las hamburguesas cuadradas en Loja?",
    a: "Las hamburguesas cuadradas en Loja son un estilo artesanal que se ha vuelto viral en redes sociales. Se caracterizan por su pan cuadrado artesanal, medallón de carne aplastado al estilo smash y ingredientes frescos locales. Son conocidas como 'hamburguesas cuadradas loja' en Google.",
  },
  {
    q: "¿Cuánto cuesta una hamburguesa en Loja?",
    a: "Las hamburguesas en Loja van desde $4.50 USD (opción sencilla con papas) hasta $10 USD para opciones premium artesanales con carne de calidad, queso importado y salsas especiales.",
  },
  {
    q: "¿Hay hamburguesas a domicilio en Loja?",
    a: "Sí, varios locales de hamburguesas en Loja ofrecen servicio a domicilio, especialmente en el sector céntrico. El horario de delivery suele ser de 5 PM a 10 PM los días de semana y hasta las 11 PM los fines de semana.",
  },
];

export default function HamburguesasLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Hamburguesas en Loja | Smash Burgers y Artesanales",
        "url": "https://quecomerenloja.com/platos/hamburguesas-loja",
        "description": "Guía de hamburguesas artesanales y smash burgers en Loja Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": HAMBUR_FAQS.map((f) => ({
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

      {/* ── 1. HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-10 pt-20">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-loja.jpg" alt="Hamburguesas artesanales en Loja Ecuador" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              BURGER HOUSE · NOCHES EN LOJA
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Hamburguesas en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                Smash burgers, cuadradas y artesanales.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              De las hamburguesas cuadradas virales a los smash burgers con carne de res local. Descubre los mejores locales para comer hamburguesas artesanales en Loja.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/comida-rapida-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Cenar en Loja
              </Link>
              <Link href="/platos/alitas-loja" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Alitas en Loja →
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
              <li className="font-semibold text-petroleo">Hamburguesas en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">PASIÓN ARTESANAL</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La cultura de la hamburguesa artesanal llega a Loja
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Las hamburguesas en Loja han experimentado una transformación destacada en los últimos años, con propuestas artesanales de carne premium, panes brioche horneados a diario y salsas de autor. Las opciones de hamburguesas cuadradas y recetas innovadoras conquistan a los amantes del buen comer nocturno.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              El smash burger —técnica de aplastar el medallón en plancha caliente para crear una costra caramelizada— es la tendencia que domina los nuevos emprendimientos gastronómicos de Loja.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍔 Smash burger artesanal</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">⬜ Hamburguesas cuadradas</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🥩 Carne de res local</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Hamburguesas en Loja</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Estilos:</span>
                <strong className="text-grafito font-semibold">Smash · Cuadrada · Clásica</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Carne:</span>
                <strong className="text-grafito font-semibold">Res local · Cerdo · Pollo</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">12:00 PM – 11:00 PM</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Acompañamiento:</span>
                <strong className="text-grafito font-semibold">Papas fritas · Aros de cebolla</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Delivery:</span>
                <strong className="text-petroleo font-bold">Disponible en varios locales</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">$4.50 – $10.00</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      <PlazasDisponiblesPlato nombrePlato="Hamburguesas" horarioRecomendado="12:00 PM – 11:00 PM (mejor: 6:00 PM – 10:00 PM)" />
      <MapaLeafletLoja nombrePlato="Hamburguesas" />

      {/* FAQ */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Hamburguesas en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {HAMBUR_FAQS.map((faq) => (
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">NOCHES EN LOJA</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Buscas más opciones para cenar en Loja?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Alitas BBQ, pizzas artesanales, chifas y más en la guía completa de restaurantes nocturnos de Loja.
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
