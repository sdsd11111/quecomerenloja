import type { Metadata } from "next";
import Link from "next/link";
import { POPULAR_DISHES } from "@/lib/data";
import { listRestaurants } from "@/lib/repository";
import { Explorer } from "@/components/Explorer";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Buscar por plato o ingrediente",
  description: "¿Dónde comer repe, cecina o alverja con guineo en Loja? Busca por plato e ingrediente.",
  alternates: { canonical: "/buscar" },
  robots: { index: false, follow: true },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const items = await listRestaurants();
  return (
    <>
      <PageHero eyebrow="BUSCAR" title={<>¿Dónde puedo comer <em className="text-[#e1b45f]">eso que se me antoja?</em></>}>
        Busca por plato o ingrediente y mira qué restaurante lo tiene hoy.
      </PageHero>
      <Wrap className="py-10">
        <div className="mb-5 flex flex-wrap gap-2">
          {POPULAR_DISHES.map((d) => (
            <Link key={d} href={`/buscar?q=${encodeURIComponent(d)}`} className="rounded-full border border-[#e9dfce] px-3.5 py-1.5 text-[11px] text-[#6d604d] hover:bg-clay hover:text-white">{d}</Link>
          ))}
        </div>
        <DemoNote />
        <Explorer key={q} items={items} initialQuery={q} />
      </Wrap>
    </>
  );
}
