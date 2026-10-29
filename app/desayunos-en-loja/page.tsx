import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { getPlatosByMomento } from "@/lib/platos-data";
import { PlatoCarouselRow } from "@/components/PlatoCarouselRow";
import { getAliadosByMomento } from "@/lib/aliados-db";
import { getPlatosByMomentoDB } from "@/lib/platos-db";
import { SplitMomentoMapa } from "@/components/SplitMomentoMapa";
import { AliadosSlideInfinito } from "@/components/AliadosSlideInfinito";

export const metadata: Metadata = {
  title: "Dónde Desayunar en Loja | Cafeterías, Tamales y Café de Especialidad",
  description: "Guía definitiva de desayunos en Loja: cafeterías de especialidad en el centro histórico y calle Lourdes, tamales tradicionales, humitas y café de altura.",
  alternates: { canonical: "/desayunos-en-loja" },
  openGraph: {
    title: "Dónde Desayunar en Loja: Cafeterías y Desayunos Típicos",
    description: "Encuentra dónde desayunar en Loja: tamales mañaneros, humitas calientes y café de especialidad de altura sin intermediarios.",
    url: "https://quecomerenloja.com/desayunos-en-loja",
    images: [{ url: "/cafe-loja-persona.jpg", width: 1200, height: 630, alt: "Desayunos y café en Loja Ecuador" }],
  },
};

export const dynamic = "force-dynamic";

const WA_AFILIACION_CAFES = "https://wa.me/593988888888?text=Hola%2C%20tengo%20una%20cafeter%C3%ADa%20o%20local%20de%20desayunos%20en%20Loja%20y%20deseo%20afiliarlo%20a%20Qu%C3%A9%20Comer%20en%20Loja";

const DESAYUNO_SLOTS = [
  {
    id: "slot-cafe-1",
    zone: "Calle Lourdes / Centro Histórico",
    title: "Cupo Oficial: Cafetería de Especialidad",
    desc: "Espacio reservado para una cafetería de autor o tostaduría en la emblemática Calle Lourdes. Canalización directa a WhatsApp sin comisiones.",
    status: "Disponible para Socio",
    highlight: "Primer puesto en intención 'cafeterías en loja'",
  },
  {
    id: "slot-cafe-2",
    zone: "Plaza Central / San Sebastián",
    title: "Cupo Oficial: Tradición de Tamales & Humitas",
    desc: "Espacio reservado para local tradicional con alta producción matutina de tamales calientes y quimbolitos para locales y turistas.",
    status: "Disponible para Socio",
    highlight: "Alta preferencia en desayunos tradicionales",
  },
  {
    id: "slot-cafe-3",
    zone: "Av. Orillas del Zamora / Nueva Loja",
    title: "Cupo Oficial: Brunch Moderno & Pastelería",
    desc: "Espacio para propuesta moderna de brunch, tostadas artesanales, café frío y opciones de desayuno ligero.",
    status: "Disponible para Socio",
    highlight: "Público joven y ejecutivos matutinos",
  },
];

const FAQS_DESAYUNOS = [
  {
    q: "¿A qué hora abren las cafeterías para desayunar en Loja?",
    a: "La mayoría de puestos tradicionales del centro y el mercado abren desde las 06:30 o 07:00 AM para ofrecer tamales y café recién pasados. Las cafeterías de especialidad y locales de brunch suelen iniciar atención entre 07:30 y 08:30 AM.",
  },
  {
    q: "¿Dónde se concentran las mejores cafeterías y tamales de Loja?",
    a: "El sector más tradicional es la peatonal Calle Lourdes con sus fachadas coloniales y ambiente bohemio. También los alrededores de la Plaza San Sebastián, la calle Bolívar y la calle Sucre concentran barras de café de altura premiado y tamalerías tradicionales.",
  },
  {
    q: "¿Cuánto cuesta desayunar en Loja?",
    a: "Un desayuno tradicional de tamal o humita con taza de café de filtro cuesta entre $2.25 y $3.50 USD. Desayunos completos con tigrillo o bolón mixto, huevos, carne cecina y jugo natural oscilan entre $3.50 y $5.50 USD.",
  },
  {
    q: "¿Qué diferencia al café lojano que se sirve en el desayuno?",
    a: "Loja produce cafés arábicos de altura (de 1.400 a 2.100 msnm) reconocidos internacionalmente con galardones como Taza Dorada. En los desayunos se disfruta tanto la tradicional 'pasada' concentrada en chuspa como extracciones de especialidad en V60 y Chemex.",
  },
  {
    q: "¿Hay opciones de desayuno a domicilio o para llevar en Loja?",
    a: "Sí. Gran parte de las cafeterías aliadas en Qué Comer en Loja despachan pedidos matutinos directos vía WhatsApp sin recargos abusivos de aplicaciones intermediarias.",
  },
];

