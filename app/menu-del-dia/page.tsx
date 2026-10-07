import type { Metadata } from "next";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Menú del día en Loja",
  description: "Los menús del día de los restaurantes verificados de Loja, actualizados por nota de voz de WhatsApp.",
  alternates: { canonical: "/menu-del-dia" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await listRestaurants();
  const today = new Intl.DateTimeFormat("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "long" }).format(new Date());
  return (
    <>
      <PageHero eyebrow={`HOY · ${today.toUpperCase()}`} title={<>Menús del Día — <em className="text-[#e1b45f]">actualizados hoy</em></>}>
        Los restaurantes verificados publican su menú enviando una nota de voz por WhatsApp.
      </PageHero>
      <Wrap className="py-10">
        <DemoNote />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.filter((r) => r.meal !== "cena").map((r) => <RestaurantCard key={r.slug} r={r} />)}
        </div>
      </Wrap>
    </>
  );
}
