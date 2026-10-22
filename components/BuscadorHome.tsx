"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface SearchCatalogItem {
  type: "plato" | "aliado" | "momento";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
  slug?: string;
  image?: string | null;
  whatsappUrl?: string | null;
  price?: string | null;
  keywords: string[];
  momentos?: string[];
  platosRelacionados?: string[];
}

interface CatalogData {
  platos: SearchCatalogItem[];
  aliados: SearchCatalogItem[];
  momentos: SearchCatalogItem[];
}

const CHIPS_SUGERIDOS = [
  { label: "⭐ ¿Qué comer hoy?", query: "hoy", isSpecial: true },
  { label: "🥣 Repe Lojano", query: "repe", isSpecial: false },
  { label: "🥩 Cecina Lojana", query: "cecina", isSpecial: false },
  { label: "🦐 Parihuela", query: "parihuela", isSpecial: false },
  { label: "🍱 Almuerzos de hoy", query: "almuerzo", isSpecial: false },
  { label: "☕ Café de Altura", query: "cafe", isSpecial: false },
  { label: "🍕 Pizzas & Alitas", query: "alitas", isSpecial: false },
];

export function BuscadorHome() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"todos" | "platos" | "restaurantes" | "hoy">("todos");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  // Cargar catálogo de API una sola vez en cliente
  useEffect(() => {
    let mounted = true;
    async function loadCatalog() {
      try {
        setLoading(true);
        const res = await fetch("/api/search/catalog");
        if (!res.ok) throw new Error("Error HTTP");
        const data = await res.json();
        if (mounted) {
          setCatalog(data);
        }
      } catch (err) {
        console.warn("Fallo carga de catalogo para buscador:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtrado optimizado tolerante a tildes y caracteres
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const results = useMemo(() => {
    if (!catalog) return [];
    const qNorm = normalize(query);
    if (!qNorm) return [];

    const isHoy = qNorm.includes("hoy") || qNorm.includes("menu del dia");

    // Todos los elementos consolidados
    const allItems: SearchCatalogItem[] = [
      ...catalog.momentos,
      ...catalog.aliados,
      ...catalog.platos,
    ];

    const matched = allItems.filter((item) => {
      if (activeTab === "platos" && item.type !== "plato") return false;
      if (activeTab === "restaurantes" && item.type !== "aliado") return false;
      if (activeTab === "hoy") {
        if (item.type === "momento" && item.id === "momento-hoy") return true;
        if (item.type === "aliado") return true; // Todos los aliados tienen oferta activa hoy
        if (item.type === "plato") {
          // Platos tradicionales o almuerzos típicos de hoy
          return (
            item.category.toLowerCase().includes("tradicional") ||
            item.category.toLowerCase().includes("secos") ||
            item.category.toLowerCase().includes("mariscos")
          );
        }
      }

      const titleNorm = normalize(item.title);
      const subNorm = normalize(item.subtitle);
      const catNorm = normalize(item.category);

      const inTitle = titleNorm.includes(qNorm);
      const inSub = subNorm.includes(qNorm);
      const inCat = catNorm.includes(qNorm);
      const inKw = (item.keywords || []).some((kw) => normalize(kw).includes(qNorm));

      // Si busca "hoy", priorizar el banner de hoy y aliados
      if (isHoy) {
        if (item.id === "momento-hoy") return true;
        if (item.type === "aliado") return true;
      }

      return inTitle || inSub || inCat || inKw;
    });

    // Ordenar: primero momentos si coincide exactamente, luego aliados verificados, luego platos
    return matched.sort((a, b) => {
      if (isHoy && a.id === "momento-hoy") return -1;
      if (isHoy && b.id === "momento-hoy") return 1;
      if (a.type === "aliado" && b.type !== "aliado") return -1;
      if (b.type === "aliado" && a.type !== "aliado") return 1;
      return 0;
    }).slice(0, 8);
  }, [catalog, query, activeTab]);

  // Cierre al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qTrim = query.trim();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex].href);
      return;
    }

    if (normalize(qTrim) === "hoy" || normalize(qTrim).includes("que comer hoy")) {
      router.push("/que-comer-hoy");
      setOpen(false);
      return;
    }

    if (results.length > 0) {
      handleSelect(results[0].href);
    } else if (qTrim) {
      router.push(`/buscar?q=${encodeURIComponent(qTrim)}`);
      setOpen(false);
    }
  };

  // Navegación con teclado (Flechas y Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── FORMULARIO PRINCIPAL DE BÚSQUEDA ── */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="relative flex items-center gap-3.5 rounded-2xl border border-niebla bg-white px-5 sm:px-7 py-4 sm:py-5 shadow-[0_14px_45px_#153E3E18] transition-all focus-within:border-petroleo focus-within:shadow-[0_16px_50px_#153E3E25]"
      >
        <span aria-hidden className="text-2xl text-petroleo shrink-0">
          ⌕
        </span>
        <label htmlFor="home-search-input" className="sr-only">
          Busca platos, restaurantes de Loja o qué comer hoy
        </label>
        <input
          id="home-search-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué quieres comer en Loja? (ej: parihuela, repe, qué comer hoy, alitas, ceviche...)"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted text-grafito"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedIndex(-1);
            }}
            className="text-xs text-muted hover:text-grafito transition px-1"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl bg-petroleo px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#0E2E2E] active:scale-95 shrink-0 shadow-sm"
        >
          Explorar →
        </button>
      </form>

      {/* ── CHIPS DE SUGERENCIA RÁPIDA ── */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted shrink-0">
          Sugerencias:
        </span>
        {CHIPS_SUGERIDOS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              if (chip.query === "hoy") {
                router.push("/que-comer-hoy");
              } else {
                setQuery(chip.query);
                setOpen(true);
              }
            }}
            className={`shrink-0 rounded-full border px-3 py-1 font-semibold transition active:scale-95 ${
              chip.isSpecial
                ? "border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 shadow-2xs"
                : "border-niebla bg-white/90 text-grafito/80 hover:border-petroleo hover:text-petroleo hover:bg-white"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ── DROPDOWN FLOTANTE INTELIGENTE CLASIFICADO ── */}
      {open && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 z-40 mt-2 overflow-hidden rounded-2xl border border-niebla bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Tabs rápidas de filtrado dentro del buscador */}
          <div className="flex items-center gap-1.5 border-b border-niebla/70 bg-porcelana/70 px-4 py-2.5 overflow-x-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted mr-1 shrink-0">
              FILTRAR:
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("todos")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                activeTab === "todos"
                  ? "bg-petroleo text-white"
                  : "bg-white text-muted hover:text-grafito border border-niebla/60"
              }`}
            >
              Todos ({results.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("platos")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                activeTab === "platos"
                  ? "bg-petroleo text-white"
                  : "bg-white text-muted hover:text-grafito border border-niebla/60"
              }`}
            >
              🍲 Platos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("restaurantes")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                activeTab === "restaurantes"
                  ? "bg-petroleo text-white"
                  : "bg-white text-muted hover:text-grafito border border-niebla/60"
              }`}
            >
              🍽️ Restaurantes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hoy")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                activeTab === "hoy"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-900 border border-amber-200"
              }`}
            >
              ⭐ De Hoy
            </button>
          </div>

          {/* Lista de resultados */}
          {results.length > 0 ? (
            <ul ref={listRef} className="divide-y divide-niebla/40 max-h-[380px] overflow-y-auto">
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between px-5 py-3.5 text-left transition group ${
                        isSelected ? "bg-porcelana" : "hover:bg-porcelana/70"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icono o miniatura */}
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-niebla bg-porcelana">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-xl">
                              {item.type === "plato" ? "🍲" : item.type === "aliado" ? "🍽️" : "✨"}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-sm text-grafito group-hover:text-petroleo transition-colors truncate">
                              {item.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                item.type === "plato"
                                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                  : item.type === "aliado"
                                  ? "bg-sky-50 text-sky-900 border border-sky-200"
                                  : "bg-amber-50 text-amber-900 border border-amber-200"
                              }`}
                            >
                              {item.type === "plato" ? "Plato" : item.type === "aliado" ? "Aliado" : "Guía"}
                            </span>
                            {item.price && (
                              <span className="text-[11px] font-bold text-petroleo">
                                {item.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted mt-0.5 truncate">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="shrink-0 pl-3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-petroleo opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                          Ver detalles
                        </span>
                        <span className="text-muted text-sm group-hover:text-petroleo group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-serif text-sm font-bold text-grafito">
                No encontramos coincidencias exactas para &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                Prueba buscando por plato (ej: <em>repe, cecina, parihuela</em>) o consulta qué hay para comer hoy.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelect("/que-comer-hoy")}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition shadow-xs"
                >
                  ⭐ Ver qué comer hoy
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect("/platos")}
                  className="rounded-xl bg-petroleo px-4 py-2 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-xs"
                >
                  Ver todos los 50+ platos
                </button>
              </div>
            </div>
          )}

          {/* Footer del dropdown */}
          <div className="border-t border-niebla/70 bg-porcelana/40 px-5 py-2.5 flex items-center justify-between text-[11px] text-muted">
            <span>Presiona <strong>Enter</strong> para ver todos los resultados</span>
            <button
              type="button"
              onClick={() => router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)}
              className="text-petroleo font-bold hover:underline"
            >
              Búsqueda avanzada →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
