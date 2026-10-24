"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrap } from "./PageHero";
import type { PlatoCatalogo } from "@/lib/platos-db";
import type { AliadoDb } from "@/lib/aliados-db";

export interface SplitMomentoMapaProps {
  momento: "desayuno" | "almuerzo" | "cena";
  subtitulo: string;
  titulo: string;
  descripcion: string;
  platos: PlatoCatalogo[];
  aliados: AliadoDb[];
}

interface CoordenadaAliado {
  id: number;
  nombre: string;
  sector: string;
  lat: number;
  lng: number;
  telefono: string | null;
  imagenUrl: string | null;
  rangoPrecio: string | null;
  descripcion: string;
  destacado: boolean;
  distanciaMetros?: number;
}

// Fallbacks de coordenadas según sector típico en Loja
function inferirCoordenadas(ubicacion: string, id: number): { lat: number; lng: number } {
  const u = (ubicacion || "").toLowerCase();
  // Variación leve determinista basada en ID para que los pins no se monten unos sobre otros
  const jitterLat = ((id * 37) % 10 - 5) * 0.00035;
  const jitterLng = ((id * 43) % 10 - 5) * 0.00035;

  if (u.includes("lourdes") || u.includes("bolívar") || u.includes("bolivar")) {
    return { lat: -3.99615 + jitterLat, lng: -79.20455 + jitterLng };
  }
  if (u.includes("san sebastián") || u.includes("san sebastian") || u.includes("valdivieso")) {
    return { lat: -3.99952 + jitterLat, lng: -79.20621 + jitterLng };
  }
  if (u.includes("valle") || u.includes("bustamante")) {
    return { lat: -3.98255 + jitterLat, lng: -79.20152 + jitterLng };
  }
  if (u.includes("pradera") || u.includes("zona rosa")) {
    return { lat: -3.98920 + jitterLat, lng: -79.20410 + jitterLng };
  }
  if (u.includes("mercado") || u.includes("10 de agosto") || u.includes("18 de noviembre")) {
    return { lat: -3.99321 + jitterLat, lng: -79.20384 + jitterLng };
  }
  // Centro neurálgico de Loja por defecto
  return { lat: -3.99720 + jitterLat, lng: -79.20510 + jitterLng };
}

// Fórmula Haversine para distancia en metros
function calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

function formatearDistancia(metros: number): string {
  if (metros < 1000) {
    return `a ${metros} m`;
  }
  return `a ${(metros / 1000).toFixed(1)} km`;
}

