/**
 * CONTRATO DEL ASESOR IA
 *
 * El sitio NO contiene IA. Reenvía la conversación a tu servicio y muestra la respuesta.
 *
 *   Sitio ──POST {ADVISOR_API_URL}──▶ Tu asesor   (AdvisorRequest → AdvisorResponse)
 *   Tu asesor ──GET /api/advisor/context──▶ Sitio  (menús y negocios actuales)
 */

export interface AdvisorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AdvisorRequest {
  /** Mensaje actual del visitante (máx. 400 caracteres). */
  message: string;
  /** Últimos turnos de la conversación (máx. 6), sin incluir `message`. */
  history?: AdvisorMessage[];
  /** Ubicación opcional, solo si el visitante dio permiso. */
  location?: { latitude: number; longitude: number };
  locale?: string;
}

export interface AdvisorResponse {
  /** Texto plano que se muestra en el chat. */
  reply: string;
}

export interface AdvisorContextItem {
  slug: string;
  name: string;
  category: string;
  zone: string;
  dish: string;
  menu: string;
  price: number | null;
  meal: string;
  whatsapp: string | null;
  lat: number | null;
  lng: number | null;
  verifiedAt: string | null;
  url: string;
}
