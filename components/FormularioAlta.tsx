'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIAS_FORMULARIO,
  METODOS_PAGO,
  MOMENTOS_FORMULARIO,
  RANGOS_PRECIO,
} from '@/lib/formulario';

const CLAVE_ALMACEN = 'qccl-formulario-alta-v1';
const WHATSAPP = '593986962872';

type Datos = {
  nombreComercial: string;
  ruc: string;
  propietario: string;
  telefono: string;
  telefonoAlt: string;
  email: string;
  emailPersonal: string;
  direccion: string;
  referencias: string;
  horarios: string;
  categoria: string;
  momentos: string[];
  rangoPrecio: string;
  metodosPago: string[];
  redesUrl: string;
  cuentaBancaria: string;
  notas: string;
  cartaTexto: string;
};

const DATOS_INICIALES: Datos = {
  nombreComercial: '',
  ruc: '',
  propietario: '',
  telefono: '',
  telefonoAlt: '',
  email: '',
  emailPersonal: '',
  direccion: '',
  referencias: '',
  horarios: '',
  categoria: 'tradicional',
  momentos: ['almuerzo'],
  rangoPrecio: '$$',
  metodosPago: ['Efectivo'],
  redesUrl: '',
  cuentaBancaria: '',
  notas: '',
  cartaTexto: '',
};

const PASOS = [
  { n: 1, titulo: 'El restaurante', ayuda: 'Datos básicos de tu negocio' },
  { n: 2, titulo: 'Contacto y cobro', ayuda: 'Cómo te llamamos y te cobramos' },
  { n: 3, titulo: 'Tu carta', ayuda: 'Una foto y la cargamos nosotros' },
  { n: 4, titulo: 'Enviar', ayuda: 'Revisa y listo' },
];

