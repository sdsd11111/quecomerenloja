"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type MomentoFilter = "" | "desayuno" | "almuerzo" | "cena";
type CategoriaFilter = "" | "tradicional" | "cafe" | "noche" | "alta";

interface PlazaAliado {
  id: string;
  slotNumero: string;
  categoria: CategoriaFilter;
  momento: MomentoFilter;
  tipoNegocio: string;
  zona: string;
  platoEstrella: string;
  horario: string;
  descripcion: string;
  badgeBeneficio: string;
}

const PLAZAS_DISPONIBLES: PlazaAliado[] = [
  {
    id: "plaza-1",
    slotNumero: "Vacante 01 · Prioridad",
    categoria: "tradicional",
    momento: "almuerzo",
    tipoNegocio: "Restaurante de Repe Lojano & Cecina",
    zona: "Centro Histórico / San Sebastián",
    platoEstrella: "Repe Blanco con Quesillo & Cecina Asada",
    horario: "11:30 AM – 04:00 PM",
    descripcion: "Cupo reservado para la hueca o restaurante referente de cocina tradicional lojana. Posicionamiento en búsquedas de 'repe lojano' (5.000 búsquedas/mes).",
    badgeBeneficio: "Posición Insignia",
  },
  {
    id: "plaza-2",
    slotNumero: "Vacante 02",
    categoria: "cafe",
    momento: "desayuno",
    tipoNegocio: "Cafetería de Especialidad & Tamales",
    zona: "Calle Lourdes / 24 de Mayo",
    platoEstrella: "Café de Altura premiado + Tamales & Humitas",
    horario: "07:00 AM – 08:30 PM",
    descripcion: "Espacio para cafetería con café arábico de origen lojano y desayunos tradicionales. Contacto directo por WhatsApp sin comisiones.",
    badgeBeneficio: "Desayunos & Café",
  },
  {
    id: "plaza-3",
    slotNumero: "Vacante 03",
    categoria: "tradicional",
    momento: "almuerzo",
    tipoNegocio: "Comedor de Almuerzos & Menú Diario",
    zona: "Sector Parque Central / Sucre",
    platoEstrella: "Almuerzo Ejecutivo & Sopa de Arveja con Guineo",
    horario: "12:00 PM – 03:30 PM",
    descripcion: "Vacante para restaurante de almuerzos diarios. Conexión directa con oficinistas y visitantes que buscan dónde almorzar hoy en Loja.",
    badgeBeneficio: "Almuerzos Ejecutivos",
  },
  {
    id: "plaza-4",
    slotNumero: "Vacante 04",
    categoria: "noche",
    momento: "cena",
    tipoNegocio: "Pizzería Artesanal al Horno de Leña",
    zona: "Av. Universitaria / Zamora Huayco",
    platoEstrella: "Pizzas Napolitanas & Delivery",
    horario: "05:30 PM – 11:00 PM",
    descripcion: "Cupo oficial para pizzería destacada en Loja. Alta demanda nocturna de jueves a domingo en búsquedas locales de pizzas y pedidos.",
    badgeBeneficio: "Cenas & Delivery",
  },
  {
    id: "plaza-5",
    slotNumero: "Vacante 05",
    categoria: "noche",
    momento: "cena",
    tipoNegocio: "Local de Alitas BBQ & Cenas Rápidas",
    zona: "Centro / Sector La Pileta",
    platoEstrella: "Alitas con Salsas Artesanales & Papas",
    horario: "05:00 PM – 11:30 PM",
    descripcion: "Vacante comercial para negocio de alitas, smash burgers o comida nocturna. Enlace directo al WhatsApp de tu local.",
    badgeBeneficio: "Comida Rápida & Noche",
  },
  {
    id: "plaza-6",
    slotNumero: "Vacante 06",
    categoria: "alta",
    momento: "cena",
    tipoNegocio: "Restaurante Gourmet & Cocina de Autor",
    zona: "San Sebastián / Sector El Valle",
    platoEstrella: "Cortes Finos, Mariscos & Gastronomía Fusión",
    horario: "12:30 PM – 10:30 PM",
    descripcion: "Espacio exclusivo para restaurante de alta cocina o veladas especiales en Loja. Vitrina para turistas gastronómicos y eventos.",
    badgeBeneficio: "Perfil Premium Verificado",
  },
];

interface Props {
  initialCategory?: string;
}