export function SplitMomentoMapa({
  momento,
  subtitulo,
  titulo,
  descripcion,
  platos,
  aliados,
}: SplitMomentoMapaProps) {
  const [tabActiva, setTabActiva] = useState<"platos" | "locales">("platos");
  const [aliadoSeleccionado, setAliadoSeleccionado] = useState<CoordenadaAliado | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cargandoGps, setCargandoGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const markersRef = useRef<{ [id: number]: any }>({});
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  const platosCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollPlatosCarousel = (direction: "left" | "right") => {
    if (platosCarouselRef.current) {
      const cardWidth = platosCarouselRef.current.firstElementChild?.clientWidth || 260;
      platosCarouselRef.current.scrollBy({
        left: direction === "left" ? -(cardWidth + 14) : cardWidth + 14,
        behavior: "smooth",
      });
    }
  };

  // Normalizar y preparar aliados con coordenadas aseguradas
  const aliadosGeoref: CoordenadaAliado[] = useMemo(() => {
    return aliados.map((a) => {
      const coords =
        a.ubicacionLat && a.ubicacionLng && !isNaN(Number(a.ubicacionLat))
          ? { lat: Number(a.ubicacionLat), lng: Number(a.ubicacionLng) }
          : inferirCoordenadas(a.ubicacion, a.id);

      return {
        id: a.id,
        nombre: a.nombre,
        sector: a.ubicacion,
        lat: coords.lat,
        lng: coords.lng,
        telefono: a.telefono,
        imagenUrl: a.imagenUrl,
        rangoPrecio: a.rangoPrecio,
        descripcion: a.descripcion,
        destacado: Boolean(a.destacado),
      };
    });
  }, [aliados]);

  // Lista de aliados ordenada por cercanía si se tiene GPS
  const aliadosOrdenados = useMemo(() => {
    if (!userCoords) return aliadosGeoref;

    return [...aliadosGeoref]
      .map((a) => ({
        ...a,
        distanciaMetros: calcularDistanciaMetros(userCoords.lat, userCoords.lng, a.lat, a.lng),
      }))
      .sort((a, b) => (a.distanciaMetros ?? 0) - (b.distanciaMetros ?? 0));
  }, [aliadosGeoref, userCoords]);

  const aliadoMasCercano = userCoords && aliadosOrdenados.length > 0 ? aliadosOrdenados[0] : null;

  // Inicialización de Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import("leaflet");

      const containerWithId = mapContainerRef.current as any;
      if (containerWithId._leaflet_id) {
        containerWithId._leaflet_id = null;
      }

      // Centro histórico de Loja
      const centroLoja: [number, number] = [-3.9965, -79.205];

      const map = L.map(mapContainerRef.current, {
        center: centroLoja,
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false, // Evita atrapar el scroll de la página
      });

      // Capa oficial de OpenStreetMap (idéntica a MapaLeafletLoja)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Iconos idénticos a los de parihuela-loja (MapaLeafletLoja)
      const plazaIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background-color:#153E3E; color:#FFFFFF; border:2px solid #FFFFFF; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-size:18px;">
              📍
            </div>
            <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid #153E3E; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      });

      const aliadoIcon = L.divIcon({
        className: "custom-aliado-marker",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background-color:#065F46; color:#D0DB61; border:2.5px solid #FFFFFF; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(6,95,70,0.5); font-size:20px; font-weight:bold;">
              ★
            </div>
            <div style="width:0; height:0; border-left:7px solid transparent; border-right:7px solid transparent; border-top:8px solid #065F46; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      });

      // Renderizar marcadores de aliados
      aliadosGeoref.forEach((a) => {
        const marker = L.marker([a.lat, a.lng], {
          icon: a.destacado ? aliadoIcon : plazaIcon,
        });

        const telLimpio = (a.telefono || "").replace(/\D/g, "");
        const waUrl = telLimpio
          ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
              `Hola ${a.nombre}, los vi en el mapa de Qué Comer en Loja y deseo hacer un pedido/reserva.`
            )}`
          : null;

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`;

        const popupContent = `
          <div style="font-family: inherit; min-width: 200px; padding: 2px;">
            <div style="font-size: 14px; font-weight: bold; color: #153E3E; margin-bottom: 2px;">${a.nombre}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">📍 ${a.sector}</div>
            ${a.rangoPrecio ? `<div style="font-size: 11px; font-weight: 600; color: #065F46; margin-bottom: 8px;">💰 ${a.rangoPrecio}</div>` : ""}
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              ${
                waUrl
                  ? `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #065F46; color: #ffffff; font-size: 11px; font-weight: bold; padding: 5px 8px; border-radius: 6px; text-decoration: none; text-align: center; display: inline-block;">WhatsApp</a>`
                  : ""
              }
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #153E3E; color: #ffffff; font-size: 11px; font-weight: bold; padding: 5px 8px; border-radius: 6px; text-decoration: none; text-align: center; display: inline-block;">Cómo llegar ↗</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          setAliadoSeleccionado(a);
        });

        marker.addTo(map);
        markersRef.current[a.id] = marker;
      });

      setTimeout(() => {
        if (isMounted && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [aliadosGeoref]);

  // Centrar mapa en aliado seleccionado
  const enfocarAliado = (a: CoordenadaAliado) => {
    setAliadoSeleccionado(a);
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.flyTo([a.lat, a.lng], 16, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    const marker = markersRef.current[a.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  };

  // Función para obtener GPS del usuario
  const activarGeolocalizacion = () => {
    if (!navigator.geolocation) {
      setGpsError("Tu navegador no soporta geolocalización.");
      return;
    }

    setCargandoGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        setCargandoGps(false);
        setTabActiva("locales");

        if (mapInstanceRef.current) {
          const L = await import("leaflet");

          // Crear o mover pin de usuario
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          } else {
            const userIcon = L.divIcon({
              className: "leaflet-user-pin",
              html: `
                <div style="position:relative; display:flex; align-items:center; justify-content:center;">
                  <div style="position:absolute; width:34px; height:34px; background:rgba(37,99,235,0.25); border-radius:50%; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="background:#2563EB; width:18px; height:18px; border:3px solid #FFFFFF; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:2;"></div>
                </div>
              `,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            });

            const marker = L.marker([coords.lat, coords.lng], { icon: userIcon })
              .bindPopup("<b>📍 Tu ubicación actual</b>")
              .addTo(mapInstanceRef.current);

            userMarkerRef.current = marker;
          }

          // Ajustar zoom para mostrar al usuario y a los locales cercanos
          const bounds = L.latLngBounds([[coords.lat, coords.lng]]);
          aliadosGeoref.forEach((al) => bounds.extend([al.lat, al.lng]));
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      },
      (err) => {
        setCargandoGps(false);
        if (err.code === 1) {
          setGpsError("Permiso de GPS denegado. Puedes explorar los locales manualmente.");
        } else {
          setGpsError("No se pudo obtener la ubicación precisa.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="py-16 md:py-20 bg-porcelana/70 border-b border-niebla">
      <Wrap>
        {/* Cabecera general de la sección */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8 md:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-petroleo mb-2">
              <span>📍 RADAR DE CERCANÍA · {subtitulo}</span>
            </div>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-grafito leading-tight">
              {titulo}
            </h2>
            <p className="text-xs md:text-sm text-muted mt-2 max-w-2xl leading-relaxed">
              {descripcion}
            </p>
          </div>

          {/* Toggle de pestañas para móvil / selector secundario */}
          <div className="flex items-center gap-2 rounded-xl bg-white p-1 border border-niebla shadow-xs self-start md:self-auto">
            <button
              onClick={() => setTabActiva("platos")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                tabActiva === "platos"
                  ? "bg-petroleo text-white shadow-xs"
                  : "text-muted hover:text-grafito"
              }`}
            >
              🍽️ Platos Populares ({platos.length})
            </button>
            <button
              onClick={() => setTabActiva("locales")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                tabActiva === "locales"
                  ? "bg-petroleo text-white shadow-xs"
                  : "text-muted hover:text-grafito"
              }`}
            >
              📍 Locales Cercanos ({aliados.length})
            </button>
          </div>
        </div>

        {/* CONTENEDOR SPLIT 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── COLUMNA IZQUIERDA (50% en desktop: 6 cols) ── */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[520px]">
            {tabActiva === "platos" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span>Platos insignia ordenados por demanda en Loja:</span>
                  <div className="flex items-center gap-2">
                    {/* Flechas de navegación para platos en móvil y desktop */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollPlatosCarousel("left")}
                        aria-label="Plato anterior"
                        className="h-7 w-7 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95 text-xs"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollPlatosCarousel("right")}
                        aria-label="Plato siguiente"
                        className="h-7 w-7 rounded-full border border-niebla bg-white text-petroleo shadow-xs flex items-center justify-center hover:bg-porcelana hover:border-petroleo transition active:scale-95 text-xs"
                      >
                        →
                      </button>
                    </div>

                    <button
                      onClick={() => setTabActiva("locales")}
                      className="font-bold text-petroleo hover:underline inline-flex items-center gap-1 ml-1"
                    >
                      Ver mapa →
                    </button>
                  </div>
                </div>

                {/* Contenedor: En móvil carrusel deslizante (w-[80vw]) con snap que asoma la siguiente tarjeta. En sm+ cuadrícula de 2 columnas */}
                <div
                  ref={platosCarouselRef}
                  className="flex gap-3.5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {platos.slice(0, 4).map((p) => (
                    <div
                      key={p.slug}
                      className="w-[80vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink group flex flex-col justify-between rounded-2xl border border-niebla bg-white p-4 shadow-xs transition hover:border-petroleo hover:shadow-md"
                    >
                      <div>
                        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-porcelana">
                          <Image
                            src={p.hero_imagen_url || "https://mvps.b-cdn.net/quecomerenloja/home/repe-lojano.webp"}
                            alt={p.nombre}
                            fill
                            sizes="(max-width: 640px) 80vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          {p.rango_precio_loja && (
                            <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-petroleo shadow">
                              {p.rango_precio_loja}
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base font-bold text-grafito group-hover:text-petroleo transition-colors">
                          {p.nombre}
                        </h3>
                        <p className="text-[11px] text-muted mt-1 leading-snug line-clamp-2">
                          {p.descripcion_corta}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-niebla/60 flex items-center justify-between">
                        <Link
                          href={`/platos/${p.slug}`}
                          className="text-[11px] font-bold text-petroleo group-hover:underline"
                        >
                          Ver ficha completa →
                        </Link>
                        <button
                          onClick={() => {
                            setTabActiva("locales");
                            if (aliadosGeoref[0]) enfocarAliado(aliadosGeoref[0]);
                          }}
                          className="text-[10px] bg-citrico/30 hover:bg-citrico/60 px-2 py-1 rounded-md font-bold text-petroleo transition"
                        >
                          Ver en mapa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Indicador táctil en móvil para invitar al swipe */}
                <div className="flex sm:hidden items-center justify-center gap-1.5 mt-1 text-[11px] text-petroleo font-medium">
                  <span>👈 Desliza para ver más platos 👉</span>
                </div>

                {/* Banner de llamada a la acción hacia GPS */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        ¿Buscas el más cercano a tu ubicación ahora?
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Calculamos la distancia exacta a cada local verificado en Loja.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={activarGeolocalizacion}
                    disabled={cargandoGps}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition whitespace-nowrap"
                  >
                    {cargandoGps ? "Localizando..." : "Activar mi GPS"}
                  </button>
                </div>
              </div>
            ) : (
              /* VISTA: LOCALES Y PROXIMIDAD */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-grafito">
                    {userCoords
                      ? "Restaurantes ordenados por cercanía a ti:"
                      : "Locales y restaurantes recomendados en Loja:"}
                  </span>
                  <button
                    onClick={activarGeolocalizacion}
                    disabled={cargandoGps}
                    className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>{cargandoGps ? "Buscando..." : "📍 Usar mi GPS"}</span>
                  </button>
                </div>

                {gpsError && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                    ⚠️ {gpsError}
                  </div>
                )}

                {aliadoMasCercano && (
                  <div className="rounded-xl bg-emerald-600 text-white p-3 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded-full inline-block mb-0.5">
                        🏆 El más cercano
                      </span>
                      <div className="text-xs font-bold">{aliadoMasCercano.nombre}</div>
                      <div className="text-[10px] text-emerald-100">
                        A solo {formatearDistancia(aliadoMasCercano.distanciaMetros ?? 0)} de tu posición
                      </div>
                    </div>
                    <button
                      onClick={() => enfocarAliado(aliadoMasCercano)}
                      className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-900 hover:bg-citrico transition shadow-xs"
                    >
                      Ver en mapa
                    </button>
                  </div>
                )}

                {/* Lista scrolleable de locales */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {aliadosOrdenados.map((a) => {
                    const isSelected = aliadoSeleccionado?.id === a.id;
                    const telLimpio = (a.telefono || "").replace(/\D/g, "");
                    const waUrl = telLimpio
                      ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
                          `Hola ${a.nombre}, los vi en el mapa de Qué Comer en Loja y deseo información sobre sus platos y pedidos.`
                        )}`
                      : null;

                    return (
                      <div
                        key={a.id}
                        onClick={() => enfocarAliado(a)}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600"
                            : "border-niebla bg-white hover:border-petroleo/70 hover:shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {a.imagenUrl ? (
                            <img
                              src={a.imagenUrl}
                              alt={a.nombre}
                              className="size-12 rounded-xl object-cover border border-niebla shrink-0"
                            />
                          ) : (
                            <div className="size-12 rounded-xl bg-porcelana border border-niebla flex items-center justify-center text-lg shrink-0">
                              🍽️
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-serif text-sm font-bold text-grafito truncate">
                                {a.nombre}
                              </h4>
                              {a.destacado && (
                                <span className="bg-citrico/40 text-petroleo text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0">
                                  ★ Top
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-muted block truncate">
                              📍 {a.sector}
                            </span>
                            {a.distanciaMetros !== undefined && (
                              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                                {formatearDistancia(a.distanciaMetros)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white p-2 text-xs font-bold shadow-xs transition"
                              title="Escribir por WhatsApp"
                            >
                              💬
                            </a>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              enfocarAliado(a);
                            }}
                            className="rounded-lg bg-petroleo hover:bg-black text-white px-2.5 py-2 text-[10px] font-bold transition shadow-xs"
                          >
                            Centrar ↗
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── COLUMNA DERECHA (50% en desktop: 6 cols) ── */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative rounded-3xl border border-niebla bg-white shadow-xl overflow-hidden h-[420px] sm:h-[480px] lg:h-[540px]">
              {/* Contenedor del mapa Leaflet */}
              <div ref={mapContainerRef} className="w-full h-full z-0" />

              {/* Barra superior estilo MapaLeafletLoja idéntica a parihuela-loja */}
              <div className="absolute top-3 left-3 right-3 z-[450] flex items-center justify-between pointer-events-none">
                <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-petroleo shadow-md border border-niebla flex items-center gap-1.5 pointer-events-auto">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  Mapa Real de Calles y Sectores · Loja, Ecuador
                </div>
                <div className="flex items-center gap-2 pointer-events-auto">
                  <div className="rounded-xl bg-white/90 backdrop-blur-md px-2.5 py-1.5 text-[10px] text-muted shadow-xs border border-niebla hidden sm:block">
                    OpenStreetMap Georeferenciado
                  </div>
                  <button
                    onClick={activarGeolocalizacion}
                    disabled={cargandoGps}
                    className="rounded-xl bg-petroleo hover:bg-black text-white px-3.5 py-1.5 text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-citrico animate-pulse" />
                    {cargandoGps ? "Detectando..." : userCoords ? "✓ GPS Activo" : "📍 Usar mi ubicación"}
                  </button>
                </div>
              </div>

              {/* Banner inferior de feedback cuando se selecciona un local */}
              {aliadoSeleccionado && (
                <div className="absolute bottom-4 left-4 right-4 z-[450] pointer-events-auto bg-white/95 backdrop-blur-md border border-niebla rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">
                      Seleccionado en el mapa
                    </span>
                    <div className="text-xs font-bold text-grafito truncate">
                      {aliadoSeleccionado.nombre}
                    </div>
                    <span className="text-[11px] text-muted block truncate">
                      📍 {aliadoSeleccionado.sector}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {aliadoSeleccionado.telefono && (
                      <a
                        href={`https://wa.me/${aliadoSeleccionado.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hola ${aliadoSeleccionado.nombre}, los vi en el mapa de Qué Comer en Loja.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-700 text-white px-3 py-1.5 text-[11px] font-bold hover:bg-emerald-800 transition"
                      >
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${aliadoSeleccionado.lat},${aliadoSeleccionado.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-petroleo text-white px-3 py-1.5 text-[11px] font-bold hover:bg-black transition"
                    >
                      Ruta ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
