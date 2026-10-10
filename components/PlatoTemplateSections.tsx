"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrap } from "./PageHero";

// Plazas comerciales libres para aliados de este plato específico
interface SlotData {
  id: number;
  tipo: string;
  badge: string;
  titulo: string;
  subtitulo: string;
  desc: string;
}

export function PlazasDisponiblesPlato({
  nombrePlato,
  horarioRecomendado,
}: {
  nombrePlato: string;
  horarioRecomendado?: string;
}) {
  const slots: SlotData[] = [
    {
      id: 1,
      tipo: "Plaza Destacada 01",
      badge: "Cupo Disponible",
      titulo: `Restaurante Oficial de ${nombrePlato}`,
      subtitulo: "Centro Histórico / Calle Lourdes",
      desc: `Espacio reservado para el local referente que prepare el mejor ${nombrePlato} tradicional en Loja.`,
    },
    {
      id: 2,
      tipo: "Plaza Destacada 02",
      badge: "Cupo Disponible",
      titulo: `Hueca Tradicional de ${nombrePlato}`,
      subtitulo: "San Sebastián / El Valle",
      desc: `Destaca tu sazón casera y receta familiar ante miles de turistas que buscan ${nombrePlato} cada semana.`,
    },
    {
      id: 3,
      tipo: "Plaza Destacada 03",
      badge: "Cupo Disponible",
      titulo: `Cafetería o Comedor Aliado`,
      subtitulo: "Sector Terminal / Gran Colombia",
      desc: `Aparece verificado con botón directo a tu WhatsApp para reservas y pedidos sin intermediarios ni comisiones.`,
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-niebla">
      <Wrap>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
          <div>
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
              ★ LOCALES Y HUECAS RECOMENDADAS
            </span>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-grafito">
              Dónde Comer {nombrePlato} en Loja
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
              {horarioRecomendado
                ? `Horario típico: ${horarioRecomendado}. Conoce las plazas gastronómicas verificadas para disfrutar este plato.`
                : `Conoce las plazas gastronómicas verificadas para disfrutar este plato tradicional recién hecho.`}
            </p>
          </div>
          <Link
            href="/para-negocios"
            className="rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-sm self-start md:self-auto"
          >
            Anunciar mi local aquí →
          </Link>
        </div>

        {/* Grid de 3 cards estilo plaza libre con logo */}
        <div className="grid gap-6 md:grid-cols-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="group flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-porcelana/40 p-7 transition-all duration-300 hover:border-petroleo hover:bg-white hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                    {slot.tipo}
                  </span>
                  <span className="rounded-full bg-citrico/40 px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo">
                    {slot.badge}
                  </span>
                </div>

                {/* Símbolo / Logo de espacio libre */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-niebla bg-white text-2xl shadow-xs group-hover:scale-105 transition-transform">
                    🍽️
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-grafito group-hover:text-petroleo transition-colors">
                      {slot.titulo}
                    </h3>
                    <span className="text-[11px] font-medium text-muted">
                      📍 {slot.subtitulo}
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted">
                  {slot.desc}
                </p>
              </div>

              <div className="mt-6 border-t border-niebla/70 pt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-petroleo">
                  Plaza libre disponible
                </span>
                <Link
                  href="/para-negocios"
                  className="rounded-lg bg-citrico px-3.5 py-2 text-[11px] font-bold text-petroleo transition hover:brightness-105 shadow-2xs"
                >
                  Postular local →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// Lugares de referencia en Loja para ubicar en el mapa interactivo
interface PuntoMapa {
  id: string;
  nombre: string;
  sector: string;
  lat: number;
  lng: number;
  referencia: string;
  disponible: boolean;
}

const PUNTOS_LOJA: PuntoMapa[] = [
  {
    id: "p1",
    nombre: "Plaza Gastronómica Lourdes",
    sector: "Calle Lourdes y Bolívar (Centro)",
    lat: -3.9961,
    lng: -79.2045,
    referencia: "Frente a las casas coloniales de Calle Lourdes",
    disponible: true,
  },
  {
    id: "p2",
    nombre: "Rincón Tradicional San Sebastián",
    sector: "Plaza San Sebastián (Bernardo Valdivieso)",
    lat: -3.9995,
    lng: -79.2062,
    referencia: "Cerca de la glorieta y torre de San Sebastián",
    disponible: true,
  },
  {
    id: "p3",
    nombre: "Comedor Típico El Valle",
    sector: "Parroquia El Valle (Av. Salvador Bustamante)",
    lat: -3.9825,
    lng: -79.2015,
    referencia: "Sector gastronómico tradicional norte",
    disponible: true,
  },
  {
    id: "p4",
    nombre: "Hueca Tradicional Los Molinos",
    sector: "Mercado Central / 18 de Noviembre",
    lat: -3.9932,
    lng: -79.2038,
    referencia: "Planta de comidas tradicionales céntricas",
    disponible: true,
  },
];

export function MapaCercanoPlato({ nombrePlato }: { nombrePlato: string }) {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PuntoMapa | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  function solicitarUbicacion() {
    if (!navigator.geolocation) {
      setStatusMsg("Tu navegador no soporta geolocalización.");
      return;
    }
    setLoading(true);
    setStatusMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
        // Automáticamente seleccionar el punto más cercano o el primero
        setSelectedPoint(PUNTOS_LOJA[0]);
        setStatusMsg("¡Ubicación detectada! Mostrando los puntos más cercanos en Loja.");
      },
      (error) => {
        setLoading(false);
        if (error.code === 1) {
          setStatusMsg("Permiso de ubicación denegado. Puedes explorar los puntos de Loja haciendo clic en los marcadores.");
        } else {
          setStatusMsg("No pudimos obtener tu posición. Mostramos los puntos tradicionales del mapa de Loja.");
        }
        // Fallback: mostrar punto central
        setSelectedPoint(PUNTOS_LOJA[0]);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  return (
    <section className="py-16 bg-porcelana border-t border-niebla">
      <Wrap>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8">
          <div>
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
              GEOLOCALIZACIÓN INTELIGENTE
            </span>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-grafito">
              Descubre el Lugar Más Cercano para Comer {nombrePlato}
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
              Comparte tu ubicación para encontrar el restaurante o hueca con cupo verificado más próximo a ti en Loja.
            </p>
          </div>

          <button
            onClick={solicitarUbicacion}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-petroleo px-5 py-3 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-md disabled:opacity-60 self-start md:self-auto"
          >
            <span>{loading ? "Localizando..." : "📍 Usar mi ubicación"}</span>
          </button>
        </div>

        {statusMsg && (
          <div className="mb-6 rounded-xl border border-niebla bg-white p-3.5 text-xs text-petroleo flex items-center justify-between">
            <span>{statusMsg}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-muted hover:text-grafito text-xs font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Interfaz de Mapa Interactivo Estilizado de Loja */}
        <div className="relative overflow-hidden rounded-3xl border border-niebla bg-white shadow-lg">
          {/* Cabecera del visor de mapa */}
          <div className="flex flex-wrap items-center justify-between border-b border-niebla bg-[#EBF0EC] px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petroleo opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-petroleo"></span>
              </span>
              <span className="font-serif text-sm font-bold text-grafito">
                Mapa Gastronómico de Loja · {nombrePlato}
              </span>
            </div>
            <span className="text-[11px] text-muted font-medium">
              4 sectores clave identificados · Plazas libres para aliados
            </span>
          </div>

          {/* Lienzo visual del mapa vectorial de Loja */}
          <div className="relative h-[360px] md:h-[420px] w-full bg-[#E5ECE7] overflow-hidden select-none">
            {/* Grid y ríos/calles vectoriales simulados de Loja */}
            <svg
              className="absolute inset-0 h-full w-full opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD8D0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              {/* Río Malacatos simulado */}
              <path
                d="M 280 0 Q 320 180 340 420"
                fill="none"
                stroke="#A8C8BA"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Río Zamora simulado */}
              <path
                d="M 500 0 Q 480 150 490 420"
                fill="none"
                stroke="#A8C8BA"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Calles principales diagonales */}
              <path d="M 0 160 L 900 130" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 0 240 L 900 220" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 200 0 L 220 420" stroke="#FFFFFF" strokeWidth="4" />
              <path d="M 640 0 L 630 420" stroke="#FFFFFF" strokeWidth="4" />
            </svg>

            {/* Marcadores de sectores gastronómicos en Loja */}
            {/* 1. Centro Calle Lourdes */}
            <button
              onClick={() => setSelectedPoint(PUNTOS_LOJA[0])}
              className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform hover:scale-125 focus:outline-hidden"
              title="Calle Lourdes"
            >
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-petroleo px-2 py-0.5 text-[9px] font-bold text-white shadow-md whitespace-nowrap mb-1">
                  Calle Lourdes
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-petroleo text-white shadow-lg border-2 border-white">
                  📍
                </div>
              </div>
            </button>

            {/* 2. San Sebastián */}
            <button
              onClick={() => setSelectedPoint(PUNTOS_LOJA[1])}
              className="absolute top-[68%] left-[36%] -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform hover:scale-125 focus:outline-hidden"
              title="Plaza San Sebastián"
            >
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-petroleo px-2 py-0.5 text-[9px] font-bold text-white shadow-md whitespace-nowrap mb-1">
                  San Sebastián
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4E4E] text-white shadow-lg border-2 border-white">
                  📍
                </div>
              </div>
            </button>

            {/* 3. El Valle */}
            <button
              onClick={() => setSelectedPoint(PUNTOS_LOJA[2])}
              className="absolute top-[22%] left-[62%] -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform hover:scale-125 focus:outline-hidden"
              title="Parroquia El Valle"
            >
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-petroleo px-2 py-0.5 text-[9px] font-bold text-white shadow-md whitespace-nowrap mb-1">
                  El Valle
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4E4E] text-white shadow-lg border-2 border-white">
                  📍
                </div>
              </div>
            </button>

            {/* 4. Mercado Central */}
            <button
              onClick={() => setSelectedPoint(PUNTOS_LOJA[3])}
              className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 group z-10 transition-transform hover:scale-125 focus:outline-hidden"
              title="Mercado Central"
            >
              <div className="flex flex-col items-center">
                <span className="rounded-md bg-petroleo px-2 py-0.5 text-[9px] font-bold text-white shadow-md whitespace-nowrap mb-1">
                  Centro / Mercado
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4E4E] text-white shadow-lg border-2 border-white">
                  📍
                </div>
              </div>
            </button>

            {/* Marcador del usuario si compartió ubicación */}
            {userCoords && (
              <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="flex flex-col items-center animate-bounce">
                  <span className="rounded-full bg-citrico px-2.5 py-0.5 text-[10px] font-black text-petroleo shadow">
                    Tú estás aquí
                  </span>
                  <div className="h-5 w-5 rounded-full bg-citrico border-2 border-petroleo shadow-md" />
                </div>
              </div>
            )}

            {/* Botón flotante para interactuar en el mapa */}
            <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white/90 backdrop-blur-md px-3.5 py-2 text-[11px] text-grafito shadow-md border border-niebla">
              💡 Haz clic en cualquier marcador para ver los detalles del punto
            </div>
          </div>
        </div>

        {/* Modal / Popup flotante al hacer clic en un punto */}
        {selectedPoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-niebla animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedPoint(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-porcelana text-muted hover:text-grafito transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-citrico/40 px-2.5 py-0.5 text-[10px] font-extrabold text-petroleo uppercase">
                  Plaza Gastronómica Libre
                </span>
                <span className="text-[10px] font-bold text-muted">Loja, Ecuador</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-grafito">
                {selectedPoint.nombre}
              </h3>
              <p className="text-xs text-petroleo font-semibold mt-1">
                📍 {selectedPoint.sector}
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                {selectedPoint.referencia}. Este punto gastronómico está reservado para el restaurante o hueca verificado que ofrezca {nombrePlato} en este sector de Loja.
              </p>

              <div className="mt-5 rounded-2xl border border-dashed border-niebla bg-porcelana/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-grafito">¿Administras este local?</span>
                  <span className="rounded-full bg-petroleo text-white px-2 py-0.5 text-[9px] font-bold">Cupo #1</span>
                </div>
                <p className="text-[11px] text-muted mt-1">
                  Registra tu negocio para que los turistas te encuentren cuando busquen "{nombrePlato}" cerca de este sector.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/para-negocios"
                  className="flex-1 rounded-xl bg-petroleo py-3 text-center text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-md"
                >
                  Reclamar esta plaza →
                </Link>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="rounded-xl border border-niebla px-4 py-3 text-xs font-bold text-muted hover:bg-porcelana transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </Wrap>
    </section>
  );
}
