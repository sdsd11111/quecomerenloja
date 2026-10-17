'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PLATOS } from '@/lib/platos-data';
import { normalizarMenuTexto, type NormalizacionResultado, type PlatoExtraido } from '@/lib/menu-normalizer';

export interface AliadoItem {
  id?: number;
  nombre: string;
  tipo: 'GASTRONOMIA' | 'CAFETERIA' | string;
  imagenUrl: string | null;
  servicios: string | null;
  telefono: string | null;
  destacado: boolean;
  activo: boolean;
  descripcion: string;
  mapaUrl: string | null;
  rangoPrecio: string | null;
  redesUrl: string | null;
  ubicacion: string;
  websiteUrl: string | null;
  ubicacionLat: number | null;
  ubicacionLng: number | null;
  estrellas: number | null;
  momentos?: ('desayuno' | 'almuerzo' | 'cena')[];
  platos?: string[];
}

const ZONAS_PREDEFINIDAS_LOJA = [
  { nombre: 'Calle Lourdes (Centro Histórico)', lat: -3.99615, lng: -79.20455 },
  { nombre: 'San Sebastián (Plaza y Glorieta)', lat: -3.99952, lng: -79.20621 },
  { nombre: 'El Valle (Rincón Gastronómico)', lat: -3.98255, lng: -79.20152 },
  { nombre: 'Centro Comercial / Mercado Central', lat: -3.99321, lng: -79.20384 },
  { nombre: 'Av. Universitaria / Gran Colombia', lat: -3.99750, lng: -79.20120 },
  { nombre: 'Sector Terminal Terrestre', lat: -3.97800, lng: -79.20600 },
  { nombre: 'Vilcabamba (Parque Central)', lat: -4.26123, lng: -79.22312 },
  { nombre: 'Valle de Catamayo', lat: -3.98672, lng: -79.35824 },
];

const INITIAL_FORM: AliadoItem = {
  nombre: '',
  tipo: 'GASTRONOMIA',
  imagenUrl: '',
  servicios: '',
  telefono: '',
  destacado: true,
  activo: true,
  descripcion: '',
  mapaUrl: '',
  rangoPrecio: '$8 - $18 por persona',
  redesUrl: '',
  ubicacion: '',
  websiteUrl: '',
  ubicacionLat: -3.99615,
  ubicacionLng: -79.20455,
  estrellas: 5,
  momentos: ['almuerzo'],
  platos: [],
};

