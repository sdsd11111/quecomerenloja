import Link from "next/link";
import Image from "next/image";
import { NAV, SITE } from "@/lib/site";

const FOOTER_LINKS = [
  ...NAV,
  { href: "/para-negocios", label: "Para negocios" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-niebla bg-[#F5F6F1] text-grafito transition-colors">
      <div className="mx-auto w-[min(1180px,calc(100%-40px))] pb-10 pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">

          {/* COLUMNA 1: LOGO DE MARCA + DESCRIPTOR */}
          <div className="md:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="Qué comer en Loja, inicio">
              {/* Badge del símbolo oficial Q plato */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-petroleo p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/favicon.svg"
                  alt="Símbolo Qué Comer en Loja"
                  width={34}
                  height={34}
                  className="h-full w-full object-contain"
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

            <p className="mt-4 max-w-[320px] text-xs leading-relaxed text-muted">
              Plataforma de descubrimiento gastronómico de Loja, Ecuador. Descubre dónde comer repe, cecina, café de especialidad y comida tradicional sin intermediarios.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-niebla bg-white px-3 py-1 text-[11px] font-semibold text-petroleo shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-petroleo" />
              100% Sabor lojano · Sin comisiones
            </div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <nav className="md:col-span-2 md:col-start-6" aria-label="Navegación del pie de página">
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
              Explorar
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((l) => (
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

          {/* COLUMNA 3: PLATOS TÍPICOS */}
          <div className="md:col-span-3">
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
              Platos Típicos Top
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/platos/repe-lojano" className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4">
                  🥣 Repe Lojano (5K b/m)
                </Link>
              </li>
              <li>
                <Link href="/platos/cecina-lojana" className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4">
                  🥩 Cecina Lojana a la brasa
                </Link>
              </li>
              <li>
                <Link href="/platos/tamales-lojanos" className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4">
                  🌽 Tamales y Humitas
                </Link>
              </li>
              <li>
                <Link href="/cafe-de-loja" className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4">
                  ☕ Café de Loja de Especialidad
                </Link>
              </li>
              <li>
                <Link href="/comida-rapida-loja" className="text-xs font-medium text-grafito/80 transition-colors hover:text-petroleo hover:underline underline-offset-4">
                  🍕 Alitas, Pizzas & Noche
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: ECOSISTEMA GUIA LOJA */}
          <div className="md:col-span-2">
            <p className="mb-4 text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
              Ecosistema
            </p>
            <ul className="space-y-2.5">
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

        {/* BARRA INFERIOR DE DERECHOS */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-niebla pt-6 text-[11px] text-muted md:flex-row">
          <span>© 2026 GuIAloja · quecomerenloja.com · Loja, Ecuador</span>
          <div className="flex items-center gap-4">
            <Link href="/para-negocios" className="font-semibold text-petroleo hover:underline">
              Anunciar mi restaurante
            </Link>
            <span>·</span>
            <span>Contacto directo a WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
