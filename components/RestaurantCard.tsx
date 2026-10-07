import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { isVerifiedToday } from "@/lib/search";
import { DishArt } from "./DishArt";
import { WhatsAppButton } from "./WhatsAppButton";

export function RestaurantCard({ r, km }: { r: Restaurant; km?: number }) {
  const verified = r.demo ? "✓ Verificado GuIAloja · Demo" : r.verifiedAt ? "✓ Verificado GuIAloja" : "Verificación pendiente";
  const fresh = r.demo
    ? "Ejemplo · sin verificar hoy"
    : isVerifiedToday(r.verifiedAt)
      ? "✅ Verificado hoy"
      : r.verifiedAt
        ? "Menú no confirmado hoy"
        : "Sin actualización confirmada";
  const tag = r.meal === "desayuno" ? "DESAYUNO ESPECIAL" : r.meal === "cena" ? "PROPUESTA NOCTURNA" : "ALMUERZO DEL DÍA";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#e7decc] bg-paper transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <DishArt style={r.style} label={r.dish}>
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#fff8e9]/90 px-2.5 py-1 text-[9px] text-[#5a513b]">{tag}</span>
        <span className="absolute bottom-5 left-5 z-10 font-serif text-[26px] italic text-[#fff4df]">{r.dish}</span>
        {r.price !== null && (
          <span className="absolute bottom-4 right-4 z-10 rounded-lg bg-cream px-2.5 py-1.5 text-lg font-extrabold text-clay">${r.price.toFixed(2)}</span>
        )}
      </DishArt>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex justify-between gap-2 text-[10px] text-muted">
          <span>⌖ {r.zone}{km !== undefined && Number.isFinite(km) ? ` · ${km.toFixed(1)} km aprox.` : ""}</span>
          <span className="font-semibold text-green">{verified}</span>
        </div>
        <h3 className="text-2xl tracking-tight">
          <Link href={`/restaurantes/${r.slug}`} className="hover:text-clay">{r.name}</Link>
        </h3>
        <p className="my-3 min-h-[42px] text-xs text-muted">{r.menu}</p>
        <span className="mb-5 text-[11px] text-green">{fresh}</span>
        <div className="mt-auto flex flex-col gap-2">
          <WhatsAppButton number={r.whatsapp} text={`Hola ${r.name}, vi su menú en quecomerenloja.com: ${r.menu}. ¿Está disponible?`} />
          <Link href={`/restaurantes/${r.slug}`} className="text-center text-[11px] font-semibold text-clay hover:underline">Ver ficha completa →</Link>
        </div>
      </div>
    </article>
  );
}
