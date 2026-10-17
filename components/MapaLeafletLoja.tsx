"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wrap } from "./PageHero";

export interface PuntoGastronomico {
  id: string;
  nombre: string;
  sector: string;
  lat: number;
  lng: number;
  tipo: string;
  descripcion: string;
  horario: string;
  disponible: boolean;
  distanciaKm?: number;
  esAliadoReal?: boolean;
  telefono?: string | null;
  imagenUrl?: string | null;
  rangoPrecio?: string | null;
}

// Coordenadas reales de puntos gastronómicos clave en Loja
export const PUNTOS_LOJA_DEFAULT: PuntoGastronomico[] = [
  {
    id: "lourdes",
    nombre: "Cafetería y Plaza Tradicional Lourdes",
    sector: "Calle Lourdes y Bolívar (Centro Histórico)",
    lat: -3.99615,
    lng: -79.20455,
    tipo: "Plaza Histórica · Calle Lourdes",
    descripcion: "La zona más bohemia y turística de Loja. Casas coloniales con tradición de tamales calientes y café de especialidad.",
    horario: "07:00 AM – 10:30 PM",
    disponible: true,
  },
  {
    id: "san-sebastian",
    nombre: "Plaza Tradicional San Sebastián",
    sector: "Bernardo Valdivieso y Alonso de Mercadillo",
    lat: -3.99952,
    lng: -79.20621,
    tipo: "Plaza Tradicional · San Sebastián",
    descripcion: "Sector histórico frente a la glorieta y torre de San Sebastián, epicentro de cafeterías y huecas tradicionales.",
    horario: "07:30 AM – 09:30 PM",
    disponible: true,
  },
  {
    id: "el-valle",
    nombre: "Rincón Gastronómico El Valle",
    sector: "Av. Salvador Bustamante Celi (Parroquia El Valle)",
    lat: -3.98255,
    lng: -79.20152,
    tipo: "Sector Típico · El Valle",
    descripcion: "Cuna de la gastronomía lojana tradicional: cuyes, repe, cecina y desayunos típicos los fines de semana.",
    horario: "08:00 AM – 06:00 PM",
    disponible: true,
  },
  {
    id: "mercado-centro",
    nombre: "Comedor Tradicional Centro & Mercado",
    sector: "10 de Agosto y 18 de Noviembre (Centro)",
    lat: -3.99321,
    lng: -79.20384,
    tipo: "Hueca Tradicional · Centro",
    descripcion: "El corazón del comercio de Loja, donde se cocinan los caldos y masas al vapor desde primera hora de la mañana.",
    horario: "06:30 AM – 04:30 PM",
    disponible: true,
  },
  {
    id: "vilcabamba",
    nombre: "Valle de la Longevidad Vilcabamba",
    sector: "Parque Central de Vilcabamba (Cantón Loja)",
    lat: -4.26123,
    lng: -79.22312,
    tipo: "Destino Turístico · Vilcabamba",
    descripcion: "A 40 minutos al sur de Loja: café de altura orgánico, comida típica y ambiente campestre internacional.",
    horario: "08:00 AM – 10:00 PM",
    disponible: true,
  },
  {
    id: "catamayo",
    nombre: "Ruta Gastronómica Catamayo",
    sector: "Valle de Catamayo (Vía a Loja)",
    lat: -3.98672,
    lng: -79.35824,
    tipo: "Valle Cálido · Catamayo",
    descripcion: "Famoso por su cecina asada, clima cálido y paradas obligatorias para viajeros que entran a Loja.",
    horario: "09:00 AM – 09:00 PM",
    disponible: true,
  },
];

