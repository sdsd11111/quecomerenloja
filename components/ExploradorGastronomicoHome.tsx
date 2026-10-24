'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PlatoCatalogo } from '@/lib/platos-db';

interface ExploradorGastronomicoHomeProps {
  platos: PlatoCatalogo[];
}

type CategoriaPillId = 'TODOS' | 'TRADICIONAL' | 'DESAYUNOS' | 'ALMUERZOS' | 'MARISCOS' | 'RAPIDA' | 'PARRILLAS';

interface CategoriaPill {
  id: CategoriaPillId;
  label: string;
  emoji: string;
  matchSecciones: string[];
}

const CATEGORIAS_PILLS: CategoriaPill[] = [
  { id: 'TODOS', label: 'Toda la Carta', emoji: '🍽️', matchSecciones: [] },
  { id: 'TRADICIONAL', label: 'Típicos de Loja', emoji: '🥣', matchSecciones: ['Tradicional Lojana', 'Bebidas Tradicionales', 'Pescados y Tradición'] },
  { id: 'DESAYUNOS', label: 'Café & Desayunos', emoji: '☕', matchSecciones: ['Desayunos y Cafeterías', 'Desayunos y Tradicional', 'Cafeterías y Bebidas'] },
  { id: 'ALMUERZOS', label: 'Almuerzos & Secos', emoji: '🍲', matchSecciones: ['Almuerzos y Menú del Día', 'Almuerzos y Sopas', 'Secos y Almuerzos', 'Platos Fuertes'] },
  { id: 'MARISCOS', label: 'Mariscos & Costeña', emoji: '🦐', matchSecciones: ['Mariscos y Costeña'] },
  { id: 'PARRILLAS', label: 'Carnes & Parrillas', emoji: '🥩', matchSecciones: ['Parrilladas y Carnes', 'Carnes y Asados'] },
  { id: 'RAPIDA', label: 'Noche & Comida Rápida', emoji: '🍕', matchSecciones: ['Comida Rápida', 'Comida Rápida y Piqueos', 'Bares y Noche'] },
];

