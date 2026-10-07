import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/repository";
import { DishArt } from "@/components/DishArt";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Wrap } from "@/components/PageHero";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  if (!r) return {};
  return {
    title: r.name,
    description: `${r.name} en Loja: ${r.menu}. Consulta y escribe directo por WhatsApp.`,
    alternates: { canonical: `/restaurantes/${r.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getRestaurantBySlug(slug);
  if (!r) notFound();

  const message = `Hola, vi su menú en Qué Comer en Loja y quisiera consultar por: ${r.dish}.`;

  return (
    <>
      <DishArt style={r.style} label={r.dish}>
        <div className="absolute inset-x-0 bottom-0 z-10">
          <Wrap className="pb-8">
            <Link href="/restaurantes" className="text-xs text-[#e6d7bc] hover:underline">← Dónde comer</Link>
            <h1 className="mt-2 text-4xl text-[#fff4df] md:text-6xl">{r.name}</h1>
          </Wrap>
        </div>
      </DishArt>
      <Wrap className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          {r.demo && <p className="mb-4 rounded-lg bg-[#f3efdf] px-4 py-3 text-xs text-[#746344]">Ficha de demostración: los datos son de ejemplo y no se ha verificado disponibilidad real.</p>}
          <p className="text-muted">{r.description}</p>
          <h2 className="mt-8 text-2xl">Menú del día</h2>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-paper p-5">
            <span className="text-sm">{r.menu}</span>
            {r.price !== null && <span className="ml-4 rounded-lg bg-cream px-3 py-1.5 text-lg font-extrabold text-clay">${r.price.toFixed(2)}</span>}
          </div>
          <h2 className="mt-8 text-2xl">Platos recomendados</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {r.highlights.map((h) => (
              <li key={h} className="rounded-full border border-[#e9dfce] px-4 py-1.5 text-xs text-[#6d604d]">{h}</li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-line bg-paper p-6">
          <p className="text-[11px] text-muted">⌖ {r.zone}</p>
          <p className="mt-3 text-sm font-semibold text-green">{r.demo ? "✓ Verificado GuIAloja · Demo" : r.verifiedAt ? "✓ Verificado GuIAloja" : "Verificación pendiente"}</p>
          <div className="mt-5">
            <WhatsAppButton number={r.whatsapp} text={message} label="Consultar por WhatsApp →" />
          </div>
          <p className="mt-4 text-[10px] text-muted">Mensaje preestructurado: “{message}”</p>
          <p className="mt-3 text-[10px] text-muted">Para dietas o alergias, confirma ingredientes directamente con el restaurante.</p>
        </aside>
      </Wrap>
    </>
  );
}
