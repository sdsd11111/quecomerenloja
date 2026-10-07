"use client";

import { useMemo, useState } from "react";
import type { Category, Meal, Restaurant } from "@/lib/types";
import { distanceKm, filterRestaurants, hasCoords, type Coords } from "@/lib/search";
import { RestaurantCard } from "./RestaurantCard";

const MEALS: { key: Meal; label: string }[] = [
  { key: "desayuno", label: "Desayunos" },
  { key: "almuerzo", label: "Almuerzo" },
  { key: "cena", label: "Cena" },
];

interface Props {
  items: Restaurant[];
  initialQuery?: string;
  initialCategory?: Category | "";
  lockedCategory?: boolean;
}

export function Explorer({ items, initialQuery = "", initialCategory = "", lockedCategory = false }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState<Category | "">(initialCategory);
  const [meal, setMeal] = useState<Meal | "">("");
  const [pos, setPos] = useState<Coords | null>(null);
  const [near, setNear] = useState(false);
  const [notice, setNotice] = useState("");

  const results = useMemo(() => {
    const list = filterRestaurants(items, { q, category, meal });
    return near ? [...list].sort((a, b) => distanceKm(a, pos) - distanceKm(b, pos)) : list;
  }, [items, q, category, meal, near, pos]);

  function reset() {
    setQ("");
    setMeal("");
    setNear(false);
    if (!lockedCategory) setCategory("");
  }

  function locate() {
    if (!items.some(hasCoords)) {
      setNotice("Los negocios de ejemplo aún no tienen coordenadas reales. No hemos solicitado tu ubicación.");
      return;
    }
    if (!window.isSecureContext || !navigator.geolocation) {
      setNotice("La geolocalización necesita un navegador compatible y HTTPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ latitude: p.coords.latitude, longitude: p.coords.longitude });
        setNear(true);
        setNotice("Ubicación usada solo en esta sesión. Distancias aproximadas en línea recta.");
      },
      (e) => setNotice(e.code === 1 ? "No diste permiso de ubicación. Puedes seguir buscando por plato o zona." : "No pudimos obtener tu ubicación."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[11px] transition ${active ? "border-clay bg-clay text-white" : "border-[#e9dfce] text-[#6d604d] hover:border-clay hover:bg-clay hover:text-white"}`;

  return (
    <div>
      <div className="rounded-2xl border border-[#e7ddc9] bg-paper p-6 shadow-[0_14px_40px_#37200b0c]">
        <form role="search" className="flex items-center gap-3" onSubmit={(e) => e.preventDefault()}>
          <span aria-hidden className="text-2xl text-clay">⌕</span>
          <label htmlFor="q" className="sr-only">Busca un platillo, restaurante o zona</label>
          <input
            id="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca un platillo, restaurante o zona… (ej: cecina, repe, café)"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-[#8a7b69]"
          />
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ede5d5] pt-4" role="group" aria-label="Filtros rápidos">
          <span className="mr-1 hidden text-[10px] text-muted sm:inline">¿QUÉ SE TE ANTOJA?</span>
          {MEALS.map((m) => (
            <button key={m.key} aria-pressed={meal === m.key} className={chip(meal === m.key)} onClick={() => setMeal(meal === m.key ? "" : m.key)}>
              {m.label}
            </button>
          ))}
          {!lockedCategory && (
            <button aria-pressed={category === "cafe"} className={chip(category === "cafe")} onClick={() => setCategory(category === "cafe" ? "" : "cafe")}>
              Café de Loja
            </button>
          )}
          <button onClick={locate} className="rounded-full border border-[#d3dfcd] px-4 py-1.5 text-[11px] text-green transition hover:bg-green hover:text-white sm:ml-auto">
            ⌖ Cerca de mí
          </button>
        </div>
        <p className="mt-2 text-xs text-green" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "menú disponible" : "menús disponibles"} en la demostración
          {near ? " · Ordenados por distancia aproximada" : ""}.
          {notice && <span className="ml-2 text-muted">{notice}</span>}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <RestaurantCard key={r.slug} r={r} km={near ? distanceKm(r, pos) : undefined} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-[#b9aa8d] p-9 text-center">
          <h3 className="text-2xl">Un antojo para seguir explorando.</h3>
          <p className="mb-4 mt-2 text-sm text-muted">No hay menús de demostración que coincidan. Prueba con cecina, repe o café.</p>
          <button onClick={reset} className="rounded-lg border border-line px-5 py-3 text-[13px] font-bold">Ver todos los menús →</button>
        </div>
      )}
      <div className="mt-6 flex justify-between text-[11px] text-muted">
        <span>También nos encanta: alverja con guineo, tamales, humitas y hornado.</span>
        <button onClick={reset} className="text-clay underline">Restablecer filtros ↻</button>
      </div>
    </div>
  );
}
