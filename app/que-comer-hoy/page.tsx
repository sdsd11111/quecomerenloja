import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, Wrap } from "@/components/PageHero";
import { getAliadosActivos } from "@/lib/aliados-db";
import { getAllPlatos } from "@/lib/platos-db";
import { getPromosActivas, type PromoAliado } from "@/lib/promos-db";

export const metadata: Metadata = {
  title: "¿Qué Comer Hoy en Loja? | Menú del Día, Almuerzos y Ofertas de Hoy",
  description: "Descubre qué comer hoy en Loja: menús ejecutivos, platos típicos del día, promociones en vivo y aliados oficiales. Contacta directo por WhatsApp.",
  alternates: { canonical: "/que-comer-hoy" },
  openGraph: {
    title: "¿Qué Comer Hoy en Loja? | Menús y Platos del Día",
    description: "Platos tradicionales, menús del día, ofertas en vivo y aliados oficiales en Loja.",
    url: "https://quecomerenloja.com/que-comer-hoy",
  },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ momento?: string }>;
}

export default async function QueComerHoyPage({ searchParams }: PageProps) {
  const { momento = "todos" } = await searchParams;

  const [aliados, platos, promosActivas] = await Promise.all([
    getAliadosActivos(),
    getAllPlatos(),
    getPromosActivas(50),
  ]);

  // Determinar momento del día según hora de Ecuador (UTC-5)
  const ahora = new Date();
  const horaUtc = ahora.getUTCHours();
  const horaLoja = (horaUtc - 5 + 24) % 24;

  let momentoActual: "desayuno" | "almuerzo" | "cena" = "almuerzo";
  let saludoMomento = "¡Es hora del almuerzo en Loja!";
  let descripcionMomento = "Revisa los menús ejecutivos, repe lojano y platos del día listos para servir.";

  if (horaLoja >= 6 && horaLoja < 11) {
    momentoActual = "desayuno";
    saludoMomento = "¡Buenos días! Desayunos tradicionales en Loja";
    descripcionMomento = "Tamales lojanos al vapor, humitas de choclo, bolones de verde y café recién filtrado.";
  } else if (horaLoja >= 11 && horaLoja < 16) {
    momentoActual = "almuerzo";
    saludoMomento = "¡Hora de almorzar! Menús del día y gastronomía lojana";
    descripcionMomento = "Encuentra secos de pollo, repe blanco, arveja con guineo, parihuelas y almuerzos ejecutivos.";
  } else {
    momentoActual = "cena";
    saludoMomento = "¡Buenas noches! Planes para cenar hoy en Loja";
    descripcionMomento = "Pizzas artesanales, alitas BBQ, hamburguesas smash, parrilladas y piqueos nocturnos.";
  }

  // Filtrado de aliados por momento
  const aliadosFiltrados = aliados.filter((a) => {
    if (momento === "todos") return true;
    return (a.momentos || []).includes(momento as any);
  });

  // Platos sugeridos para hoy según el momento
  const platosDelDia = platos.filter((p) => {
    if (momento === "desayuno" || (momento === "todos" && momentoActual === "desayuno")) {
      return (
        p.slug.includes("tamal") ||
        p.slug.includes("humita") ||
        p.slug.includes("bolon") ||
        p.slug.includes("tigrillo") ||
        p.slug.includes("cafe")
      );
    }
    if (momento === "cena" || (momento === "todos" && momentoActual === "cena")) {
      return (
        p.slug.includes("pizza") ||
        p.slug.includes("alitas") ||
        p.slug.includes("hamburguesa") ||
        p.slug.includes("parrillada") ||
        p.slug.includes("costilla") ||
        p.slug.includes("tacos")
      );
    }
    // Almuerzo por defecto
    return (
      p.slug.includes("repe") ||
      p.slug.includes("cecina") ||
      p.slug.includes("arveja") ||
      p.slug.includes("parihuela") ||
      p.slug.includes("seco") ||
      p.slug.includes("cuy")
    );
  }).slice(0, 6);

  // Badge para cada tipo de promo/menú
  const renderBadgeTipo = (tipo: PromoAliado['tipo']) => {
    switch (tipo) {
      case 'PROMO':
        return <span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">🔥 Promo</span>;
      case 'OFERTA':
        return <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">🏷️ Oferta</span>;
      case 'EVENTO':
        return <span className="bg-purple-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">🎉 Evento</span>;
      default:
        return <span className="bg-petroleo text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">🍽️ Menú del Día</span>;
    }
  };

  // Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://quecomerenloja.com/que-comer-hoy#webpage",
        url: "https://quecomerenloja.com/que-comer-hoy",
        name: "¿Qué comer hoy en Loja? Menú del día y opciones culinarias",
        description: "Directorio de menús del día, platos recomendados y restaurantes abiertos hoy en Loja, Ecuador.",
      },
      {
        "@type": "ItemList",
        name: "Platos Recomendados para Comer Hoy en Loja",
        itemListElement: platosDelDia.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.nombre,
          url: `https://quecomerenloja.com/platos/${p.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Dónde almorzar hoy en Loja económico y tradicional?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "En el Centro Histórico, San Sebastián y El Valle encuentras comedores y restaurantes aliados con menús del día completos desde $2.50 hasta $4.50 que incluyen sopa tradicional (como repe o arveja con guineo), plato fuerte y jugo natural.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cómo consultar el menú del día de los restaurantes aliados?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cada aliado cuenta con botón directo de WhatsApp para consultar en tiempo real su plato del día, disponibilidad y pedir reservas o delivery sin intermediarios.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="RECOMENDACIONES EN VIVO · LOJA, ECUADOR"
        title={
          <>
            ¿Qué comer hoy en Loja? <em className="text-[#e1b45f] font-serif italic font-normal">Menús del día, promociones y platos</em>
          </>
        }
      >
        No des más vueltas pensando qué almorzar o cenar. Aquí tienes las promociones y menús del día publicados en tiempo real, platos recomendados y restaurantes aliados listos para atenderte por WhatsApp.
      </PageHero>

      <Wrap className="py-10">
        {/* ── BANNER EN TIEMPO REAL: MOMENTO ACTIVO SEGÚN HORA DE LOJA ── */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-petroleo via-[#1A4545] to-grafito p-7 md:p-9 text-white shadow-xl mb-12 border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  RECOMENDACIÓN EN VIVO (HORA LOCAL {horaLoja}:00)
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-serif text-white">
                {saludoMomento}
              </h2>
              <p className="mt-2 text-xs md:text-sm text-[#e6d7bc] leading-relaxed">
                {descripcionMomento}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/que-comer-hoy?momento=desayuno"
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
                  momento === "desayuno" || (momento === "todos" && momentoActual === "desayuno")
                    ? "bg-amber-400 text-petroleo"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                🌅 Desayunos
              </Link>
              <Link
                href="/que-comer-hoy?momento=almuerzo"
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
                  momento === "almuerzo" || (momento === "todos" && momentoActual === "almuerzo")
                    ? "bg-amber-400 text-petroleo"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                🍽️ Almuerzos de hoy
              </Link>
              <Link
                href="/que-comer-hoy?momento=cena"
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
                  momento === "cena" || (momento === "todos" && momentoActual === "cena")
                    ? "bg-amber-400 text-petroleo"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                🌙 Cenas & Piqueos
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 0: MENÚS Y PROMOCIONES ACTIVAS PUBLICADAS HOY (BOT WHATSAPP / ALIADOS) ── */}
        {promosActivas.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2.8px] text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  EN VIVO · PUBLICADO HOY
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-grafito mt-2 font-serif">
                  Menús del Día y Promociones Activas ({promosActivas.length})
                </h3>
                <p className="text-xs text-muted mt-1">
                  Publicados directamente por los restaurantes y aliados gastronómicos de Loja.
                </p>
              </div>

              <Link
                href="/restaurantes"
                className="text-xs font-bold text-petroleo hover:underline shrink-0"
              >
                Ver todos los restaurantes →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {promosActivas.map((promo) => {
                const placeholderImg = "https://mvps.b-cdn.net/quecomerenloja/home/hero-home.webp";
                const displayImg = promo.imagen_url || placeholderImg;

                return (
                  <article
                    key={promo.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-niebla bg-white shadow-sm hover:border-petroleo hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div>
                      {/* Imagen / Banner de la promo */}
                      <div className="relative h-48 w-full bg-porcelana overflow-hidden">
                        <Image
                          src={displayImg}
                          alt={promo.titulo}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          {renderBadgeTipo(promo.tipo)}
                          {promo.precio_promo && (
                            <span className="bg-citrico text-petroleo font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                              {promo.precio_promo}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-[11px] font-extrabold text-citrico tracking-wide uppercase drop-shadow-md flex items-center gap-1">
                            <span>📍</span> {promo.aliado_nombre}
                          </span>
                        </div>
                      </div>

                      {/* Contenido de la promo */}
                      <div className="p-5">
                        <h4 className="font-serif text-lg font-bold text-grafito leading-snug group-hover:text-petroleo transition-colors">
                          {promo.titulo}
                        </h4>
                        <p className="mt-2 text-xs text-muted line-clamp-3 leading-relaxed whitespace-pre-line">
                          {promo.descripcion}
                        </p>

                        {promo.precio_original && (
                          <div className="mt-3 flex items-center gap-2 text-xs">
                            <span className="text-muted line-through">{promo.precio_original}</span>
                            <span className="font-bold text-emerald-800">{promo.precio_promo}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="p-5 pt-0 border-t border-niebla/50 mt-2">
                      <div className="flex items-center gap-2 pt-3">
                        {promo.whatsapp_url ? (
                          <a
                            href={promo.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-3 shadow-xs transition"
                          >
                            <span>💬</span>
                            <span>Pedir por WhatsApp</span>
                          </a>
                        ) : null}
                        <Link
                          href={`/promos/${promo.slug}`}
                          className="rounded-xl border border-niebla bg-porcelana hover:bg-niebla/50 text-grafito font-bold text-xs py-3 px-4 transition text-center"
                        >
                          Ver detalle
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECCIÓN 1: RESTAURANTES ALIADOS QUE OFRECEN COMIDA HOY ── */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
                DISPONIBILIDAD INMEDIATA
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-grafito mt-1">
                Restaurantes Aliados Oficiales de Hoy ({aliadosFiltrados.length})
              </h3>
              <p className="text-xs text-muted mt-1">
                Haz clic en el botón de WhatsApp para recibir al instante el menú del día y apartar tu mesa.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/que-comer-hoy?momento=todos"
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  momento === "todos"
                    ? "bg-petroleo text-white"
                    : "bg-porcelana text-muted hover:text-grafito border border-niebla"
                }`}
              >
                Ver todos
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aliadosFiltrados.map((aliado) => {
              const telLimpio = (aliado.telefono || "").replace(/\D/g, "");
              const whatsappUrl = telLimpio
                ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                    `Hola ${aliado.nombre}, vi su perfil en Qué Comer en Loja y deseo saber cuál es el menú disponible hoy.`
                  )}`
                : null;

              return (
                <article
                  key={aliado.id}
                  className="group flex flex-col justify-between rounded-3xl border border-niebla bg-white p-6 shadow-sm hover:border-petroleo hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[9px] font-extrabold text-emerald-900 uppercase">
                        {aliado.tipo === "CAFETERIA" ? "☕ Cafetería Oficial" : "🍽️ Restaurante Oficial"}
                      </span>
                      {aliado.destacado && (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-800">
                          ★ Verificado Hoy
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-xl font-bold text-grafito group-hover:text-petroleo transition-colors">
                      {aliado.nombre}
                    </h4>
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <span>📍</span> {aliado.ubicacion}
                    </p>

                    <div className="mt-4 rounded-2xl bg-porcelana/70 p-4 border border-niebla/50 space-y-2 text-xs">
                      {aliado.rangoPrecio && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted">Rango de precio:</span>
                          <strong className="text-petroleo font-bold">{aliado.rangoPrecio}</strong>
                        </div>
                      )}
                      {aliado.servicios && (
                        <div className="border-t border-niebla/40 pt-2 text-muted">
                          <strong className="text-grafito font-semibold block mb-0.5">Servicios de hoy:</strong>
                          <span className="text-[11px] leading-relaxed line-clamp-2">{aliado.servicios}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted mt-4 leading-relaxed line-clamp-3">
                      {aliado.descripcion}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-niebla/60 flex flex-col gap-2">
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 px-4 shadow-sm transition group-hover:shadow-md"
                      >
                        <span className="text-sm">💬</span>
                        <span>Preguntar menú de hoy por WhatsApp</span>
                      </a>
                    ) : (
                      <Link
                        href="/restaurantes"
                        className="flex w-full items-center justify-center rounded-xl bg-petroleo text-white font-bold text-xs py-3 px-4 transition hover:bg-[#0E2E2E]"
                      >
                        Ver detalles del local
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── SECCIÓN 2: PLATOS RECOMENDADOS PARA HOY ── */}
        <div className="mb-16 border-t border-niebla pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
                SUGERENCIAS CULINARIAS
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-grafito mt-1">
                Platos Ideales para Probar Hoy en Loja
              </h3>
              <p className="text-xs text-muted mt-1">
                Conoce la historia, precios y restaurantes que preparan estas especialidades.
              </p>
            </div>
            <Link href="/platos" className="text-xs font-bold text-petroleo hover:underline">
              Explorar los 50+ platos del catálogo →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platosDelDia.map((plato) => (
              <Link
                key={plato.id}
                href={`/platos/${plato.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-niebla bg-white p-5 shadow-xs hover:border-petroleo hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-porcelana">
                    {plato.hero_imagen_url ? (
                      <Image
                        src={plato.hero_imagen_url}
                        alt={plato.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">
                        🍲
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[9px] font-extrabold uppercase text-petroleo border border-white/60 shadow-2xs">
                      {plato.seccion}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-grafito group-hover:text-petroleo transition-colors">
                    {plato.nombre}
                  </h4>
                  <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                    {plato.descripcion_corta}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-niebla/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-petroleo">
                    {plato.rango_precio_loja || "Precio accesible"}
                  </span>
                  <span className="font-bold text-petroleo group-hover:translate-x-1 transition-transform">
                    Ver dónde comer hoy →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── SECCIÓN 3: PREGUNTAS FRECUENTES (FAQS RICH SNIPPETS) ── */}
        <div className="border-t border-niebla pt-14">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              GUÍA RÁPIDA
            </span>
            <h3 className="text-2xl font-bold text-grafito mt-1">
              Preguntas Frecuentes al Comer en Loja
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs">
              <h4 className="font-bold text-sm text-grafito">
                ¿A qué hora se sirven los almuerzos en Loja?
              </h4>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                La mayoría de restaurantes y comedores empiezan a servir almuerzos ejecutivos desde las 11:30 AM hasta las 3:30 PM. En los fines de semana, platos típicos como el cuy o parrilladas se extienden hasta la tarde.
              </p>
            </div>
            <div className="rounded-2xl border border-niebla bg-white p-5 shadow-2xs">
              <h4 className="font-bold text-sm text-grafito">
                ¿Qué incluye el típico menú del día lojano?
              </h4>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Por lo general incluye una sopa tradicional (repe blanco, sopa de arveja con guineo o caldo criollo), un plato fuerte (seco de pollo, carne asada con arroz y menestra), jugo natural y en ocasiones postre o café.
              </p>
            </div>
          </div>
        </div>
      </Wrap>
    </>
  );
}
