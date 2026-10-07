import "server-only";
import { listRestaurants } from "@/lib/repository";
import { normalize } from "@/lib/search";
import type { AdvisorRequest, AdvisorResponse } from "./types";

/**
 * Punto único de integración del Asesor IA.
 * - Con ADVISOR_API_URL: reenvía la petición a tu servicio (ver ./types.ts).
 * - Sin ella: responde con un recomendador de ejemplo, para poder probar la interfaz.
 */
export async function askAdvisor(req: AdvisorRequest): Promise<AdvisorResponse> {
  const url = process.env.ADVISOR_API_URL;
  if (!url) return demoAdvisor(req.message);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.ADVISOR_API_KEY ? { Authorization: `Bearer ${process.env.ADVISOR_API_KEY}` } : {}),
    },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`El asesor respondió ${res.status}`);
  const data = (await res.json()) as Partial<AdvisorResponse>;
  if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("Respuesta del asesor inválida");
  return { reply: data.reply };
}

async function demoAdvisor(text: string): Promise<AdvisorResponse> {
  const q = normalize(text);
  if (/reserv|horario|abierto|delivery/.test(q))
    return { reply: "No puedo confirmar horarios ni gestionar reservas o delivery. Abre la ficha y consulta directamente al restaurante por WhatsApp." };
  if (/vegano|vegetariano|sin gluten|alerg/.test(q))
    return { reply: "No hay datos confirmados para esa preferencia. Para dietas o alergias, confirma ingredientes directamente con el restaurante." };

  let items = await listRestaurants();
  const amount = q.match(/(?:\$\s*|hasta\s+|menos de\s+|presupuesto\s+(?:de\s+)?)(\d+(?:[.,]\d+)?)/);
  if (amount) items = items.filter((r) => r.price !== null && r.price <= Number(amount[1].replace(",", ".")));
  const terms = ["cecina", "repe", "cafe", "humita", "churrasco", "tradicional", "desayuno", "almuerzo", "bar", "noche", "cena"];
  const hits = terms.filter((t) => q.includes(t));
  if (hits.length) items = items.filter((r) => hits.some((t) => normalize(r.keywords).includes(t)));
  if (!items.length) return { reply: "No encontré opciones para ese antojo o presupuesto. Prueba con café, cecina o un almuerzo." };

  const lines = items.slice(0, 3).map((r) => `${r.name}${r.price !== null ? ` · $${r.price.toFixed(2)}` : ""}\n${r.menu}`);
  return { reply: `Te sugiero:\n\n${lines.join("\n\n")}\n\nConsulta la ficha antes de visitar.` };
}
