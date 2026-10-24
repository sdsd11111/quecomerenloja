"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface ConsumptionMoment {
  title: string;
  badge: string;
  tagline: string;
  desc: string;
  href: string;
  cta: string;
  image: string;
}

interface MomentosSlideProps {
  moments: ConsumptionMoment[];
}

export function MomentosSlide({ moments }: MomentosSlideProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // En móvil avanza el ancho de la card (~82vw) + gap
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
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={() => scroll("left")}
          aria-label="Momento anterior"
          className="h-9 w-9 rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 hover:border-citrico transition active:scale-95"
        >
          ←
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Momento siguiente"
          className="h-9 w-9 rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/70 hover:border-citrico transition active:scale-95"
        >
          →
        </button>
      </div>

      {/* Contenedor carrusel con swipe en móvil: w-[84vw] para asomar la siguiente card */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {moments.map((moment) => (
          <div
            key={moment.title}
            className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-6 sm:p-7 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-citrico hover:bg-black/60"
          >
            <div>
              {/* Foto miniatura o preview dentro de la card */}
              <div className="relative mb-5 sm:mb-6 h-44 sm:h-48 w-full overflow-hidden rounded-xl border border-white/10 shadow-inner">
                <Image
                  src={moment.image}
                  alt={moment.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-citrico px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-petroleo">
                  {moment.badge}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-citrico transition">
                {moment.title}
              </h3>
              <small className="block font-semibold text-[11px] text-citrico/90 mt-1">
                {moment.tagline}
              </small>
              <p className="mt-3 text-xs leading-relaxed text-niebla/80">
                {moment.desc}
              </p>
            </div>

            <div className="mt-6 sm:mt-7 border-t border-white/10 pt-4">
              <Link
                href={moment.href}
                className="inline-flex items-center text-xs font-bold text-white group-hover:text-citrico transition gap-1 underline underline-offset-4"
              >
                {moment.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador táctil en móvil para invitar al swipe */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mt-3 text-[11px] text-citrico font-medium">
        <span>👈 Desliza para explorar momentos 👉</span>
      </div>
    </div>
  );
}
