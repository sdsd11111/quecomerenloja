'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AliadoDb } from '@/lib/aliados-db';

type MomentoFilter = '' | 'desayuno' | 'almuerzo' | 'cena';
type CategoriaFilter = '' | 'tradicional' | 'cafe' | 'noche' | 'alta';

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
    id: 'plaza-1',
    slotNumero: 'Vacante 01 · Prioridad',
    categoria: 'tradicional',
    momento: 'almuerzo',
    tipoNegocio: 'Restaurante de Repe Lojano & Cecina',
    zona: 'Centro Histórico / San Sebastián',
    platoEstrella: 'Repe Blanco con Quesillo & Cecina Asada',
    horario: '11:30 AM – 04:00 PM',
    descripcion: 'Cupo reservado para la hueca o restaurante referente de cocina tradicional lojana.',
    badgeBeneficio: 'Posición Insignia',
  },
  {
    id: 'plaza-2',
    slotNumero: 'Vacante 02',
    categoria: 'cafe',
    momento: 'desayuno',
    tipoNegocio: 'Cafetería de Especialidad & Tamales',
    zona: 'Calle Lourdes / 24 de Mayo',
    platoEstrella: 'Café de Altura premiado + Tamales & Humitas',
    horario: '07:00 AM – 08:30 PM',
    descripcion: 'Espacio para cafetería con café arábico de origen lojano y desayunos tradicionales.',
    badgeBeneficio: 'Desayunos & Café',
  },
  {
    id: 'plaza-3',
    slotNumero: 'Vacante 03',
    categoria: 'tradicional',
    momento: 'almuerzo',
    tipoNegocio: 'Comedor de Almuerzos & Menú Diario',
    zona: 'Sector Parque Central / Sucre',
    platoEstrella: 'Almuerzo Ejecutivo & Sopa de Arveja con Guineo',
    horario: '12:00 PM – 03:30 PM',
    descripcion: 'Vacante para restaurante de almuerzos diarios. Conexión directa con oficinistas y visitantes.',
    badgeBeneficio: 'Almuerzos Ejecutivos',
  },
];

interface Props {
  initialCategory?: string;
  aliadosReales?: AliadoDb[];
}

