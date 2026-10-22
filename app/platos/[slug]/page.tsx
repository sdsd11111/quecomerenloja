import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";
import { getAllPlatosSlugs, getPlatoBySlug, getRestaurantesByPlato } from "@/lib/platos-db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // ISR: revalida cada 24 horas

/**
 * Pre-renderizar en tiempo de compilación los 50+ platos activos de la DB
 */
export async function generateStaticParams() {
  const slugs = await getAllPlatosSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generación de metadatos SEO dinámicos y OpenGraph para cada plato
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plato = await getPlatoBySlug(slug);

  if (!plato) {
    return {
      title: "Plato no encontrado | Qué Comer en Loja",
      description: "El plato solicitado no se encuentra en nuestro catálogo gastronómico de Loja.",
    };
  }

  const canonicalUrl = `https://quecomerenloja.com/platos/${plato.slug}`;
  const ogImage = plato.hero_imagen_url || "https://mvps.b-cdn.net/quecomerenloja/og-default.jpg";

  return {
    title: plato.meta_title,
    description: plato.meta_description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: plato.meta_title,
      description: plato.meta_description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${plato.nombre} en Loja Ecuador`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: plato.meta_title,
      description: plato.meta_description,
      images: [ogImage],
    },
  };
}

export default async function PlatoDinamicoPage({ params }: PageProps) {
  const { slug } = await params;
  const plato = await getPlatoBySlug(slug);

  if (!plato) {
    notFound();
  }

  const restaurantes = await getRestaurantesByPlato(plato.id);

  // JSON-LD para Recipe + FAQPage + ItemList de restaurantes
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: `${plato.nombre} en Loja`,
        headline: plato.titulo_h1,
        description: plato.descripcion_corta,
        recipeCuisine: "Ecuatoriana / Lojana",
        recipeCategory: plato.seccion,
        keywords: `${plato.nombre.toLowerCase()} loja, donde comer ${plato.nombre.toLowerCase()} en loja, comida en loja`,
        recipeIngredient: plato.ingredientes_clave || [],
      },
      {
        "@type": "FAQPage",
        mainEntity: (plato.faqs || []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "ItemList",
        name: `Restaurantes que sirven ${plato.nombre} en Loja`,
        numberOfItems: restaurantes.length,
        itemListElement: restaurantes.slice(0, 10).map((r, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: r.nombre_restaurante,
          description: `${r.item_carta} - ${r.precio_textual || (r.precio_numerico ? `$${r.precio_numerico} USD` : "Consultar")}`,
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

      {/* ── 1. HERO DINÁMICO ── */}
      <section className="relative min-h-[65vh] flex flex-col justify-end overflow-hidden pb-10 pt-20">
        <div className="absolute inset-0 z-0 bg-petroleo">
          {plato.hero_imagen_url && (
            <Image
              src={plato.hero_imagen_url}
              alt={`${plato.nombre} en Loja Ecuador`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-85"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[720px] rounded-3xl bg-white/95 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/60">
            <span className="inline-block rounded-full bg-citrico/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2.5">
              {plato.seccion.toUpperCase()} · GUÍA GASTRONÓMICA EN LOJA
            </span>

            <h1 className="text-[clamp(28px,3.8vw,46px)] font-bold tracking-tight text-grafito leading-[1.15]">
              {plato.titulo_h1}
            </h1>

            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              {plato.descripcion_corta}
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <Link
                href="/platos"
                className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
              >
                ← Catálogo de Platos
              </Link>
              <Link
                href="/restaurantes"
                className="rounded-xl border border-niebla bg-white px-4 py-2.5 text-xs font-bold text-petroleo hover:bg-porcelana transition"
              >
                Ver Restaurantes →
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
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/platos" className="hover:underline">
                  Platos Típicos y Comida
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-petroleo">
                {plato.nombre}
              </li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. DESCRIPCIÓN Y FICHA GASTRONÓMICA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              TRADICIÓN & SAZÓN EN LOJA
            </span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-grafito">
              ¿Dónde comer el mejor {plato.nombre.toLowerCase()} en Loja?
            </h2>

            {plato.historia_tradicion && (
              <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
                {plato.historia_tradicion}
              </p>
            )}

            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-grafito mb-3">
                Ingredientes y Elementos Clave
              </h3>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {plato.ingredientes_clave.map((ing, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-niebla bg-white px-3 py-1.5 text-petroleo shadow-2xs"
                  >
                    ✦ {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-niebla bg-white p-6 shadow-sm">
            <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
              FICHA INFORMATIVA
            </span>
            <h3 className="font-serif text-xl font-bold text-grafito mt-1">
              Ficha del Plato
            </h3>
            <ul className="mt-5 space-y-3 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Categoría:</span>
                <strong className="text-grafito font-semibold">
                  {plato.seccion}
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Precio estimado en Loja:</span>
                <strong className="text-petroleo font-bold">
                  {plato.rango_precio_loja || "Consulte con el local"}
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Locales registrados:</span>
                <strong className="text-grafito font-semibold">
                  {restaurantes.length} opciones en la ciudad
                </strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Origen & Estilo:</span>
                <strong className="text-grafito font-semibold">
                  Cocina Tradicional de Loja
                </strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* ── 3. LISTADO REAL DE RESTAURANTES Y CARTAS SCRAPEADAS ── */}
      {restaurantes.length > 0 && (
        <section className="bg-white py-16 border-b border-niebla">
          <Wrap>
            <div className="max-w-2xl mb-10">
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
                CARTA & PRECIOS REALES EN LOJA
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-grafito">
                Restaurantes que preparan {plato.nombre} en la ciudad
              </h2>
              <p className="mt-2 text-xs md:text-sm text-muted">
                Precios e ítems de cartas recopilados y verificados en establecimientos de Loja.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restaurantes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-niebla bg-porcelana/40 p-5 shadow-2xs hover:border-petroleo/30 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-petroleo uppercase bg-white border border-niebla px-2.5 py-0.5 rounded-full">
                        {item.parroquia || "Loja Urbano"}
                      </span>
                      {item.precio_numerico && (
                        <span className="text-sm font-extrabold text-petroleo">
                          ${item.precio_numerico.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-grafito leading-snug">
                      {item.item_carta}
                    </h4>

                    <p className="text-xs font-semibold text-petroleo mt-1">
                      📍 {item.nombre_restaurante}
                    </p>

                    {item.direccion && (
                      <p className="text-[11px] text-muted mt-1 line-clamp-2">
                        {item.direccion}
                      </p>
                    )}

                    {item.descripcion_item && (
                      <p className="text-[11px] text-muted italic mt-2 line-clamp-3">
                        &ldquo;{item.descripcion_item}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-niebla/60 flex items-center justify-between text-xs">
                    <span className="text-muted text-[10px]">
                      {item.categoria_excel || "Plato a la carta"}
                    </span>
                    <Link
                      href={`/restaurantes`}
                      className="font-bold text-petroleo hover:underline text-[11px]"
                    >
                      Ver local →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}

      {/* ── 4. PLAZAS PARA ALIADOS GASTRONÓMICOS (MONETIZACIÓN) ── */}
      <PlazasDisponiblesPlato
        nombrePlato={plato.nombre}
        horarioRecomendado="Horario de atención habitual en Loja"
      />

      {/* ── 5. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato={`${plato.nombre} en Loja`} />

      {/* ── 6. PREGUNTAS FRECUENTES (FAQS) ── */}
      {plato.faqs && plato.faqs.length > 0 && (
        <section className="bg-white py-16 border-t border-niebla">
          <Wrap>
            <div className="max-w-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
                PREGUNTAS FRECUENTES
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-grafito">
                Todo lo que debes saber sobre {plato.nombre.toLowerCase()} en Loja
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 max-w-4xl">
              {plato.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-niebla bg-porcelana/30 p-5"
                >
                  <h3 className="font-bold text-sm text-grafito">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      )}
    </>
  );
}
