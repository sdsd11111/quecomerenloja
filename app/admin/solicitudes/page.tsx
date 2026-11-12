'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const AUTH_COOKIE_NAME = 'admin_session_token';

type Plato = {
  nombre: string;
  descripcion?: string;
  precio?: number | null;
  momento?: string;
  palabrasClave?: string;
};

type Solicitud = {
  id: number;
  folio: string;
  nombreComercial: string;
  ruc: string | null;
  propietario: string | null;
  telefono: string;
  telefonoAlt: string | null;
  email: string;
  emailPersonal: string | null;
  direccion: string;
  referencias: string | null;
  horarios: string | null;
  categorias: string[];
  momentos: string[];
  rangoPrecio: string | null;
  metodosPago: string[];
  redesUrl: string | null;
  cuentaBancaria: string | null;
  notas: string | null;
  cartaTexto: string | null;
  estado: string;
  motivoRechazo: string | null;
  borrador: Plato[] | null;
  aliadoId: number | null;
  creadoEn: string;
  archivos: { id: number; tipo: string; nombre: string; url: string; mime: string | null }[];
};

const ESTADOS = [
  { slug: '', nombre: 'Todas' },
  { slug: 'recibido', nombre: 'Recibidas' },
  { slug: 'en_revision', nombre: 'En revisión' },
  { slug: 'aprobado', nombre: 'Aprobadas' },
  { slug: 'publicado', nombre: 'Publicadas' },
  { slug: 'rechazado', nombre: 'Rechazadas' },
];

