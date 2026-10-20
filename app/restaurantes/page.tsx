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
      <PageHero
        eyebrow="DIRECTORIO OFICIAL · ALIADOS GASTRONÓMICOS DE LOJA"
        title={
          <>
            Restaurantes en Loja: <em className="font-serif italic font-normal text-[#e1b45f]">Sabores auténticos y aliados verificados.</em>
          </>
        }
      >
        Descubre los mejores restaurantes, huecas tradicionales y cafeterías de Loja. Contacto directo con cada negocio por WhatsApp sin intermediarios ni comisiones.
      </PageHero>

      <Wrap className="py-12">
        <ExplorerPlazas initialCategory={categoria} aliadosReales={aliados} />
      </Wrap>
    </>
  );
}
