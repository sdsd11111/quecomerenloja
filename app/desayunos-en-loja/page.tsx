import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { getPlatosByMomento } from "@/lib/platos-data";
import { PlatoCarouselRow } from "@/components/PlatoCarouselRow";
import { getAliadosByMomento } from "@/lib/aliados-db";

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

const DESAYUNOS_ITEMS = [
  {
    name: "Desayuno Completo Lojano",
    tagline: "Huevos, cecina, aguacate y café",
    desc: "El clásico desayuno de mesa: huevos fritos de campo, cecina de cerdo lojana dorada, rodajas de aguacate, pan artesanal y café de altura recién pasado.",
    price: "$3.50 – $5.00",
    icon: "🍳",
    image: "https://mvps.b-cdn.net/quecomerenloja/desayunos/desayuno-completo.webp",
    href: "/restaurantes?categoria=desayunos",
  },
  {
    name: "Tigrillo & Desayuno Campesino",
    tagline: "Energía andina de la mañana",
    desc: "Plátano verde majado al sartén con huevo criollo y abundante quesillo artesanal, servido con bistec o cecina frita.",
    price: "$3.00 – $4.50",
    icon: "🥘",
    image: "https://mvps.b-cdn.net/quecomerenloja/desayunos/tigrillo-lojano.webp",
    href: "/buscar?q=tigrillo",
  },
  {
    name: "Café de Especialidad Filtrado",
    tagline: "Taza de Excelencia internacional",
    desc: "Extracciones en V60, Chemex, prensa francesa o gota a gota tradicional con granos arábicos de valles como Puyango, Vilcabamba y Malacatos.",
    price: "$1.50 – $3.00",
    icon: "☕",
    image: "https://mvps.b-cdn.net/quecomerenloja/desayunos/cafe-filtrado.webp",
    href: "/cafe-de-loja",
  },
  {
    name: "Bolón con Quesillo & Chicharrón",
    tagline: "Verde crocante y relleno abundante",
    desc: "Esfera de plátano verde recién majada y frita con relleno de quesillo derretido y chicharrón crocante, acompañado de ají y café caliente.",
    price: "$1.75 – $3.50",
    icon: "🍌",
    image: "https://mvps.b-cdn.net/quecomerenloja/desayunos/bolon-quesillo.webp",
    href: "/platos/bolones-en-loja",
  },
];

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
    a: "La mayoría de cafeterías tradicionales y puestos del centro abren desde las 07:00 AM para ofrecer tamales y café recién pasados. Las cafeterías de especialidad y brunch suelen iniciar atención entre 07:30 y 08:30 AM.",
  },
  {
    q: "¿Dónde se concentran las mejores cafeterías de Loja?",
    a: "El sector más tradicional es la peatonal Calle Lourdes con sus fachadas coloniales y ambiente bohemio. También los alrededores de la Plaza San Sebastián y la calle Bolívar concentran barras de café premiado.",
  },
  {
    q: "¿Cuánto cuesta desayunar en Loja?",
    a: "Un desayuno tradicional de tamal o humita con taza de café cuesta entre $2.25 y $3.50 USD. Desayunos completos con tigrillo, huevos y jugo promedian entre $3.50 y $5.00 USD.",
  },
];

