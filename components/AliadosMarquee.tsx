'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AliadoMarqueeProps {
  items: any[];
}

export function AliadosMarquee({ items }: AliadoMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!items || items.length === 0) return null;

  const renderCard = (item: any, keyId: string) => {
    const isReal = 'nombre' in item;

    if (isReal) {
      const aliado = item;
      const telLimpio = (aliado.telefono || '').replace(/\D/g, '');
      const waUrl = telLimpio
        ? `https://wa.me/${telLimpio}?text=${encodeURIComponent(
            `Hola ${aliado.nombre}, los vi en la guía de Qué Comer en Loja. Deseo información de sus platos y reservas.`
          )}`
        : null;

      return (
        <div
          key={keyId}
          className="w-[340px] flex-shrink-0 flex flex-col justify-between rounded-2xl border border-niebla bg-white p-7 shadow-sm transition hover:border-petroleo hover:shadow-xl select-none"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {aliado.tipo === 'CAFETERIA' ? '☕ Cafetería' : '🍽️ Restaurante'}
              </span>
              {aliado.destacado && (
                <span className="rounded-full bg-citrico/30 px-2.5 py-0.5 text-[9px] font-extrabold text-petroleo">
                  ★ Verificado
                </span>
              )}
            </div>

            <div className="my-4 flex items-center gap-3">
              {aliado.imagenUrl ? (
                <img
                  src={aliado.imagenUrl}
                  alt={aliado.nombre}
                  className="size-14 rounded-2xl object-cover border border-niebla shadow-xs shrink-0"
                />
              ) : (
                <div className="size-14 rounded-2xl bg-porcelana border border-niebla flex items-center justify-center text-2xl shadow-xs shrink-0">
                  {aliado.tipo === 'CAFETERIA' ? '☕' : '🍽️'}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-bold text-grafito leading-tight line-clamp-1">
                  {aliado.nombre}
                </h3>
                <span className="text-xs text-muted block mt-0.5 line-clamp-1">
                  📍 {aliado.ubicacion}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
              {aliado.descripcion}
            </p>

            {aliado.rangoPrecio && (
              <div className="mt-3 text-[11px] font-bold text-petroleo">
                💰 {aliado.rangoPrecio}
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-niebla pt-3 flex items-center justify-between">
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center rounded-lg bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 text-[11px] font-bold text-white transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>💬</span> Contactar al WhatsApp
              </a>
            ) : (
              <Link
                href="/restaurantes"
                className="w-full text-center rounded-lg bg-petroleo hover:bg-[#0E2E2E] px-3.5 py-2 text-[11px] font-bold text-white transition"
              >
                Ver detalles →
              </Link>
            )}
          </div>
        </div>
      );
    }

    // Tarjeta de cupo disponible
    const slot = item;
    return (
      <div
        key={keyId}
        className="w-[340px] flex-shrink-0 flex flex-col justify-between rounded-2xl border-2 border-dashed border-niebla bg-white p-7 transition hover:border-petroleo hover:shadow-xl select-none"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">{slot.category}</span>
            <span className="rounded-full bg-niebla/70 px-2.5 py-0.5 text-[9px] font-bold text-petroleo">
              {slot.status}
            </span>
          </div>
          <h3 className="mt-4 font-serif text-lg font-bold text-grafito">
            {slot.title}
          </h3>
          <small className="block font-semibold text-[11px] text-petroleo mt-1">✓ {slot.highlight}</small>
          <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">{slot.desc}</p>
        </div>

        <div className="mt-6 border-t border-niebla pt-4 flex items-center justify-between">
          <span className="text-[11px] text-muted font-medium">¿Tu negocio aquí?</span>
          <Link
            href="/para-negocios"
            className="rounded-lg bg-citrico px-3.5 py-2 text-[11px] font-bold text-petroleo transition hover:brightness-105"
          >
            Reservar cupo →
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sombras de desvanecimiento laterales */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-porcelana to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-porcelana to-transparent" />

      {/* Inline styles para garantizar que la animación funcione en cualquier navegador */}
      <style jsx>{`
        @keyframes customMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: customMarquee 35s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Contenedor del track en movimiento continuo */}
      <div className={`marquee-track ${isPaused ? 'paused' : ''}`}>
        {/* Set 1 */}
        <div className="flex gap-6 pr-6">
          {items.map((item, idx) => renderCard(item, `first-${idx}`))}
        </div>
        {/* Set 2 (duplicado para el loop continuo e infinito) */}
        <div className="flex gap-6 pr-6" aria-hidden="true">
          {items.map((item, idx) => renderCard(item, `second-${idx}`))}
        </div>
      </div>
    </div>
  );
}