export default async function DesayunosPage() {
  const [aliadosDesayuno, platosTopDB] = await Promise.all([
    getAliadosByMomento("desayuno"),
    getPlatosByMomentoDB("desayuno", 4),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Dónde Desayunar en Loja | Cafeterías y Tamales",
        "url": "https://quecomerenloja.com/desayunos-en-loja",
        "description": "Ruta gastronómica matutina de Loja: café de altura, tamales, humitas y cafeterías.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_DESAYUNOS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
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

      {/* ── HERO DE PÁGINA: DESAYUNOS EN LOJA ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden py-16 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mvps.b-cdn.net/quecomerenloja/desayunos/hero-desayunos.webp"
            alt="Desayunos tradicionales y café en Loja"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        </div>

        <Wrap className="relative z-10 my-auto">
          <div className="max-w-[760px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-citrico/30 bg-black/40 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-citrico backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-citrico animate-pulse" /> MAÑANAS EN LOJA · CAFETERÍAS Y TRADICIÓN
            </div>

            <h1 className="text-[clamp(30px,5vw,64px)] font-bold tracking-tight text-white leading-[1.1] drop-shadow-md">
              Dónde Desayunar en Loja: <em className="font-serif font-normal italic text-citrico">Cafeterías, Tamales y Café de Altura.</em>
            </h1>

            <p className="mt-3.5 sm:mt-5 max-w-[620px] text-sm sm:text-base md:text-lg text-white font-medium leading-[1.5] sm:leading-relaxed drop-shadow">
              <span className="sm:hidden">
                Café lojano pasado, tamales calientes en achira, humitas y bolones en el centro y la Calle Lourdes.
              </span>
              <span className="hidden sm:inline">
                Despertar en Loja huele a café arábico recién pasado, tamales calientes en hoja de achira y humitas con quesillo. Conoce la ruta matutina del centro histórico y la Calle Lourdes.
              </span>
            </p>

            <div className="mt-5 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/cafe-de-loja"
                className="rounded-xl bg-citrico px-5 py-3 sm:px-6 sm:py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-lg"
              >
                Ver cafeterías destacadas →
              </Link>
              <a
                href={WA_AFILIACION_CAFES}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-5 py-3 sm:px-6 sm:py-3.5 text-xs font-bold text-white hover:bg-white/20 transition inline-flex items-center gap-1.5"
              >
                ¿Tienes una cafetería? Afiliarla aquí ↗
              </a>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: SPLIT 50/50 (PLATOS DE DESAYUNO & MAPA CON GEOLOCALIZACIÓN) ── */}
      <SplitMomentoMapa
        momento="desayuno"
        subtitulo="MAÑANAS EN LOJA"
        titulo="Los Desayunos que Marcan la Mañana Lojana"
        descripcion="Explora los platos insignia matutinos o activa tu ubicación para descubrir la cafetería o local de tamales más cercano a ti."
        platos={platosTopDB}
        aliados={aliadosDesayuno}
      />

      {/* ── SECCIÓN 3: GUÍAS COMPLETAS POR PLATO (HUB & SPOKE CAROUSEL) ── */}
      <section className="py-16 bg-porcelana/60 border-t border-niebla">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
                GUÍAS COMPLETAS POR PLATO
              </span>
              <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-grafito">
                Especialidades Matutinas de Loja
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl">
                <span className="sm:hidden">Dónde comer los mejores tamales y humitas con café lojano.</span>
                <span className="hidden sm:inline">Guías completas sobre los clásicos del desayuno lojano: dónde se cocinan al vapor y los mejores acompañamientos con café de altura.</span>
              </p>
            </div>
          </div>

          <PlatoCarouselRow
            platos={getPlatosByMomento("desayuno")}
            hubUrl="/restaurantes?categoria=desayunos"
            verMasTexto="Ver todas las cafeterías"
          />
        </Wrap>
      </section>

      {/* ── SECCIÓN 4: VITRINA DE SOCIOS Y CAFETERÍAS VERIFICADAS (SLIDE INFINITO) ── */}
      <section className="py-20 border-t border-niebla bg-white overflow-hidden">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div className="max-w-[650px]">
              <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
                ★ SOCIOS VERIFICADOS · DESAYUNOS
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Cafeterías y Locales Recomendados
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2">
                <span className="sm:hidden">Cafeterías recomendadas con contacto directo a WhatsApp sin intermediarios.</span>
                <span className="hidden sm:inline">Espacios exclusivos para cafeterías de Loja que buscan captar al turista matutino y al residente sin intermediarios ni comisiones.</span>
              </p>
            </div>
            <a
              href={WA_AFILIACION_CAFES}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition inline-flex items-center gap-1.5"
            >
              Postular mi cafetería aquí ↗
            </a>
          </div>
        </Wrap>

        {/* Marquee de ancho completo, fuera del Wrap para romper la limitación de max-width */}
        <AliadosSlideInfinito
          aliados={aliadosDesayuno}
          slots={DESAYUNO_SLOTS}
          waAfiliacionUrl={WA_AFILIACION_CAFES}
          badgeTexto="☕ Socio Verificado"
        />
      </section>

      {/* ── SECCIÓN 5: FAQ MATUTINO ── */}
      <section className="py-16 border-t border-niebla bg-porcelana/50">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-grafito">
                Dudas Comunes sobre Desayunar en Loja
              </h2>
            </div>

            <div className="space-y-3.5">
              {FAQS_DESAYUNOS.map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-niebla bg-white p-5 transition open:shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between font-serif text-base font-semibold text-grafito">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-petroleo transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted border-t border-niebla/40 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
