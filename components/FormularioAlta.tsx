'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIAS_FORMULARIO,
  MOMENTOS_FORMULARIO,
  RANGOS_PRECIO,
} from '@/lib/formulario';
import { extractGpsFromGoogleMaps } from '@/lib/maps-extractor';

const CLAVE_ALMACEN = 'qccl-formulario-alta-v2';
const WHATSAPP = '593986962872';
const CENTRO_LOJA: [number, number] = [-3.9965, -79.205];

type Datos = {
  nombreComercial: string;
  propietario: string;
  telefono: string;
  email: string;
  direccion: string;
  referencias: string;
  horarios: string;
  categoria: string;
  momentos: string[];
  rangoPrecio: string;
  enlaceMapa: string;
  lat: number | null;
  lng: number | null;
  notas: string;
  cartaTexto: string;
};

const DATOS_INICIALES: Datos = {
  nombreComercial: '',
  propietario: '',
  telefono: '',
  email: '',
  direccion: '',
  referencias: '',
  horarios: '',
  categoria: 'tradicional',
  momentos: ['almuerzo'],
  rangoPrecio: '$$',
  enlaceMapa: '',
  lat: null,
  lng: null,
  notas: '',
  cartaTexto: '',
};

const PASOS = [
  { n: 1, titulo: 'El restaurante', ayuda: 'Datos básicos' },
  { n: 2, titulo: 'Tu ubicación', ayuda: 'El pin exacto en el mapa' },
  { n: 3, titulo: 'Tu carta', ayuda: 'Una foto y la cargamos nosotros' },
  { n: 4, titulo: 'Enviar', ayuda: 'Revisa y listo' },
];

