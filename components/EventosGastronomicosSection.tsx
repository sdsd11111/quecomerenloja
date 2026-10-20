import Link from "next/link";
import { Wrap } from "@/components/PageHero";
import { getEventosGastronomicos } from "@/lib/services/eventosGastronomicos";
import { EventosSlideMarquee } from "@/components/EventosSlideMarquee";

export async function EventosGastronomicosSection() {
  const eventos = await getEventosGastronomicos();

  return (
    <section id="eventos-gastronomicos" className="border-t border-niebla bg-[#FAFAF7] py-20 overflow-hidden">
      <Wrap>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-8">
          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 mb-3">
              <span>🎪</span>
              <span>AGENDA EN VIVO · LOJA</span>
            </div>
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito leading-tight">
              Ferias y Eventos Gastronómicos en Loja
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Festivales culinarios, catas de café de especialidad y ferias de tradición lojana. Información actualizada en tiempo real vía Agenda Cultural Loja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/eventos-gastronomicos"
              className="inline-flex items-center gap-1.5 rounded-xl border border-niebla bg-white px-5 py-3 text-xs font-bold text-grafito shadow-2xs transition hover:border-petroleo hover:text-petroleo hover:shadow-xs"
            >
              Ver cartelera completa →
            </Link>
            <a
              href="https://www.agendaculturalloja.com/publicar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#0E2E2E]"
            >
              <span>+</span>
              <span>Registrar evento</span>
            </a>
          </div>
        </div>
      </Wrap>

      {/* RENDERIZADO CONDICIONAL: SLIDE O FALLBACK AMIGABLE */}
      {eventos.length > 0 ? (
        <EventosSlideMarquee eventos={eventos} />
      ) : (
        <Wrap>
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-niebla/90 bg-white p-8 md:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-3xl">
              ☕
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-grafito">
              Próximas ferias y festivales en preparación
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted">
              Actualmente no hay eventos gastronómicos programados para las próximas horas. ¿Organizas una feria, cata o festival en Loja?
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.agendaculturalloja.com/publicar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0E2E2E]"
              >
                <span>🎪</span>
                <span>Publicar feria o festival gratis ↗</span>
              </a>
              <Link
                href="/restaurantes"
                className="inline-flex items-center rounded-xl border border-niebla bg-porcelana/60 px-5 py-3 text-xs font-bold text-grafito hover:bg-white transition"
              >
                Explorar restaurantes y huecas
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted font-medium">
              <span>Sincronizado oficialmente con</span>
              <a
                href="https://www.agendaculturalloja.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-petroleo hover:underline"
              >
                agendaculturalloja.com
              </a>
            </div>
          </div>
        </Wrap>
      )}
    </section>
  );
}
