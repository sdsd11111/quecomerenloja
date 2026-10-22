import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, Wrap } from "@/components/PageHero";
import { getAllPlatos } from "@/lib/platos-db";
import { getAliadosActivos } from "@/lib/aliados-db";
import { BuscadorHome } from "@/components/BuscadorHome";

export const metadata: Metadata = {
  title: "Buscador Gastronómico de Loja | Platos, Restaurantes y Qué Comer Hoy",
  description: "Encuentra dónde comer en Loja: busca entre más de 50 platos tradicionales, parihuelas, cecina, repe y restaurantes aliados con menú de hoy.",
  alternates: { canonical: "/buscar" },
};

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; tipo?: string; momento?: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const { q = "", tipo = "todos", momento = "" } = await searchParams;

  const [platos, aliados] = await Promise.all([
    getAllPlatos(),
    getAliadosActivos(),
  ]);

  const queryNorm = q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Filtrado de platos
  const platosFiltrados = platos.filter((p) => {
    if (!queryNorm) return true;
    const nombre = p.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const seccion = p.seccion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const ingredientes = (p.ingredientes_clave || []).join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return nombre.includes(queryNorm) || seccion.includes(queryNorm) || ingredientes.includes(queryNorm);
  });

  // Filtrado de aliados
  const aliadosFiltrados = aliados.filter((a) => {
    if (!queryNorm) return true;
    const nombre = a.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const ubicacion = a.ubicacion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const servicios = (a.servicios || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const platosList = (a.platos || []).join(" ").toLowerCase();
    return (
      nombre.includes(queryNorm) ||
      ubicacion.includes(queryNorm) ||
      servicios.includes(queryNorm) ||
      platosList.includes(queryNorm)
    );
  });

  const totalResultados = platosFiltrados.length + aliadosFiltrados.length;

  return (
    <>
      <PageHero
        eyebrow="MOTOR DE BÚSQUEDA GASTRONÓMICO · LOJA"
        title={
          <>
            Encuentra exactamente <em className="text-[#e1b45f]">lo que se te antoja en Loja</em>
          </>
        }
      >
        Explora más de 50 platos típicos e internacionales, restaurantes aliados verificados y qué pedir hoy con contacto directo a WhatsApp.
      </PageHero>

      <Wrap className="py-8">
        {/* Buscador interactivo integrado */}
        <div className="max-w-3xl mx-auto -mt-14 relative z-20 mb-12">
          <BuscadorHome />
        </div>

        {/* Resumen de búsqueda */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-niebla pb-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-grafito font-serif">
              {q ? (
                <>Resultados para: <span className="text-petroleo">&ldquo;{q}&rdquo;</span></>
              ) : (
                "Catálogo Completo de Sabores y Aliados en Loja"
              )}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Se encontraron <strong>{totalResultados}</strong> resultados ({platosFiltrados.length} platos, {aliadosFiltrados.length} aliados).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/que-comer-hoy"
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 transition shadow-xs flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span>¿Qué comer hoy?</span>
            </Link>
          </div>
        </div>

        {/* ── SECCIÓN 1: PLATOS COINCIDENTES ── */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-petroleo">
                GUÍA DE PLATOS
              </span>
              <h3 className="text-xl font-bold text-grafito mt-0.5">
                Platos Disponibles en Loja ({platosFiltrados.length})
              </h3>
            </div>
            <Link href="/platos" className="text-xs font-bold text-petroleo hover:underline">
              Ver catálogo completo de platos →
            </Link>
          </div>

          {platosFiltrados.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {platosFiltrados.map((plato) => (
                <Link
                  key={plato.id}
                  href={`/platos/${plato.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-5 shadow-xs hover:border-petroleo hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 bg-porcelana">
                      {plato.hero_imagen_url ? (
                        <Image
                          src={plato.hero_imagen_url}
                          alt={plato.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          🍲
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-petroleo border border-white/60">
                        {plato.seccion}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-grafito group-hover:text-petroleo transition-colors">
                      {plato.nombre}
                    </h4>
                    <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                      {plato.descripcion_corta}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-niebla/60 flex items-center justify-between text-xs">
                    <span className="font-semibold text-petroleo">
                      {plato.rango_precio_loja || "Precio accesible"}
                    </span>
                    <span className="font-bold text-petroleo group-hover:translate-x-1 transition-transform">
                      Ver dónde comer →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-niebla bg-porcelana/40 p-8 text-center text-muted text-xs">
              No se hallaron platos específicos para &ldquo;{q}&rdquo;.
            </div>
          )}
        </div>

        {/* ── SECCIÓN 2: RESTAURANTES Y ALIADOS COINCIDENTES ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-petroleo">
                ESTABLECIMIENTOS VERIFICADOS
              </span>
              <h3 className="text-xl font-bold text-grafito mt-0.5">
                Restaurantes & Cafeterías Aliadas ({aliadosFiltrados.length})
              </h3>
            </div>
            <Link href="/restaurantes" className="text-xs font-bold text-petroleo hover:underline">
              Ver directorio de aliados →
            </Link>
          </div>

          {aliadosFiltrados.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aliadosFiltrados.map((aliado) => {
                const telLimpio = (aliado.telefono || "").replace(/\D/g, "");
                const whatsappUrl = telLimpio
                  ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                      `Hola ${aliado.nombre}, los encontré en Qué Comer en Loja y deseo consultar su menú de hoy.`
                    )}`
                  : null;

                return (
                  <article
                    key={aliado.id}
                    className="flex flex-col justify-between rounded-2xl border border-niebla bg-white p-5 shadow-xs hover:border-petroleo transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-900 uppercase">
                          {aliado.tipo === "CAFETERIA" ? "☕ Cafetería" : "🍽️ Restaurante"}
                        </span>
                        {aliado.rangoPrecio && (
                          <span className="text-[11px] font-bold text-petroleo">
                            {aliado.rangoPrecio}
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-grafito">
                        {aliado.nombre}
                      </h4>
                      <p className="text-xs text-muted mt-0.5">📍 {aliado.ubicacion}</p>
                      <p className="text-xs text-muted mt-2.5 line-clamp-3 leading-relaxed">
                        {aliado.descripcion}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-niebla/60 flex flex-col gap-2">
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 text-xs font-bold transition shadow-xs"
                        >
                          <span>💬</span>
                          <span>Consultar Menú por WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-niebla bg-porcelana/40 p-8 text-center text-muted text-xs">
              No se hallaron locales con ese criterio.
            </div>
          )}
        </div>
      </Wrap>
    </>
  );
}
