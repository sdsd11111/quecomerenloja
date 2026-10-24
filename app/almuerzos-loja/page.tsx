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
  title: "Dónde Almorzar en Loja | Menú del Día y Almuerzos Ejecutivos",
  description: "Guía completa de almuerzos en Loja: menús del día entre $3.00 y $5.00 con sopa tradicional (repe o arveja), segundo, ensalada y jugo natural sin intermediarios.",
  alternates: { canonical: "/almuerzos-loja" },
  openGraph: {
    title: "Dónde Almorzar en Loja: Menús del Día y Almuerzos Ejecutivos",
    description: "Encuentra dónde almorzar en Loja hoy: comida tradicional casera, menú ejecutivo y huecas populares.",
    url: "https://quecomerenloja.com/almuerzos-loja",
    images: [{ url: "/repe-lojano.jpg", width: 1200, height: 630, alt: "Almuerzos en Loja Ecuador" }],
  },
};

export const dynamic = "force-dynamic";

const WA_AFILIACION_ALMUERZOS = "https://wa.me/593988888888?text=Hola%2C%20tengo%20un%20restaurante%20o%20comedor%20de%20almuerzos%20en%20Loja%20y%20deseo%20afiliarlo%20a%20Qu%C3%A9%20Comer%20en%20Loja";

const ALMUERZO_SLOTS = [
  {
    id: "slot-almuerzo-1",
    zone: "Centro Financiero / Calle 10 de Agosto",
    title: "Cupo Oficial: Almuerzo Ejecutivo Premium",
    desc: "Espacio reservado para restaurante ejecutivo con menú diario de calidad para profesionales, bancos y oficinas públicas.",
    status: "Disponible para Socio",
    highlight: "Alta demanda de lunes a viernes (12:00 a 15:00)",
  },
  {
    id: "slot-almuerzo-2",
    zone: "Sector El Valle / Tradición",
    title: "Cupo Oficial: Hueca Tradicional & Repe",
    desc: "Espacio para hueca representativa de platos típicos de almuerzo (repe blanco, cecina, arveja) para turistas y familias.",
    status: "Disponible para Socio",
    highlight: "Preferencia destacada en comida típica",
  },
  {
    id: "slot-almuerzo-3",
    zone: "Cerca de UTPL / Sector San Cayetano",
    title: "Cupo Oficial: Almuerzos Universitarios & Económicos",
    desc: "Espacio para comedor o restaurante con almuerzos balanceados y rápidos de $3.00 a $3.50 para estudiantes y docentes.",
    status: "Disponible para Socio",
    highlight: "Flujo constante de volumen de clientes",
  },
];

const FAQS_ALMUERZOS = [
  {
    q: "¿Cuánto cuesta un almuerzo ejecutivo o menú del día en Loja?",
    a: "El precio promedio oscila entre $3.00 y $4.50 USD en la gran mayoría de comedores y restaurantes céntricos. Incluye sopa casera (repe, arveja o caldo), plato fuerte con arroz y ensalada, jugo natural y en muchos locales un postre pequeño.",
  },
  {
    q: "¿A qué hora se sirve el almuerzo en Loja?",
    a: "El horario típico de almuerzo en Loja es de 12:00 a 14:30. Los locales más concurridos del centro y San Sebastián suelen agotar sus mejores platos y opciones de sopa alrededor de las 13:30.",
  },
  {
    q: "¿Qué opciones de sopa suelen tener los almuerzos lojanos?",
    a: "El repe lojano (sopa cremosa de guineo verde y quesillo) es tradicional los lunes y viernes. También es muy habitual encontrar sopa de arveja con guineo, locro de papa con queso, caldo de patas o caldo de gallina criolla.",
  },
  {
    q: "¿Dónde almorzar comida típica y cecina en Loja?",
    a: "El sector de El Valle y las inmediaciones de la Plaza San Sebastián concentran las huecas más emblemáticas para comer cecina lojana a la brasa, repe blanco y cuy asado al mediodía.",
  },
  {
    q: "¿Cómo pedir almuerzo a domicilio en Loja sin apps con sobreprecio?",
    a: "A través de Qué Comer en Loja contactas directamente al WhatsApp verificado del restaurante para ordenar tu almuerzo al precio real de carta, sin las comisiones del 20-30% de las apps tradicionales.",
  },
];

