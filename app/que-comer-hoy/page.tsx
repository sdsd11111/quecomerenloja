import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, Wrap } from "@/components/PageHero";
import { getAliadosActivos } from "@/lib/aliados-db";
import { getAllPlatos } from "@/lib/platos-db";
import { getPromosDelDia, type PromoAliado } from "@/lib/promos-db";
import { AliadosSlideInfinito } from "@/components/AliadosSlideInfinito";

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
    getPromosDelDia(50),
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

      {/* HERO CON IMAGEN */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[520px] flex items-end">
        {/* Imagen de fondo */}
        <Image
          src="/platos/cecina-lojana.webp"
          alt="Cecina lojana: plato típico de Loja, Ecuador"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay degradado oscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />

        {/* Contenido encima de la imagen */}
        <div className="relative z-10 w-full pb-6 pt-20 sm:pb-10 sm:pt-28">
          <Wrap>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2.8px] text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  EN VIVO · LOJA, ECUADOR
                </span>
                <h1 className="text-2xl md:text-4xl font-bold text-white mt-2.5 font-serif drop-shadow-lg">
                  Menús del Día y Promociones Activas ({promosActivas.length})
                </h1>
                <p className="text-xs sm:text-sm text-white/80 mt-1.5 drop-shadow">
                  Platos del día y ofertas vigentes hoy de restaurantes y cafeterías de Loja.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <Link
                  href="/que-comer-hoy?momento=desayuno"
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                    momento === "desayuno" || (momento === "todos" && momentoActual === "desayuno")
                      ? "bg-white text-grafito"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                  }`}
                >
                  🌅 Desayunos
                </Link>
                <Link
                  href="/que-comer-hoy?momento=almuerzo"
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                    momento === "almuerzo" || (momento === "todos" && momentoActual === "almuerzo")
                      ? "bg-white text-grafito"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                  }`}
                >
                  🍽️ Almuerzos
                </Link>
                <Link
                  href="/que-comer-hoy?momento=cena"
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
                    momento === "cena" || (momento === "todos" && momentoActual === "cena")
                      ? "bg-white text-grafito"
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                  }`}
                >
                  🌙 Cenas
                </Link>
              </div>
            </div>
          </Wrap>
        </div>
      </section>

      <Wrap className="py-8 sm:py-10">
        {/* ── SECCIÓN: MENÚS Y PROMOCIONES ACTIVAS PUBLICADAS HOY (BOT WHATSAPP / ALIADOS) ── */}
        <div className="mb-14">
          {promosActivas.length > 0 ? (
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
          ) : (
            <div className="rounded-3xl border border-niebla bg-white p-8 sm:p-10 text-center shadow-xs">
              <span className="text-4xl block mb-2">🍽️</span>
              <h3 className="font-serif text-xl font-bold text-grafito">
                Aún no hay promociones ni menús cargados para hoy
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto">
                Los establecimientos aliados van publicando sus almuerzos y ofertas en vivo. Puedes consultarles directamente abajo o pedir por WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* ── SECCIÓN 1: RESTAURANTES ALIADOS QUE OFRECEN COMIDA HOY (SLIDE INFINITO) ── */}
        <div className="mb-16 border-t border-niebla pt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
                DISPONIBILIDAD INMEDIATA
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-grafito mt-1">
                Restaurantes Aliados Oficiales de Hoy ({aliadosFiltrados.length})
              </h2>
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

          <AliadosSlideInfinito
            aliados={aliadosFiltrados}
            waAfiliacionUrl="https://wa.me/593988888888?text=Hola%2C%20tengo%20un%20restaurante%20en%20Loja%20y%20deseo%20afiliarlo%20a%20Qu%C3%A9%20Comer%20en%20Loja"
            badgeTexto="Oficial de Hoy"
          />
        </div>

        {/* ── SECCIÓN 2: PREGUNTAS FRECUENTES (FAQS RICH SNIPPETS) ── */}
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
