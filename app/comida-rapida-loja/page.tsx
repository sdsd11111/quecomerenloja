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
  title: "Dónde Cenar en Loja | Comida Rápida, Alitas, Pizzas y Chifas",
  description: "Guía de cenas y comida de noche en Loja: alitas con salsas artesanales, pizzerías a la leña, hamburguesas smash y chifas tradicionales.",
  alternates: { canonical: "/comida-rapida-loja" },
  openGraph: {
    title: "Dónde Cenar en Loja: Alitas, Pizzas, Burgers y Chifas",
    description: "Descubre dónde cenar y pedir comida rápida en Loja hoy: alitas crujientes, pizzas a la leña y comida nocturna sin intermediarios.",
    url: "https://quecomerenloja.com/comida-rapida-loja",
    images: [{ url: "/hero-loja.jpg", width: 1200, height: 630, alt: "Comida nocturna y cenas en Loja Ecuador" }],
  },
};

export const dynamic = "force-dynamic";

const WA_AFILIACION_CENAS = "https://wa.me/593988888888?text=Hola%2C%20tengo%20un%20local%20de%20comida%20r%C3%A1pida%20o%20cenas%20en%20Loja%20y%20deseo%20afiliarlo%20a%20Qu%C3%A9%20Comer%20en%20Loja";

const NIGHT_SLOTS = [
  {
    id: "slot-noche-1",
    zone: "Sector San Sebastián / Centro",
    title: "Cupo Oficial: Alitas & Cervecería Artesanal",
    desc: "Espacio reservado para el local de alitas más visitado por jóvenes, universitarios y turistas para cenas y planes de fin de semana.",
    status: "Disponible para Socio",
    highlight: "Alta concurrencia en fines de semana",
  },
  {
    id: "slot-noche-2",
    zone: "Av. Salvador Bustamante / El Valle",
    title: "Cupo Oficial: Pizzería a la Leña & Pastas",
    desc: "Espacio reservado para pizzería artesanal italiana o al horno de leña con servicio para cenar y delivery directo sin comisión.",
    status: "Disponible para Socio",
    highlight: "Opción estelar para cenas en familia",
  },
  {
    id: "slot-noche-3",
    zone: "Zona Rosa / La Pradera / Nueva Loja",
    title: "Cupo Oficial: Chifa Tradicional & Wok",
    desc: "Espacio exclusivo para chifa de alta concurrencia nocturna ante comensales que buscan chaulafán y comida abundante para llevar o cenar.",
    status: "Disponible para Socio",
    highlight: "Platos al paso y delivery familiar",
  },
];

const FAQS_NIGHT = [
  {
    q: "¿Qué es lo que más busca la gente para cenar en Loja?",
    a: "Las opciones favoritas de cena en Loja se concentran en alitas con salsas artesanales (maracuyá picante, BBQ y honey mustard), pizzas al horno de leña, hamburguesas smash con carne local y los tradicionales banquetes de chifa al wok.",
  },
  {
    q: "¿Hasta qué hora abren los locales de comida rápida y cena en Loja?",
    a: "La mayoría de locales de alitas, hamburguesas y pizzas atienden desde las 17:30 o 18:00 hasta las 23:00 de domingo a jueves. Los viernes y sábados extienden su horario habitualmente hasta la medianoche o 01:00 AM.",
  },
  {
    q: "¿Cuáles son las zonas gastronómicas nocturnas más populares de Loja?",
    a: "La Plaza de San Sebastián y sus calles aledañas reúnen bares de café, cervecerías y alitas. Para pizzerías y comida al paso moderna, la Av. Salvador Bustamante Celi y el sector de La Pradera son puntos de alta afluencia.",
  },
  {
    q: "¿Hay opciones de comida rápida tradicional lojana por la noche?",
    a: "Sí. Es muy común encontrar locales que sirven cecina con yuca hasta altas horas de la noche, asados de carne a la parrilla, salchipapas especiales y tamales con café caliente para la merienda.",
  },
  {
    q: "¿Cómo pedir delivery nocturno en Loja sin comisiones abusivas?",
    a: "En Qué Comer en Loja encuentras los contactos directos de WhatsApp de cada restaurante verificado. Puedes ordenar delivery o reservar mesa sin recargos ocultos ni porcentajes extra de intermediación.",
  },
];

