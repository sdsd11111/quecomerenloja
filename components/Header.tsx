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
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-niebla/60 py-3"
            : "bg-white/90 backdrop-blur-sm border-b border-niebla/40 py-4"
        }`}
      >
        <nav
          className="mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* ── LOGO ELEGANTE (FAVICON BADGE + TIPOGRAFÍA) ── */}
          <Link
            href="/"
            className="group flex items-center gap-3 shrink-0"
            aria-label="Qué comer en Loja, inicio"
            onClick={() => setOpen(false)}
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-petroleo p-2 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-petroleo/30">
              <Image
                src="/favicon.svg"
                alt="Símbolo Qué Comer en Loja"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-grafito leading-none group-hover:text-petroleo transition-colors">
                Qué comer <span className="text-petroleo">en Loja</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-muted mt-0.5">
                Guía Gastronómica Local
              </span>
            </div>
          </Link>

          {/* ── ACCIONES A LA DERECHA: CTA RÁPIDO + BOTÓN MENÚ DESPLEGABLE ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/para-negocios"
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-petroleo px-4 py-2.5 text-[12px] font-bold tracking-wide text-white shadow-sm transition hover:bg-[#0E2E2E] hover:shadow-md hover:-translate-y-0.5"
            >
              Soy un negocio ↗
            </Link>

            {/* BOTÓN ÚNICO QUE ACTIVA EL DRAWER LATERAL */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú de navegación"
              className="flex items-center gap-2.5 rounded-xl border border-niebla bg-porcelana/80 px-4 py-2.5 text-petroleo shadow-sm transition hover:border-petroleo hover:bg-white active:scale-95"
            >
              <span className="text-xs font-extrabold uppercase tracking-wider">Menú</span>
              <div className="flex flex-col gap-1 w-5 justify-center items-center">
                <span className="h-0.5 w-5 rounded-full bg-petroleo" />
                <span className="h-0.5 w-3.5 rounded-full bg-petroleo self-end" />
                <span className="h-0.5 w-5 rounded-full bg-petroleo" />
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-petroleo p-1.5 flex items-center justify-center shadow-sm">
              <Image
                src="/favicon.svg"
                alt="Logo"
                width={30}
                height={30}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-grafito block leading-none">
                Qué comer en Loja
              </span>
              <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                Menú de Navegación
              </span>
            </div>
          </div>

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

          {/* Platos Populares rápidos */}
          <div className="border-t border-niebla/60 pt-5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted block mb-3">
              Platos Típicos Top
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/platos/repe-lojano"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-niebla bg-porcelana/50 p-2.5 text-xs font-semibold text-grafito hover:border-petroleo transition text-center"
              >
                🥣 Repe Lojano
              </Link>
              <Link
                href="/platos/cecina-lojana"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-niebla bg-porcelana/50 p-2.5 text-xs font-semibold text-grafito hover:border-petroleo transition text-center"
              >
                🥩 Cecina
              </Link>
              <Link
                href="/platos/tamales-lojanos"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-niebla bg-porcelana/50 p-2.5 text-xs font-semibold text-grafito hover:border-petroleo transition text-center"
              >
                🌽 Tamales
              </Link>
              <Link
                href="/cafe-de-loja"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-niebla bg-porcelana/50 p-2.5 text-xs font-semibold text-grafito hover:border-petroleo transition text-center"
              >
                ☕ Café de Loja
              </Link>
            </div>
          </div>
        </div>

        {/* Footer del Drawer: CTA para restaurantes */}
        <div className="border-t border-niebla/60 bg-porcelana/40 p-6 space-y-3">
          <Link
            href="/para-negocios"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-xl bg-petroleo px-4 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#0E2E2E] transition"
          >
            ¿Tienes un restaurante? Súmate aquí ↗
          </Link>
          <p className="text-center text-[10px] text-muted">
            Directorio y asesoría gastronómica 100% Loja.
          </p>
        </div>
      </aside>
    </>
  );
}
