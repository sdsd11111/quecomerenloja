export interface EventoGastronomico {
  id: number | string;
  nombre: string;
  slug: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  resumen: string;
  imagenUrl?: string | null;
  mapaUrl?: string | null;
  organizador?: string | null;
  parroquia?: string | null;
  tipoEvento?: string | null; // e.g. "feria" | "festival" | "ruta"
  canonicalUrl: string;
  flywheelLink: string;
}

export interface AgendaCulturalResponse {
  success: boolean;
  fuente?: string;
  total?: number;
  eventos: EventoGastronomico[];
  error?: string;
}

const API_ENDPOINT = "https://www.agendaculturalloja.com/api/eventos/gastronomicos";
const TIMEOUT_MS = 6000;

export async function getEventosGastronomicos(): Promise<EventoGastronomico[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(API_ENDPOINT, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[getEventosGastronomicos] Error status ${res.status} al consultar la API.`);
      return [];
    }

    const data: AgendaCulturalResponse = await res.json();

    if (data && Array.isArray(data.eventos)) {
      return data.eventos;
    }

    return [];
  } catch (error: any) {
    // Si hay timeout o error de red, logueamos advertencia y retornamos fallback seguro vacío
    if (error?.name === "AbortError") {
      console.warn("[getEventosGastronomicos] Request abortada por timeout (>6s).");
    } else {
      console.warn("[getEventosGastronomicos] Fallback por error en fetch:", error?.message || error);
    }
    return [];
  }
}