export default async function DesayunosPage() {
  const aliadosDesayuno = await getAliadosByMomento("desayuno");
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

            <h1 className="text-[clamp(36px,5vw,64px)] font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Dónde Desayunar en Loja: <em className="font-serif font-normal italic text-citrico">Cafeterías, Tamales y Café de Altura.</em>
            </h1>

            <p className="mt-5 max-w-[620px] text-base md:text-lg text-white font-medium leading-relaxed drop-shadow">
              Despertar en Loja huele a café arábico recién pasado, tamales calientes en hoja de achira y humitas con quesillo. Conoce la ruta matutina del centro histórico y la Calle Lourdes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cafe-de-loja"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-lg"
              >
                Ver cafeterías destacadas →
              </Link>
              <Link
                href="/para-negocios"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                ¿Tienes una cafetería? Postula aquí →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: QUÉ DESAYUNAR EN LOJA (PLATOS MATUTINOS) ── */}
      <section className="py-20 bg-porcelana">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                TRADICIÓN MATUTINA
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Los Desayunos que Marcan la Mañana Lojana
              </h2>
              <p className="text-xs md:text-sm text-muted mt-2 max-w-[600px]">
                En Loja el desayuno es un ritual. Cada mañana se cocinan a fuego lento las recetas más icónicas de la Sierra Sur.
              </p>
            </div>
            <Link href="/platos/tamales-lojanos" className="text-xs font-bold text-petroleo hover:underline">
              Historia del tamal lojano →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {DESAYUNOS_ITEMS.map((item) => (
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
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-petroleo shadow">
                      {item.price}
                    </span>
                  </div>

                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-grafito group-hover:text-petroleo transition-colors">
                    {item.name}
                  </h3>
                  <small className="block text-[11px] font-semibold text-petroleo mt-0.5">{item.tagline}</small>
                  <p className="text-xs text-muted mt-2.5 leading-relaxed">{item.desc}</p>
                </div>

                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center text-xs font-bold text-petroleo group-hover:underline"
                >
                  Ver dónde probarlo →
                </Link>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2.5: PLATOS DE DESAYUNO (HUB & SPOKE INTERLINKING) ── */}
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
              <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
                Guías completas sobre los clásicos del desayuno lojano: dónde se cocinan al vapor y los mejores acompañamientos con café de altura.
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

      {/* ── SECCIÓN 3: VITRINA DE CUPOS DE CAFETERÍAS (MONETIZACIÓN B2B) ── */}
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
              <p className="text-xs md:text-sm text-muted mt-2">
                Espacios exclusivos para cafeterías de Loja que buscan captar al turista matutino y al residente sin intermediarios ni comisiones.
              </p>
            </div>
            <Link
              href="/para-negocios"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition"
            >
              Postular mi cafetería aquí →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {aliadosDesayuno.map((aliado) => {
              const telLimpio = (aliado.telefono || "").replace(/\D/g, "");
              const waUrl = telLimpio
                ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                    `Hola ${aliado.nombre}, vi su cafetería en la sección de Desayunos de Qué Comer en Loja. Deseo información de sus tamales, café y horarios.`
                  )}`
                : null;

              return (
                <div
                  key={`desayuno-aliado-${aliado.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-7 shadow-sm transition hover:border-petroleo hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ☕ Socio Verificado
                      </span>
                      {aliado.destacado && (
                        <span className="rounded-full bg-citrico/30 px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo">
                          ★ Destacado
                        </span>
                      )}
                    </div>

                    <div className="my-4 flex items-center gap-3">
                      {aliado.imagenUrl ? (
                        <img
                          src={aliado.imagenUrl}
                          alt={aliado.nombre}
                          className="size-14 rounded-2xl object-cover border border-niebla shadow-xs"
                        />
                      ) : (
                        <div className="size-14 rounded-2xl bg-porcelana border border-niebla flex items-center justify-center text-2xl shadow-xs">
                          ☕
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif text-lg font-bold text-grafito leading-tight">
                          {aliado.nombre}
                        </h3>
                        <span className="text-xs text-muted block mt-0.5">
                          📍 {aliado.ubicacion}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {aliado.descripcion}
                    </p>

                    {aliado.rangoPrecio && (
                      <div className="mt-3 text-[11px] font-semibold text-petroleo">
                        💰 {aliado.rangoPrecio}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-niebla pt-4 flex flex-col gap-2">
                    {waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-700 px-3.5 py-2 text-[11px] font-bold text-white text-center transition hover:bg-emerald-800 shadow-xs"
                      >
                        💬 Contactar por WhatsApp
                      </a>
                    ) : (
                      <Link
                        href="/cafe-de-loja"
                        className="rounded-lg bg-citrico px-3.5 py-2 text-[11px] font-bold text-petroleo text-center transition hover:brightness-105"
                      >
                        Ver Cafetería →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Plazas disponibles de postulación para completar el grid */}
            {DESAYUNO_SLOTS.slice(0, Math.max(1, 3 - aliadosDesayuno.length)).map((slot) => (
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
                  <small className="block text-[11px] font-semibold text-petroleo mt-1">✓ {slot.highlight}</small>
                  <p className="text-xs text-muted mt-3 leading-relaxed">{slot.desc}</p>
                </div>

                <div className="mt-6 border-t border-niebla pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-muted">¿Eres dueño?</span>
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

      {/* ── FAQ MATUTINO ── */}
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
