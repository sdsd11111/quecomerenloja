'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PromoAliado } from '@/lib/promos-db';

interface PromosCalendarSectionProps {
  initialPromos: PromoAliado[];
}

export function PromosCalendarSection({ initialPromos }: PromosCalendarSectionProps) {
  const [promos] = useState<PromoAliado[]>(initialPromos);

  // Fecha de HOY (Ecuador)
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  // Estado del popup de calendario
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [popupView, setPopupView] = useState<'month' | 'dayDetail'>('month');
  const [selectedPopupDate, setSelectedPopupDate] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);

  // Navegación de mes en el calendario
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Matriz de días del mes para el popup de calendario
  const calendarMatrix = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Dom
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const matrix: ({ dayNum: number; dateStr: string; hasPromos: boolean; isToday: boolean; promoCount: number } | null)[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      matrix.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const promosDelDia = promos.filter((p) => {
        const start = p.fecha_inicio.split('T')[0];
        const end = p.fecha_fin ? p.fecha_fin.split('T')[0] : start;
        return dateStr >= start && dateStr <= end;
      });

      const isToday =
        today.getFullYear() === currentYear &&
        today.getMonth() === currentMonth &&
        today.getDate() === day;

      matrix.push({
        dayNum: day,
        dateStr,
        hasPromos: promosDelDia.length > 0,
        promoCount: promosDelDia.length,
        isToday,
      });
    }

    return matrix;
  }, [currentYear, currentMonth, promos, today]);

  // Promos estrictamente del día de HOY para el slide principal de la Home
  const promosDeHoy = useMemo(() => {
    return promos.filter((p) => {
      const start = p.fecha_inicio.split('T')[0];
      const end = p.fecha_fin ? p.fecha_fin.split('T')[0] : start;
      return todayStr >= start && todayStr <= end;
    });
  }, [promos, todayStr]);

  // Promos del día seleccionado dentro del popup modal
  const promosDelDiaPopup = useMemo(() => {
    if (!selectedPopupDate) return [];
    return promos.filter((p) => {
      const start = p.fecha_inicio.split('T')[0];
      const end = p.fecha_fin ? p.fecha_fin.split('T')[0] : start;
      return selectedPopupDate >= start && selectedPopupDate <= end;
    });
  }, [promos, selectedPopupDate]);

  // Si hay más de 4 eventos hoy, activamos el slide continuo
  const isInfiniteSlide = promosDeHoy.length > 4;
  const [isPaused, setIsPaused] = useState(false);

  // Navegación meses en popup
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Al hacer clic en un día del calendario: abrir vista de actividades de ese día dentro del popup
  const handleSelectDayInModal = (dateStr: string) => {
    setSelectedPopupDate(dateStr);
    setCardIndex(0);
    setPopupView('dayDetail');
  };

  const renderBadgeTipo = (tipo: string) => {
    switch (tipo) {
      case 'PROMO':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">🔥 PROMO</span>;
      case 'EVENTO':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">🎉 EVENTO</span>;
      case 'OFERTA':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">🏷️ OFERTA</span>;
      default:
        return <span className="bg-teal-100 text-teal-900 border border-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">✨ NOVEDAD</span>;
    }
  };

  // Card para el slide de HOY en la Home
  const renderCardHome = (promo: PromoAliado, keySuffix: string | number) => {
    const defaultPlaceholder = promo.imagen_url || (
      promo.tipo === 'EVENTO'
        ? 'https://mvps.b-cdn.net/quecomerenloja/home/ruta-desayunos.webp'
        : 'https://mvps.b-cdn.net/quecomerenloja/home/cecina-lojana.webp'
    );

    return (
      <Link
        href={`/promos/${promo.slug}`}
        key={`${promo.id}-${keySuffix}`}
        className="group relative w-[310px] sm:w-[340px] flex-shrink-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-niebla bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative h-44 w-full bg-porcelana overflow-hidden">
          <Image
            src={defaultPlaceholder}
            alt={promo.titulo}
            fill
            sizes="340px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {renderBadgeTipo(promo.tipo)}
            {promo.precio_promo && (
              <span className="bg-citrico text-petroleo font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                {promo.precio_promo}
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 left-3 right-3">
            <span className="text-[11px] font-extrabold text-citrico tracking-wide uppercase drop-shadow-md">
              📍 {promo.aliado_nombre}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-grafito leading-tight line-clamp-2 group-hover:text-petroleo transition-colors">
              {promo.titulo}
            </h3>
            <p className="mt-2 text-xs text-muted line-clamp-2 leading-relaxed">
              {promo.descripcion}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-niebla flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-1.5 font-medium text-grafito">
              <span className="text-emerald-700 font-extrabold">● Disponible Hoy</span>
            </div>
            <span className="text-xs font-bold text-petroleo group-hover:translate-x-0.5 transition-transform">
              Ver detalle →
            </span>
          </div>
        </div>
      </Link>
    );
  };

  // Fecha legible formateada (ej: JUEVES, 15 DE OCTUBRE DE 2026)
  const formatFechaLegible = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('es-EC', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="relative border-t border-niebla bg-[#FAFAFA] py-14 sm:py-18 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera de la sección */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-citrico/30 px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-petroleo mb-2.5">
              <span>🔥</span>
              <span>PROMOCIONES Y EVENTOS DISPONIBLES HOY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-grafito tracking-tight">
              ¿Qué hay hoy en Loja?
            </h2>
            <p className="mt-2 text-sm text-muted max-w-xl">
              Ofertas activas, menús especiales y eventos gastronómicos disponibles durante el día de hoy en restaurantes y cafeterías oficiales.
            </p>
          </div>

          {/* Botón que despliega el Popup de Calendario Completo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPopupView('month');
                setIsCalendarOpen(true);
              }}
              className="inline-flex items-center gap-2.5 rounded-xl bg-petroleo px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-[#0E2E2E] transition active:scale-95"
            >
              <span>📅</span>
              <span>Abrir Calendario de Eventos</span>
              <span className="rounded-full bg-citrico text-petroleo px-2 py-0.5 text-[10px] font-extrabold">
                Ver Agenda
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SLIDE DE EVENTOS Y PROMOS EXCLUSIVAS DE HOY ═══ */}
      {promosDeHoy.length === 0 ? (
        <div className="mx-auto max-w-md text-center py-10 px-5 bg-white rounded-3xl border border-niebla shadow-xs">
          <span className="text-4xl">🍽️</span>
          <h4 className="mt-3 text-base font-bold text-grafito">
            No hay promociones activas registradas para hoy
          </h4>
          <p className="mt-1.5 text-xs text-muted leading-relaxed">
            Nuestros aliados gastronómicos actualizan sus promociones y menús constantemente. Abre el calendario para ver los eventos de los próximos días.
          </p>
          <div className="mt-5">
            <button
              onClick={() => {
                setPopupView('month');
                setIsCalendarOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-petroleo text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0E2E2E]"
            >
              <span>📅</span> Explorar Calendario de Eventos
            </button>
          </div>
        </div>
      ) : isInfiniteSlide ? (
        /* Slide Infinito si superan los 4 items de hoy */
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex gap-6 py-2 ${isPaused ? '' : 'animate-marquee'}`}
            style={{
              width: 'max-content',
              animationDuration: `${Math.max(26, promosDeHoy.length * 6)}s`,
            }}
          >
            {promosDeHoy.map((promo, idx) => renderCardHome(promo, `h1-${idx}`))}
            {promosDeHoy.map((promo, idx) => renderCardHome(promo, `h2-${idx}`))}
          </div>
        </div>
      ) : (
        /* Cuadrícula centrada si son 4 o menos hoy */
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 py-2">
            {promosDeHoy.map((promo, idx) => renderCardHome(promo, `grid-today-${idx}`))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL POPUP: CALENDARIO INTERACTIVO & ACTIVIDADES DEL DÍA (TAL COMO LA CAPTURA)
          ════════════════════════════════════════════════════════════════ */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsCalendarOpen(false)} />

          {/* Modal Card Principal */}
          <div className="relative z-10 w-full max-w-md sm:max-w-lg overflow-hidden rounded-3xl bg-white border border-niebla shadow-2xl flex flex-col max-h-[92vh]">
            {/* Top Bar del Modal */}
            <div className="flex items-center justify-between border-b border-niebla px-6 py-4 bg-white">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-petroleo animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-petroleo">
                  AGENDA Y CALENDARIO GASTRONÓMICO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(false)}
                className="size-8 rounded-full bg-porcelana hover:bg-niebla/70 flex items-center justify-center text-xs font-bold text-grafito transition"
              >
                ✕
              </button>
            </div>

            {/* VISTA 1: VISTA MENSUAL DEL CALENDARIO */}
            {popupView === 'month' && (
              <div className="p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-serif font-bold text-grafito">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="size-8 rounded-xl bg-porcelana hover:bg-niebla border border-niebla flex items-center justify-center font-bold text-sm text-grafito transition"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="size-8 rounded-xl bg-porcelana hover:bg-niebla border border-niebla flex items-center justify-center font-bold text-sm text-grafito transition"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold uppercase text-muted mb-2">
                  <span>Dom</span>
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mié</span>
                  <span>Jue</span>
                  <span>Vie</span>
                  <span>Sáb</span>
                </div>

                {/* Matriz interactiva de días */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarMatrix.map((item, idx) => {
                    if (!item) {
                      return <div key={`empty-${idx}`} className="h-11" />;
                    }

                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => handleSelectDayInModal(item.dateStr)}
                        className={`group relative h-11 rounded-2xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          item.hasPromos
                            ? 'bg-petroleo text-white hover:bg-[#0E2E2E] shadow-xs'
                            : item.isToday
                            ? 'bg-citrico/30 text-petroleo border border-citrico font-extrabold'
                            : 'bg-porcelana/70 text-grafito hover:bg-niebla/70'
                        }`}
                      >
                        <span className="text-xs leading-none">{item.dayNum}</span>

                        {item.hasPromos && (
                          <span className="mt-1 flex items-center gap-0.5">
                            <span className="size-1 rounded-full bg-citrico" />
                            {item.promoCount > 1 && (
                              <span className="text-[8px] font-extrabold text-citrico">
                                {item.promoCount}
                              </span>
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-niebla flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-3 text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-petroleo" />
                      <span>Con eventos/promos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-citrico" />
                      <span>Hoy</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted italic">Toca un día para explorar</span>
                </div>
              </div>
            )}

            {/* VISTA 2: ACTIVIDADES DEL DÍA (CLON EXACTO DE LA CAPTURA) */}
            {popupView === 'dayDetail' && selectedPopupDate && (
              <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-between">
                <div>
                  {/* Header de Actividades del Día */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700">
                        ACTIVIDADES DEL DÍA
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-black text-grafito leading-tight">
                        {formatFechaLegible(selectedPopupDate)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPopupView('month')}
                      className="text-xs font-bold text-grafito bg-porcelana hover:bg-niebla border border-niebla px-3.5 py-1.5 rounded-xl transition"
                    >
                      ← Volver al calendario
                    </button>
                  </div>

                  {/* Contenido: Si no hay eventos o el carrusel de eventos */}
                  {promosDelDiaPopup.length === 0 ? (
                    <div className="my-8 rounded-2xl border border-niebla bg-porcelana/30 p-8 text-center">
                      <span className="text-3xl">☕</span>
                      <h4 className="mt-2 text-sm font-bold text-grafito">
                        Sin promociones registradas para esta fecha
                      </h4>
                      <p className="mt-1 text-xs text-muted">
                        No hay ofertas o eventos programados para este día. Elige otra fecha en el calendario.
                      </p>
                    </div>
                  ) : (
                    /* Tarjeta Interactiva con Paginación como en la captura */
                    (() => {
                      const currentPromo = promosDelDiaPopup[cardIndex] || promosDelDiaPopup[0];
                      const totalCards = promosDelDiaPopup.length;
                      const promoImg = currentPromo.imagen_url || 'https://mvps.b-cdn.net/quecomerenloja/home/ruta-desayunos.webp';

                      return (
                        <div className="mt-2">
                          {/* Card Central */}
                          <div className="overflow-hidden rounded-2xl border border-niebla bg-white shadow-md">
                            {/* Imagen Banner */}
                            <div className="relative h-56 sm:h-64 w-full bg-porcelana">
                              <Image
                                src={promoImg}
                                alt={currentPromo.titulo}
                                fill
                                sizes="480px"
                                className="object-cover object-center"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {/* Badge Fecha */}
                              <div className="absolute bottom-3 left-3">
                                <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                                  📅 {new Date(currentPromo.fecha_inicio).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>

                              {/* Badge Tipo & Precio */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                {currentPromo.precio_promo && (
                                  <span className="bg-citrico text-petroleo font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                                    {currentPromo.precio_promo}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Contenido de la Card */}
                            <div className="p-5">
                              <h4 className="font-serif text-lg font-bold text-grafito leading-tight">
                                {currentPromo.titulo}
                              </h4>
                              <p className="mt-1 text-xs text-muted flex items-center gap-1">
                                <span>📍</span>
                                <span>{currentPromo.lugar || currentPromo.aliado_nombre}</span>
                              </p>

                              <p className="mt-2.5 text-xs text-muted line-clamp-2 leading-relaxed">
                                {currentPromo.descripcion}
                              </p>

                              {/* Botón Ver Evento (Púrpura / Morado como en la captura) */}
                              <Link
                                href={`/promos/${currentPromo.slug}`}
                                onClick={() => setIsCalendarOpen(false)}
                                className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#8A2BE2] hover:bg-[#7824c9] py-3 text-xs font-bold text-white shadow-md transition"
                              >
                                Ver evento →
                              </Link>
                            </div>
                          </div>

                          {/* Paginador numérico < 1/2 > como en la captura */}
                          {totalCards > 1 && (
                            <div className="mt-4 flex flex-col items-center gap-1">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCardIndex((i) => (i > 0 ? i - 1 : totalCards - 1))}
                                  className="size-8 rounded-full bg-porcelana hover:bg-niebla border border-niebla flex items-center justify-center text-xs font-bold text-grafito transition"
                                >
                                  ‹
                                </button>
                                <span className="text-xs font-bold text-muted px-2">
                                  {cardIndex + 1} / {totalCards}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCardIndex((i) => (i < totalCards - 1 ? i + 1 : 0))}
                                  className="size-8 rounded-full bg-porcelana hover:bg-niebla border border-niebla flex items-center justify-center text-xs font-bold text-grafito transition"
                                >
                                  ›
                                </button>
                              </div>
                              <span className="text-[10px] text-muted">
                                Deslizá la carta o usá las flechas para explorar
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>

                {/* Botón Volver a la vista mensual */}
                <div className="mt-6 pt-3">
                  <button
                    type="button"
                    onClick={() => setPopupView('month')}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-porcelana hover:bg-niebla/70 border border-niebla py-3 text-xs font-bold text-grafito transition"
                  >
                    <span>📅</span>
                    <span>VOLVER A LA VISTA MENSUAL DEL CALENDARIO</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
