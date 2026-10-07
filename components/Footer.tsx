import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto w-[min(1180px,calc(100%-40px))] pb-8 pt-12">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <Link href="/" className="font-serif text-2xl font-semibold text-clay">quecomerenloja.com</Link>
          <p className="mt-2 text-xs text-muted">Una iniciativa de GuIAloja — Loja, Ecuador.</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
            {[...NAV, { href: "/para-negocios", label: "Para negocios" }, { href: "/contacto", label: "Contacto" }].map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <nav className="flex flex-col gap-2.5 text-xs" aria-label="Ecosistema GuIAloja">
          {SITE.sisters.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.label} ↗</a>
          ))}
        </nav>
      </div>
      <div className="mt-8 flex flex-col justify-between gap-2 border-t border-line pt-5 text-[10px] text-muted md:flex-row">
        <span>© 2026 GuIAloja. Todos los derechos reservados. Loja, Ecuador.</span>
        <span>Loja · Vilcabamba · Saraguro · Catamayo · Zamora · Macará</span>
      </div>
    </footer>
  );
}