export default function FormularioAlta() {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState<Datos>(DATOS_INICIALES);
  const [carta, setCarta] = useState<File[]>([]);
  const [fotos, setFotos] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<{ folio: string; mensaje: string } | null>(null);
  const cartaRef = useRef<HTMLInputElement>(null);
  const fotosRef = useRef<HTMLInputElement>(null);

  // ── Guardado automático (para no perder nada si se cierra la página) ────
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

  const set = <K extends keyof Datos>(campo: K, valor: Datos[K]) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const alternar = (campo: 'momentos' | 'metodosPago', valor: string) =>
    setDatos((d) => {
      const lista = d[campo] as string[];
      return {
        ...d,
        [campo]: lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor],
      };
    });

  const validarPaso = (n: number): string => {
    if (n === 1) {
      if (!datos.nombreComercial.trim()) return 'Escribe el nombre comercial del restaurante.';
      if (!/^\d{10}$|^\d{13}$/.test(datos.ruc.replace(/\D/g, '')))
        return 'El RUC (13 dígitos) o la cédula (10 dígitos) no parece válido.';
      if (datos.telefono.replace(/\D/g, '').length < 9) return 'Escribe tu WhatsApp con 9 dígitos.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email.trim()))
        return 'Revisa el correo del establecimiento.';
      if (!datos.direccion.trim()) return 'Escribe la dirección del restaurante.';
      if (!datos.horarios.trim()) return 'Escribe tus horarios de atención.';
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
    setPaso((p) => Math.min(4, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retroceder = () => {
    setError('');
    setPaso((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enviar = async () => {
    const mensaje = validarPaso(1) || validarPaso(3);
    if (mensaje) {
      setError(mensaje);
      setPaso(mensaje === validarPaso(1) ? 1 : 3);
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
      ['RUC / cédula', datos.ruc || '—'],
      ['WhatsApp', datos.telefono || '—'],
      ['Correo', datos.email || '—'],
      ['Dirección', datos.direccion || '—'],
      ['Horarios', datos.horarios || '—'],
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
              Qué sigue: revisamos tu carta, cargamos tus platos y publicamos tu ficha. Si falta algo te
              escribimos por WhatsApp.
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
      {/* Encabezado */}
      <section className="relative overflow-hidden bg-petroleo px-5 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-citrico px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-petroleo">
            Plan piloto · $10 al mes
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Hazte aliado de Qué Comer en Loja
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80 sm:text-lg">
            Un solo paso: llena este formulario y nosotros creamos tu ficha, cargamos tu carta y
            publicamos tu menú del día. Sin formularios, sin que cargues nada.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* Stepper */}
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
              <Campo etiqueta="Nombre comercial del restaurante" obligatorio>
                <input
                  className="input"
                  value={datos.nombreComercial}
                  onChange={(e) => set('nombreComercial', e.target.value)}
                  placeholder="Chimichurri Fast Food"
                />
              </Campo>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="RUC o cédula" obligatorio ayuda="13 dígitos (RUC) o 10 (cédula)">
                  <input
                    className="input"
                    inputMode="numeric"
                    value={datos.ruc}
                    onChange={(e) => set('ruc', e.target.value.replace(/\D/g, ''))}
                    placeholder="0999999999000"
                  />
                </Campo>
                <Campo etiqueta="Nombre del propietario" ayuda="Quien firma el acuerdo">
                  <input
                    className="input"
                    value={datos.propietario}
                    onChange={(e) => set('propietario', e.target.value)}
                    placeholder="José Mauricio Pardo Acaro"
                  />
                </Campo>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="WhatsApp de pedidos" obligatorio ayuda="Con el 0 inicial">
                  <input
                    className="input"
                    inputMode="tel"
                    value={datos.telefono}
                    onChange={(e) => set('telefono', e.target.value)}
                    placeholder="0984222336"
                  />
                </Campo>
                <Campo etiqueta="Correo del establecimiento">
                  <input
                    className="input"
                    type="email"
                    value={datos.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="chefmauriciopardo@gmail.com"
                  />
                </Campo>
              </div>

              <Campo etiqueta="Dirección del restaurante" obligatorio>
                <input
                  className="input"
                  value={datos.direccion}
                  onChange={(e) => set('direccion', e.target.value)}
                  placeholder="Calles Zoilo Rodríguez y 24 de Mayo, Loja"
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
                <Campo etiqueta="Horarios de atención" obligatorio ayuda="Uno por línea, por día">
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

          {/* PASO 2 */}
          {paso === 2 && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Campo etiqueta="Teléfono secundario" ayuda="Opcional">
                  <input
                    className="input"
                    inputMode="tel"
                    value={datos.telefonoAlt}
                    onChange={(e) => set('telefonoAlt', e.target.value)}
                    placeholder="0979332245"
                  />
                </Campo>
                <Campo etiqueta="Correo personal" ayuda="Opcional">
                  <input
                    className="input"
                    type="email"
                    value={datos.emailPersonal}
                    onChange={(e) => set('emailPersonal', e.target.value)}
                    placeholder="mpardoacaro@gmail.com"
                  />
                </Campo>
              </div>

              <Campo etiqueta="Redes sociales o web actual" ayuda="Opcional">
                <input
                  className="input"
                  value={datos.redesUrl}
                  onChange={(e) => set('redesUrl', e.target.value)}
                  placeholder="https://facebook.com/turestaurante"
                />
              </Campo>

              <Campo etiqueta="Métodos de pago">
                <div className="flex flex-wrap gap-2">
                  {METODOS_PAGO.map((m) => (
                    <Chip
                      key={m}
                      activo={datos.metodosPago.includes(m)}
                      onClick={() => alternar('metodosPago', m)}
                    >
                      {m}
                    </Chip>
                  ))}
                </div>
              </Campo>

              <Campo
                etiqueta="Cuenta bancaria para el cobro mensual"
                ayuda="Opcional. Solo la vemos nosotros; nunca se publica."
              >
                <textarea
                  className="input min-h-[88px]"
                  value={datos.cuentaBancaria}
                  onChange={(e) => set('cuentaBancaria', e.target.value)}
                  placeholder="Banco, tipo de cuenta, número y titular"
                />
              </Campo>

              <Campo etiqueta="Algo más que debamos saber" ayuda="Opcional">
                <textarea
                  className="input min-h-[88px]"
                  value={datos.notas}
                  onChange={(e) => set('notas', e.target.value)}
                  placeholder="Polo especial los fines de semana, tenemos parqueadero…"
                />
              </Campo>
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
                  placeholder={"Menú del día\n1. Arroz con menestra $6.50\n2. Cecina asada $8.00\n…"}
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

          {/* Navegación */}
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
              'Hola, quiero hazerme aliado de Qué Comer en Loja.'
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

// ── Piezas auxiliares ─────────────────────────────────────────────────────
function Campo({
  etiqueta,
  ayuda,
  obligatorio,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  obligatorio?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-petroleo">
        {etiqueta}
        {obligatorio && <span className="ml-1 text-xs font-semibold text-muted">· obligatorio</span>}
      </span>
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
