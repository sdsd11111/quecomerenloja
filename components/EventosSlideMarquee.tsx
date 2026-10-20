"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EventoGastronomico } from "@/lib/services/eventosGastronomicos";

interface EventosSlideProps {
  eventos: EventoGastronomico[];
}

// Formateador de fechas en zona horaria de Loja / Ecuador (UTC-5)
function formatearRangoFechas(fechaInicioStr: string, fechaFinStr: string) {
  try {
    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);

    const opcionesDia: Intl.DateTimeFormatOptions = {
      timeZone: "America/Guayaquil",
      day: "numeric",
      month: "short",
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      timeZone: "America/Guayaquil",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const diaInicio = inicio.toLocaleDateString("es-EC", opcionesDia);
    const diaFin = fin.toLocaleDateString("es-EC", opcionesDia);
    const horaInicio = inicio.toLocaleTimeString("es-EC", opcionesHora);

    if (diaInicio === diaFin) {
      return `${diaInicio} · ${horaInicio}`;
    }
    return `${diaInicio} - ${diaFin}`;
  } catch {
    return "Fechas por confirmar";
  }
}

function getTipoEventoBadge(tipo?: string | null) {
  const t = (tipo || "").toLowerCase();
  if (t.includes("feria")) return { label: "🎪 Feria", bg: "bg-amber-100 text-amber-900 border-amber-200" };
  if (t.includes("festival")) return { label: "✨ Festival", bg: "bg-purple-100 text-purple-900 border-purple-200" };
  if (t.includes("ruta") || t.includes("cafe") || t.includes("café")) return { label: "☕ Ruta Gastronómica", bg: "bg-emerald-100 text-emerald-900 border-emerald-200" };
  if (t.includes("cata") || t.includes("taller")) return { label: "🍷 Cata & Taller", bg: "bg-rose-100 text-rose-900 border-rose-200" };
  return { label: "🍴 Evento Gastronómico", bg: "bg-teal-100 text-teal-900 border-teal-200" };
}

export function EventosSlideMarquee({ eventos }: EventosSlideProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!eventos || eventos.length === 0) return null;

  // Si hay pocos eventos (ej: 1, 2 o 3), los duplicamos para que el slide infinito tenga suficiente longitud
  let itemsToRender = [...eventos];
  while (itemsToRender.length < 4) {
    itemsToRender = [...itemsToRender, ...eventos];
  }

  const renderCard = (ev: EventoGastronomico, keyId: string) => {
    const badge = getTipoEventoBadge(ev.tipoEvento);
    const fechaTexto = formatearRangoFechas(ev.fechaInicio, ev.fechaFin);

    return (
      <article
        key={keyId}
        className="group relative flex w-[350px] sm:w-[380px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-niebla/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-petroleo/60 hover:shadow-xl select-none"
      >
        {/* Encabezado / Imagen */}
        <div className="relative h-48 w-full overflow-hidden bg-porcelana">
          {ev.imagenUrl ? (
            <img
              src={ev.imagenUrl}
              alt={ev.nombre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-petroleo/10 to-petroleo/20 text-4xl">
              🥘
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Chips flotantes */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide backdrop-blur-md shadow-xs ${badge.bg}`}
            >
              {badge.label}
            </span>
            {ev.parroquia && (
              <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-grafito backdrop-blur-sm shadow-xs">
                📍 {ev.parroquia}
              </span>
            )}
          </div>

          {/* Fecha destacada en el banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-semibold">
            <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate drop-shadow-sm">{fechaTexto}</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight text-grafito line-clamp-1 group-hover:text-petroleo transition-colors">
              {ev.nombre}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted">
              <span>📍</span>
              <span className="truncate">{ev.lugar}</span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
              {ev.resumen}
            </p>

            {ev.organizador && (
              <div className="mt-3 text-[11px] font-medium text-petroleo/80 flex items-center gap-1">
                <span className="text-muted">Organiza:</span>
                <span className="font-semibold">{ev.organizador}</span>
              </div>
            )}
          </div>

          {/* CTA Link Oficial */}
          <div className="mt-6 border-t border-niebla/60 pt-4">
            <a
              href={ev.flywheelLink || ev.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0E2E2E] hover:shadow-md"
            >
              <span>Ver programación oficial</span>
              <span className="text-sm font-normal">→</span>
            </a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sombras de desvanecimiento laterales */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-porcelana to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-porcelana to-transparent" />

      {/* Animación continua de slider infinito */}
      <style jsx>{`
        @keyframes eventosSlideTrack {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .eventos-track {
          display: flex;
          width: max-content;
          animation: eventosSlideTrack 38s linear infinite;
        }
        .eventos-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`eventos-track ${isPaused ? "paused" : ""}`}>
        {/* Set 1 */}
        <div className="flex gap-6 pr-6">
          {itemsToRender.map((ev, idx) => renderCard(ev, `slide-1-${idx}`))}
        </div>
        {/* Set 2 (duplicado para el loop infinito sin saltos) */}
        <div className="flex gap-6 pr-6" aria-hidden="true">
          {itemsToRender.map((ev, idx) => renderCard(ev, `slide-2-${idx}`))}
        </div>
      </div>
    </div>
  );
}
