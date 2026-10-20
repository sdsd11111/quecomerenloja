import type { Metadata } from "next";
import Link from "next/link";
import { Wrap } from "@/components/PageHero";
import { getEventosGastronomicos } from "@/lib/services/eventosGastronomicos";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ferias y Eventos Gastronómicos en Loja 2026 | Festivales, Catas y Comida Típica",
  description:
    "Guía y cartelera en vivo de ferias gastronómicas en Loja, festivales de café de especialidad, catas, rutas del sabor tradicional y eventos culinarios en Loja, Ecuador.",
  keywords: [
    "ferias gastronomicas loja",
    "eventos gastronomicos en loja",
    "festival del cafe loja",
    "ferias de comida loja",
    "festivales gastronomicos loja ecuador",
    "que comer en loja ferias",
    "agenda gastronomica loja",
    "eventos culinarios loja 2026",
    "feria del tamal loja",
  ],
  alternates: {
    canonical: "https://quecomerenloja.com/eventos-gastronomicos",
  },
  openGraph: {
    title: "Ferias y Eventos Gastronómicos en Loja 2026 | Cartelera Oficial",
    description:
      "Descubre qué ferias de comida típica, festivales culinarios y catas de café hay en Loja hoy y este fin de semana. Sincronizado en tiempo real.",
    url: "https://quecomerenloja.com/eventos-gastronomicos",
    siteName: "Qué Comer en Loja",
    locale: "es_EC",
    type: "website",
  },
};

const EVENTOS_FAQS = [
  {
    q: "¿Dónde se celebran las ferias gastronómicas más importantes de Loja?",
    a: "Las principales ferias culinarias y festivales de Loja se desarrollan habitualmente en la Plaza de San Sebastián, el Complejo Ferial Simón Bolívar, el Parque Central, la Plaza Macará y los valles gastronómicos de Vilcabamba y Malacatos.",
  },
  {
    q: "¿Qué tipo de eventos gastronómicos se realizan con frecuencia en Loja?",
    a: "Destacan el Festival y Subasta de Café de Especialidad Loja Sabor, ferias de cocina tradicional lojana (repe, cecina y cuy asado), el Festival de la Colada Morada y Figuras de Pan en San Sebastián, y rutas gourmet organizadas durante el Festival de Artes Vivas (FIAVL).",
  },
  {
    q: "¿Tiene algún costo publicar una feria o festival gastronómico en esta guía?",
    a: "No. La publicación y difusión básica para eventos culturales y ferias gastronómicas organizadas en Loja es 100% gratuita a través del formulario oficial de Agenda Cultural Loja.",
  },
  {
    q: "¿Cómo se actualizan los eventos y con qué frecuencia?",
    a: "Nuestra cartelera está conectada en tiempo real mediante API a la red de Agenda Cultural Loja, asegurando que cada nuevo festival o cambio de horario se refleje de manera inmediata.",
  },
];

const CALENDARIO_ESTACIONAL = [
  {
    temporada: "Noviembre",
    icono: "🥖",
    nombre: "Festival de la Colada Morada y Figuras de Pan",
    lugar: "Plaza de San Sebastián",
    descripcion: "Tradición centenaria con más de 100 artesanas lojanas preparando colada morada con mortiño andino y guaguas de pan artesanales.",
    etiqueta: "Patrimonio Lojano",
  },
  {
    temporada: "Noviembre",
    icono: "🎭",
    nombre: "Ruta Gastronómica del FIAVL (Festival de Artes Vivas)",
    lugar: "Centro Histórico & Calles Peatonales",
    descripcion: "Restaurantes y cafeterías de la calle Bolívar, Lourdes y 10 de Agosto activan menús de autor y promociones temáticas de medianoche.",
    etiqueta: "Fiesta Internacional",
  },
  {
    temporada: "Julio - Agosto",
    icono: "☕",
    nombre: "Feria & Subasta Loja Sabor a Café",
    lugar: "Complejo Ferial / San Sebastián",
    descripcion: "El encuentro cumbre del café de altura de Vilcabamba, Chaguarpamba y Quilanga con barismo en vivo, catas públicas y ruedas de negocios.",
    etiqueta: "Especialidad",
  },
  {
    temporada: "Septiembre",
    icono: "🎪",
    nombre: "Pabellón Gastronómico Feria de Loja (195 años)",
    lugar: "Complejo Ferial Simón Bolívar",
    descripcion: "El patio de comidas más grande del sur del país: cecina a la brasa, cuy asado, gallina criolla, bocadillos azucarados y dulces tradicionales.",
    etiqueta: "Feria de Loja",
  },
];