export function ExplorerPlazas({ initialCategory = '', aliadosReales = [] }: Props) {
  const [q, setQ] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'' | 'GASTRONOMIA' | 'CAFETERIA'>('');

  const filteredAliados = useMemo(() => {
    return aliadosReales.filter((a) => {
      const matchTipo = !tipoFiltro || a.tipo === tipoFiltro;
      if (!matchTipo) return false;

      if (!q.trim()) return true;
      const search = q.toLowerCase();
      return (
        a.nombre.toLowerCase().includes(search) ||
        (a.descripcion || '').toLowerCase().includes(search) ||
        (a.ubicacion || '').toLowerCase().includes(search) ||
        (a.servicios || '').toLowerCase().includes(search)
      );
    });
  }, [aliadosReales, tipoFiltro, q]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
      active
        ? 'border-petroleo bg-petroleo text-white shadow-xs'
        : 'border-niebla bg-white text-grafito/80 hover:border-petroleo hover:text-petroleo'
    }`;

  return (
    <div>
      {/* ── BARRA DE BÚSQUEDA Y FILTROS ── */}
      <div className="rounded-2xl border border-niebla bg-white p-4 sm:p-6 shadow-sm">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2.5 sm:gap-3">
          <span aria-hidden className="text-lg sm:text-xl text-petroleo">⌕</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, plato o sector (ej: repe, cecina, San Sebastián)..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-1.5 sm:py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} className="text-xs text-muted hover:text-grafito px-2 py-1">
              ✕
            </button>
          )}
        </form>

        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 border-t border-niebla/60 pt-3 sm:pt-4">
          <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wider text-muted hidden sm:inline">
            TIPO:
          </span>
          <button
            type="button"
            className={chip(tipoFiltro === '')}
            onClick={() => setTipoFiltro('')}
          >
            Todos ({aliadosReales.length})
          </button>
          <button
            type="button"
            className={chip(tipoFiltro === 'GASTRONOMIA')}
            onClick={() => setTipoFiltro(tipoFiltro === 'GASTRONOMIA' ? '' : 'GASTRONOMIA')}
          >
            🍽️ Restaurantes ({aliadosReales.filter((a) => a.tipo === 'GASTRONOMIA').length})
          </button>
          <button
            type="button"
            className={chip(tipoFiltro === 'CAFETERIA')}
            onClick={() => setTipoFiltro(tipoFiltro === 'CAFETERIA' ? '' : 'CAFETERIA')}
          >
            ☕ Cafeterías ({aliadosReales.filter((a) => a.tipo === 'CAFETERIA').length})
          </button>

          {(tipoFiltro || q) && (
            <button
              type="button"
              onClick={() => {
                setQ('');
                setTipoFiltro('');
              }}
              className="text-[11px] font-semibold text-petroleo hover:underline ml-auto"
            >
              Restablecer ↻
            </button>
          )}
        </div>
      </div>

      {/* ── GRID DE ALIADOS REALES DE LA BASE DE DATOS ── */}
      {filteredAliados.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAliados.map((aliado) => {
            const telLimpio = (aliado.telefono || '').replace(/\D/g, '');
            const whatsappUrl = telLimpio
              ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                  `Hola ${aliado.nombre}, los vi en Qué Comer en Loja y deseo información sobre sus platos y reservas.`
                )}`
              : null;

            return (
              <article
                key={aliado.id}
                className="group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-6 shadow-sm transition-all duration-300 hover:border-petroleo hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Badge de tipo y destacado */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-900 uppercase">
                      {aliado.tipo === 'CAFETERIA' ? '☕ Cafetería Oficial' : '🍽️ Restaurante Oficial'}
                    </span>
                    {aliado.destacado && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-800">
                        ★ Aliado Destacado
                      </span>
                    )}
                  </div>

                  {/* Imagen o ícono */}
                  <div className="my-5 flex items-center gap-4">
                    {aliado.imagenUrl ? (
                      <img
                        src={aliado.imagenUrl}
                        alt={aliado.nombre}
                        className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-niebla shadow-xs group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-niebla bg-porcelana text-3xl shadow-xs group-hover:scale-105 transition-transform">
                        {aliado.tipo === 'CAFETERIA' ? '☕' : '🍽️'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-grafito leading-snug group-hover:text-petroleo transition-colors">
                        {aliado.nombre}
                      </h3>
                      <span className="text-xs text-muted block mt-0.5">
                        📍 {aliado.ubicacion}
                      </span>
                    </div>
                  </div>

                  {/* Precios y Servicios */}
                  <div className="rounded-xl bg-porcelana/60 p-3.5 border border-niebla/50 space-y-1.5 text-xs mb-4">
                    {aliado.rangoPrecio && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted">Rango de precio:</span>
                        <strong className="text-grafito font-semibold">{aliado.rangoPrecio}</strong>
                      </div>
                    )}
                    {aliado.servicios && (
                      <div className="flex items-start justify-between gap-2 border-t border-niebla/40 pt-1.5">
                        <span className="text-muted">Servicios:</span>
                        <span className="font-medium text-petroleo text-right line-clamp-1">{aliado.servicios}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-muted line-clamp-3">
                    {aliado.descripcion}
                  </p>
                </div>

                {/* Botón directo a WhatsApp o Maps */}
                <div className="mt-6 border-t border-niebla/60 pt-4 flex flex-col gap-2">
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                    >
                      <span>💬</span>
                      <span>Contactar por WhatsApp</span>
                    </a>
                  ) : (
                    <Link
                      href="/para-negocios"
                      className="flex w-full items-center justify-center rounded-xl bg-petroleo px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#0E2E2E]"
                    >
                      Consultar Información
                    </Link>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-muted px-1">
                    {aliado.mapaUrl && (
                      <a
                        href={aliado.mapaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-petroleo hover:underline font-semibold"
                      >
                        📍 Ver en Google Maps
                      </a>
                    )}
                    {aliado.redesUrl && (
                      <a
                        href={aliado.redesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-petroleo hover:underline font-semibold ml-auto"
                      >
                        📸 Instagram / Redes
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-niebla bg-white p-12 text-center">
          <span className="text-4xl block mb-2">🍽️</span>
          <h3 className="font-serif text-xl font-bold text-grafito">No se encontraron aliados para esta búsqueda</h3>
          <p className="mt-1 text-xs text-muted max-w-md mx-auto">
            Intenta borrar los términos de búsqueda para ver todos los restaurantes y cafeterías registradas.
          </p>
          <button
            onClick={() => {
              setQ('');
              setTipoFiltro('');
            }}
            className="mt-4 rounded-xl bg-petroleo px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition"
          >
            Ver todos los aliados
          </button>
        </div>
      )}

      {/* ── SECCIÓN DE VACANTES DISPONIBLES PARA NUEVOS ALIADOS ── */}
      <div className="mt-16 border-t border-niebla pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
              ★ ESPACIOS DISPONIBLES
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-grafito">
              ¿Tu restaurante aún no está en la guía? Plazas Comerciales Disponibles
            </h2>
            <p className="text-xs text-muted mt-1 max-w-2xl">
              Postula tu restaurante o cafetería para tener tu ficha oficial con contacto directo a tu WhatsApp.
            </p>
          </div>
          <Link
            href="/para-negocios"
            className="rounded-xl bg-petroleo px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition self-start md:self-auto"
          >
            Postular mi negocio →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLAZAS_DISPONIBLES.map((plaza) => (
            <div
              key={plaza.id}
              className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-porcelana/30 p-6 transition hover:border-petroleo hover:bg-white hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">{plaza.slotNumero}</span>
                  <span className="rounded-full bg-citrico/30 px-2 py-0.5 text-[9px] font-bold text-petroleo">
                    {plaza.badgeBeneficio}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-grafito mt-3 group-hover:text-petroleo transition-colors">
                  {plaza.tipoNegocio}
                </h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">{plaza.descripcion}</p>
              </div>
              <div className="mt-5 border-t border-niebla pt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-petroleo">Cupo disponible</span>
                <Link
                  href="/para-negocios"
                  className="rounded-lg bg-citrico px-3 py-1.5 text-[11px] font-bold text-petroleo transition hover:brightness-105"
                >
                  Postular →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
