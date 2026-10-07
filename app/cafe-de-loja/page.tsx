import type { Metadata } from "next";
import Link from "next/link";
import { listByCategory } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Café de Loja: ruta de cafeterías",
  description: "La ruta del Café de Loja: cafeterías de especialidad, desayunos, postres y lugares tranquilos.",
  alternates: { canonical: "/cafe-de-loja" },
};

const TOPICS = ["Cafeterías de especialidad", "Café lojano de origen", "Postres y desayunos", "Lugares tranquilos para trabajar", "Cafés cerca del centro histórico"];

export const dynamic = "force-dynamic";

export default async function Page() {
  const cafes = await listByCategory("cafe");
  return (
    <>
      <PageHero eyebrow="RUTA TEMÁTICA" title={<>Café de Loja: <em className="text-[#e1b45f]">origen, aroma y conversación</em></>}>
        Una ruta para tomarse el tiempo: de la taza al grano, y del grano a la charla.
      </PageHero>
      <Wrap className="py-12">
        <ul className="mb-8 flex flex-wrap gap-2">
          {TOPICS.map((t) => <li key={t} className="rounded-full border border-[#e9dfce] px-4 py-1.5 text-xs text-[#6d604d]">{t}</li>)}
        </ul>
        <DemoNote />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cafes.map((r) => <RestaurantCard key={r.slug} r={r} />)}
        </div>
        <p className="mt-10 text-sm text-muted">
          ¿Quieres leer más? Mira la <Link href="/blog/cafe-de-loja-guia-para-empezar" className="font-semibold text-clay underline">guía para empezar con el Café de Loja</Link>.
        </p>
      </Wrap>
    </>
  );
}