function formatearRangoFechas(fechaInicioStr: string, fechaFinStr: string) {
  try {
    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);

    const opcionesDia: Intl.DateTimeFormatOptions = {
      timeZone: "America/Guayaquil",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      timeZone: "America/Guayaquil",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const diaInicio = inicio.toLocaleDateString("es-EC", opcionesDia);
    const diaFin = fin.toLocaleDateString("es-EC", opcionesDia);
    const horaInicio = inicio.toLocaleTimeString("es-EC", opcionesHora);

    if (diaInicio === diaFin) {
      return `${diaInicio} · ${horaInicio}`;
    }
    return `${diaInicio} al ${diaFin}`;
  } catch {
    return "Fechas por confirmar";
  }
}

function getTipoBadge(tipo?: string | null) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("feria")) return { label: "🎪 Feria Gastronómica", color: "bg-amber-100 text-amber-900 border-amber-200" };
  if (t.includes("festival")) return { label: "✨ Festival Culinario", color: "bg-purple-100 text-purple-900 border-purple-200" };
  if (t.includes("ruta") || t.includes("cafe") || t.includes("café")) return { label: "☕ Ruta del Café & Sabor", color: "bg-emerald-100 text-emerald-900 border-emerald-200" };
  return { label: "🍴 Evento Gastronómico", color: "bg-teal-100 text-teal-900 border-teal-200" };
}

