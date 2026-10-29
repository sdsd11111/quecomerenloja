import type { Metadata } from "next";
import { PageHero, Wrap } from "@/components/PageHero";
import { ExplorerPlazas } from "@/components/ExplorerPlazas";
import { getAliadosActivos } from "@/lib/aliados-db";

export const metadata: Metadata = {
  title: "Restaurantes en Loja | Directorio Oficial de Aliados Gastronómicos",
  description: "Directorio oficial de restaurantes y cafeterías aliados en Loja. Conoce nuestra oferta gastronómica con contacto directo por WhatsApp.",
  alternates: { canonical: "/restaurantes" },
  openGraph: {
    title: "Restaurantes en Loja | Directorio Oficial de Aliados",
    description: "Espacios gastronómicos oficiales de Loja. Contacto directo por WhatsApp sin comisiones ni intermediarios.",
    url: "https://quecomerenloja.com/restaurantes",
  },
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const aliados = await getAliadosActivos();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://quecomerenloja.com/restaurantes#collection",
        url: "https://quecomerenloja.com/restaurantes",
        name: "Directorio Oficial de Restaurantes y Cafeterías en Loja",
        description: "Catálogo curado y verificado de restaurantes, cafeterías y huecas en Loja, Ecuador.",
        isPartOf: {
          "@type": "WebSite",
          url: "https://quecomerenloja.com",
          name: "Qué Comer en Loja",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: "https://quecomerenloja.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Restaurantes",
            item: "https://quecomerenloja.com/restaurantes",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Restaurantes y Cafeterías Destacados en Loja",
        itemListElement: aliados.slice(0, 15).map((a, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: a.nombre,
          url: `https://quecomerenloja.com/restaurantes#aliado-${a.id}`,
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
      {/* ── HERO ELEGANTE Y DIRECTO AL GRANO ── */}
      <section className="bg-porcelana/70 border-b border-niebla py-8 sm:py-10">
        <Wrap>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[2.8px] text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                DIRECTORIO OFICIAL · LOJA, ECUADOR
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-grafito mt-2.5 font-serif">
                Restaurantes en Loja: <em className="font-serif italic font-normal text-petroleo">Nuestros Aliados Oficiales ({aliados.length})</em>
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1.5">
                <span className="sm:hidden">
                  Restaurantes y cafeterías verificados con contacto directo a WhatsApp sin intermediarios.
                </span>
                <span className="hidden sm:inline">
                  Descubre los mejores restaurantes, huecas tradicionales y cafeterías de Loja con atención y reservas directas a su WhatsApp sin comisiones.
                </span>
              </p>
            </div>
          </div>
        </Wrap>
      </section>

      <Wrap className="py-8 sm:py-10">
        <ExplorerPlazas initialCategory={categoria} aliadosReales={aliados} />
      </Wrap>
    </>
  );
}