export function ExplorerPlazas({ initialCategory = "" }: Props) {
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState<CategoriaFilter>(
    (initialCategory as CategoriaFilter) || ""
  );
  const [momento, setMomento] = useState<MomentoFilter>("");

  const filteredPlazas = useMemo(() => {
    return PLAZAS_DISPONIBLES.filter((p) => {
      const matchQ =
        !q.trim() ||
        p.tipoNegocio.toLowerCase().includes(q.toLowerCase()) ||
        p.platoEstrella.toLowerCase().includes(q.toLowerCase()) ||
        p.zona.toLowerCase().includes(q.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(q.toLowerCase());

      const matchCat = !categoria || p.categoria === categoria;
      const matchMom = !momento || p.momento === momento;

      return matchQ && matchCat && matchMom;
    });
  }, [q, categoria, momento]);

  const reset = () => {
    setQ("");
    setCategoria("");
    setMomento("");
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[11px] font-semibold transition ${
      active
        ? "border-petroleo bg-petroleo text-white shadow-xs"
        : "border-niebla bg-white text-grafito/80 hover:border-petroleo hover:text-petroleo"
    }`;

  return (
    <div>
      {/* ── BARRA DE BÚSQUEDA Y FILTROS DE PLAZAS ── */}
      <div className="rounded-2xl border border-niebla bg-white p-6 shadow-sm">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
          <span aria-hidden className="text-xl text-petroleo">⌕</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar plazas por tipo de cocina, plato o sector… (ej: cecina, pizza, centro)"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-xs md:text-sm outline-none placeholder:text-muted"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="text-xs text-muted hover:text-grafito">
              Limpiar
            </button>
          )}
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-niebla/60 pt-4">
          <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            MOMENTO:
          </span>
          <button
            type="button"
            className={chip(momento === "desayuno")}
            onClick={() => setMomento(momento === "desayuno" ? "" : "desayuno")}
          >
            ☕ Desayunos
          </button>
          <button
            type="button"
            className={chip(momento === "almuerzo")}
            onClick={() => setMomento(momento === "almuerzo" ? "" : "almuerzo")}
          >
            🥣 Almuerzos
          </button>
          <button
            type="button"
            className={chip(momento === "cena")}
            onClick={() => setMomento(momento === "cena" ? "" : "cena")}
          >
            🍕 Cenas
          </button>

          <span className="mx-2 text-niebla hidden sm:inline">|</span>

          <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            TIPO:
          </span>
          <button
            type="button"
            className={chip(categoria === "tradicional")}
            onClick={() => setCategoria(categoria === "tradicional" ? "" : "tradicional")}
          >
            Tradicional
          </button>
          <button
            type="button"
            className={chip(categoria === "cafe")}
            onClick={() => setCategoria(categoria === "cafe" ? "" : "cafe")}
          >
            Cafeterías
          </button>
          <button
            type="button"
            className={chip(categoria === "noche")}
            onClick={() => setCategoria(categoria === "noche" ? "" : "noche")}
          >
            Comida Rápida
          </button>
          <button
            type="button"
            className={chip(categoria === "alta")}
            onClick={() => setCategoria(categoria === "alta" ? "" : "alta")}
          >
            Gourmet
          </button>

          {(categoria || momento || q) && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-semibold text-petroleo hover:underline ml-auto"
            >
              Restablecer filtros ↻
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted pt-1">
          <span>
            Mostrando <strong>{filteredPlazas.length}</strong> {filteredPlazas.length === 1 ? "plaza vacante" : "plazas vacantes disponibles"} para aliados gastronómicos en Loja.
          </span>
        </div>
      </div>

      {/* ── GRID DE PLAZAS DISPONIBLES CON LOGO Y POSTULACIÓN ── */}
      {filteredPlazas.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlazas.map((plaza) => (
            <article
              key={plaza.id}
              className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-white p-6 transition-all duration-300 hover:border-petroleo hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Cabecera del slot */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                    {plaza.slotNumero}
                  </span>
                  <span className="rounded-full bg-citrico/30 px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo">
                    {plaza.badgeBeneficio}
                  </span>
                </div>

                {/* Ícono de vacante / Logo genérico de plaza libre */}
                <div className="my-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-niebla bg-porcelana text-2xl shadow-xs group-hover:scale-105 transition-transform group-hover:border-petroleo">
                    🍽️
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-grafito leading-snug group-hover:text-petroleo transition-colors">
                      {plaza.tipoNegocio}
                    </h3>
                    <span className="text-xs text-muted block mt-0.5">
                      📍 {plaza.zona}
                    </span>
                  </div>
                </div>

                {/* Datos del plato y horario */}
                <div className="rounded-xl bg-porcelana/60 p-3.5 border border-niebla/50 space-y-1.5 text-xs mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted">Especialidad:</span>
                    <strong className="text-grafito text-right font-semibold">{plaza.platoEstrella}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-niebla/40 pt-1.5">
                    <span className="text-muted">Horario ideal:</span>
                    <span className="font-medium text-petroleo">{plaza.horario}</span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted">
                  {plaza.descripcion}
                </p>
              </div>

              {/* Botón de acción para postular */}
              <div className="mt-6 border-t border-niebla/60 pt-4">
                <Link
                  href="/para-negocios"
                  className="flex w-full items-center justify-center rounded-xl bg-petroleo px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0E2E2E] hover:shadow-md"
                >
                  Postular mi restaurante a este cupo →
                </Link>
                <span className="block text-center text-[10px] text-muted mt-2">
                  Verificación directa · Sin comisiones de delivery
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-niebla bg-white p-12 text-center">
          <span className="text-4xl block mb-2">🍽️</span>
          <h3 className="font-serif text-xl font-bold text-grafito">No hay vacantes para este filtro</h3>
          <p className="mt-1 text-xs text-muted max-w-md mx-auto">
            Prueba seleccionando otro momento del día o restableciendo los filtros para ver todas las plazas disponibles.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-xl bg-petroleo px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition"
          >
            Ver todas las plazas disponibles
          </button>
        </div>
      )}

      {/* Banner inferior de invitación B2B */}
      <div className="mt-12 rounded-3xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
        <div className="max-w-[620px]">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">
            CONVOCATORIA PARA RESTAURANTES EN LOJA
          </span>
          <h3 className="mt-2 text-2xl font-bold font-serif">
            ¿Tu restaurante prepara uno de los mejores platos de la ciudad?
          </h3>
          <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
            Súmate a la guía gastronómica que conecta a comensales y turistas directamente con tu WhatsApp. Sin aplicaciones pesadas ni comisiones por pedido.
          </p>
        </div>
        <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
          <Link
            href="/para-negocios"
            className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
          >
            Conocer planes y postular →
          </Link>
        </div>
      </div>
    </div>
  );
}