// Fórmula Haversine para distancia en kilómetros
function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function MapaLeafletLoja({ nombrePlato }: { nombrePlato: string }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-base/no-explicit-any
  const markersGroupRef = useRef<any>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PuntoGastronomico | null>(null);
  const [puntos, setPuntos] = useState<PuntoGastronomico[]>(PUNTOS_LOJA_DEFAULT);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Cargar aliados de la base de datos y unirlos con los puntos predefinidos
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import("leaflet");

      const containerWithId = mapContainerRef.current as any;
      if (containerWithId._leaflet_id) {
        containerWithId._leaflet_id = null;
      }

      // Centro de Loja, Ecuador
      const lojaCoords: [number, number] = [-3.996, -79.205];

      // Inicializar el mapa
      const map = L.map(mapContainerRef.current, {
        center: lojaCoords,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      // Capa de OpenStreetMap con estilo limpio
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Icono para plazas default
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

      // Icono destacado para Aliados Gastronómicos Verificados
      const aliadoIcon = L.divIcon({
        className: "custom-aliado-marker",
        html: `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background-color:#065F46; color:#D0DB61; border:2px solid #FFFFFF; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(6,95,70,0.5); font-size:20px; font-weight:bold;">
              ★
            </div>
            <div style="width:0; height:0; border-left:7px solid transparent; border-right:7px solid transparent; border-top:8px solid #065F46; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      });

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // Obtener aliados reales desde la API
      let puntosTotales: PuntoGastronomico[] = [...PUNTOS_LOJA_DEFAULT];
      try {
        const res = await fetch("/api/aliados");
        const data = await res.json();
        if (data.success && Array.isArray(data.aliados)) {
          const aliadosGeoref: PuntoGastronomico[] = data.aliados
            .filter((a: any) => a.ubicacionLat && a.ubicacionLng)
            .map((a: any) => ({
              id: `aliado-${a.id}`,
              nombre: a.nombre,
              sector: a.ubicacion,
              lat: Number(a.ubicacionLat),
              lng: Number(a.ubicacionLng),
              tipo: a.tipo === "CAFETERIA" ? "☕ Cafetería Verificada" : "🍽️ Restaurante Verificado",
              descripcion: a.descripcion || "Socio oficial de la guía gastronómica de Loja.",
              horario: a.servicios || "Atención habitual de gastronomía",
              disponible: true,
              esAliadoReal: true,
              telefono: a.telefono,
              imagenUrl: a.imagenUrl,
              rangoPrecio: a.rangoPrecio,
            }));

          if (aliadosGeoref.length > 0) {
            puntosTotales = [...aliadosGeoref, ...PUNTOS_LOJA_DEFAULT];
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar aliados para el mapa, usando defaults", err);
      }

      if (isMounted) {
        setPuntos(puntosTotales);
      }

      // Renderizar marcadores
      puntosTotales.forEach((pto) => {
        const marker = L.marker([pto.lat, pto.lng], {
          icon: pto.esAliadoReal ? aliadoIcon : plazaIcon,
        });

        marker.on("click", () => {
          setSelectedPoint(pto);
        });

        markersGroup.addLayer(marker);
      });

      if (isMounted) {
        setMapLoaded(true);
        setTimeout(() => {
          map.invalidateSize();
        }, 150);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null;
      }
    };
  }, []);

  // Función al solicitar geolocalización del usuario
  async function obtenerUbicacion() {
    if (!navigator.geolocation) {
      setStatusMsg("Tu navegador no soporta geolocalización.");
      return;
    }

    setLoadingLoc(true);
    setStatusMsg("Obteniendo tu ubicación satelital en tiempo real...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = await import("leaflet");

        setUserLocation({ lat: latitude, lng: longitude });
        setLoadingLoc(false);

        // Calcular distancias a cada punto y ordenar por cercanía
        const puntosConDistancia = puntos.map((pto) => ({
          ...pto,
          distanciaKm: calcularDistanciaKm(latitude, longitude, pto.lat, pto.lng),
        })).sort((a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0));

        setPuntos(puntosConDistancia);

        const masCercano = puntosConDistancia[0];
        setSelectedPoint(masCercano);

        const distTexto =
          masCercano.distanciaKm && masCercano.distanciaKm < 1
            ? `${Math.round(masCercano.distanciaKm * 1000)} metros`
            : `${masCercano.distanciaKm} km`;

        setStatusMsg(
          `¡Ubicación detectada! El punto más cercano es ${masCercano.nombre} (${distTexto} de ti).`
        );

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;

          // Remover marcador de usuario previo si existe
          if (userMarkerRef.current) {
            map.removeLayer(userMarkerRef.current);
          }

          // Crear marcador visual del usuario ("Tú estás aquí")
          const userIcon = L.divIcon({
            className: "user-loc-marker",
            html: `
              <div style="display:flex; flex-direction:column; align-items:center;">
                <div style="background-color:#D0DB61; color:#153E3E; font-weight:800; font-size:10px; padding:2px 8px; border-radius:9999px; box-shadow:0 2px 6px rgba(0,0,0,0.2); white-space:nowrap; margin-bottom:2px; border:1px solid #153E3E;">
                  Tú estás aquí
                </div>
                <div style="background-color:#153E3E; border:3px solid #D0DB61; border-radius:50%; width:22px; height:22px; box-shadow:0 0 0 5px rgba(208,219,97,0.4); animation:pulse 2s infinite;"></div>
              </div>
            `,
            iconSize: [80, 40],
            iconAnchor: [40, 40],
          });

          const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          userMarkerRef.current = userMarker;

          // Volar suavemente hacia la ubicación del usuario con zoom de calle
          map.flyTo([latitude, longitude], 16, {
            animate: true,
            duration: 1.5,
          });
        }
      },
      (error) => {
        setLoadingLoc(false);
        if (error.code === 1) {
          setStatusMsg(
            "Permiso de ubicación no concedido. Puedes explorar los puntos de Loja en el mapa haciendo clic en ellos."
          );
        } else {
          setStatusMsg("No se pudo obtener la posición. Mostrando el mapa general de Loja.");
        }
        // Fallback: centrar en el primer punto
        if (mapInstanceRef.current && puntos.length > 0) {
          mapInstanceRef.current.flyTo([puntos[0].lat, puntos[0].lng], 15);
        }
        if (puntos.length > 0) {
          setSelectedPoint(puntos[0]);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Centrar en un punto específico
  function volarAPunto(pto: PuntoGastronomico) {
    setSelectedPoint(pto);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([pto.lat, pto.lng], 16, {
        animate: true,
        duration: 1.2,
      });
    }
  }

  return (
    <section className="py-16 bg-porcelana border-t border-niebla">
      <Wrap>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8">
          <div>
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-2">
              MAPA REAL INTERACTIVO · LOJA, ECUADOR
            </span>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-grafito">
              Descubre el Lugar Más Cercano para Comer {nombrePlato}
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1.5 max-w-2xl">
              Activa tu ubicación satelital para hacer zoom en tu calle y ver las plazas gastronómicas y locales de {nombrePlato} más cercanos a ti.
            </p>
          </div>

          <button
            onClick={obtenerUbicacion}
            disabled={loadingLoc}
            className="inline-flex items-center gap-2 rounded-xl bg-petroleo px-6 py-3.5 text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-md hover:shadow-lg disabled:opacity-60 self-start md:self-auto cursor-pointer"
          >
            <span>{loadingLoc ? "Localizando satélite..." : "📍 Usar mi ubicación"}</span>
          </button>
        </div>

        {statusMsg && (
          <div className="mb-6 rounded-2xl border border-petroleo/20 bg-white p-4 text-xs font-semibold text-petroleo flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-citrico animate-ping shrink-0" />
              <span>{statusMsg}</span>
            </div>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-muted hover:text-grafito text-xs font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Layout en 2 columnas: Lista rápida de distancias + Visor de Mapa Leaflet */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Columna lateral: Puntos ordenados por distancia */}
          <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            <div className="rounded-2xl border border-niebla bg-white p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                {userLocation ? "Puntos ordenados por cercanía" : "Sectores clave en Loja"}
              </span>
              <p className="text-xs text-muted mt-1">
                Haz clic en cualquier punto para enfocar el mapa y ver detalles del local.
              </p>
            </div>

            {puntos.map((pto) => (
              <button
                key={pto.id}
                onClick={() => volarAPunto(pto)}
                className={`group flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  selectedPoint?.id === pto.id
                    ? "border-petroleo bg-white shadow-md ring-2 ring-petroleo/10"
                    : pto.esAliadoReal
                    ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-500 hover:bg-white"
                    : "border-niebla bg-white/80 hover:border-petroleo/50 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {pto.imagenUrl ? (
                      <img
                        src={pto.imagenUrl}
                        alt={pto.nombre}
                        className="h-9 w-9 shrink-0 rounded-xl object-cover border border-niebla shadow-2xs"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-porcelana text-sm border border-niebla">
                        {pto.esAliadoReal ? "★" : "📍"}
                      </span>
                    )}
                    <div>
                      <h4 className="font-serif text-sm font-bold text-grafito group-hover:text-petroleo transition-colors line-clamp-1">
                        {pto.nombre}
                      </h4>
                      <span className="text-[11px] text-muted block mt-0.5 line-clamp-1">
                        📍 {pto.sector}
                      </span>
                    </div>
                  </div>

                  {pto.distanciaKm !== undefined && (
                    <span className="rounded-full bg-citrico/40 px-2.5 py-0.5 text-[10px] font-black text-petroleo shrink-0">
                      {pto.distanciaKm < 1
                        ? `${Math.round(pto.distanciaKm * 1000)} m`
                        : `${pto.distanciaKm} km`}
                    </span>
                  )}
                </div>

                <div className="mt-3 border-t border-niebla/50 pt-2 flex items-center justify-between text-[11px]">
                  {pto.esAliadoReal ? (
                    <span className="text-emerald-800 font-extrabold text-[10px] bg-emerald-100/60 px-2 py-0.5 rounded-full">
                      ✓ Aliado Oficial
                    </span>
                  ) : (
                    <span className="text-petroleo font-bold">Plaza Libre</span>
                  )}
                  <span className="text-muted group-hover:text-petroleo font-semibold">
                    Ver en mapa →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Columna principal: Mapa Real de Loja (OpenStreetMap + Leaflet) */}
          <div className="lg:col-span-8 overflow-hidden rounded-3xl border border-niebla bg-white shadow-xl">
            {/* Barra superior del mapa */}
            <div className="flex flex-wrap items-center justify-between border-b border-niebla bg-[#EBF0EC] px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-petroleo opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-petroleo"></span>
                </span>
                <span className="font-serif text-sm font-bold text-grafito">
                  Mapa Real de Calles y Sectores · Loja, Ecuador
                </span>
              </div>
              <span className="text-[11px] text-muted font-medium">
                OpenStreetMap Georeferenciado
              </span>
            </div>

            {/* Contenedor del Mapa Leaflet */}
            <div className="relative h-[440px] md:h-[500px] w-full">
              <div ref={mapContainerRef} className="h-full w-full z-0" />

              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-porcelana text-xs font-bold text-muted">
                  Cargando mapa de Loja...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal / Popup de Información del Local o Plaza Seleccionada */}
        {selectedPoint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-niebla animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedPoint(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-porcelana text-muted hover:text-grafito transition cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                {selectedPoint.esAliadoReal ? (
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-900 uppercase">
                    ✓ Socio Verificado
                  </span>
                ) : (
                  <span className="rounded-full bg-citrico/40 px-2.5 py-0.5 text-[10px] font-extrabold text-petroleo uppercase">
                    Plaza Gastronómica Libre
                  </span>
                )}

                {selectedPoint.distanciaKm !== undefined && (
                  <span className="rounded-full bg-petroleo text-white px-2 py-0.5 text-[10px] font-bold">
                    A {selectedPoint.distanciaKm < 1
                      ? `${Math.round(selectedPoint.distanciaKm * 1000)} metros`
                      : `${selectedPoint.distanciaKm} km`} de ti
                  </span>
                )}
              </div>

              {selectedPoint.imagenUrl && (
                <div className="mb-4 overflow-hidden rounded-2xl border border-niebla h-36 w-full">
                  <img
                    src={selectedPoint.imagenUrl}
                    alt={selectedPoint.nombre}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <h3 className="font-serif text-xl font-bold text-grafito">
                {selectedPoint.nombre}
              </h3>
              <p className="text-xs text-petroleo font-semibold mt-1">
                📍 {selectedPoint.sector}
              </p>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">
                {selectedPoint.descripcion}
              </p>

              <div className="mt-4 rounded-xl border border-niebla bg-porcelana/40 p-3 text-[11px] text-muted flex items-center justify-between">
                <span>🕒 Atención:</span>
                <strong className="text-grafito">{selectedPoint.horario}</strong>
              </div>

              {selectedPoint.rangoPrecio && (
                <div className="mt-2 rounded-xl border border-niebla bg-porcelana/40 p-3 text-[11px] text-muted flex items-center justify-between">
                  <span>💰 Rango de precio:</span>
                  <strong className="text-petroleo font-bold">{selectedPoint.rangoPrecio}</strong>
                </div>
              )}

              {!selectedPoint.esAliadoReal && (
                <div className="mt-4 rounded-2xl border-2 border-dashed border-niebla bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-grafito">¿Administras este restaurante?</span>
                    <span className="rounded-full bg-citrico px-2 py-0.5 text-[9px] font-black text-petroleo">Cupo Abierto</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Conecta tu negocio directamente con los turistas que buscan "{nombrePlato}" en esta zona sin comisiones de apps.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2">
                {selectedPoint.esAliadoReal && selectedPoint.telefono ? (
                  <a
                    href={`https://wa.me/${selectedPoint.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hola ${selectedPoint.nombre}, vi su local en el mapa de Qué Comer en Loja. Deseo información de sus platos y reservas.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-md"
                  >
                    <span>💬 Contactar por WhatsApp</span>
                  </a>
                ) : !selectedPoint.esAliadoReal ? (
                  <Link
                    href="/para-negocios"
                    className="flex w-full items-center justify-center rounded-xl bg-petroleo py-3 text-center text-xs font-bold text-white hover:bg-[#0E2E2E] transition shadow-md"
                  >
                    Reclamar esta plaza →
                  </Link>
                ) : null}

                <button
                  onClick={() => setSelectedPoint(null)}
                  className="rounded-xl border border-niebla py-2.5 text-xs font-bold text-muted hover:bg-porcelana transition cursor-pointer"
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
