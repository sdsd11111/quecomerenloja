import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Tamales y Humitas en Loja | La Casa del Tamal Lojano y Cafeterías",
  description: "Descubre los mejores tamales lojanos y humitas tradicionales. Masa de maíz criollo envuelta en achira, rellenos de pollo o queso, acompañados de café de altura.",
  alternates: {
    canonical: "/platos/tamales-lojanos",
  },
  openGraph: {
    title: "Tamales Lojanos y Humitas: Desayunos y Tradición de Loja",
    description: "Guía de tamales lojanos y la famosa casa de la humita y el tamal en Loja. Dónde desayunar con café lojano de especialidad.",
    url: "https://quecomerenloja.com/platos/tamales-lojanos",
    images: [{ url: "/tamales-humitas.jpg", width: 1200, height: 630, alt: "Tamales Lojanos y Humitas en Loja" }],
  },
};

const TAMAL_FAQS = [
  {
    q: "¿Qué hace especial al tamal lojano frente a otros tamales de Ecuador?",
    a: "El tamal lojano se elabora con maíz criollo seco remojado y molido finamente, cocido con manteca y caldo de pollo para lograr una masa sumamente suave y esponjosa. Va envuelto exclusivamente en hoja de achira (que le confiere su aroma andino inconfundible) y lleva un generoso condumio de pollo o cerdo con huevo duro y pimiento.",
  },
  {
    q: "¿Cuál es la diferencia entre un tamal y una humita?",
    a: "El tamal lojano se hace con masa cocida de maíz seco y lleva relleno de carne (generalmente pollo sazonado), envuelto en hoja de achira. La humita se elabora con choclo tierno (maíz fresco dulce) molido con abundante quesillo y mantequilla, y se envuelve en las hojas tiernas de la propia mazorca de choclo.",
  },
  {
    q: "¿A qué hora se acostumbra comer tamales en Loja?",
    a: "Son el alimento rey del desayuno lojano (desde las 6:30 AM) y también de las meriendas de la tarde (el tradicional 'café de las 5'). Siempre se acompañan de una taza humeante de café filtrado lojano de especialidad.",
  },
  {
    q: "¿Dónde encontrar tamales y humitas en Loja?",
    a: "En locales emblemáticos dedicados exclusivamente a esta tradición (como la famosa Casa de la Humita y el Tamal Lojano, Tamalería Lojana, El Palacio del Tamal) y en las acogedoras cafeterías de la tradicional Calle Lourdes y el centro histórico.",
  },
];

export const dynamic = "force-dynamic";

export default function TamalesLojanosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        "name": "Tamal Lojano Tradicional en Hoja de Achira",
        "headline": "El bocado mañanero por excelencia de Loja",
        "description": "Tamal andino suave a base de masa de maíz sazonada, relleno de pollo y envuelto en hoja de achira.",
        "recipeCuisine": "Lojana / Ecuatoriana",
        "recipeCategory": "Desayunos / Tradición",
        "keywords": "tamales lojanos, humitas loja, casa del tamal lojano, desayuno lojano",
        "recipeIngredient": [
          "Harina o masa de maíz criollo cocida",
          "Caldo de pollo concentrado",
          "Condumio de pollo desmechado con achiote y cebolla",
          "Huevo duro en rodajas",
          "Hojas de achira frescas lavadas",
          "Café de Loja para servir",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": TAMAL_FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
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

      {/* ── 1. HERO AL 70% DE PANTALLA CON IMAGEN LIMPIA DE FONDO (SIN OVERLAY OSCURO) ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-10 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/tamales-humitas.jpg"
            alt="Tamales lojanos tradicionales y humitas"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Tarjeta de título flotante integrada abajo a la izquierda para máxima legibilidad sin tapar la foto */}
        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              TRADICIÓN MATUTINA · DESAYUNOS DE LOJA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-grafito leading-[1.1]">
              Tamales Lojanos & Humitas:{" "}
              <em className="font-serif italic font-normal text-petroleo">
                El aroma inconfundible de la achira.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La tradición mañanera más querida de Loja. Conoce las huecas más populares, la historia de la hoja de achira y dónde pedir un tamal caliente con café de altura.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/desayunos-en-loja"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Guía de Desayunos en Loja
              </Link>
              <Link
                href="/cafe-de-loja"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Cafeterías de especialidad →
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
              <li className="font-semibold text-petroleo">Tamales y Humitas</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DATA DEL PLATO PARA POSICIONAMIENTO Y CULTURA GASTRONÓMICA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              TRADICIÓN Y SABOR AUTÉNTICO
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La Casa de la Humita y el Tamal Lojano
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Tanto lojanos como viajeros consideran el desayuno con tamal caliente en hoja de achira y café de filtro un ritual sagrado de hospitalidad andina. Es el punto de encuentro matutino de la ciudad.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La cocción lenta al vapor dentro de las hojas de achira transmite notas herbales únicas a la masa que ningún molde moderno puede igualar. Es la compañía ideal para una mañana fresca en la centinela del sur.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🍃 Envuelto en hoja de achira
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                ☕ Maridaje con café de especialidad
              </span>
              <span className="rounded-xl border border-niebla bg-white px-3.5 py-2 text-petroleo shadow-2xs">
                🧀 Humitas con queso criollo
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-7 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">FICHA GASTRONÓMICA</span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">Ficha de Tamales y Humitas</h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">El Tamal:</span>
                <strong className="text-grafito font-semibold">Maíz seco, pollo, hoja de achira</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">La Humita:</span>
                <strong className="text-grafito font-semibold">Choclo tierno dulce, queso, hoja de maíz</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-petroleo font-bold">Desayuno (7-10 AM) / Tarde (4-7 PM)</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Acompañamiento:</span>
                <strong className="text-grafito font-semibold">Café de Loja pasado</strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Puntos clave:</span>
                <strong className="text-grafito font-semibold">Calle Lourdes, San Sebastián, Centro</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-petroleo font-bold text-sm">$1.25 – $2.00 por unidad</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. DÓNDE COMER: 3 CARDS DE PLAZAS LIBRES PARA ALIADOS ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Tamales y Humitas"
        horarioRecomendado="07:00 AM – 11:00 AM y 04:30 PM – 07:30 PM"
      />

      {/* ── 4. DESCUBRE EL RESTAURANTE MÁS CERCANO (MAPA REAL LEAFLET DE LOJA) ── */}
      <MapaLeafletLoja nombrePlato="Tamales y Humitas" />

      {/* ── 5. PREGUNTAS FRECUENTES (FORMATO ACORDEÓN LIMPIO IGUAL A LA HOME) ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Tamales y Humitas</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {TAMAL_FAQS.map((faq) => (
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

      {/* ── 6. CTA TRANSVERSAL CON CAFÉ DE LOJA ── */}
      <section className="py-12 bg-porcelana border-t border-niebla">
        <Wrap>
          <div className="rounded-3xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">MARIDAJE TRADICIONAL</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Buscas el mejor café para acompañar tu tamal?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Visita nuestra guía de cafeterías de especialidad y café de altura premiado internacionalmente en Loja.
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
