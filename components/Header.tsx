"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 h-[72px] border-b border-ink/5 bg-cream md:h-[84px]">
      <nav className="mx-auto flex h-full w-[min(1180px,calc(100%-40px))] items-center justify-between gap-6" aria-label="Navegación principal">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Qué comer en Loja, inicio" onClick={() => setOpen(false)}>
          <span aria-hidden className="grid h-[42px] w-9 place-items-center rounded-[50%_50%_45%_45%] border border-[#cdbb9b] text-[27px] text-clay">♧</span>
          <span className="leading-tight">
            <span className="block font-serif text-xl font-semibold tracking-tight">
              qué comer <b className="font-semibold text-clay">en loja.</b>
            </span>
            <span className="mt-1 block text-[8px] uppercase tracking-[2.4px] text-muted">La ruta gastronómica · GuIAloja</span>
          </span>
        </Link>

        <button
          className="rounded-md border border-line px-3 py-1.5 md:hidden"
          aria-label="Abrir navegación"
          aria-controls="nav-links"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <div
          id="nav-links"
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[72px] flex-col items-stretch gap-4 bg-cream p-6 shadow-lg md:static md:flex md:flex-row md:items-center md:gap-7 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs font-semibold hover:text-clay" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/para-negocios" className="inline-flex items-center justify-center rounded-lg bg-clay px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5" onClick={() => setOpen(false)}>
            Soy un negocio ↗
          </Link>
        </div>
      </nav>
    </header>
  );
}
