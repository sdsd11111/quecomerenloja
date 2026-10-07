import { NextResponse } from "next/server";
import { askAdvisor } from "@/lib/advisor";
import type { AdvisorMessage, AdvisorRequest } from "@/lib/advisor/types";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const isMsg = (m: unknown): m is AdvisorMessage =>
  typeof m === "object" && m !== null &&
  ((m as AdvisorMessage).role === "user" || (m as AdvisorMessage).role === "assistant") &&
  typeof (m as AdvisorMessage).content === "string";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`chat:${ip}`)) {
    return NextResponse.json({ reply: "Estás escribiendo muy rápido. Espera un momento e inténtalo de nuevo." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 400) : "";
  if (!message) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });

  const history = Array.isArray(body.history)
    ? body.history.filter(isMsg).slice(-6).map((m) => ({ role: m.role, content: m.content.slice(0, 600) }))
    : [];

  const loc = body.location as { latitude?: unknown; longitude?: unknown } | undefined;
  const location =
    loc && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)
      ? { latitude: Number(loc.latitude), longitude: Number(loc.longitude) }
      : undefined;

  const payload: AdvisorRequest = { message, history, location, locale: "es-EC" };

  try {
    return NextResponse.json(await askAdvisor(payload));
  } catch (err) {
    console.error("[advisor]", err);
    return NextResponse.json({ reply: "El asesor no está disponible en este momento. Inténtalo de nuevo en unos minutos." }, { status: 502 });
  }
}
