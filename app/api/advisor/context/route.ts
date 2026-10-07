import { NextResponse } from "next/server";
import { listRestaurants } from "@/lib/repository";
import { SITE } from "@/lib/site";
import type { AdvisorContextItem } from "@/lib/advisor/types";

export const dynamic = "force-dynamic";

/**
 * Datos actuales para alimentar tu Asesor IA (RAG / contexto).
 * Si defines ADVISOR_API_KEY, exige `Authorization: Bearer <ADVISOR_API_KEY>`.
 */
export async function GET(req: Request) {
  const key = process.env.ADVISOR_API_KEY;
  if (key && req.headers.get("authorization") !== `Bearer ${key}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const items: AdvisorContextItem[] = (await listRestaurants()).map((r) => ({
    slug: r.slug,
    name: r.name,
    category: r.category,
    zone: r.zone,
    dish: r.dish,
    menu: r.menu,
    price: r.price,
    meal: r.meal,
    whatsapp: r.whatsapp || null,
    lat: r.lat,
    lng: r.lng,
    verifiedAt: r.verifiedAt,
    url: `${SITE.url}/restaurantes/${r.slug}`,
  }));
  return NextResponse.json({ generatedAt: new Date().toISOString(), items });
}
