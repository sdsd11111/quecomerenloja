import type { Metadata } from "next";
import Link from "next/link";
import { Wrap } from "@/components/PageHero";
import { getAllPlatos } from "@/lib/platos-db";

export const metadata: Metadata = {
  title: "Platos Típicos y Comida en Loja | Guía Gastronómica Completa",
  description:
    "Descubre los 50 platos más buscados y representativos de Loja, Ecuador: desde el tradicional repe lojano y cecina, hasta mariscos frescos, asados, pizzas y cafeterías.",
  alternates: { canonical: "https://quecomerenloja.com/platos" },
  openGraph: {
    title: "Catálogo de Platos Típicos y Gastronomía en Loja",
    description:
      "Explora dónde comer cada plato en Loja: precios de cartas reales, recetas tradicionales y restaurantes recomendados.",
    url: "https://quecomerenloja.com/platos",
  },
};

export const revalidate = 86400;

export default async function PlatosHubPage() {
  const platos = await getAllPlatos();

  // Agrupar por sección
  const secciones = Array.from(new Set(platos.map((p) => p.seccion)));

  return (
    <div className="bg-porcelana min-h-screen">
      {/* ── HERO HUB ── */}
      <section className="bg-petroleo text-white py-16 md:py-20 border-b border-niebla">
        <Wrap>
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-citrico mb-3">
              GUÍA GASTRONÓMICA OFICIAL DE LOJA
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              ¿Qué comer en Loja? Catálogo Completo de Platos
            </h1>
            <p className="mt-4 text-sm md:text-base text-porcelana/80 leading-relaxed">
              Explora más de 50 platos ordenados por intención de búsqueda real en la ciudad.
              Descubre qué restaurantes los preparan, sus precios observados y dónde probar las mejores recetas.
            </p>
          </div>
        </Wrap>
      </section>

      {/* ── BREADCRUMB ── */}
      <div className="border-b border-niebla bg-white">
        <Wrap className="py-3 text-xs text-muted">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-petroleo">Platos Típicos y Comida</li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── LISTADO POR SECCIONES ── */}
      <section className="py-16">
        <Wrap className="space-y-16">
          {secciones.map((sec) => {
            const platosSec = platos.filter((p) => p.seccion === sec);
            return (
              <div key={sec}>
                <div className="border-b border-niebla/80 pb-3 mb-6 flex items-baseline justify-between flex-wrap gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-grafito">
                    {sec}
                  </h2>
                  <span className="text-xs text-muted font-medium">
                    {platosSec.length} platos catalogados
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {platosSec.map((plato) => (
                    <Link
                      key={plato.id}
                      href={`/platos/${plato.slug}`}
                      className="group rounded-2xl border border-niebla bg-white p-5 shadow-2xs hover:border-petroleo/40 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-petroleo uppercase bg-porcelana px-2.5 py-0.5 rounded-full border border-niebla/60">
                            {plato.seccion}
                          </span>
                          <span className="text-xs font-semibold text-muted">
                            ~{plato.volumen_busqueda} búsquedas/mes
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-grafito group-hover:text-petroleo transition">
                          {plato.nombre}
                        </h3>

                        <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                          {plato.descripcion_corta}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-niebla/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-petroleo">
                          {plato.rango_precio_loja || "Ver carta"}
                        </span>
                        <span className="font-semibold text-grafito group-hover:translate-x-0.5 transition">
                          Dónde comer →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </Wrap>
      </section>
    </div>
  );
}