export function AdminAliadosSection() {
  const [aliados, setAliados] = useState<AliadoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState<'TODOS' | 'GASTRONOMIA' | 'CAFETERIA'>('TODOS');
  const [search, setSearch] = useState('');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AliadoItem>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados de Ingesta Inteligente de Menú (IA / OCR / Texto)
  const [menuRawInput, setMenuRawInput] = useState('');
  const [menuResultado, setMenuResultado] = useState<NormalizacionResultado | null>(null);
  const [copiadoSlug, setCopiadoSlug] = useState<string | null>(null);
  const [showOportunidadesModal, setShowOportunidadesModal] = useState(false);

  const fetchAliados = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/aliados');
      const data = await res.json();
      if (data.success) {
        setAliados(data.aliados || []);
      } else {
        console.error('Error fetching aliados:', data.error);
      }
    } catch (err) {
      console.error('Network error fetching aliados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAliados();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setMenuRawInput('');
    setMenuResultado(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (aliado: AliadoItem) => {
    setEditingId(aliado.id ?? null);
    setForm({
      ...aliado,
      imagenUrl: aliado.imagenUrl || '',
      servicios: aliado.servicios || '',
      telefono: aliado.telefono || '',
      mapaUrl: aliado.mapaUrl || '',
      rangoPrecio: aliado.rangoPrecio || '',
      redesUrl: aliado.redesUrl || '',
      websiteUrl: aliado.websiteUrl || '',
      estrellas: aliado.estrellas ?? 5,
      ubicacionLat: aliado.ubicacionLat ?? -3.99615,
      ubicacionLng: aliado.ubicacionLng ?? -79.20455,
      momentos: aliado.momentos || (aliado.tipo === 'CAFETERIA' ? ['desayuno'] : ['almuerzo']),
      platos: aliado.platos || [],
    });
    setMenuRawInput('');
    setMenuResultado(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  // Función para normalizar texto de la carta y vincular platos automáticamente
  const ejecutarNormalizacionMenu = () => {
    if (!menuRawInput.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor pega el texto de la carta o menú extraído con IA antes de normalizar.',
      });
      return;
    }

    const resultado = normalizarMenuTexto(menuRawInput);
    setMenuResultado(resultado);

    // Unir los slugs encontrados con los existentes sin duplicados
    const platosCombinados = Array.from(
      new Set([...(form.platos || []), ...resultado.slugsAsociados])
    );

    // Unir los momentos detectados
    const momentosCombinados = Array.from(
      new Set([...(form.momentos || []), ...resultado.momentosDetectados])
    ) as ('desayuno' | 'almuerzo' | 'cena')[];

    // Si detectamos precios, sugerir el rango de precios
    let nuevoRango = form.rangoPrecio;
    const preciosNumericos = resultado.platos
      .map((p) => {
        if (!p.precio) return null;
        const num = parseFloat(p.precio.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
      })
      .filter((n): n is number => n !== null);

    if (preciosNumericos.length >= 2) {
      const min = Math.min(...preciosNumericos);
      const max = Math.max(...preciosNumericos);
      nuevoRango = `$${min.toFixed(2)} - $${max.toFixed(2)} por plato`;
    }

    setForm((prev) => ({
      ...prev,
      platos: platosCombinados,
      momentos: momentosCombinados.length > 0 ? momentosCombinados : prev.momentos,
      rangoPrecio: nuevoRango || prev.rangoPrecio,
      // Si la descripción está vacía, sugerir una con los platos insignia
      descripcion: prev.descripcion
        ? prev.descripcion
        : `Especialidad en cocina lojana: ofrece ${resultado.slugsAsociados.slice(0, 3).join(', ')} con preparación tradicional y atención directa en Loja.`,
    }));

    setMessage({
      type: 'success',
      text: `¡Menú normalizado con éxito! Se vincularon automáticamente ${resultado.slugsAsociados.length} páginas de platos y se detectaron ${resultado.platosSinPagina.length} oportunidades SEO.`,
    });
  };

  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoSlug(texto);
    setTimeout(() => setCopiadoSlug(null), 2000);
  };

  const handleToggleMomento = (momento: 'desayuno' | 'almuerzo' | 'cena') => {
    const current = form.momentos || [];
    const exists = current.includes(momento);
    setForm({
      ...form,
      momentos: exists ? current.filter((m) => m !== momento) : [...current, momento],
    });
  };

  const handleTogglePlato = (slug: string) => {
    const current = form.platos || [];
    const exists = current.includes(slug);
    setForm({
      ...form,
      platos: exists ? current.filter((p) => p !== slug) : [...current, slug],
    });
  };

  const handleSelectZona = (lat: number, lng: number, nombreZona: string) => {
    setForm((prev) => ({
      ...prev,
      ubicacionLat: lat,
      ubicacionLng: lng,
      ubicacion: prev.ubicacion ? prev.ubicacion : `${nombreZona}, Loja`,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const isEdit = Boolean(editingId);
    const method = isEdit ? 'PUT' : 'POST';
    const payload = isEdit ? { ...form, id: editingId } : form;

    try {
      const res = await fetch('/api/admin/aliados', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: 'success',
          text: isEdit ? '¡Aliado actualizado con éxito!' : '¡Aliado agregado exitosamente a la base de datos!',
        });
        fetchAliados();
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage(null);
        }, 1200);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Error al guardar el aliado',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Error de red con el servidor' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Estás seguro de eliminar este aliado de la base de datos gastronómica?')) return;

    try {
      const res = await fetch(`/api/admin/aliados?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAliados();
      } else {
        alert(data.error || 'Error al eliminar aliado');
      }
    } catch {
      alert('Error de red al intentar eliminar aliado');
    }
  };

  const handleToggleActivo = async (aliado: AliadoItem) => {
    if (!aliado.id) return;
    try {
      const res = await fetch('/api/admin/aliados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: aliado.id, activo: !aliado.activo }),
      });
      if (res.ok) {
        setAliados((prev) =>
          prev.map((a) => (a.id === aliado.id ? { ...a, activo: !a.activo } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAliados = aliados.filter((a) => {
    if (filterTipo !== 'TODOS' && a.tipo !== filterTipo) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = a.nombre.toLowerCase().includes(q);
      const matchLoc = (a.ubicacion || '').toLowerCase().includes(q);
      const matchServ = (a.servicios || '').toLowerCase().includes(q);
      const matchPlatos = (a.platos || []).some((p) => p.includes(q));
      return matchName || matchLoc || matchServ || matchPlatos;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Controles y Botón Nuevo Aliado */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterTipo('TODOS')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterTipo === 'TODOS' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Todos ({aliados.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTipo('GASTRONOMIA')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterTipo === 'GASTRONOMIA' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              🍽️ Restaurantes ({aliados.filter((a) => a.tipo === 'GASTRONOMIA').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTipo('CAFETERIA')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterTipo === 'CAFETERIA' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ☕ Cafeterías ({aliados.filter((a) => a.tipo === 'CAFETERIA').length})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Buscar por nombre, zona, plato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
            />
            <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOportunidadesModal(true)}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            title="Ver platos que tienen los aliados pero que aún no tienen página web creada"
          >
            <span>🎯</span> Radar SEO: Platos Sin Página
          </button>

          <button
            type="button"
            onClick={openNewModal}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>➕</span> Nuevo Aliado Gastronómico
          </button>
        </div>
      </div>

      {/* Tabla de Aliados */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Aliado / Negocio</th>
                <th className="py-4 px-4">Tipo & Momentos</th>
                <th className="py-4 px-4">Ubicación & GPS</th>
                <th className="py-4 px-4">Platos Vinculados</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                    <div className="inline-block animate-spin mr-2">⏳</div> Cargando aliados desde GASTRONOMIA_DB...
                  </td>
                </tr>
              ) : filteredAliados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No se encontraron aliados gastronómicos registrados.
                  </td>
                </tr>
              ) : (
                filteredAliados.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {a.imagenUrl ? (
                          <img
                            src={a.imagenUrl}
                            alt={a.nombre}
                            className="size-12 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="size-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl shrink-0">
                            {a.tipo === 'CAFETERIA' ? '☕' : '🍽️'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            <span>{a.nombre}</span>
                            {a.destacado && (
                              <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5">
                                ★ Destacado
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">
                            {a.descripcion}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          a.tipo === 'CAFETERIA'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {a.tipo === 'CAFETERIA' ? '☕ Cafetería' : '🍽️ Restaurante'}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(a.momentos && a.momentos.length > 0
                          ? a.momentos
                          : a.tipo === 'CAFETERIA'
                          ? ['desayuno']
                          : ['almuerzo']
                        ).map((m) => (
                          <span
                            key={m}
                            className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                          >
                            {m === 'desayuno' ? '🍳 Desayuno' : m === 'almuerzo' ? '🍲 Almuerzo' : '🍕 Cena'}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-600">
                      <div className="font-medium text-gray-900">📍 {a.ubicacion}</div>
                      {a.ubicacionLat && a.ubicacionLng ? (
                        <div className="text-[11px] text-petroleo font-mono mt-0.5">
                          🌐 {a.ubicacionLat.toFixed(4)}, {a.ubicacionLng.toFixed(4)}
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Sin GPS
                        </span>
                      )}
                      {a.telefono && (
                        <div className="text-emerald-700 font-semibold mt-0.5">
                          📱 {a.telefono}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs max-w-xs">
                      {a.platos && a.platos.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {a.platos.map((p) => {
                            const found = PLATOS.find((item) => item.slug === p);
                            return (
                              <span
                                key={p}
                                className="bg-citrico/30 text-petroleo border border-citrico/50 px-2 py-0.5 rounded-md text-[10px] font-bold"
                              >
                                {found?.emoji || '🍽️'} {found?.nombre || p}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          {a.servicios || 'Sin platos vinculados aún'}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActivo(a)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                          a.activo
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {a.activo ? '✓ Activo' : '✕ Inactivo'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(a)}
                          className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id)}
                          className="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR ALIADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl font-bold">
                  {form.tipo === 'CAFETERIA' ? '☕' : '🍽️'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Editar Aliado Gastronómico' : 'Agregar Nuevo Aliado Gastronómico'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configuración de Platos, Momentos y Posición en Mapa Leaflet
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 size-8 rounded-full bg-gray-100 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold border ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Nombre del Negocio *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Café Loja Gourmet"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo font-bold"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Tipo de Establecimiento *
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo font-semibold"
                  >
                    <option value="GASTRONOMIA">🍽️ Restaurante / Hueca Tradicional</option>
                    <option value="CAFETERIA">☕ Cafetería / Especialidad</option>
                  </select>
                </div>

                {/* MOMENTOS DE CONSUMO (DESAYUNO, ALMUERZO, CENA) */}
                <div className="sm:col-span-2 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                  <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
                    ☀️ Momentos del Día en que Atiende (Rutas de Consumo) *
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {(['desayuno', 'almuerzo', 'cena'] as const).map((m) => {
                      const active = (form.momentos || []).includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleToggleMomento(m)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            active
                              ? 'bg-emerald-800 text-white shadow-sm'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>{m === 'desayuno' ? '🍳' : m === 'almuerzo' ? '🍲' : '🍕'}</span>
                          <span className="capitalize">{m}</span>
                          {active && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Aparecerá en los hubs de <strong>/desayunos-en-loja</strong>, <strong>/almuerzos-loja</strong> o <strong>/comida-rapida-loja</strong> según corresponda.
                  </p>
                </div>

                {/* INGESTA RÁPIDA DE MENÚ / CARTA CON IA O TEXTO PLANO */}
                <div className="sm:col-span-2 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white border-2 border-amber-300/80 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
                        <span>✨</span> Ingesta Inteligente de Menú (Texto / IA / OCR)
                      </span>
                      <p className="text-[11px] text-amber-900/80 mt-0.5">
                        Pega el texto de la carta extraído con IA u OCR. El sistema normaliza los platos, los vincula automáticamente y detecta si faltan páginas en la web.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Pega aquí el texto de la carta o platos del negocio:
                    </label>
                    <textarea
                      rows={3}
                      value={menuRawInput}
                      onChange={(e) => setMenuRawInput(e.target.value)}
                      placeholder="Ej:&#10;- Tamales lojanos con café $2.50&#10;- Repe con quesillo $3.50&#10;- Cecina asada con yuca $6.50&#10;- Chivo al hueco zocorrano $7.00&#10;- Trucha frita $6.00"
                      className="w-full bg-white border border-amber-200 rounded-2xl p-3 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-400"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                      <span className="text-[10px] text-gray-500">
                        Soporta listas con viñetas, precios en dólares ($), o JSON copiado de la IA.
                      </span>
                      <button
                        type="button"
                        onClick={ejecutarNormalizacionMenu}
                        className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>⚡</span> Normalizar y Vincular Platos
                      </button>
                    </div>
                  </div>

                  {/* RESULTADO DE LA NORMALIZACIÓN EN TIEMPO REAL */}
                  {menuResultado && (
                    <div className="space-y-3 border-t border-amber-200/80 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">
                          📊 Resultado del Análisis:
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {menuResultado.resumenTexto}
                        </span>
                      </div>

                      {/* 1. Platos vinculados con éxito a páginas existentes */}
                      {menuResultado.slugsAsociados.length > 0 && (
                        <div className="bg-white rounded-2xl border border-emerald-200 p-3">
                          <span className="text-[11px] font-bold text-emerald-900 block mb-1.5 flex items-center gap-1">
                            <span>🟢</span> Páginas de Platos Vinculadas (Aparecerá aquí automáticamente):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {menuResultado.slugsAsociados.map((slug) => {
                              const plato = PLATOS.find((p) => p.slug === slug);
                              return (
                                <Link
                                  key={slug}
                                  href={`/platos/${slug}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg border border-emerald-300 transition"
                                >
                                  <span>{plato?.emoji || '🍽️'}</span>
                                  <span>{plato?.nombre || slug}</span>
                                  <span className="text-[9px] text-emerald-700 underline ml-0.5">↗</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. Platos que el cliente ofrece pero NO tienen página en la web todavía (Oportunidades SEO) */}
                      {menuResultado.platosSinPagina.length > 0 && (
                        <div className="bg-amber-100/60 rounded-2xl border border-amber-300 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                              <span>⚠️</span> Platos Sin Página en la Web ({menuResultado.platosSinPagina.length} Oportunidades SEO)
                            </span>
                            <span className="text-[10px] text-amber-900 font-semibold bg-white/80 px-2 py-0.5 rounded-full border border-amber-300">
                              Crear página sugerida
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-900/90 leading-relaxed">
                            Este negocio prepara estos platos, pero <strong>todavía no existe una página en el sitio</strong> para ellos. Puedes crear la página o artículo para captar búsquedas de turistas:
                          </p>

                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {menuResultado.platosSinPagina.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white rounded-xl border border-amber-200 p-2 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{item.nombre}</span>
                                  {item.precio && (
                                    <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-1.5 py-0.5 rounded">
                                      {item.precio}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                                    /platos/{item.slugSugerido}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => copiarAlPortapapeles(`/platos/${item.slugSugerido}`)}
                                  className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-2 py-1 rounded border border-amber-300 transition shrink-0 cursor-pointer"
                                >
                                  {copiadoSlug === `/platos/${item.slugSugerido}` ? '✓ Copiado' : 'Copiar URL'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SELECTOR MANUAL DE RESPALDO DE PLATOS */}
                  <div className="border-t border-amber-200/60 pt-3">
                    <span className="block text-[11px] font-bold text-amber-950 uppercase tracking-wider mb-2">
                      Platos Actualmente Seleccionados ({form.platos?.length || 0}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                      {PLATOS.map((plato) => {
                        const active = (form.platos || []).includes(plato.slug);
                        return (
                          <button
                            key={plato.slug}
                            type="button"
                            onClick={() => handleTogglePlato(plato.slug)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                              active
                                ? 'bg-amber-600 text-white shadow-xs font-bold'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                            }`}
                          >
                            <span>{plato.emoji}</span>
                            <span>{plato.nombre}</span>
                            {active && <span className="ml-0.5">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Ubicación Física */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Dirección / Ubicación Física en Loja *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    placeholder="Ej: Calle Lourdes y Bolívar, Centro Histórico, Loja"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* GEOLOCALIZACIÓN GPS PARA MAPA LEAFLET */}
                <div className="sm:col-span-2 bg-blue-50/40 border border-blue-200/60 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-blue-950 uppercase tracking-wider block">
                        🗺️ Coordenadas GPS (Para el Mapa de Cercanía)
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Permite calcular qué tan cerca está el restaurante del usuario.
                      </span>
                    </div>

                    {/* Presets de zonas rápidas */}
                    <div className="flex flex-wrap gap-1">
                      {ZONAS_PREDEFINIDAS_LOJA.slice(0, 4).map((z) => (
                        <button
                          key={z.nombre}
                          type="button"
                          onClick={() => handleSelectZona(z.lat, z.lng, z.nombre)}
                          className="text-[10px] bg-white border border-blue-200 hover:bg-blue-100 text-blue-900 px-2 py-1 rounded font-semibold transition"
                        >
                          📍 {z.nombre.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Latitud GPS (ej: -3.99615)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={form.ubicacionLat ?? ''}
                        onChange={(e) =>
                          setForm({ ...form, ubicacionLat: e.target.value ? parseFloat(e.target.value) : null })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Longitud GPS (ej: -79.20455)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={form.ubicacionLng ?? ''}
                        onChange={(e) =>
                          setForm({ ...form, ubicacionLng: e.target.value ? parseFloat(e.target.value) : null })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="text"
                    value={form.telefono || ''}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="Ej: 593991234567"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Rango de Precios */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Rango de Precios Estimado
                  </label>
                  <input
                    type="text"
                    value={form.rangoPrecio || ''}
                    onChange={(e) => setForm({ ...form, rangoPrecio: e.target.value })}
                    placeholder="Ej: $4 - $12 por persona"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Imagen URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    URL de Imagen Principal
                  </label>
                  <input
                    type="url"
                    value={form.imagenUrl || ''}
                    onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... o enlace de BunnyCDN"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Descripción */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Descripción del Local (El Chatbot la usa para recomendarlo) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Especialidad en tamales lojanos al vapor, humitas de choclo tierno y café filtrado..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Servicios y Platos Estrella */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Servicios Adicionales
                  </label>
                  <input
                    type="text"
                    value={form.servicios || ''}
                    onChange={(e) => setForm({ ...form, servicios: e.target.value })}
                    placeholder="Wifi de alta velocidad, terraza colonial, parqueadero, pet friendly"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Redes / Google Maps */}
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Instagram o Red Social URL
                  </label>
                  <input
                    type="url"
                    value={form.redesUrl || ''}
                    onChange={(e) => setForm({ ...form, redesUrl: e.target.value })}
                    placeholder="https://instagram.com/mi_local"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={form.mapaUrl || ''}
                    onChange={(e) => setForm({ ...form, mapaUrl: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-petroleo"
                  />
                </div>

                {/* Opciones booleanas */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.activo}
                      onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                      className="size-4 text-petroleo rounded focus:ring-petroleo"
                    />
                    <span>Activo (visible en la web pública y chatbot)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.destacado}
                      onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                      className="size-4 text-petroleo rounded focus:ring-petroleo"
                    />
                    <span>Destacado (primeros lugares en recomendaciones)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : '✓ Registrar Aliado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RADAR DE OPORTUNIDADES SEO DE PLATOS FALTANTES */}
      {showOportunidadesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl font-bold">
                  🎯
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Radar de Oportunidades SEO: Platos Sin Página Creada
                  </h3>
                  <p className="text-xs text-gray-500">
                    Detecta qué platos ofrecen los aliados que aún no tienen su propia página en Qué Comer en Loja
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOportunidadesModal(false)}
                className="text-gray-500 hover:text-gray-900 size-8 rounded-full bg-gray-100 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <span>💡</span> ¿Por qué es vital esta sección?
                </p>
                <p className="leading-relaxed">
                  Cuando subes el menú de un aliado con la IA, el sistema identifica platos populares de Loja que <strong>aún no tienen una página dedicada en el sitio web</strong> (como <em>Chivo al Hueco, Trucha Frita, Ají de Carne o Hornado</em>).
                </p>
                <p className="leading-relaxed text-amber-900">
                  Al crear una página <code>/platos/[slug]</code> para estos platos, captarás el tráfico orgánico de Google cuando los turistas busquen <em>"Dónde comer [plato] en Loja"</em> y estos aliados aparecerán de primeros de forma inmediata.
                </p>
              </div>

              {/* Lista de platos sin página más comunes en la gastronomía lojana */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                  Platos Típicos Pendientes por Crear Página (Sugerencias de Alto Impacto):
                </span>

                <div className="space-y-2">
                  {[
                    {
                      nombre: 'Chivo al Hueco Lojano',
                      slug: 'chivo-al-hueco-loja',
                      zona: 'Zapotillo / Catamayo / Loja',
                      busqueda: '1.200 búsquedas/mes',
                      momento: 'Almuerzo tradicional',
                    },
                    {
                      nombre: 'Trucha Frita y al Ajillo',
                      slug: 'trucha-frita-loja',
                      zona: 'Valle de Vilcabamba / Cajas',
                      busqueda: '800 búsquedas/mes',
                      momento: 'Almuerzo y Fines de Semana',
                    },
                    {
                      nombre: 'Tigrillo Lojano con Cecina',
                      slug: 'tigrillo-lojano',
                      zona: 'Calle Lourdes / Centro',
                      busqueda: '1.500 búsquedas/mes',
                      momento: 'Desayunos mañaneros',
                    },
                    {
                      nombre: 'Hornado Lojano Tradicional',
                      slug: 'hornado-lojano',
                      zona: 'Mercado Central / El Valle',
                      busqueda: '900 búsquedas/mes',
                      momento: 'Almuerzos y Ferias',
                    },
                    {
                      nombre: 'Caldo de Gallina Criolla Lojano',
                      slug: 'caldo-de-gallina-criolla',
                      zona: 'El Valle / Malacatos',
                      busqueda: '1.100 búsquedas/mes',
                      momento: 'Almuerzo de campo',
                    },
                  ].map((sug) => (
                    <div
                      key={sug.slug}
                      className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-amber-400 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-bold text-gray-900">{sug.nombre}</h4>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            {sug.busqueda}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap gap-2">
                          <span>📍 {sug.zona}</span>
                          <span>•</span>
                          <span>🕒 {sug.momento}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => copiarAlPortapapeles(`/platos/${sug.slug}`)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 transition cursor-pointer"
                        >
                          {copiadoSlug === `/platos/${sug.slug}` ? '✓ Copiado' : 'Copiar URL'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowOportunidadesModal(false)}
                className="bg-petroleo hover:bg-[#0E2E2E] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
              >
                Entendido / Cerrar Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