export default async function AlmuerzosPage() {
  const [aliadosAlmuerzo, platosTopDB] = await Promise.all([
    getAliadosByMomento("almuerzo"),
    getPlatosByMomentoDB("almuerzo", 4),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Dónde Almorzar en Loja | Menú del Día",
        "url": "https://quecomerenloja.com/almuerzos-loja",
        "description": "Guía de almuerzos ejecutivos y menús del día en Loja, Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_ALMUERZOS.map((f) => ({
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

      {/* ── HERO ALMUERZOS EN LOJA ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden py-16 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mvps.b-cdn.net/quecomerenloja/almuerzos/hero-almuerzos.webp"
            alt="Restaurantes y almuerzos en Loja Ecuador"
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
              <span className="h-2 w-2 rounded-full bg-citrico animate-pulse" /> MEDIODÍA EN LOJA · MENÚS DE $3 A $5
            </div>

            <h1 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Dónde Almorzar en Loja: <em className="font-serif font-normal italic text-citrico">Menú del Día y Almuerzos Ejecutivos.</em>
            </h1>

            <p className="mt-5 max-w-[620px] text-base md:text-lg text-white font-medium leading-relaxed drop-shadow">
              Comer rico, casero y al instante. Descubre las huecas y restaurantes que sirven el menú del día completo: sopa lojana tradicional, plato fuerte, ensalada y jugo natural fresco.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/restaurantes"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-lg"
              >
                Ver restaurantes para almorzar →
              </Link>
              <a
                href={WA_AFILIACION_ALMUERZOS}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition inline-flex items-center gap-1.5"
              >
                ¿Tienes un restaurante? Afiliarlo aquí ↗
              </a>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: SPLIT 50/50 (PLATOS DE ALMUERZO & MAPA CON GEOLOCALIZACIÓN) ── */}
      <SplitMomentoMapa
        momento="almuerzo"
        subtitulo="MEDIODÍA EN LOJA"
        titulo="Especialidades que Definen el Almuerzo en Loja"
        descripcion="Elige tu plato fuerte preferido o activa tu GPS para encontrar el restaurante con almuerzo ejecutivo o comida típica más cercano a ti."
        platos={platosTopDB}
        aliados={aliadosAlmuerzo}
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
                Platos Típicos para el Almuerzo Lojano
              </h2>
              <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
                Conoce a detalle la historia, ingredientes y mejores lugares para comer cada plato insignia del mediodía en Loja.
              </p>
            </div>
          </div>

          <PlatoCarouselRow
            platos={getPlatosByMomento("almuerzo")}
            hubUrl="/restaurantes"
            verMasTexto="Ver restaurantes para almorzar"
          />
        </Wrap>
      </section>

      {/* ── SECCIÓN 4: VITRINA DE SOCIOS Y RESTAURANTES VERIFICADOS (SLIDE INFINITO) ── */}
      <section className="py-20 border-t border-niebla bg-white overflow-hidden">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div className="max-w-[650px]">
              <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
                ★ SOCIOS VERIFICADOS · ALMUERZOS
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Restaurantes con Almuerzo Verificado
              </h2>
              <p className="text-xs md:text-sm text-muted mt-2">
                Nuestros aliados actualizan sus platos del día directamente por WhatsApp y se recomiendan automáticamente ante miles de turistas y lojanos.
              </p>
            </div>
            <a
              href={WA_AFILIACION_ALMUERZOS}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition inline-flex items-center gap-1.5"
            >
              Publicar mi restaurante aquí ↗
            </a>
          </div>
        </Wrap>

        {/* Marquee de ancho completo */}
        <AliadosSlideInfinito
          aliados={aliadosAlmuerzo}
          slots={ALMUERZO_SLOTS}
          waAfiliacionUrl={WA_AFILIACION_ALMUERZOS}
          badgeTexto="🍽️ Socio Verificado"
        />
      </section>

      {/* ── SECCIÓN 5: FAQ ALMUERZOS ── */}
      <section className="py-16 border-t border-niebla bg-porcelana/50">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-grafito">
                Preguntas sobre Almuerzos en Loja
              </h2>
            </div>

            <div className="space-y-3.5">
              {FAQS_ALMUERZOS.map((faq) => (
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
