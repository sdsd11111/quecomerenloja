"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AliadoDb } from "@/lib/aliados-db";

export interface SlotDisponible {
  id: string;
  zone: string;
  title: string;
  desc: string;
  status: string;
  highlight: string;
}

interface AliadosSlideInfinitoProps {
  aliados: AliadoDb[];
  slots?: SlotDisponible[];
  waAfiliacionUrl: string;
  badgeTexto?: string;
}

export function AliadosSlideInfinito({
  aliados,
  slots = [],
  waAfiliacionUrl,
  badgeTexto = "Socio Verificado",
}: AliadosSlideInfinitoProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Unir aliados reales con slots disponibles
  const itemsCombinados = [
    ...aliados.map((a) => ({ tipoItem: "aliado" as const, data: a })),
    ...slots.map((s) => ({ tipoItem: "slot" as const, data: s })),
  ];

  if (itemsCombinados.length === 0) return null;

  // Para que el carrusel infinito no tenga saltos en pantallas anchas,
  // multiplicamos los elementos para tener al menos 8 tarjetas en cada mitad del track
  const factorRepeticion = Math.max(1, Math.ceil(8 / itemsCombinados.length));
  const setOriginal: typeof itemsCombinados = [];
  for (let i = 0; i < factorRepeticion; i++) {
    setOriginal.push(...itemsCombinados);
  }

  const renderCard = (
    item: (typeof itemsCombinados)[number],
    keyPrefix: string,
    idx: number
  ) => {
    if (item.tipoItem === "aliado") {
      const aliado = item.data;
      const telLimpio = (aliado.telefono || "").replace(/\D/g, "");
      const waUrl = telLimpio
        ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
            `Hola ${aliado.nombre}, los vi en la sección de Socios Verificados de Qué Comer en Loja. Deseo información de su menú y reservas.`
          )}`
        : null;

      return (
        <div
          key={`${keyPrefix}-aliado-${aliado.id}-${idx}`}
          className="w-[320px] sm:w-[350px] shrink-0 flex flex-col justify-between rounded-2xl border border-niebla bg-white p-6 shadow-sm transition hover:border-petroleo hover:shadow-xl hover:-translate-y-1 select-none"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>★</span> {badgeTexto}
              </span>
              {aliado.destacado && (
                <span className="rounded-full bg-citrico/30 px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo">
                  Destacado
                </span>
              )}
            </div>

            <div className="my-4 flex items-center gap-3">
              {aliado.imagenUrl ? (
                <img
                  src={aliado.imagenUrl}
                  alt={aliado.nombre}
                  className="size-14 rounded-2xl object-cover border border-niebla shadow-xs shrink-0"
                />
              ) : (
                <div className="size-14 rounded-2xl bg-porcelana border border-niebla flex items-center justify-center text-2xl shadow-xs shrink-0">
                  🍽️
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-bold text-grafito leading-tight truncate">
                  {aliado.nombre}
                </h3>
                <span className="text-xs text-muted block mt-0.5 truncate">
                  📍 {aliado.ubicacion}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed line-clamp-3">
              {aliado.descripcion}
            </p>

            {aliado.rangoPrecio && (
              <div className="mt-3 text-[11px] font-semibold text-petroleo">
                💰 {aliado.rangoPrecio}
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-niebla pt-3 flex items-center gap-2">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 text-[11px] font-bold text-center transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>💬</span> Contactar WhatsApp
              </a>
            ) : (
              <Link
                href="/restaurantes"
                className="flex-1 rounded-xl bg-petroleo hover:bg-black text-white px-3.5 py-2 text-[11px] font-bold text-center transition"
              >
                Ver local →
              </Link>
            )}
          </div>
        </div>
      );
    }

    // Tarjeta de cupo disponible para socio nuevo
    const slot = item.data;
    return (
      <div
        key={`${keyPrefix}-slot-${slot.id}-${idx}`}
        className="w-[320px] sm:w-[350px] shrink-0 flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-porcelana/40 p-6 transition hover:border-petroleo hover:shadow-lg select-none"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              {slot.zone}
            </span>
            <span className="rounded-full bg-niebla/70 px-2 py-0.5 text-[9px] font-bold text-petroleo">
              {slot.status}
            </span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-grafito mt-3 line-clamp-1">
            {slot.title}
          </h3>
          <small className="block font-semibold text-[11px] text-petroleo mt-0.5">
            ✓ {slot.highlight}
          </small>
          <p className="text-xs text-muted mt-2.5 leading-relaxed line-clamp-2">
            {slot.desc}
          </p>
        </div>

        <div className="mt-5 border-t border-niebla pt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted font-medium">¿Eres dueño?</span>
          <a
            href={waAfiliacionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-citrico hover:brightness-105 px-3.5 py-2 text-[11px] font-bold text-petroleo transition shadow-xs whitespace-nowrap"
          >
            Reservar cupo ↗
          </a>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Sombras de desvanecimiento laterales para efecto infinito suave */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent" />

      {/* Keyframes de animación infinita continua */}
      <style jsx>{`
        @keyframes slideInfinitoContinuo {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .slide-infinito-track {
          display: flex;
          width: max-content;
          animation: slideInfinitoContinuo 42s linear infinite;
        }
        .slide-infinito-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Track que se desplaza sin fin */}
      <div className={`slide-infinito-track ${isPaused ? "paused" : ""}`}>
        {/* Set 1 */}
        <div className="flex gap-6 pr-6">
          {setOriginal.map((item, idx) => renderCard(item, "set1", idx))}
        </div>
        {/* Set 2 (duplicado para el loop infinito sin saltos) */}
        <div className="flex gap-6 pr-6" aria-hidden="true">
          {setOriginal.map((item, idx) => renderCard(item, "set2", idx))}
        </div>
      </div>
    </div>
  );
}
