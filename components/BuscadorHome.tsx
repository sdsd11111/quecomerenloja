"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Catálogo interno de páginas indexadas y rutas oficiales del sitio
export const SITE_PAGES = [
  // Platos Típicos & Guías de Plato
  { title: "Repe Lojano", subtitle: "Plato insignia de Loja (5.000 búsquedas/mes)", href: "/platos/repe-lojano", category: "Plato Típico", icon: "🥣", keywords: ["repe", "sopa", "guineo", "quesillo", "repe lojano", "repe blanco"] },
  { title: "Cecina Lojana", subtitle: "Asado tradicional a la brasa con yuca y mote", href: "/platos/cecina-lojana", category: "Plato Típico", icon: "🥩", keywords: ["cecina", "carne", "cerdo", "asado", "brasa", "cecina lojana"] },
  { title: "Tamales y Humitas", subtitle: "Desayunos, lonches y café de altura (+900% demanda)", href: "/platos/tamales-lojanos", category: "Plato Típico", icon: "🌽", keywords: ["tamal", "tamales", "humita", "humitas", "quimbolito", "achira"] },
  { title: "Arveja con Guineo", subtitle: "Clásico plato andino de cuchara lojana", href: "/platos/repe-lojano", category: "Plato Típico", icon: "🍲", keywords: ["arveja", "guineo", "cuchara", "arveja con guineo", "sopa"] },

  // Momentos de Consumo & Ocasiones
  { title: "Cafeterías & Desayunos", subtitle: "Café de especialidad, tamales y cafeterías en Loja", href: "/desayunos-en-loja", category: "Momento", icon: "☕", keywords: ["cafe", "cafeteria", "cafeterias", "desayuno", "desayunos", "calle lourdes", "cafe de loja", "filtrado"] },
  { title: "Almuerzos & Menú del Día", subtitle: "Menús ejecutivos y platos del día de $3.00 a $5.00", href: "/almuerzos-loja", category: "Momento", icon: "🍱", keywords: ["menu", "almuerzo", "almuerzos", "menu del dia", "ejecutivo", "economico"] },
  { title: "Cenas, Alitas, Pizzas & Noche", subtitle: "Comida rápida nocturna, pizzas a la leña, alitas (+900%) y chifas", href: "/comida-rapida-loja", category: "Momento", icon: "🍕", keywords: ["cena", "cenas", "cenar", "donde cenar", "alitas", "pizza", "pizzas", "hamburguesa", "hamburguesas", "chifa", "comida rapida", "noche"] },
  { title: "Bares y Vida Nocturna", subtitle: "Cócteles, bares y planes nocturnos en Loja", href: "/bares-y-noche", category: "Momento", icon: "🍸", keywords: ["bar", "bares", "tragos", "cocteles", "discoteca", "noche", "musica"] },

  // Directorio y Negocios
  { title: "Dónde Comer en Loja (Directorio)", subtitle: "Explora la selección curada de restaurantes", href: "/restaurantes", category: "Directorio", icon: "🍽️", keywords: ["restaurante", "restaurantes", "donde comer", "huecas", "comida"] },
  { title: "Para Negocios (Súmate a la Guía)", subtitle: "Publica tu restaurante o cafetería sin comisiones", href: "/para-negocios", category: "Negocios", icon: "💼", keywords: ["negocio", "negocios", "anunciar", "publicar", "restaurante", "afiliar", "planes"] },
  { title: "Blog Gastronómico de Loja", subtitle: "Guías, historias culinarias y recomendaciones", href: "/blog", category: "Editorial", icon: "📖", keywords: ["blog", "articulos", "guias", "historias", "recomendaciones"] },
];

export function BuscadorHome() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filtrar páginas del sitio que coincidan
  const filtered = query.trim() === ""
    ? []
    : SITE_PAGES.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }).slice(0, 5);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      handleSelect(filtered[0].href);
    } else if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-center gap-3.5 rounded-2xl border border-niebla bg-white px-7 py-5 shadow-[0_14px_45px_#153E3E18] transition-all focus-within:border-petroleo focus-within:shadow-[0_16px_50px_#153E3E25]"
      >
        <span aria-hidden className="text-2xl text-petroleo">⌕</span>
        <label htmlFor="home-search-input" className="sr-only">
          Busca un platillo, categoría o página gastronómica de Loja
        </label>
        <input
          id="home-search-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="¿Qué quieres comer en Loja? (ej: repe lojano, desayunos, cafeterías, alitas, menú del día...)"
          className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-muted text-grafito"
          autoComplete="off"
        />
        <button
          type="submit"
          className="rounded-xl bg-petroleo px-6 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#0E2E2E] active:scale-95 shrink-0"
        >
          Explorar →
        </button>
      </form>

      {/* ── DROPDOWN FLOTANTE INTELIGENTE CONECTADO A LAS PÁGINAS DEL SITIO ── */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-niebla bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="border-b border-niebla/50 bg-porcelana/40 px-5 py-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Páginas sugeridas en Qué Comer en Loja
            </span>
          </div>

          <ul className="divide-y divide-niebla/40 max-h-[340px] overflow-y-auto">
            {filtered.map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-porcelana/70 group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-grafito group-hover:text-petroleo transition-colors">
                          {item.title}
                        </span>
                        <span className="rounded-full bg-niebla/60 px-2 py-0.5 text-[9px] font-semibold text-petroleo uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-muted text-sm group-hover:text-petroleo group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
