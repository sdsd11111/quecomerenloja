"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BuscadorHome } from "./BuscadorHome";

export function FloatingSearchWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    // Si no estamos en la Home, siempre está visible
    if (!isHome) {
      setVisible(true);
      return;
    }

    // Si estamos en la Home, observar el buscador del Hero (#home-search-trigger)
    const triggerEl = document.getElementById("home-search-trigger");
    if (!triggerEl) {
      // Fallback si por alguna razón no se renderiza de inmediato
      const handleScroll = () => {
        setVisible(window.scrollY > 450);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Si el buscador del Hero es visible, ocultar el botón flotante
        // Si ya NO es visible (scroll abajo), mostrar el botón flotante
        setVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(triggerEl);
    return () => observer.disconnect();
  }, [isHome, pathname]);

  // Cerrar al presionar Escape o atajo global Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bloquear scroll de fondo cuando el popup modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Cerrar modal al navegar a otra página
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Escuchar evento personalizado para abrir desde el header móvil
  useEffect(() => {
    const handleOpenSearch = () => setIsOpen(true);
    window.addEventListener("open-search-modal", handleOpenSearch);
    return () => window.removeEventListener("open-search-modal", handleOpenSearch);
  }, []);

  if (!visible && !isOpen) return null;

  return (
    <>
      {/* ── BOTÓN FLOTANTE EN ESQUINA INFERIOR IZQUIERDA (SOLO DESKTOP / TABLET) ── */}
      <div className="hidden sm:flex fixed bottom-5 left-4 sm:left-6 z-40 items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buscar platos y restaurantes en Loja"
          className="group relative flex items-center gap-2.5 rounded-full bg-petroleo hover:bg-[#0E2E2E] text-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Pulso sutil animado */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-citrico opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-citrico"></span>
          </span>

          <span className="text-lg">⌕</span>
          <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">
            Buscar en Loja
          </span>

          <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-mono text-white/80 hidden md:inline">
            ⌘K
          </span>
        </button>
      </div>

      {/* ── POPUP MODAL CENTRADO TIPO COMMAND PALETTE ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-200">
          {/* Backdrop con desenfoque suave */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Caja modal del buscador */}
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-niebla z-10 mt-10 md:mt-16 animate-in zoom-in-95 duration-200">
            {/* Cabecera del popup */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-niebla/70">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-petroleo text-white font-bold text-sm shadow-xs">
                  ⌕
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-grafito">
                    Buscador Gastronómico de Loja
                  </h3>
                  <p className="text-[11px] text-muted">
                    Consulta los 50+ platos, restaurantes aliados y qué comer hoy.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-muted hover:text-grafito hover:bg-porcelana transition"
                aria-label="Cerrar buscador"
              >
                ✕
              </button>
            </div>

            {/* Buscador inteligente */}
            <BuscadorHome />

            {/* Teclas de atajo y sugerencia en el pie */}
            <div className="mt-4 pt-3 border-t border-niebla/60 flex items-center justify-between text-[11px] text-muted">
              <span>Navega con flechas ↑ ↓ y presiona <strong>Enter</strong></span>
              <span>Cierra con <strong>Esc</strong></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