export default function AdminSolicitudesPage() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [resumen, setResumen] = useState<Record<string, number>>({});
  const [filtro, setFiltro] = useState('');
  const [seleccion, setSeleccion] = useState<Solicitud | null>(null);
  const [borrador, setBorrador] = useState<Plato[]>([]);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/solicitudes');
      if (res.status === 401) {
        setAutenticado(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSolicitudes(data.solicitudes || []);
        setResumen(data.resumen || {});
        setAutenticado(true);
      }
    } catch {
      setError('No se pudieron cargar las solicitudes.');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const entrar = async () => {
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.success) {
      setAutenticado(true);
      cargar();
    } else {
      setError('Contraseña incorrecta.');
    }
  };

  const abrir = (s: Solicitud) => {
    setSeleccion(s);
    setBorrador(s.borrador || []);
    setMensaje(null);
  };

  const accion = async (cuerpo: Record<string, unknown>, exito: string) => {
    if (!seleccion) return;
    setOcupado(true);
    setMensaje(null);
    try {
      const res = await fetch(`/api/admin/solicitudes/${seleccion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setMensaje({ tipo: 'error', texto: data.error || 'No se pudo completar la acción.' });
      } else {
        const extra = data.avisos?.length ? ` ${data.avisos.join(' ')}` : '';
        setMensaje({ tipo: 'ok', texto: exito + extra });
        await cargar();
        const actualizada = (await (await fetch(`/api/admin/solicitudes/${seleccion.id}`)).json()).solicitud;
        if (actualizada) {
          setSeleccion(actualizada);
          setBorrador(actualizada.borrador || []);
        }
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de red.' });
    } finally {
      setOcupado(false);
    }
  };

  const guardarBorrador = () =>
    accion({ accion: 'borrador', platos: borrador }, 'Borrador guardado.');

  const publicar = () =>
    accion({ accion: 'publicar', platos: borrador }, 'Ficha publicada correctamente.');

  const filtradas = filtro
    ? solicitudes.filter((s) => s.estado === filtro)
    : solicitudes;

  // ── Login ───────────────────────────────────────────────────────────────
  if (autenticado === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-porcelana px-5">
        <div className="w-full max-w-sm rounded-2xl border border-niebla bg-white p-7">
          <h1 className="text-xl font-bold text-petroleo">Solicitudes de alta</h1>
          <p className="mt-1 text-sm text-muted">Acceso restringido al equipo.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
            placeholder="Contraseña"
            className="mt-5 w-full rounded-xl border border-niebla px-4 py-3 text-sm outline-none focus:border-petroleo"
          />
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
          <button
            onClick={entrar}
            className="mt-5 w-full rounded-xl bg-petroleo px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0E2E2E]"
          >
            Entrar
          </button>
          <Link
            href="/admin"
            className="mt-4 block text-center text-xs font-semibold text-muted hover:text-petroleo"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelana px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-petroleo">Solicitudes de alta</h1>
            <p className="mt-1 text-sm text-muted">
              Formulario de quecomerenloja.com/formulario ·{' '}
              {Object.entries(resumen)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ') || 'sin datos'}
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-niebla bg-white px-4 py-2 text-sm font-bold text-petroleo transition hover:bg-porcelana"
          >
            ← Panel de aliados
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {ESTADOS.map((e) => (
            <button
              key={e.slug}
              onClick={() => setFiltro(e.slug)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                filtro === e.slug
                  ? 'border-petroleo bg-petroleo text-white'
                  : 'border-niebla bg-white text-grafito hover:border-petroleo/40'
              }`}
            >
              {e.nombre}
            </button>
          ))}
          <button
            onClick={cargar}
            className="rounded-full border border-niebla bg-white px-4 py-1.5 text-xs font-bold text-muted transition hover:text-petroleo"
          >
            ↻ Actualizar
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Listado */}
          <div className="space-y-3">
            {filtradas.length === 0 && (
              <p className="rounded-xl border border-niebla bg-white p-6 text-center text-sm text-muted">
                Todavía no hay solicitudes.
              </p>
            )}
            {filtradas.map((s) => (
              <button
                key={s.id}
                onClick={() => abrir(s)}
                className={`block w-full rounded-xl border bg-white p-4 text-left transition ${
                  seleccion?.id === s.id
                    ? 'border-citrico shadow-sm'
                    : 'border-niebla hover:border-petroleo/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-petroleo">{s.nombreComercial}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {s.folio} · {s.telefono} · {new Date(s.creadoEn).toLocaleString('es-EC')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      s.estado === 'publicado'
                        ? 'bg-citrico text-petroleo'
                        : s.estado === 'rechazado'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-niebla/60 text-muted'
                    }`}
                  >
                    {s.estado}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted">
                  {s.direccion} · {s.horarios}
                </p>
              </button>
            ))}
          </div>

          {/* Detalle */}
          <div className="space-y-4">
            {!seleccion && (
              <div className="rounded-xl border border-niebla bg-white p-8 text-center text-sm text-muted">
                Selecciona una solicitud para revisarla.
              </div>
            )}

            {seleccion && (
              <>
                <div className="rounded-xl border border-niebla bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-petroleo">{seleccion.nombreComercial}</h2>
                      <p className="mt-0.5 text-xs text-muted">
                        {seleccion.folio} · {seleccion.propietario || 'Sin propietario'}
                      </p>
                    </div>
                    <span className="rounded-full bg-niebla/60 px-3 py-1 text-[10px] font-bold uppercase text-muted">
                      {seleccion.estado}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <Dato etiqueta="RUC / cédula" valor={seleccion.ruc} />
                    <Dato etiqueta="WhatsApp" valor={seleccion.telefono} />
                    <Dato etiqueta="Teléfono alterno" valor={seleccion.telefonoAlt} />
                    <Dato etiqueta="Correo" valor={seleccion.email} />
                    <Dato etiqueta="Correo personal" valor={seleccion.emailPersonal} />
                    <Dato etiqueta="Horarios" valor={seleccion.horarios} />
                    <Dato etiqueta="Dirección" valor={seleccion.direccion} />
                    <Dato etiqueta="Referencias" valor={seleccion.referencias} />
                    <Dato etiqueta="Tipo" valor={seleccion.categorias.join(', ')} />
                    <Dato etiqueta="Momentos" valor={seleccion.momentos.join(', ')} />
                    <Dato etiqueta="Precio" valor={seleccion.rangoPrecio} />
                    <Dato etiqueta="Métodos de pago" valor={seleccion.metodosPago.join(', ')} />
                    <Dato etiqueta="Redes" valor={seleccion.redesUrl} />
                    <Dato etiqueta="Cuenta bancaria" valor={seleccion.cuentaBancaria} />
                    <Dato etiqueta="Notas" valor={seleccion.notas} />
                  </dl>

                  {seleccion.cartaTexto && (
                    <details className="mt-4 rounded-lg bg-porcelana p-3">
                      <summary className="cursor-pointer text-xs font-bold text-petroleo">
                        Texto de la carta enviado
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-grafito">
                        {seleccion.cartaTexto}
                      </pre>
                    </details>
                  )}

                  {seleccion.archivos.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">
                        Archivos ({seleccion.archivos.length})
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {seleccion.archivos.map((a) => (
                          <a
                            key={a.id}
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-niebla bg-white px-3 py-2 text-xs font-semibold text-petroleo hover:border-petroleo"
                          >
                            {a.tipo === 'carta' ? '📄' : '🖼️'} {a.nombre}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Borrador de platos */}
                <div className="rounded-xl border border-niebla bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-petroleo">
                      Platos detectados ({borrador.length})
                    </h3>
                    <button
                      onClick={() => setBorrador([...borrador, { nombre: '', precio: null }])}
                      className="rounded-lg border border-niebla px-3 py-1.5 text-xs font-bold text-petroleo hover:border-petroleo"
                    >
                      + Agregar plato
                    </button>
                  </div>

                  {borrador.length === 0 ? (
                    <p className="mt-3 text-sm text-muted">
                      La lectura automática no encontró platos. Agrégalos a mano o pídele la carta
                      por WhatsApp.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {borrador.map((p, i) => (
                        <div key={i} className="rounded-lg border border-niebla p-3">
                          <div className="flex gap-2">
                            <input
                              className="flex-1 rounded-lg border border-niebla px-3 py-2 text-sm outline-none focus:border-petroleo"
                              value={p.nombre}
                              placeholder="Nombre del plato"
                              onChange={(e) =>
                                setBorrador((b) =>
                                  b.map((x, j) => (j === i ? { ...x, nombre: e.target.value } : x))
                                )
                              }
                            />
                            <input
                              className="w-24 rounded-lg border border-niebla px-3 py-2 text-sm outline-none focus:border-petroleo"
                              value={p.precio ?? ''}
                              placeholder="$"
                              inputMode="decimal"
                              onChange={(e) =>
                                setBorrador((b) =>
                                  b.map((x, j) =>
                                    j === i
                                      ? {
                                          ...x,
                                          precio: e.target.value
                                            ? Number(e.target.value.replace(/[^\d.]/g, ''))
                                            : null,
                                        }
                                      : x
                                  )
                                )
                              }
                            />
                            <button
                              onClick={() => setBorrador((b) => b.filter((_, j) => j !== i))}
                              className="rounded-lg px-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            className="mt-2 w-full rounded-lg border border-niebla px-3 py-2 text-sm outline-none focus:border-petroleo"
                            value={p.palabrasClave || ''}
                            placeholder="Palabras clave (repe, cecina, menestra…)"
                            onChange={(e) =>
                              setBorrador((b) =>
                                b.map((x, j) => (j === i ? { ...x, palabrasClave: e.target.value } : x))
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={guardarBorrador}
                      disabled={ocupado}
                      className="rounded-lg border border-petroleo px-4 py-2 text-xs font-bold text-petroleo transition hover:bg-petroleo hover:text-white disabled:opacity-50"
                    >
                      Guardar borrador
                    </button>
                    <button
                      onClick={publicar}
                      disabled={ocupado}
                      className="rounded-lg bg-citrico px-4 py-2 text-xs font-bold text-petroleo transition hover:bg-[#c3cf55] disabled:opacity-50"
                    >
                      Publicar ficha
                    </button>
                    <button
                      onClick={() => accion({ accion: 'estado', estado: 'en_revision' }, 'Marcada en revisión.')}
                      disabled={ocupado}
                      className="rounded-lg border border-niebla px-4 py-2 text-xs font-bold text-grafito transition hover:border-petroleo disabled:opacity-50"
                    >
                      Marcar en revisión
                    </button>
                    <a
                      href={`https://wa.me/${(seleccion.telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola ${seleccion.nombreComercial}, gracias por enviar el formulario. Para completar su ficha necesitamos: ...`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-niebla px-4 py-2 text-xs font-bold text-grafito transition hover:border-petroleo"
                    >
                      Pedir por WhatsApp
                    </a>
                    <button
                      onClick={() => accion({ accion: 'estado', estado: 'rechazado' }, 'Solicitud rechazada.')}
                      disabled={ocupado}
                      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </div>

                  {mensaje && (
                    <p
                      className={`mt-3 rounded-lg px-3 py-2 text-xs font-semibold ${
                        mensaje.tipo === 'ok'
                          ? 'bg-citrico/30 text-petroleo'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {mensaje.texto}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  if (!valor) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-niebla/60 pb-1.5">
      <dt className="text-xs text-muted">{etiqueta}</dt>
      <dd className="text-right text-xs font-semibold text-grafito">{valor}</dd>
    </div>
  );
}
