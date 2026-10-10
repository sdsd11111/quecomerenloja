import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const EXPLORAR_LINKS = [
  { href: "/desayunos-en-loja", label: "Desayunos" },
  { href: "/almuerzos-loja", label: "Almuerzos" },
  { href: "/comida-rapida-loja", label: "Dónde cenar" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-niebla bg-[#F5F6F1] text-grafito transition-colors">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))] pb-8 pt-12">
        <div className="grid gap-8 md:grid-cols-12 md:gap-8 items-start">

          {/* COLUMNA 1: LOGO DE MARCA + DESCRIPTOR COMPACTO */}
          <div className="md:col-span-5">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="Qué comer en Loja, inicio">
              {/* Badge del símbolo oficial Q plato */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-petroleo p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/favicon.svg"
                  alt="Símbolo Qué Comer en Loja"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-grafito leading-none group-hover:text-petroleo transition-colors">
                  Qué comer <span className="text-petroleo">en Loja</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted mt-0.5">
                  Guía Gastronómica Local
                </span>
              </div>
            </Link>

            <p className="mt-3 max-w-[320px] text-xs leading-relaxed text-muted">
              Plataforma de descubrimiento gastronómico de Loja, Ecuador. Descubre dónde desayunar, almorzar y cenar sin intermediarios.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-niebla bg-white px-3 py-1 text-[11px] font-semibold text-petroleo shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-petroleo" />
              100% Sabor lojano · Sin comisiones
            </div>
          </div>

          {/* COLUMNA 2: EXPLORAR COMPACTO (Desayuno, Almuerzo, Dónde cenar, Blog) */}
          <nav className="md:col-span-3 md:col-start-7" aria-label="Navegación del pie de página">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
              Explorar
            </p>
            <ul className="space-y-2">
              {EXPLORAR_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* COLUMNA 3: ECOSISTEMA (SIN guialoja.com) */}
          <div className="md:col-span-3">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
              Ecosistema
            </p>
            <ul className="space-y-2">
              {SITE.sisters.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BARRA INFERIOR DE DERECHOS COMPACTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-niebla pt-5 text-[11px] text-muted md:flex-row">
          <div>
            Diseñado por{" "}
            <a
              href="https://cesarreyesjaramillo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-petroleo hover:underline"
            >
              Cesar Reyes
            </a>{" "}
            | Que comer en loja {currentYear} Loja-Ecuador
          </div>

          <div className="flex items-center gap-4">
            <Link href="/para-negocios" className="font-semibold text-petroleo hover:underline">
              Anunciar mi restaurante
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