export default async function EventosGastronomicosPage() {
  const eventos = await getEventosGastronomicos();

  // Schema.org para Google (FAQPage + BreadcrumbList + Event Schema si hay en vivo)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://quecomerenloja.com/eventos-gastronomicos#webpage",
        "url": "https://quecomerenloja.com/eventos-gastronomicos",
        "name": "Ferias y Eventos Gastronómicos en Loja 2026",
        "description": "Cartelera oficial y actualizada de ferias gastronómicas, catas de café y festivales de comida típica en Loja Ecuador.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://quecomerenloja.com/#website",
          "name": "Qué Comer en Loja",
          "url": "https://quecomerenloja.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://quecomerenloja.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Eventos y Ferias Gastronómicas",
            "item": "https://quecomerenloja.com/eventos-gastronomicos",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": EVENTOS_FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          },
        })),
      },
      ...(eventos.length > 0
        ? eventos.map((ev) => ({
            "@type": "Event",
            "name": ev.nombre,
            "description": ev.resumen,
            "startDate": ev.fechaInicio,
            "endDate": ev.fechaFin,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": ev.lugar,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Loja",
                "addressRegion": "Loja",
                "addressCountry": "EC",
              },
            },
            "image": ev.imagenUrl ? [ev.imagenUrl] : undefined,
            "url": ev.canonicalUrl || "https://quecomerenloja.com/eventos-gastronomicos",
            "organizer": ev.organizador
              ? {
                  "@type": "Organization",
                  "name": ev.organizador,
                }
              : undefined,
          }))
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FBFBFA]">
        {/* ── Breadcrumb de navegación ── */}
        <div className="border-b border-niebla/60 bg-white py-3">
          <Wrap>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-muted">
              <Link href="/" className="hover:text-petroleo transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <span className="font-semibold text-petroleo">Eventos & Ferias Gastronómicas</span>
            </nav>
          </Wrap>
        </div>

        {/* ── Hero Principal SEO ── */}
        <section className="border-b border-niebla bg-white py-14 sm:py-20">
          <Wrap>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-900 mb-4">
                <span>🎪</span>
                <span>AGENDA GASTRONÓMICA EN VIVO · LOJA</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-grafito leading-tight">
                Ferias y Eventos Gastronómicos en Loja
              </h1>
              <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
                Cartelera viva de festivales culinarios, catas de café de especialidad, ferias de tradición lojana y rutas del sabor. Actualización en tiempo real vía Agenda Cultural Loja.
              </p>

              {/* Botonera de acciones rápidas */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://www.agendaculturalloja.com/publicar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0E2E2E]"
                >
                  <span>+</span>
                  <span>Publicar mi feria o evento gastronómico ↗</span>
                </a>
                <a
                  href="#calendario-anual"
                  className="inline-flex items-center rounded-xl border border-niebla bg-porcelana/70 px-5 py-3 text-xs font-bold text-grafito transition hover:bg-white"
                >
                  Ver grandes festivales del año ↓
                </a>
              </div>
            </div>
          </Wrap>
        </section>

        {/* ── Cartelera de Eventos en Tiempo Real ── */}
        <section className="py-14 sm:py-20">
          <Wrap>
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  ● EN VIVO Y PRÓXIMAS FECHAS
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-grafito">
                  Próximas Citas Culinarias en Loja
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted">
                  Eventos activos confirmados para los próximos días y fines de semana.
                </p>
              </div>

              <div className="text-xs text-muted">
                Fuente oficial:{" "}
                <a
                  href="https://www.agendaculturalloja.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-petroleo hover:underline"
                >
                  agendaculturalloja.com ↗
                </a>
              </div>
            </div>

            {eventos.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {eventos.map((ev) => {
                  const badge = getTipoBadge(ev.tipoEvento);
                  const fecha = formatearRangoFechas(ev.fechaInicio, ev.fechaFin);

                  return (
                    <article
                      key={ev.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-niebla/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-petroleo/70 hover:shadow-xl"
                    >
                      {/* Media */}
                      <div className="relative h-56 w-full bg-porcelana overflow-hidden">
                        {ev.imagenUrl ? (
                          <img
                            src={ev.imagenUrl}
                            alt={ev.nombre}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-petroleo/10 to-petroleo/20 text-5xl">
                            🍲
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-md shadow-xs ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                          {ev.parroquia && (
                            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-grafito backdrop-blur-xs">
                              📍 {ev.parroquia}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-sm">
                          <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                          <span>{fecha}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <h3 className="font-serif text-xl font-bold tracking-tight text-grafito leading-snug group-hover:text-petroleo transition-colors">
                            {ev.nombre}
                          </h3>

                          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                            <span>📍</span>
                            <span className="truncate">{ev.lugar}</span>
                          </div>

                          <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-3">
                            {ev.resumen}
                          </p>

                          {ev.organizador && (
                            <div className="mt-4 rounded-xl bg-porcelana/70 p-2.5 text-[11px] text-muted">
                              <span className="font-semibold text-grafito">Organiza: </span>
                              {ev.organizador}
                            </div>
                          )}
                        </div>

                        {/* Botones de acción oficial */}
                        <div className="mt-6 border-t border-niebla/70 pt-4 flex flex-col gap-2">
                          <a
                            href={ev.flywheelLink || ev.canonicalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-petroleo px-4 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#0E2E2E]"
                          >
                            <span>Ver programación e itinerario oficial</span>
                            <span>→</span>
                          </a>

                          {ev.mapaUrl && (
                            <a
                              href={ev.mapaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-niebla bg-porcelana/40 px-3 py-2 text-[11px] font-semibold text-grafito hover:bg-porcelana transition"
                            >
                              <span>🗺️</span>
                              <span>Ver ubicación en mapa</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-niebla bg-white p-10 md:p-14 text-center shadow-xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
                  🎪
                </div>
                <h3 className="mt-4 font-serif text-2xl font-bold text-grafito">
                  Próximas ferias y festivales en preparación
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                  Los eventos concluidos en Loja se purgan de forma automática para garantizar información 100% fresca. Las fechas de los próximos fines de semana se publican continuamente.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://www.agendaculturalloja.com/publicar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#0E2E2E] transition"
                  >
                    Publicar feria o festival gratis ↗
                  </a>
                  <Link
                    href="/cafe-de-loja"
                    className="rounded-xl border border-niebla bg-porcelana/60 px-5 py-3 text-xs font-bold text-grafito hover:bg-white transition"
                  >
                    Explorar Cafeterías de Loja
                  </Link>
                </div>
              </div>
            )}
          </Wrap>
        </section>

        {/* ── SECCIÓN DE AUTORIDAD SEO: Grandes Festivales Tradicionales de Loja ── */}
        <section id="calendario-anual" className="border-t border-niebla bg-white py-16 sm:py-24">
          <Wrap>
            <div className="mx-auto max-w-3xl text-center mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-petroleo bg-porcelana border border-niebla px-3 py-1 rounded-full">
                CALENDARIO GASTRONÓMICO ANUAL
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-grafito">
                Los Festivales y Ferias Insignes de Loja
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Cada año, la gastronomía lojana convoca a miles de visitantes en celebraciones emblemáticas de sabor andino y café de altura.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {CALENDARIO_ESTACIONAL.map((fest) => (
                <div
                  key={fest.nombre}
                  className="flex flex-col justify-between rounded-2xl border border-niebla bg-porcelana/40 p-6 shadow-xs hover:border-petroleo/50 hover:bg-white transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{fest.icono}</span>
                      <span className="rounded-full bg-petroleo/10 px-2.5 py-0.5 text-[10px] font-bold text-petroleo">
                        {fest.temporada}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-base font-bold text-grafito leading-snug">
                      {fest.nombre}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold text-petroleo">
                      📍 {fest.lugar}
                    </p>
                    <p className="mt-3 text-xs text-muted leading-relaxed">
                      {fest.descripcion}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-niebla/70 pt-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                      {fest.etiqueta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>

        {/* ── SECCIÓN DE INTERLINKING: Rutas gastronómicas relacionadas ── */}
        <section className="border-t border-niebla bg-[#F5F6F1] py-16">
          <Wrap>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-petroleo">
                  DESCUBRE MÁS EN QUÉ COMER EN LOJA
                </span>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-grafito">
                  Rutas y Platos que Debes Probar
                </h2>
              </div>
              <Link
                href="/restaurantes"
                className="text-xs font-bold text-petroleo hover:underline inline-flex items-center gap-1"
              >
                Ver todos los restaurantes de Loja →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/platos/repe-lojano"
                className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs hover:border-petroleo hover:shadow-md transition group"
              >
                <div className="text-2xl mb-2">🥣</div>
                <h3 className="font-serif text-sm font-bold text-grafito group-hover:text-petroleo transition-colors">
                  Repe Lojano
                </h3>
                <p className="mt-1 text-xs text-muted">
                  La sopa insignia de guineo verde y quesillo artesanal lojano.
                </p>
                <span className="mt-3 inline-block text-[11px] font-bold text-petroleo">
                  5.000 búsquedas/mes →
                </span>
              </Link>

              <Link
                href="/cafe-de-loja"
                className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs hover:border-petroleo hover:shadow-md transition group"
              >
                <div className="text-2xl mb-2">☕</div>
                <h3 className="font-serif text-sm font-bold text-grafito group-hover:text-petroleo transition-colors">
                  Cafeterías de Especialidad
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Café de altura de Vilcabamba con tamales y humitas mañaneras.
                </p>
                <span className="mt-3 inline-block text-[11px] font-bold text-petroleo">
                  +900% demanda →
                </span>
              </Link>

              <Link
                href="/platos/cecina-lojana"
                className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs hover:border-petroleo hover:shadow-md transition group"
              >
                <div className="text-2xl mb-2">🥩</div>
                <h3 className="font-serif text-sm font-bold text-grafito group-hover:text-petroleo transition-colors">
                  Cecina Lojana
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Carne asada a la brasa con yuca caliente, cebolla curtida y mote.
                </p>
                <span className="mt-3 inline-block text-[11px] font-bold text-petroleo">
                  Plato tradicional →
                </span>
              </Link>

              <Link
                href="/comida-rapida-loja"
                className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs hover:border-petroleo hover:shadow-md transition group"
              >
                <div className="text-2xl mb-2">🍕</div>
                <h3 className="font-serif text-sm font-bold text-grafito group-hover:text-petroleo transition-colors">
                  Pizzas, Alitas & Cenas
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Los mejores lugares para comer de noche con amigos en Loja.
                </p>
                <span className="mt-3 inline-block text-[11px] font-bold text-petroleo">
                  Alta demanda nocturna →
                </span>
              </Link>
            </div>
          </Wrap>
        </section>

        {/* ── FAQ Schema & Preguntas Frecuentes para Google & LLMs ── */}
        <section className="border-t border-niebla bg-white py-16">
          <Wrap>
            <div className="mx-auto max-w-3xl">
              <div className="text-center mb-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-petroleo">
                  INFORMACIÓN ÚTIL
                </span>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-grafito">
                  Preguntas Frecuentes sobre Ferias y Eventos en Loja
                </h2>
              </div>

              <div className="space-y-4">
                {EVENTOS_FAQS.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-niebla bg-porcelana/30 p-5 transition-all open:bg-white open:shadow-md"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-serif text-base font-bold text-grafito list-none">
                      <span>{faq.q}</span>
                      <span className="ml-4 text-petroleo transition-transform duration-200 group-open:rotate-180 font-mono text-lg">
                        ▾
                      </span>
                    </summary>
                    <div className="mt-3 border-t border-niebla/50 pt-3 text-xs leading-relaxed text-muted">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </Wrap>
        </section>

        {/* ── Banner de Conversión y Flywheel con Agenda Cultural ── */}
        <section className="border-t border-niebla bg-[#FAFAF7] py-16">
          <Wrap>
            <div className="rounded-3xl bg-petroleo p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">
                  ECOSISTEMA CULTURAL Y GASTRONÓMICO
                </span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold">
                  ¿Organizas una feria gastronómica o festival en Loja?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-niebla/80 leading-relaxed">
                  Difunde tu evento gratis en Agenda Cultural Loja y aparecerá automáticamente en Qué Comer en Loja para ser visto por miles de visitantes y lojanos.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="https://www.agendaculturalloja.com/publicar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo shadow-md hover:brightness-110 transition"
                >
                  <span>Publicar en Agenda Cultural</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </Wrap>
        </section>
      </main>
    </>
  );
}