export default async function ComidaRapidaCenasPage() {
  const [aliadosCena, platosTopDB] = await Promise.all([
    getAliadosByMomento("cena"),
    getPlatosByMomentoDB("cena", 4),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Dónde Cenar en Loja | Alitas, Pizzas, Burgers y Chifas",
        "url": "https://quecomerenloja.com/comida-rapida-loja",
        "description": "Guía de cenas, comida rápida y antojos nocturnos en Loja, Ecuador.",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_NIGHT.map((f) => ({
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

      {/* ── HERO CENAS Y NOCHE EN LOJA ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden py-16 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mvps.b-cdn.net/quecomerenloja/cenas/hero-cenas.webp"
            alt="Cenas y ambiente nocturno en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
        </div>

        <Wrap className="relative z-10 my-auto">
          <div className="max-w-[760px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-citrico/30 bg-black/40 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-citrico backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-citrico animate-pulse" /> CENAS & PLANES NOCTURNOS EN LOJA
            </div>

            <h1 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Dónde Cenar en Loja: <em className="font-serif font-normal italic text-citrico">Alitas, Pizzas, Burgers y Chifas.</em>
            </h1>

            <p className="mt-5 max-w-[620px] text-base md:text-lg text-white font-medium leading-relaxed drop-shadow">
              Cuando cae la noche en Loja, la ciudad se enciende con el sabor de las alitas crocantes, pizzas recién horneadas a la leña, hamburguesas smash y comida para compartir con amigos.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/buscar?q=noche"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-lg"
              >
                Ver opciones nocturnas →
              </Link>
              <a
                href={WA_AFILIACION_CENAS}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition inline-flex items-center gap-1.5"
              >
                ¿Tienes un local nocturno? Afiliarlo aquí ↗
              </a>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: SPLIT 50/50 (ANTOJOS NOCTURNOS & MAPA CON GEOLOCALIZACIÓN) ── */}
      <SplitMomentoMapa
        momento="cena"
        subtitulo="NOCHE & COMIDA RÁPIDA"
        titulo="Lo Que Más se Come de Noche en Loja"
        descripcion="Elige entre alitas crujientes, pizzas a la leña o smash burgers, o activa tu GPS para encontrar el local nocturno abierto más cercano a ti."
        platos={platosTopDB}
        aliados={aliadosCena}
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
                Especialidades Tradicionales para la Noche
              </h2>
              <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
                ¿Prefieres una cena típica contundente? Descubre dónde disfrutar de platos insignias de Loja al caer la noche.
              </p>
            </div>
          </div>

          <PlatoCarouselRow
            platos={getPlatosByMomento("cena")}
            hubUrl="/restaurantes?categoria=cenas"
            verMasTexto="Ver locales para cenar"
          />
        </Wrap>
      </section>

      {/* ── SECCIÓN 4: VITRINA DE SOCIOS Y LOCALES NOCTURNOS (SLIDE INFINITO) ── */}
      <section className="py-20 border-t border-niebla bg-white overflow-hidden">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div className="max-w-[650px]">
              <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
                ★ SOCIOS VERIFICADOS · CENAS & NOCHE
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Locales Nocturnos Recomendados
              </h2>
              <p className="text-xs md:text-sm text-muted mt-2">
                Espacios exclusivos para pizzerías, locales de alitas y chifas. Tu local aparece como la primera recomendación de cena ante comensales y turistas.
              </p>
            </div>
            <a
              href={WA_AFILIACION_CENAS}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition inline-flex items-center gap-1.5"
            >
              Postular mi local nocturno aquí ↗
            </a>
          </div>
        </Wrap>

        {/* Marquee de ancho completo */}
        <AliadosSlideInfinito
          aliados={aliadosCena}
          slots={NIGHT_SLOTS}
          waAfiliacionUrl={WA_AFILIACION_CENAS}
          badgeTexto="🌙 Local Verificado"
        />
      </section>

      {/* ── SECCIÓN 5: FAQ NOCHE Y CENAS ── */}
      <section className="py-16 border-t border-niebla bg-porcelana/50">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-grafito">
                Dudas sobre Cenas y Comida de Noche en Loja
              </h2>
            </div>

            <div className="space-y-3.5">
              {FAQS_NIGHT.map((faq) => (
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
