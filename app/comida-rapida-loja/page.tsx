import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { getPlatosByMomento } from "@/lib/platos-data";
import { PlatoCarouselRow } from "@/components/PlatoCarouselRow";

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

const NIGHT_ITEMS = [
  {
    name: "Alitas con Salsas Artesanales",
    tagline: "Las favoritas para grupos y amigos",
    desc: "Alitas crujientes bañadas en maracuyá picante, BBQ ahumada, honey mustard o salsa búfalo, servidas con papas rústicas y aderezo ranch.",
    price: "$5.00 – $9.00 (combos)",
    icon: "🍗",
    image: "https://mvps.b-cdn.net/quecomerenloja/cenas/alitas-artesanales.webp",
    badge: "Favoritas de la Noche",
  },
  {
    name: "Pizzas Artesanales a la Leña",
    tagline: "Horno de leña y masa madre",
    desc: "Masa madre de fermentación lenta, salsa de tomate natural y quesos de la región horneadas en horno de barro a la vista.",
    price: "$8.00 – $14.00",
    icon: "🍕",
    image: "https://mvps.b-cdn.net/quecomerenloja/cenas/pizza-lena.webp",
    badge: "Artesanales a la Leña",
  },
  {
    name: "Smash Burgers & Hamburguesas",
    tagline: "Carne lojana de primera y pan brioche",
    desc: "Carne de res lojana prensada a la plancha con costra caramelizada, queso cheddar fundido, tocineta ahumada y cebolla caramelizada.",
    price: "$4.50 – $7.50",
    icon: "🍔",
    image: "https://mvps.b-cdn.net/quecomerenloja/cenas/smash-burgers.webp",
    badge: "Top Noche",
  },
  {
    name: "Chifas Tradicionales de Loja",
    tagline: "Banquetes familiares y al wok",
    desc: "Arroz chaulafán humeante al wok, tallarín especial saltado con lomo y pollo, wantanes crujientes con salsa agridulce y grandes porciones.",
    price: "$4.00 – $8.00",
    icon: "🥢",
    image: "https://mvps.b-cdn.net/quecomerenloja/cenas/chifa-chaulafan.webp",
    badge: "Banquetes Familiares",
  },
];

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
    a: "Las cenas en Loja se concentran principalmente en alitas crujientes, pizzas artesanales al horno de leña, hamburguesas smash y chifas tradicionales.",
  },
  {
    q: "¿Hasta qué hora abren los locales de comida rápida y cena en Loja?",
    a: "La mayoría de locales de alitas, hamburguesas y pizzas atienden desde las 17:30 hasta las 23:00 de domingo a jueves, y extienden hasta la medianoche o 01:00 AM los viernes y sábados.",
  },
  {
    q: "¿Hay opciones de delivery sin comisiones en Loja?",
    a: "Sí. En Qué Comer en Loja conectamos directamente al cliente con el WhatsApp oficial del restaurante para pedir delivery sin sobreprecio ni las comisiones abusivas del 20-30% de las apps tradicionales.",
  },
];

export default function ComidaRapidaCenasPage() {
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
              <Link
                href="/para-negocios"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                ¿Tienes un local nocturno? Postula tu cupo →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: LOS ANTOJOS NOCTURNOS MÁS BUSCADOS ── */}
      <section className="py-20 bg-porcelana">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                SABORES DE LA NOCHE
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Lo Que Más se Come de Noche en Loja
              </h2>
              <p className="text-xs md:text-sm text-muted mt-2 max-w-[600px]">
                Desde alitas con salsas de la casa hasta pizzerías al horno de leña y hamburguesas artesanales listas para disfrutar en pareja o en grupo.
              </p>
            </div>
            <Link href="/restaurantes" className="text-xs font-bold text-petroleo hover:underline">
              Ver todos los restaurantes →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {NIGHT_ITEMS.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-petroleo hover:shadow-xl"
              >
                <div>
                  <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-citrico px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo shadow">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-grafito group-hover:text-petroleo transition-colors">
                    {item.name}
                  </h3>
                  <small className="block text-[11px] font-semibold text-petroleo mt-0.5">{item.tagline}</small>
                  <p className="text-xs text-muted mt-2.5 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-6 border-t border-niebla/60 pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-grafito">{item.price}</span>
                  <Link
                    href={`/buscar?q=${encodeURIComponent(item.name.split(" ")[0])}`}
                    className="text-xs font-bold text-petroleo hover:underline"
                  >
                    Buscar dónde →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2.5: PLATOS FUERTES Y CENAS TRADICIONALES (HUB & SPOKE INTERLINKING) ── */}
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

      {/* ── SECCIÓN 3: VITRINA B2B PARA LOCALES NOCTURNOS ── */}
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
            <Link
              href="/para-negocios"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition"
            >
              Postular mi local nocturno →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {NIGHT_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-porcelana/40 p-7 transition hover:border-petroleo hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">{slot.zone}</span>
                    <span className="rounded-full bg-niebla/70 px-2.5 py-0.5 text-[9px] font-bold text-petroleo">
                      {slot.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-grafito mt-4">
                    {slot.title}
                  </h3>
                  <small className="block font-semibold text-[11px] text-petroleo mt-1">✓ {slot.highlight}</small>
                  <p className="text-xs text-muted mt-3 leading-relaxed">{slot.desc}</p>
                </div>

                <div className="mt-6 border-t border-niebla pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-muted">¿Tu marca aquí?</span>
                  <Link
                    href="/para-negocios"
                    className="rounded-lg bg-citrico px-3.5 py-2 text-[11px] font-bold text-petroleo transition hover:brightness-105"
                  >
                    Reservar cupo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── FAQ NOCHE Y CENAS ── */}
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
