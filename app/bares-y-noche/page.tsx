import type { Metadata } from "next";
import { listByCategory } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Bares y vida nocturna en Loja",
  description: "Bares, picadas y vida nocturna de Loja con contacto directo por WhatsApp.",
  alternates: { canonical: "/bares-y-noche" },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const bares = await listByCategory("noche");
  return (
    <>
      <PageHero eyebrow="BARES & NOCHE" title={<>La ciudad <em className="text-[#e1b45f]">después del atardecer</em></>}>
        Picadas, música y lugares para seguir la conversación.
      </PageHero>
      <Wrap className="py-12">
        <DemoNote />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bares.map((r) => <RestaurantCard key={r.slug} r={r} />)}
        </div>
        <p className="mt-8 text-xs text-muted">Disfruta con responsabilidad. Si tomas, no manejes.</p>
      </Wrap>
    </>
  );
}
