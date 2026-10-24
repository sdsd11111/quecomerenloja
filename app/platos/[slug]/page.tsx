import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";
import { getAllPlatosSlugs, getPlatoBySlug } from "@/lib/platos-db";

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

  // JSON-LD para Recipe + FAQPage
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
                <span className="text-muted">Garantía gastronómica:</span>
                <strong className="text-grafito font-semibold">
                  Aliados Oficiales Verificados
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

      {/* ── 3. PLAZAS PARA ALIADOS GASTRONÓMICOS (MONETIZACIÓN Y NEGOCIOS ALIADOS) ── */}
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
