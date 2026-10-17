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

  return (
    <>
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
