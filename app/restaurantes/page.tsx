import type { Metadata } from "next";
import { PageHero, Wrap } from "@/components/PageHero";
import { ExplorerPlazas } from "@/components/ExplorerPlazas";

export const metadata: Metadata = {
  title: "Restaurantes en Loja | Plazas y Vacantes para Aliados Gastronómicos",
  description: "Directorio de plazas disponibles y restaurantes aliados en Loja. Conoce las vacantes oficiales para restaurantes de repe, cecina, cafeterías y comida rápida.",
  alternates: { canonical: "/restaurantes" },
  openGraph: {
    title: "Restaurantes en Loja | Directorio Oficial de Aliados y Plazas Disponibles",
    description: "Espacios y plazas comerciales para los mejores restaurantes de Loja. Contacto directo por WhatsApp sin comisiones ni intermediarios.",
    url: "https://quecomerenloja.com/restaurantes",
  },
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="DIRECTORIO OFICIAL · CUPOS PARA RESTAURANTES"
        title={
          <>
            Restaurantes en Loja: <em className="font-serif italic font-normal text-[#e1b45f]">Plazas disponibles para aliados.</em>
          </>
        }
      >
        Espacios oficiales reservados para los mejores restaurantes, huecas tradicionales y cafeterías de Loja. Contacto directo con comensales y turistas sin intermediarios.
      </PageHero>

      <Wrap className="py-12">
        <ExplorerPlazas initialCategory={categoria} />
      </Wrap>
    </>
  );
}
