import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { getPlatosByMomento } from "@/lib/platos-data";
import { PlatoCarouselRow } from "@/components/PlatoCarouselRow";
import { getAliadosByMomento } from "@/lib/aliados-db";

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

const ALMUERZOS_STRUCTURE = [
  {
    step: "1. Entrada / Sopa",
    title: "Sopa Tradicional Caliente",
    desc: "Casi todo almuerzo lojano abre con una sopa de cuchara: Repe lojano cremoso, arveja con guineo, sopa de quinua, caldo de gallina criolla o locro de papa.",
    badge: "100% Cuchara Lojana",
    image: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/sopa-entrada.webp",
  },
  {
    step: "2. Plato Fuerte / Segundo",
    title: "Segundo Balanceado con Proteína",
    desc: "Opciones diarias que rotan: Cecina asada a la brasa, seco de pollo, chuleta a la plancha, bistec de carne, trucha frita o chivo al hueco con arroz y menestra.",
    badge: "Sabor de Casa",
    image: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/segundo-fuerte.webp",
  },
  {
    step: "3. Guarnición y Acompañamiento",
    title: "Yuca, Mote o Menestra",
    desc: "La yuca sancochada fresca de valles cercanos, el mote recién cocido y las menestras de lenteja o fréjol acompañan el plato con ensalada fresca.",
    badge: "Frescura Diaria",
    image: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/guarniciones-yuca.webp",
  },
  {
    step: "4. Bebida Tradicional",
    title: "Jugo Natural de Fruta Local",
    desc: "Incluido en el menú: Jugo de mora, maracuyá, naranjilla, horchata lojana fresca con hierbas aromáticas o limonada con panela.",
    badge: "Horchata o Fruta",
    image: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/horchata-lojana.webp",
  },
];

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
    a: "El precio promedio oscila entre $3.00 y $4.50 USD en la gran mayoría de comedores y restaurantes céntricos. Incluye sopa, segundo, jugo y a veces un postre pequeño.",
  },
  {
    q: "¿A qué hora se sirve el almuerzo en Loja?",
    a: "El horario típico de almuerzo en Loja es de 12:00 a 14:30. Los locales más concurridos suelen agotar sus mejores platos del día alrededor de las 13:30.",
  },
  {
    q: "¿Qué opciones de sopa suelen tener los almuerzos lojanos?",
    a: "El repe lojano (sopa verde con quesillo) es muy habitual los lunes o viernes. También es muy común encontrar arveja con guineo, sopa de avena, caldo de patas o locro de quesillo.",
  },
];

export default async function AlmuerzosPage() {
  const aliadosAlmuerzo = await getAliadosByMomento("almuerzo");
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
              <Link
                href="/para-negocios"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Publica tu menú diario por audio WhatsApp →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2: QUÉ TRAE UN ALMUERZO EN LOJA ── */}
      <section className="py-20 bg-porcelana">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo block mb-1">
                LA COSTUMBRE LOJANA
              </span>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                ¿Cómo es el Almuerzo Típico en Loja?
              </h2>
              <p className="text-xs md:text-sm text-muted mt-2 max-w-[600px]">
                A diferencia de otras ciudades, en Loja el almuerzo diario mantiene la calidad de la cocina de olla y el sabor del campo.
              </p>
            </div>
            <Link href="/restaurantes" className="text-xs font-bold text-petroleo hover:underline">
              Explorar restaurantes →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ALMUERZOS_STRUCTURE.map((item) => (
              <div
                key={item.step}
                className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-petroleo hover:shadow-xl"
              >
                <div>
                  <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-petroleo px-2.5 py-0.5 text-[9px] font-bold text-white shadow">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block mb-1">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-grafito group-hover:text-petroleo transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted mt-2.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SECCIÓN 2.5: PLATOS DE ALMUERZO (HUB & SPOKE INTERLINKING) ── */}
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

      {/* ── SECCIÓN 3: VITRINA DE CUPOS B2B DE ALMUERZOS ── */}
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
                Los socios GuIAloja actualizan su menú diario con una simple nota de voz por WhatsApp y se recomiendan automáticamente ante miles de turistas.
              </p>
            </div>
            <Link
              href="/para-negocios"
              className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition"
            >
              Publicar mi restaurante →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {aliadosAlmuerzo.map((aliado) => {
              const telLimpio = (aliado.telefono || "").replace(/\D/g, "");
              const waUrl = telLimpio
                ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                    `Hola ${aliado.nombre}, vi su restaurante en la sección de Almuerzos de Qué Comer en Loja. Deseo información sobre el menú del día y reservas.`
                  )}`
                : null;

              return (
                <div
                  key={`almuerzo-aliado-${aliado.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-7 shadow-sm transition hover:border-petroleo hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        🍽️ Socio Verificado
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
                          🍽️
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
                        href="/restaurantes"
                        className="rounded-lg bg-citrico px-3.5 py-2 text-[11px] font-bold text-petroleo text-center transition hover:brightness-105"
                      >
                        Ver Restaurante →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Plazas disponibles de postulación para completar el grid */}
            {ALMUERZO_SLOTS.slice(0, Math.max(1, 3 - aliadosAlmuerzo.length)).map((slot) => (
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
                  <span className="text-[11px] text-muted">¿Tu local aquí?</span>
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

      {/* ── FAQ ALMUERZOS ── */}
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
