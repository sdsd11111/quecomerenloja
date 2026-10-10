import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Pizzas en Loja | Las Mejores Pizzerías y Pizza a Domicilio",
  description: "Guía completa de las mejores pizzerías en Loja Ecuador. Desde pizza napolitana artesanal hasta pizza a domicilio. Pizzería Forno di Fango, Mondragone y más opciones.",
  alternates: { canonical: "/platos/pizza-loja" },
  openGraph: {
    title: "Pizzas en Loja: Pizzerías y Pizza a Domicilio | Qué Comer en Loja",
    description: "Descubre las mejores pizzerías de Loja Ecuador: pizza artesanal, a domicilio y locales para cenar con masa madre e ingredientes frescos.",
    url: "https://quecomerenloja.com/platos/pizza-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Pizzas en Loja Ecuador" }],
  },
};

const PIZZA_FAQS = [
  {
    q: "¿Cuáles son las mejores pizzerías en Loja?",
    a: "Loja cuenta con varias pizzerías destacadas como Forno di Fango (pizza napolitana artesanal al horno de leña), Mondragone Pizzería y Giro Pizza, que ofrecen pizzas con ingredientes frescos y opciones de pizza a domicilio en el centro de la ciudad.",
  },
  {
    q: "¿Hay pizza a domicilio en Loja?",
    a: "Sí, varias pizzerías de Loja ofrecen servicio de pizza a domicilio, especialmente de jueves a domingo. Puedes contactar directamente a los locales vía WhatsApp o usar plataformas de delivery locales.",
  },
  {
    q: "¿Cuánto cuesta una pizza en Loja?",
    a: "Una pizza personal en Loja ronda entre $6 y $10 USD. Las pizzas medianas o familiares en pizzerías artesanales van de $12 a $18 USD dependiendo de los ingredientes y el tamaño.",
  },
  {
    q: "¿A qué hora abren las pizzerías en Loja?",
    a: "La mayoría de pizzerías en Loja abren a partir de las 12:00 PM y tienen su mayor actividad entre las 6:00 PM y las 10:00 PM, especialmente los fines de semana.",
  },
];

export default function PizzaLojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Pizzas en Loja | Las Mejores Pizzerías",
        "url": "https://quecomerenloja.com/platos/pizza-loja",
        "description": "Guía de las mejores pizzerías y pizza a domicilio en Loja Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": PIZZA_FAQS.map((f) => ({
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
            alt="Pizzas artesanales en Loja Ecuador"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              PIZZAS ARTESANALES · NOCHES EN LOJA
            </span>
            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Pizzas en Loja:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                Las mejores pizzerías y delivery de la ciudad.
              </em>
            </h1>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              Desde pizza napolitana artesanal al horno de leña hasta opciones de pizza a domicilio. Descubre los locales más populares para cenar pizza en Loja.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/comida-rapida-loja" className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm">
                ← Dónde Cenar en Loja
              </Link>
              <Link href="/restaurantes" className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition">
                Ver todos los restaurantes →
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
              <li className="font-semibold text-petroleo">Pizzas en Loja</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. FICHA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">ESCENA PIZZERA DE LOJA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La pizza artesanal conquista las noches lojanas
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Loja tiene una escena pizzera en pleno crecimiento, con locales artesanales y propuestas que combinan la tradición italiana con ingredientes frescos locales. Las pizzerías con horno de leña o piedra son las preferidas por familias, parejas y grupos de amigos.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La pizza a domicilio en Loja ha crecido con nuevos operadores que ofrecen tiempos de entrega de 30 a 45 minutos. Los fines de semana son los días de mayor demanda, especialmente entre las 7 PM y 10 PM.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🍕 Pizza artesanal al horno de leña</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🛵 Delivery disponible</span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">🌿 Ingredientes frescos locales</span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Pizzas en Loja</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Estilo popular:</span>
                <strong className="text-grafito font-semibold">Napolitana artesanal / Clásica italiana</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Tamaño:</span>
                <strong className="text-grafito font-semibold">Personal, mediana y familiar</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">12:00 PM – 10:30 PM (cenas desde 6 PM)</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Sectores:</span>
                <strong className="text-grafito font-semibold">Centro, Av. Universitaria, Vilcabamba</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Delivery:</span>
                <strong className="text-petroleo font-bold">Disponible en varios locales</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">$6.00 – $15.00</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. PLAZAS LIBRES ── */}
      <PlazasDisponiblesPlato nombrePlato="Pizzas" horarioRecomendado="12:00 PM – 10:30 PM (mejor horario: 6:00 PM – 10:00 PM)" />

      {/* ── 4. MAPA REAL ── */}
      <MapaLeafletLoja nombrePlato="Pizzas" />

      {/* ── 5. FAQ ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Pizzas en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>
              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {PIZZA_FAQS.map((faq) => (
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
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">MÁS OPCIONES NOCTURNAS</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Buscas otras opciones para cenar en Loja?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Explora alitas BBQ, hamburguesas artesanales, chifas y más opciones nocturnas en la guía completa de dónde cenar en Loja.
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
