"use client";

import React, { useRef } from "react";

interface EventosSlideProps {
  children: React.ReactNode;
  itemWidthClass?: string;
  pistaTexto?: string;
}

export function EventosSlide({
  children,
  itemWidthClass = "w-[84vw] max-w-[340px]",
  pistaTexto = "👈 Desliza para ver más 👉",
}: EventosSlideProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + 16) : cardWidth + 16,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Flechas de navegación para desktop y móvil */}
      <div className="flex items-center justify-end gap-1.5 mb-4">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95 text-xs sm:text-sm"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Siguiente"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95 text-xs sm:text-sm"
        >
          →
        </button>
      </div>

      {/* Contenedor carrusel en móvil (horizontal peek), cuadrícula en sm+ */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar sm:grid sm:gap-6 sm:overflow-visible sm:pb-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child) => (
          <div className={`${itemWidthClass} shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink flex flex-col`}>
            {child}
          </div>
        ))}
      </div>

      {/* Pista táctil para móvil */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2.5 text-[11px] text-petroleo font-medium">
        <span>{pistaTexto}</span>
      </div>
    </div>
  );
}
