import type { Metadata } from "next";
import { listRestaurants } from "@/lib/repository";
import { Explorer } from "@/components/Explorer";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dónde comer en Loja",
  description: "Catálogo de restaurantes, cafés, huecas y bares de Loja con menú del día y contacto directo por WhatsApp.",
  alternates: { canonical: "/restaurantes" },
};

const CATS: Category[] = ["alta", "cafe", "tradicional", "noche"];

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const initial = CATS.includes(categoria as Category) ? (categoria as Category) : "";
  const items = await listRestaurants();
  return (
    <>
      <PageHero eyebrow="DÓNDE COMER" title={<>Restaurantes, cafés y huecas de <em className="text-[#e1b45f]">Loja</em></>}>
        Filtra por momento del día, categoría o cercanía y escribe directo al negocio.
      </PageHero>
      <Wrap className="py-10">
        <DemoNote />
        <Explorer key={initial} items={items} initialCategory={initial} />
      </Wrap>
    </>
  );
}
