"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar al presionar Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Bloquear scroll de fondo cuando el menú lateral está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <>
      {/* ── HEADER ULTRA LIMPIO Y MINIMALISTA ── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-niebla/60 py-2.5 sm:py-3"
            : "bg-white/90 backdrop-blur-sm border-b border-niebla/40 py-3 sm:py-4"
        }`}
      >
        <nav
          className="mx-auto flex w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-40px))] items-center justify-between gap-2"
          aria-label="Navegación principal"
        >
          {/* ── LOGO ELEGANTE (FAVICON BADGE + TIPOGRAFÍA) ── */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
            aria-label="Qué comer en Loja, inicio"
            onClick={() => setOpen(false)}
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-petroleo p-2 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-petroleo/30 shrink-0">
              <Image
                src="/favicon.svg"
                alt="Símbolo Qué Comer en Loja"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-grafito leading-none group-hover:text-petroleo transition-colors truncate">
                Qué comer <span className="text-petroleo">en Loja</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-muted mt-0.5 hidden xs:block">
                Guía Gastronómica Local
              </span>
            </div>
          </Link>

          {/* ── ACCIONES A LA DERECHA: BUSCADOR MÓVIL + MENÚ DESPLEGABLE ── */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* BOTÓN BUSCADOR CLARO Y EVIDENTE PARA MÓVIL */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-search-modal"));
                }
              }}
              aria-label="Buscar platos, menús y restaurantes"
              className="sm:hidden flex items-center gap-1.5 h-10 rounded-xl border border-niebla bg-porcelana/90 hover:bg-white text-grafito px-2.5 py-1.5 shadow-xs transition hover:border-petroleo active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-petroleo shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <span className="text-xs font-bold text-grafito tracking-tight">Buscar</span>
            </button>

            {/* BOTÓN ÚNICO QUE ACTIVA EL DRAWER LATERAL */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú de navegación"
              className="flex items-center gap-2 sm:gap-2.5 rounded-xl border border-niebla bg-porcelana/80 px-3 sm:px-4 py-2 sm:py-2.5 text-petroleo shadow-sm transition hover:border-petroleo hover:bg-white active:scale-95"
            >
              <span className="text-xs font-extrabold uppercase tracking-wider">Menú</span>
              <div className="flex flex-col gap-1 w-4 sm:w-5 justify-center items-center">
                <span className="h-0.5 w-4 sm:w-5 rounded-full bg-petroleo" />
                <span className="h-0.5 w-3 sm:w-3.5 rounded-full bg-petroleo self-end" />
                <span className="h-0.5 w-4 sm:w-5 rounded-full bg-petroleo" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* ── OVERLAY OSCURO CON BACKDROP BLUR ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* ── DRAWER LATERAL (PANEL DESPLEGABLE ELEGANTE) ── */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[min(380px,88vw)] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out border-l border-niebla ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menú lateral de navegación"
        aria-hidden={!open}
      >
        {/* Header del Drawer */}
        <div className="flex items-center justify-between border-b border-niebla/60 p-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 group"
            aria-label="Ir al inicio"
          >
            <div className="h-10 w-10 rounded-xl bg-petroleo p-1.5 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/favicon.svg"
                alt="Logo"
                width={30}
                height={30}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-grafito block leading-none group-hover:text-petroleo transition-colors">
                Qué comer en Loja
              </span>
              <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                Menú de Navegación
              </span>
            </div>
          </Link>

          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-porcelana text-grafito hover:bg-niebla transition"
          >
            ✕
          </button>
        </div>

        {/* Links principales */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block mb-3">
              Explorar la Guía
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold text-petroleo bg-citrico/20 transition hover:bg-citrico/40"
                >
                  <span className="flex items-center gap-2">
                    <span>🏠</span> Inicio
                  </span>
                  <span className="text-petroleo text-xs">→</span>
                </Link>
              </li>
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold text-grafito transition hover:bg-porcelana hover:text-petroleo"
                  >
                    <span>{l.label}</span>
                    <span className="text-muted text-xs">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer del Drawer */}
        <div className="border-t border-niebla/60 bg-porcelana/40 p-6 space-y-3">
          <a
            href="https://wa.me/593988888888?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20Qu%C3%A9%20Comer%20en%20Loja"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-xl bg-petroleo px-4 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#0E2E2E] transition"
          >
            Contacto directo por WhatsApp ↗
          </a>
          <p className="text-center text-[10px] text-muted">
            Directorio y asesoría gastronómica 100% Loja.
          </p>
        </div>
      </aside>
    </>
  );
}
