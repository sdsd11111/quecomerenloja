'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function PublicarPromoForm() {
  const searchParams = useSearchParams();

  // El aliado se pasa por query param: ?aliado=nombre-del-aliado
  const rawAliado = searchParams.get('aliado') || '';
  const aliadoSlug = rawAliado.trim().toLowerCase();

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<'PROMO' | 'EVENTO' | 'NOVEDAD' | 'OFERTA'>('PROMO');
  const [descripcion, setDescripcion] = useState('');
  const [precioOriginal, setPrecioOriginal] = useState('');
  const [precioPromo, setPrecioPromo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [lugar, setLugar] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [colorMarca, setColorMarca] = useState('#153E3E');

  // Tipo de Media: 'IMAGEN' o 'VIDEO' o 'AMBOS'
  const [mediaType, setMediaType] = useState<'IMAGEN' | 'VIDEO'>('IMAGEN');

  // Imagen / BunnyCDN
  const [imagenUrl, setImagenUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Video de Redes Sociales (FB, IG, TikTok, YouTube)
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState('');
  const [videoOrientacion, setVideoOrientacion] = useState<'VERTICAL' | 'HORIZONTAL'>('VERTICAL');
  const [resolvingVideo, setResolvingVideo] = useState(false);
  const [videoFeedback, setVideoFeedback] = useState<string | null>(null);

  // Tab activo en el preview si hay ambos
  const [activePreviewTab, setActivePreviewTab] = useState<'imagen' | 'video'>('imagen');

  // Envío
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Default hoy
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFechaInicio(today);
  }, []);

  // Si no hay parámetro aliado en URL, bloquear acceso
  if (!aliadoSlug) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-4 font-serif text-2xl font-bold text-grafito">
            Acceso Exclusivo para Socios Aliados
          </h1>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Esta página solo está disponible para establecimientos gastronómicos registrados con su enlace único de aliado.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-petroleo px-6 py-3 text-xs font-bold text-white transition hover:bg-[#0E2E2E]"
            >
              Volver a Qué Comer en Loja →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nombreMostrado = aliadoSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Subir imagen a BunnyCDN
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aliado', aliadoSlug);

      const res = await fetch('/api/promos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setImagenUrl(data.url);
      setActivePreviewTab('imagen');
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir imagen a BunnyCDN');
    } finally {
      setUploadingImage(false);
    }
  };

  // Resolver link de video de redes sociales (FB reel/share, IG, TikTok, YouTube)
  const handleResolveVideo = async (urlToResolve: string) => {
    const raw = urlToResolve.trim();
    if (!raw) {
      setVideoEmbedUrl('');
      setVideoFeedback(null);
      return;
    }

    setResolvingVideo(true);
    setVideoFeedback(null);

    try {
      const res = await fetch('/api/promos/resolve-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setVideoEmbedUrl(data.embedUrl);
        setVideoOrientacion(data.suggestedOrientation || 'VERTICAL');
        setActivePreviewTab('video');
        setVideoFeedback(
          data.platform === 'facebook'
            ? '✓ Reel/Video de Facebook procesado correctamente'
            : data.platform === 'instagram'
            ? '✓ Reel/Post de Instagram procesado correctamente'
            : data.platform === 'tiktok'
            ? '✓ Video de TikTok procesado correctamente'
            : '✓ Video de YouTube procesado correctamente'
        );
      } else {
        setVideoFeedback('⚠️ Link guardado directamente. Verifica en la previsualización.');
        setVideoEmbedUrl(raw);
      }
    } catch {
      setVideoEmbedUrl(raw);
    } finally {
      setResolvingVideo(false);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aliado_slug: aliadoSlug,
          titulo,
          tipo,
          descripcion,
          imagen_url: imagenUrl || null,
          video_url: videoEmbedUrl || videoInputUrl || null,
          video_orientacion: videoOrientacion,
          precio_original: precioOriginal || null,
          precio_promo: precioPromo || null,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin || null,
          lugar: lugar || null,
          whatsapp_url: whatsapp || null,
          color_marca: colorMarca,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar la publicación');
      }

      setSuccessMsg(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la promoción');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMsg) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
          <span className="text-5xl">🎉</span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-grafito">
            ¡Publicación realizada con éxito!
          </h2>
          <p className="mt-2 text-sm text-muted">
            Tu publicación para <strong className="text-petroleo">{nombreMostrado}</strong> ya está activa y visible en la plataforma.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl bg-petroleo px-6 py-3 text-xs font-bold text-white transition hover:bg-[#0E2E2E]"
            >
              Ver en la Home →
            </Link>
            <button
              onClick={() => {
                setSuccessMsg(false);
                setTitulo('');
                setDescripcion('');
                setPrecioOriginal('');
                setPrecioPromo('');
                setImagenUrl('');
                setVideoInputUrl('');
                setVideoEmbedUrl('');
              }}
              className="w-full sm:w-auto rounded-xl border border-niebla px-6 py-3 text-xs font-bold text-grafito hover:bg-porcelana"
            >
              Publicar otra promoción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-[11px] font-extrabold text-emerald-800">
          <span>✓</span> SOCIO VERIFICADO: {nombreMostrado}
        </div>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-grafito">
          Publicar Promoción o Evento Gastronómico
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sube imágenes a BunnyCDN o inserta videos de redes sociales (Instagram, Facebook, TikTok o YouTube) en formato vertical u horizontal.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 rounded-2xl bg-white border border-niebla p-6 sm:p-8 shadow-xs">
          {errorMsg && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Tipo de publicación */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-2">
              Tipo de Publicación *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['PROMO', 'EVENTO', 'OFERTA', 'NOVEDAD'] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    tipo === t
                      ? 'border-petroleo bg-petroleo text-white shadow-xs'
                      : 'border-niebla bg-white text-muted hover:border-petroleo/40'
                  }`}
                >
                  {t === 'PROMO' && '🔥 Promo'}
                  {t === 'EVENTO' && '🎉 Evento'}
                  {t === 'OFERTA' && '🏷️ Oferta'}
                  {t === 'NOVEDAD' && '✨ Novedad'}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
              Título de la Promoción o Evento *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: 2x1 en Cócteles de Café y Postres Artesanales"
              className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
              Descripción detallada *
            </label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe qué incluye la promoción, condiciones, horarios o detalles del evento..."
              className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
            />
          </div>

          {/* Precios (Opcional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                Precio Normal (Opcional)
              </label>
              <input
                type="text"
                value={precioOriginal}
                onChange={(e) => setPrecioOriginal(e.target.value)}
                placeholder="Ej: $12.50"
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                Precio Oferta / Entrada
              </label>
              <input
                type="text"
                value={precioPromo}
                onChange={(e) => setPrecioPromo(e.target.value)}
                placeholder="Ej: $7.99 o Gratis"
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
          </div>

          {/* Lugar y WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                Lugar / Dirección
              </label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Ej: San Sebastián, Calle Bernardo Valdivieso"
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-1.5">
                WhatsApp de Reservas
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: 0991234567"
                className="w-full rounded-xl border border-niebla px-4 py-2.5 text-sm focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo"
              />
            </div>
          </div>

          {/* ════════ SECCIÓN DE MULTIMEDIA (IMAGEN O VIDEO / SLIDES) ════════ */}
          <div className="rounded-2xl border border-niebla/80 bg-[#FBFBFB] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-petroleo">
                📸 Multimedia: Imagen y/o Video de Redes
              </span>
              <div className="inline-flex rounded-xl bg-white border border-niebla p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMediaType('IMAGEN')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    mediaType === 'IMAGEN' ? 'bg-petroleo text-white shadow-xs' : 'text-muted hover:text-grafito'
                  }`}
                >
                  🖼️ Imagen
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('VIDEO')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    mediaType === 'VIDEO' ? 'bg-petroleo text-white shadow-xs' : 'text-muted hover:text-grafito'
                  }`}
                >
                  🎬 Video Redes
                </button>
              </div>
            </div>

            {/* OPCIÓN 1: IMAGEN CON BUNNYCDN */}
            {mediaType === 'IMAGEN' && (
              <div>
                <label className="block text-xs font-bold text-grafito mb-1.5">
                  Subir Flyer / Banner (Directo a BunnyCDN)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="text-xs text-muted file:mr-3 file:rounded-xl file:border-0 file:bg-white file:border-niebla file:border file:px-4 file:py-2 file:text-xs file:font-bold file:text-petroleo hover:file:bg-niebla"
                  />
                  {uploadingImage && <span className="text-xs text-petroleo font-bold animate-pulse">Subiendo a BunnyCDN...</span>}
                </div>
                {uploadError && <p className="mt-1 text-xs text-rose-600">{uploadError}</p>}
                {imagenUrl && (
                  <p className="mt-1.5 text-xs text-emerald-600 font-medium">✓ Imagen cargada exitosamente</p>
                )}
              </div>
            )}

            {/* OPCIÓN 2: VIDEO DE REDES SOCIALES */}
            {mediaType === 'VIDEO' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-grafito">
                      Link de Video o Reel (Instagram, Facebook, TikTok o YouTube)
                    </label>
                    {resolvingVideo && (
                      <span className="text-[11px] font-bold text-petroleo animate-pulse">
                        Resolviendo enlace...
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={videoInputUrl}
                    onChange={(e) => {
                      setVideoInputUrl(e.target.value);
                      handleResolveVideo(e.target.value);
                    }}
                    placeholder="Pega el link: https://www.facebook.com/share/v/... o instagram.com/reel/..."
                    className="w-full rounded-xl border border-niebla px-4 py-2.5 text-xs font-mono focus:border-petroleo focus:outline-none focus:ring-1 focus:ring-petroleo bg-white"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    Soporta links de <strong>compartir de Facebook</strong> (/share/v/...), <strong>Instagram Reels</strong>, <strong>TikTok</strong> y <strong>YouTube</strong>.
                  </p>
                  {videoFeedback && (
                    <p className="mt-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                      {videoFeedback}
                    </p>
                  )}
                </div>

                {/* BOTÓN OBLIGATORIO DE ORIENTACIÓN: VERTICAL U HORIZONTAL */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-grafito mb-2">
                    Orientación del Video (Elige cómo deseas que se muestre) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoOrientacion('VERTICAL')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                        videoOrientacion === 'VERTICAL'
                          ? 'border-petroleo bg-petroleo text-white shadow-sm ring-2 ring-citrico'
                          : 'border-niebla bg-white text-muted hover:border-petroleo/40'
                      }`}
                    >
                      <span className="text-base">📱</span>
                      <span>Vertical (Reels / TikTok / Shorts)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVideoOrientacion('HORIZONTAL')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                        videoOrientacion === 'HORIZONTAL'
                          ? 'border-petroleo bg-petroleo text-white shadow-sm ring-2 ring-citrico'
                          : 'border-niebla bg-white text-muted hover:border-petroleo/40'
                      }`}
                    >
                      <span className="text-base">🖥️</span>
                      <span>Horizontal (Estándar 16:9 / YouTube)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage || resolvingVideo}
              className="w-full rounded-xl bg-citrico py-3.5 px-6 text-sm font-extrabold text-petroleo transition hover:brightness-105 shadow-md disabled:opacity-50"
            >
              {submitting ? 'Publicando en la plataforma...' : 'Publicar Promoción Ahora →'}
            </button>
          </div>
        </form>

        {/* Preview en Vivo */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl bg-white border border-niebla p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-petroleo">
                PREVISTA EN TIEMPO REAL
              </span>

              {/* Si hay imagen y video a la vez, selector tipo slide */}
              {imagenUrl && videoEmbedUrl && (
                <div className="inline-flex rounded-lg bg-porcelana p-0.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('imagen')}
                    className={`px-2 py-0.5 rounded ${
                      activePreviewTab === 'imagen' ? 'bg-white text-petroleo shadow-xs' : 'text-muted'
                    }`}
                  >
                    🖼️ Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('video')}
                    className={`px-2 py-0.5 rounded ${
                      activePreviewTab === 'video' ? 'bg-white text-petroleo shadow-xs' : 'text-muted'
                    }`}
                  >
                    🎬 Video
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-niebla bg-white shadow-sm">
              {/* Media Container */}
              <div
                className={`relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  activePreviewTab === 'video' && videoEmbedUrl
                    ? videoOrientacion === 'VERTICAL'
                      ? 'aspect-[9/16] max-h-[460px]'
                      : 'aspect-video max-h-[300px]'
                    : 'h-48'
                }`}
              >
                {/* Visualizador de Video */}
                {activePreviewTab === 'video' && videoEmbedUrl ? (
                  <iframe
                    src={videoEmbedUrl}
                    title="Previsualización de Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : imagenUrl ? (
                  /* Visualizador de Imagen */
                  <img
                    src={imagenUrl}
                    alt="Preview"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center bg-petroleo text-white p-4 text-center">
                    <span className="text-3xl mb-1">
                      {tipo === 'EVENTO' ? '🎉' : tipo === 'OFERTA' ? '🏷️' : '🔥'}
                    </span>
                    <span className="text-xs font-bold text-citrico">Imagen generada por categoría</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-md text-petroleo font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                    {tipo}
                  </span>
                </div>
                {precioPromo && (
                  <div className="absolute top-3 right-3 z-10 pointer-events-none">
                    <span className="bg-citrico text-petroleo font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                      {precioPromo}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="text-[10px] font-extrabold text-petroleo uppercase">
                  📍 {nombreMostrado}
                </span>
                <h4 className="mt-1 font-serif text-base font-bold text-grafito leading-tight">
                  {titulo || 'Título de tu promoción aquí'}
                </h4>
                <p className="mt-1.5 text-xs text-muted line-clamp-3">
                  {descripcion || 'Aquí se mostrará la descripción completa de tu oferta o evento para atraer a comensales lojanos.'}
                </p>

                <div className="mt-4 pt-3 border-t border-niebla flex items-center justify-between text-xs text-muted">
                  <span>📅 {fechaInicio || 'Fecha inicio'}</span>
                  {videoEmbedUrl && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      🎬 {videoOrientacion === 'VERTICAL' ? 'Reel/Vertical' : 'Horizontal'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
