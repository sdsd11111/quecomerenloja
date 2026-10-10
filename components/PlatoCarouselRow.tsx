"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PlatoCard } from "@/lib/platos-data";

interface PlatoCarouselRowProps {
  platos: PlatoCard[];
  hubUrl?: string;
  verMasTexto?: string;
}

export function PlatoCarouselRow({
  platos,
  hubUrl,
  verMasTexto = "Ver todos los platos",
}: PlatoCarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Botones de navegación lateral en Desktop */}
      <div className="hidden sm:flex items-center justify-between pointer-events-none absolute -top-14 right-0 gap-2 z-10">
        <button
          onClick={() => scroll("left")}
          aria-label="Anterior plato"
          className="pointer-events-auto h-9 w-9 rounded-full border border-niebla bg-white text-petroleo shadow-sm flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Siguiente plato"
          className="pointer-events-auto h-9 w-9 rounded-full border border-niebla bg-white text-petroleo shadow-sm flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition"
        >
          →
        </button>
      </div>

      {/* Contenedor carrusel horizontal con scroll-snap y swipe nativo */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {platos.map((plato) => (
          <div
            key={plato.slug}
            className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col justify-between rounded-2xl border border-niebla bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-petroleo hover:shadow-xl group"
          >
            <div>
              <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl">
                <Image
                  src={plato.imagen}
                  alt={plato.nombre}
                  fill
                  sizes="320px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {plato.precioPromedio && (
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-petroleo shadow">
                    {plato.precioPromedio}
                  </span>
                )}
              </div>

              <span className="text-xl block mb-1">{plato.emoji}</span>
              <h3 className="font-serif text-lg font-bold text-grafito group-hover:text-petroleo transition-colors">
                {plato.nombre}
              </h3>
              <small className="block text-[11px] font-semibold text-petroleo mt-0.5">
                {plato.tagline}
              </small>
              <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                {plato.desc}
              </p>
            </div>

            <div className="mt-5 border-t border-niebla/60 pt-3 flex items-center justify-between">
              <Link
                href={`/platos/${plato.slug}`}
                className="text-[11px] font-extrabold text-petroleo group-hover:underline"
              >
                Guía completa y dónde comer →
              </Link>
            </div>
          </div>
        ))}

        {/* Tarjeta final "Ver más" */}
        {hubUrl && (
          <div className="w-[240px] shrink-0 snap-start flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-petroleo/30 bg-petroleo/5 p-6 text-center hover:bg-petroleo/10 hover:border-petroleo transition">
            <span className="text-3xl mb-2">🍽️</span>
            <h4 className="font-serif text-base font-bold text-grafito">
              ¿Quieres descubrir más?
            </h4>
            <p className="text-xs text-muted mt-1 mb-4">
              Explora nuestra selección completa de locales y especialidades.
            </p>
            <Link
              href={hubUrl}
              className="rounded-xl bg-petroleo px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm"
            >
              {verMasTexto} →
            </Link>
          </div>
        )}
      </div>

      {/* Pista táctil para móvil */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2 text-[11px] text-muted font-medium">
        <span>👉 Desliza para ver más platos</span>
      </div>
    </div>
  );
}