export default function FormularioAlta() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<Datos>(DATOS_INICIALES);
  const [carta, setCarta] = useState<File[]>([]);
  const [fotos, setFotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<{ folio: string; mensaje: string } | null>(null);
  const [ubicacionLista, setUbicacionLista] = useState(false);

  const cartaRef = useRef<HTMLInputElement>(null);
  const fotosRef = useRef<HTMLInputElement>(null);
  const mapaRef = useRef<HTMLDivElement>(null);
  const mapaInstancia = useRef<any>(null);
  const marcador = useRef<any>(null);

  // ── Guardado automático ─────────────────────────────────────────────────
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_ALMACEN);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        setDatos((d) => ({ ...d, ...parsed.datos }));
      }
    } catch {
      /* sin datos guardados */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CLAVE_ALMACEN,
        JSON.stringify({ datos, actualizado: new Date().toISOString() })
      );
    } catch {
      /* almacenamiento no disponible */
    }
  }, [datos]);

  // ── Mini mapa (Leaflet) ─────────────────────────────────────────────────
  useEffect(() => {
    if (paso !== 2) return;
    let vivo = true;

    (async () => {
      const L = await import('leaflet');
      if (!vivo || !mapaRef.current || mapaInstancia.current) return;

      const contenedor = mapaRef.current as any;
      if (contenedor._leaflet_id) contenedor._leaflet_id = null;

      const mapa = L.map(contenedor, {
        center: CENTRO_LOJA,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapa);

      const icono = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
                 <div style="background-color:#153E3E;color:#fff;border:2px solid #fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.3);font-size:17px;">📍</div>
                 <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #153E3E;"></div>
               </div>`,
        iconSize: [34, 40],
        iconAnchor: [17, 40],
      });

      const ponerPin = (lat: number, lng: number) => {
        if (marcador.current) {
          marcador.current.setLatLng([lat, lng]);
        } else {
          marcador.current = L.marker([lat, lng], { icon: icono, draggable: true }).addTo(mapa);
          marcador.current.on('dragend', () => {
            const pos = marcador.current.getLatLng();
            fijarCoordenadas(pos.lat, pos.lat);
          });
        }
      };

      const fijarCoordenadas = (lat: number, lng: number) => {
        setDatos((d) => ({
          ...d,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6)),
        }));
        setUbicacionLista(true);
      };

      mapa.on('click', (e: any) => {
        ponerPin(e.latlng.lat, e.latlng.lng);
        fijarCoordenadas(e.latlng.lat, e.latlng.lng);
      });

      mapaInstancia.current = mapa;

      if (datos.lat && datos.lng) {
        ponerPin(datos.lat, datos.lng);
        mapa.setView([datos.lat, datos.lng], 16);
      }
    })();

    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  const set = <K extends keyof Datos>(campo: K, valor: Datos[K]) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const alternar = (campo: 'momentos', valor: string) =>
    setDatos((d) => {
      const lista = d[campo] as string[];
      return {
        ...d,
        [campo]: lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor],
      };
    });

  // ── Ubicación ───────────────────────────────────────────────────────────
  const extraerCoordenadas = () => {
    const coords = extractGpsFromGoogleMaps(datos.enlaceMapa);
    if (!coords) {
      setAviso('No encontré coordenadas en ese enlace. Abre el pin en Google Maps y copia la URL completa.');
      setUbicacionLista(false);
      return;
    }
    setDatos((d) => ({ ...d, lat: coords.lat, lng: coords.lng }));
    setUbicacionLista(true);
    setAviso('✓ Coordenadas listas.');
    if (mapaInstancia.current && marcador.current) {
      marcador.current.setLatLng([coords.lat, coords.lng]);
      mapaInstancia.current.setView([coords.lat, coords.lng], 16);
    }
  };

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      setAviso('Tu navegador no permite obtener la ubicación. Usa el enlace de Google Maps o marca el pin en el mapa.');
      return;
    }
    setAviso('Buscando tu ubicación…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDatos((d) => ({ ...d, lat: latitude, lng: longitude }));
        setUbicacionLista(true);
        setAviso('✓ Ubicación detectada. Ajusta el pin si hace falta.');
        if (mapaInstancia.current) {
          if (marcador.current) marcador.current.setLatLng([latitude, longitude]);
          mapaInstancia.current.setView([latitude, longitude], 16);
        }
      },
      () => {
        setAviso('No pudimos obtener tu ubicación. Marca el pin en el mapa o pega el enlace de Google Maps.');
        setUbicacionLista(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // ── Validación y navegación ────────────────────────────────────────────
  const validarPaso = (n: number): string => {
    if (n === 1) {
      if (!datos.nombreComercial.trim()) return 'Escribe el nombre comercial del restaurante.';
      if (datos.telefono.replace(/\D/g, '').length < 9) return 'Escribe tu WhatsApp de pedidos.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email.trim())) return 'Revisa el correo.';
      if (!datos.direccion.trim()) return 'Escribe la dirección del restaurante.';
      if (!datos.horarios.trim()) return 'Escribe tus horarios de atención.';
    }
    if (n === 2) {
      if (!datos.lat || !datos.lng) return 'Marca la ubicación de tu restaurante en el mapa.';
    }
    if (n === 3) {
      if (carta.length === 0 && !datos.cartaTexto.trim())
        return 'Sube una foto de tu carta o escribe el texto de tu menú.';
    }
    return '';
  };

  const avanzar = () => {
    const mensaje = validarPaso(paso);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    setError('');
    setAviso('');
    setPaso((p) => Math.min(4, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retroceder = () => {
    setError('');
    setPaso((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enviar = async () => {
    const problema = validarPaso(1) || validarPaso(2) || validarPaso(3);
    if (problema) {
      setError(problema);
      setPaso(problema === validarPaso(1) ? 1 : problema === validarPaso(2) ? 2 : 3);
      return;
    }

    setEnviando(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(datos).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, v.join(','));
        else fd.append(k, String(v ?? ''));
      });
      carta.forEach((f) => fd.append('carta', f));
      fotos.forEach((f) => fd.append('fotos', f));

      const res = await fetch('/api/formulario', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        setError(json.error || 'No pudimos enviar el formulario. Intenta de nuevo.');
        setEnviando(false);
        return;
      }

      setExito({ folio: json.folio, mensaje: json.mensaje });
      try {
        window.localStorage.removeItem(CLAVE_ALMACEN);
      } catch {
        /* sin almacenamiento */
      }
    } catch {
      setError('No pudimos enviar el formulario. Revisa tu conexión o escríbenos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  const resumen = useMemo(
    () => [
      ['Restaurante', datos.nombreComercial || '—'],
      ['WhatsApp', datos.telefono || '—'],
      ['Correo', datos.email || '—'],
      ['Dirección', datos.direccion || '—'],
      ['Horarios', datos.horarios || '—'],
      ['Ubicación',
        datos.lat && datos.lng
          ? `${datos.lat.toFixed(5)}, ${datos.lng.toFixed(5)}`
          : '—'],
      ['Tipo', CATEGORIAS_FORMULARIO.find((c) => c.slug === datos.categoria)?.nombre || '—'],
      ['Carta', carta.length > 0 ? `${carta.length} archivo(s)` : 'texto escrito'],
    ],
    [datos, carta.length]
  );

  // ── Pantalla de éxito ───────────────────────────────────────────────────
  if (exito) {
    return (
      <div className="min-h-screen bg-porcelana">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-petroleo text-3xl text-citrico">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-petroleo sm:text-4xl">¡Recibimos tu solicitud!</h1>
          <p className="mt-3 text-lg text-muted">{exito.mensaje}</p>
          <div className="mt-6 rounded-2xl border border-niebla bg-white p-5 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">Número de solicitud</p>
            <p className="mt-1 font-serif text-2xl font-bold text-petroleo">{exito.folio}</p>
            <p className="mt-3 text-sm text-muted">
              Ya tenemos tu ficha con su ubicación. Revisamos tu carta, cargamos tus platos y
              publicamos tu menú. Si falta algo te escribimos por WhatsApp.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                `Hola, acabo de enviar el formulario de alta (${exito.folio}) de ${datos.nombreComercial}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-petroleo px-6 py-3 font-bold text-white transition hover:bg-[#0E2E2E]"
            >
              Escribir por WhatsApp
            </a>
            <a
              href="/"
              className="rounded-xl border border-niebla px-6 py-3 font-bold text-petroleo transition hover:bg-white"
            >
              Volver al sitio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulario ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-porcelana">
      <section className="relative overflow-hidden bg-petroleo px-5 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-citrico px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-petroleo">
            Plan piloto · $10 al mes
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Hazte aliado de Qué Comer en Loja
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 sm:text-lg">
            Un solo paso: llena este formulario y nosotros creamos tu ficha con su ubicación en el
            mapa, cargamos tu carta y publicamos tu menú del día.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <ol className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PASOS.map((p) => {
            const activo = paso === p.n;
            const hecho = paso > p.n;
            return (
              <li key={p.n}>
                <button
                  type="button"
                  onClick={() => {
                    if (p.n < paso) setPaso(p.n);
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    activo
                      ? 'border-citrico bg-white shadow-sm'
                      : hecho
                        ? 'border-niebla bg-white/70'
                        : 'border-transparent bg-white/40'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      activo
                        ? 'bg-petroleo text-citrico'
                        : hecho
                          ? 'bg-citrico text-petroleo'
                          : 'bg-niebla/60 text-muted'
                    }`}
                  >
                    {hecho ? '✓' : p.n}
                  </span>
                  <span className="mt-2 block text-sm font-bold text-petroleo">{p.titulo}</span>
                  <span className="mt-0.5 block text-xs text-muted">{p.ayuda}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="rounded-2xl border border-niebla bg-white p-5 shadow-sm sm:p-8">
          {/* PASO 1 */}
          {paso === 1 && (
            <div className="space-y-5">
              <Campo etiqueta="Nombre comercial del restaurante" ayuda="Como te ven los clientes">
                <input
                  className="input"
                  value={datos.nombreComercial}
                  onChange={(e) => set('nombreComercial', e.target.value)}
                  placeholder="Restaurante de Ejemplo"
                />
              </Campo>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="WhatsApp de pedidos" ayuda="Con el 0 inicial">
                  <input
                    className="input"
                    inputMode="tel"
                    value={datos.telefono}
                    onChange={(e) => set('telefono', e.target.value)}
                    placeholder="0987654321"
                  />
                </Campo>
                <Campo etiqueta="Correo del establecimiento">
                  <input
                    className="input"
                    type="email"
                    value={datos.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="correo@restaurante-ejemplo.com"
                  />
                </Campo>
              </div>

              <Campo etiqueta="Dirección del restaurante">
                <input
                  className="input"
                  value={datos.direccion}
                  onChange={(e) => set('direccion', e.target.value)}
                  placeholder="Av. Siempre Viva 123 y Calle Ficticia, Loja"
                />
              </Campo>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="Referencias" ayuda="Junto a, al lado de…">
                  <input
                    className="input"
                    value={datos.referencias}
                    onChange={(e) => set('referencias', e.target.value)}
                    placeholder="Frente al parque central"
                  />
                </Campo>
                <Campo etiqueta="Horarios de atención" ayuda="Uno por línea, por día">
                  <input
                    className="input"
                    value={datos.horarios}
                    onChange={(e) => set('horarios', e.target.value)}
                    placeholder="Lun-Dom 10:00 a 22:00"
                  />
                </Campo>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-bold text-petroleo">Tipo de restaurante</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CATEGORIAS_FORMULARIO.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => set('categoria', c.slug)}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        datos.categoria === c.slug
                          ? 'border-petroleo bg-petroleo text-white'
                          : 'border-niebla bg-white hover:border-petroleo/40'
                      }`}
                    >
                      <span className="block text-sm font-bold">{c.nombre}</span>
                      <span
                        className={`block text-xs ${
                          datos.categoria === c.slug ? 'text-white/70' : 'text-muted'
                        }`}
                      >
                        {c.ejemplo}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="¿Qué sirves?" ayuda="Marca los momentos que atiendes">
                  <div className="flex flex-wrap gap-2">
                    {MOMENTOS_FORMULARIO.map((m) => (
                      <Chip
                        key={m.slug}
                        activo={datos.momentos.includes(m.slug)}
                        onClick={() => alternar('momentos', m.slug)}
                      >
                        {m.nombre}
                      </Chip>
                    ))}
                  </div>
                </Campo>
                <Campo etiqueta="Rango de precio">
                  <div className="flex flex-wrap gap-2">
                    {RANGOS_PRECIO.map((r) => (
                      <Chip
                        key={r}
                        activo={datos.rangoPrecio === r}
                        onClick={() => set('rangoPrecio', r)}
                      >
                        {r}
                      </Chip>
                    ))}
                  </div>
                </Campo>
              </div>
            </div>
          )}

          {/* PASO 2: UBICACIÓN */}
          {paso === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-muted">
                Con el pin exacto tu restaurante aparece en el mapa de Loja, en el buscador y con la
                ruta más corta desde el centro.
              </p>

              <Campo etiqueta="Enlace de Google Maps" ayuda="Abre tu negocio en Google Maps, copia el enlace y pégalo aquí">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className="input"
                    value={datos.enlaceMapa}
                    onChange={(e) => set('enlaceMapa', e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                  />
                  <button
                    type="button"
                    onClick={extraerCoordenadas}
                    className="shrink-0 rounded-xl bg-petroleo px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0E2E2E]"
                  >
                    Extraer
                  </button>
                </div>
              </Campo>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={usarMiUbicacion}
                  className="rounded-xl border border-petroleo px-5 py-2.5 text-sm font-bold text-petroleo transition hover:bg-white"
                >
                  📍 Usar mi ubicación actual
                </button>
                {datos.lat && datos.lng && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${datos.lat},${datos.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-petroleo underline"
                  >
                    Ver el pin en Google Maps
                  </a>
                )}
              </div>

              <div
                ref={mapaRef}
                className="h-72 w-full overflow-hidden rounded-xl border border-niebla"
                aria-label="Mapa para marcar la ubicación del restaurante"
              />

              {aviso && (
                <p className="rounded-xl bg-porcelana px-4 py-3 text-sm font-semibold text-grafito">
                  {aviso}
                </p>
              )}

              {ubicacionLista && datos.lat && datos.lng ? (
                <p className="rounded-xl bg-citrico/25 px-4 py-3 text-sm font-semibold text-petroleo">
                  ✓ Ubicación guardada: {datos.lat.toFixed(5)}, {datos.lng.toFixed(5)}. Puedes
                  arrastrar el pin para ajustarlo.
                </p>
              ) : (
                <p className="rounded-xl border border-dashed border-niebla px-4 py-3 text-sm text-muted">
                  Haz clic en el mapa para marcar tu local.
                </p>
              )}
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-dashed border-niebla bg-porcelana/60 p-5 text-center">
                <p className="text-sm font-bold text-petroleo">Sube una foto de tu carta o tu menú</p>
                <p className="mx-auto mt-1 max-w-md text-xs text-muted">
                  Con una sola foto la leemos, la cargamos y la dejamos lista en tu ficha. JPG, PNG,
                  WEBP o PDF, hasta 6 MB por archivo.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => cartaRef.current?.click()}
                    className="rounded-xl bg-petroleo px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0E2E2E]"
                  >
                    Elegir carta o menú
                  </button>
                  <input
                    ref={cartaRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif,.pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => setCarta(Array.from(e.target.files || []).slice(0, 8))}
                  />
                </div>
                {carta.length > 0 && (
                  <ul className="mt-4 space-y-1 text-left text-xs text-muted">
                    {carta.map((f) => (
                      <li key={f.name}>
                        📄 {f.name} · {(f.size / 1024 / 1024).toFixed(2)} MB
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-dashed border-niebla bg-porcelana/60 p-5 text-center">
                <p className="text-sm font-bold text-petroleo">Fotos del local o de tus platos</p>
                <p className="mt-1 text-xs text-muted">Opcional. Entre 3 y 5 se ven mejor.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fotosRef.current?.click()}
                    className="rounded-xl border border-petroleo px-5 py-2.5 text-sm font-bold text-petroleo transition hover:bg-white"
                  >
                    Elegir fotos
                  </button>
                  <input
                    ref={fotosRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif"
                    multiple
                    className="hidden"
                    onChange={(e) => setFotos(Array.from(e.target.files || []).slice(0, 8))}
                  />
                </div>
                {fotos.length > 0 && (
                  <ul className="mt-4 space-y-1 text-left text-xs text-muted">
                    {fotos.map((f) => (
                      <li key={f.name}>
                        🖼️ {f.name} · {(f.size / 1024 / 1024).toFixed(2)} MB
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Campo etiqueta="O escribe aquí tu carta" ayuda="Si la foto no se entiende, la escribes tú">
                <textarea
                  className="input min-h-[140px]"
                  value={datos.cartaTexto}
                  onChange={(e) => set('cartaTexto', e.target.value)}
                  placeholder={'Menú del día\n1. Arroz con menestra $6.50\n2. Cecina asada $8.00\n…'}
                />
              </Campo>
            </div>
          )}

          {/* PASO 4 */}
          {paso === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-petroleo">Revisa y envía</h2>
                <p className="mt-1 text-sm text-muted">
                  Si algo no está bien, vuelve al paso con el botón de abajo.
                </p>
              </div>

              <dl className="divide-y divide-niebla rounded-xl border border-niebla">
                {resumen.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="text-right text-sm font-semibold text-petroleo">{v}</dd>
                  </div>
                ))}
              </dl>

              <label className="flex items-start gap-3 rounded-xl bg-porcelana p-4 text-sm text-grafito">
                <input type="checkbox" required defaultChecked className="mt-1 h-4 w-4 accent-[#153E3E]" />
                <span>
                  Confirmo que los datos son correctos y autorizo a Qué Comer en Loja a publicar la
                  información de mi restaurante en el portal.
                </span>
              </label>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={retroceder}
              disabled={paso === 1}
              className="rounded-xl border border-niebla px-5 py-3 text-sm font-bold text-petroleo transition hover:bg-porcelana disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Anterior
            </button>

            {paso < 4 ? (
              <button
                type="button"
                onClick={avanzar}
                className="rounded-xl bg-petroleo px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0E2E2E]"
              >
                Continuar →
              </button>
            ) : (
              <button
                type="button"
                onClick={enviar}
                disabled={enviando}
                className="rounded-xl bg-citrico px-6 py-3 text-sm font-bold text-petroleo transition hover:bg-[#c3cf55] disabled:opacity-60"
              >
                {enviando ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          ¿Prefieres escribir?{' '}
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              'Hola, quiero hacerme aliado de Qué Comer en Loja.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-petroleo underline"
          >
            WhatsApp +593 98 696 2872
          </a>
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-niebla);
          background: #fff;
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
          color: var(--color-grafito);
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .input:focus {
          border-color: var(--color-petroleo);
          box-shadow: 0 0 0 3px rgba(21, 62, 62, 0.08);
        }
      `}</style>
    </div>
  );
}

function Campo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-petroleo">{etiqueta}</span>
      {ayuda && <span className="mb-1.5 block text-xs text-muted">{ayuda}</span>}
      {children}
    </label>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        activo
          ? 'border-petroleo bg-petroleo text-white'
          : 'border-niebla bg-white text-grafito hover:border-petroleo/40'
      }`}
    >
      {children}
    </button>
  );
}