export function ExploradorGastronomicoHome({ platos }: ExploradorGastronomicoHomeProps) {
  const [categoria, setCategoria] = useState<CategoriaPillId>('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 280;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16,
        behavior: 'smooth',
      });
    }
  };

  // Filtrado de platos según categoría y búsqueda
  const platosFiltrados = useMemo(() => {
    let list = platos;

    if (categoria !== 'TODOS') {
      const activePill = CATEGORIAS_PILLS.find((p) => p.id === categoria);
      if (activePill && activePill.matchSecciones.length > 0) {
        list = list.filter((p) =>
          activePill.matchSecciones.some(
            (sec) => p.seccion.toLowerCase() === sec.toLowerCase()
          )
        );
      }
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion_corta.toLowerCase().includes(q) ||
          p.seccion.toLowerCase().includes(q)
      );
    }

    return list;
  }, [categoria, busqueda, platos]);

  // Platos mostrados según el límite progresivo (inicia en 8)
  const platosAMostrar = useMemo(() => {
    return platosFiltrados.slice(0, visibleCount);
  }, [platosFiltrados, visibleCount]);

  const hayMasParaMostrar = visibleCount < platosFiltrados.length;
  const restantes = Math.max(0, platosFiltrados.length - visibleCount);

  // Al cambiar de categoría o búsqueda, resetear vista a 8
  const handleSelectCategoria = (catId: CategoriaPillId) => {
    setCategoria(catId);
    setVisibleCount(8);
  };

  const handleCargarMas = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // Fallback de imagen limpia si no tiene o viene vacía
  const getPlatoImagen = (plato: PlatoCatalogo) => {
    if (plato.hero_imagen_url) return plato.hero_imagen_url;
    if (plato.slug.includes('repe')) return 'https://mvps.b-cdn.net/quecomerenloja/home/repe-lojano.webp';
    if (plato.slug.includes('cecina')) return 'https://mvps.b-cdn.net/quecomerenloja/home/cecina-lojana.webp';
    if (plato.slug.includes('tamal') || plato.slug.includes('humita')) return 'https://mvps.b-cdn.net/quecomerenloja/home/tamales-humitas.webp';
    if (plato.slug.includes('arveja')) return 'https://mvps.b-cdn.net/quecomerenloja/home/arveja-guineo.webp';
    if (plato.slug.includes('pizza')) return 'https://mvps.b-cdn.net/quecomerenloja/cenas/pizza-lena.webp';
    if (plato.slug.includes('alita')) return 'https://mvps.b-cdn.net/quecomerenloja/cenas/alitas-artesanales.webp';
    if (plato.slug.includes('burger') || plato.slug.includes('hamburguesa')) return 'https://mvps.b-cdn.net/quecomerenloja/cenas/smash-burgers.webp';
    return 'https://mvps.b-cdn.net/quecomerenloja/home/hero-home.webp';
  };

  return (
    <section className="py-20 bg-white border-t border-niebla">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera SEO */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="block text-[11px] font-extrabold uppercase tracking-[2.5px] text-petroleo mb-2">
              ✦ CARTA & GASTRONOMÍA DE LOJA ({platos.length} ESPECIALIDADES)
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-grafito tracking-tight">
              ¿Qué se te antoja comer hoy en Loja?
            </h2>
            <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
              Explora las especialidades de la ciudad: platos identitarios, cafeterías de altura, mariscos, almuerzos y opciones nocturnas con precios y locales verificados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Flechas de navegación para explorar platos */}
            <div className="flex items-center gap-1.5 mr-1">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                aria-label="Plato anterior"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                aria-label="Plato siguiente"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95"
              >
                →
              </button>
            </div>

            <Link
              href="/restaurantes"
              className="text-xs font-bold text-petroleo hover:underline inline-flex items-center gap-1 bg-porcelana px-3 sm:px-4 py-2 rounded-xl border border-niebla transition hover:bg-niebla/50 whitespace-nowrap"
            >
              <span>Restaurantes →</span>
            </Link>
          </div>
        </div>

        {/* Buscador Rápido interno */}
        <div className="relative mb-6">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-muted text-base">🔍</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setVisibleCount(8);
              }}
              placeholder={`Buscar entre los ${platos.length} platos (repe, cecina, tamales, ceviche, pizza, café, parrillada)...`}
              className="w-full rounded-2xl border border-niebla bg-porcelana/40 py-3.5 pl-11 pr-4 text-xs sm:text-sm text-grafito placeholder:text-muted focus:border-petroleo focus:bg-white focus:outline-none focus:ring-1 focus:ring-petroleo transition shadow-2xs"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-4 text-xs font-bold text-muted hover:text-grafito"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* PÍLDORAS DE FILTRO INTERACTIVO */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-niebla">
          {CATEGORIAS_PILLS.map((pill) => {
            const isSelected = categoria === pill.id;
            const count =
              pill.id === 'TODOS'
                ? platos.length
                : platos.filter((p) =>
                    pill.matchSecciones.some(
                      (sec) => p.seccion.toLowerCase() === sec.toLowerCase()
                    )
                  ).length;

            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleSelectCategoria(pill.id)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  isSelected
                    ? 'bg-petroleo text-white shadow-md ring-2 ring-citrico/80 scale-[1.02]'
                    : 'bg-porcelana text-grafito hover:bg-niebla/70 border border-niebla/70'
                }`}
              >
                <span>{pill.emoji}</span>
                <span>{pill.label}</span>
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-citrico text-petroleo'
                      : 'bg-white text-muted border border-niebla/60'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 mb-8 flex items-center justify-between text-xs text-muted">
          <span>
            Mostrando <strong>{platosAMostrar.length}</strong> de <strong>{platosFiltrados.length}</strong> platos disponibles
          </span>
          {categoria !== 'TODOS' && (
            <button
              onClick={() => handleSelectCategoria('TODOS')}
              className="text-xs font-bold text-petroleo underline hover:text-[#0E2E2E]"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        {/* CUADRÍCULA DE PLATOS CULINARIOS */}
        {platosFiltrados.length === 0 ? (
          <div className="rounded-3xl border border-niebla bg-porcelana/30 p-12 text-center my-6">
            <span className="text-4xl">🥣</span>
            <h4 className="mt-3 text-base font-bold text-grafito">
              No encontramos platos con ese nombre
            </h4>
            <p className="mt-1 text-xs text-muted max-w-md mx-auto">
              Intenta buscar por otro término o selecciona &quot;Toda la Carta&quot;.
            </p>
            <button
              onClick={() => {
                setCategoria('TODOS');
                setBusqueda('');
                setVisibleCount(8);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-petroleo text-white text-xs font-bold shadow-xs hover:bg-[#0E2E2E]"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div>
            {/* Contenedor: En móvil carrusel deslizante horizontal (w-[82vw]) que asoma la siguiente tarjeta. En desktop cuadrícula. */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar sm:grid sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible sm:pb-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {platosAMostrar.map((dish) => (
                <Link
                  key={dish.slug}
                  href={`/platos/${dish.slug}`}
                  className="w-[82vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-niebla bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Imagen del Plato */}
                  <div className="relative h-48 sm:h-52 w-full bg-porcelana overflow-hidden">
                    <Image
                      src={getPlatoImagen(dish)}
                      alt={`Plato en Loja: ${dish.nombre}`}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Badge Sección / Categoría */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-citrico text-petroleo font-black text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {dish.seccion}
                      </span>
                    </div>

                    {dish.rango_precio_loja && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/65 backdrop-blur-md text-white border border-white/20 font-bold text-[11px] px-2.5 py-0.5 rounded-lg shadow-sm">
                          {dish.rango_precio_loja}
                        </span>
                      </div>
                    )}

                    {/* Nombre sobre imagen */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-citrico transition-colors leading-tight">
                        {dish.nombre}
                      </h3>
                    </div>
                  </div>

                  {/* Descripción y enlace */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {dish.descripcion_corta}
                    </p>

                    <div className="mt-4 sm:mt-5 pt-3 border-t border-niebla flex items-center justify-between text-xs">
                      <span className="font-bold text-petroleo text-[11px] flex items-center gap-1">
                        <span>📍</span>
                        <span>Dónde comerlo</span>
                      </span>
                      <span className="font-extrabold text-petroleo group-hover:translate-x-1 transition-transform">
                        Ver locales →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pista visual táctil para usuarios móviles */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3 text-[11px] text-petroleo font-medium">
              <span>👈 Desliza para explorar más platos 👉</span>
            </div>
          </div>
        )}

        {/* BOTÓN PROGRESIVO "CARGAR MÁS PLATOS" PARA NO SOBRECARGAR LA HOME */}
        {hayMasParaMostrar && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleCargarMas}
              className="inline-flex items-center gap-2 rounded-2xl bg-petroleo px-8 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-[#0E2E2E] transition active:scale-95"
            >
              <span>🍽️</span>
              <span>Cargar más platos de Loja (+{Math.min(8, restantes)} de {restantes} restantes)</span>
            </button>
            <p className="mt-2 text-[11px] text-muted">
              Mostrando {platosAMostrar.length} de {platosFiltrados.length} especialidades gastronómicas
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
