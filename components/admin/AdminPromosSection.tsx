'use client';

import React, { useState, useEffect } from 'react';
import type { PromoAliado } from '@/lib/promos-db';

export function AdminPromosSection() {
  const [promos, setPromos] = useState<PromoAliado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPromo, setEditingPromo] = useState<PromoAliado | null>(null);

  // Cargar promociones
  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promos');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar promociones');
      setPromos(data.promos || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta promoción?')) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setPromos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  // Alternar destacado
  const handleToggleDestacado = async (promo: PromoAliado) => {
    try {
      const nuevoDestacado = !promo.destacado;
      const res = await fetch('/api/admin/promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, destacado: nuevoDestacado }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setPromos((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, destacado: nuevoDestacado } : p))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Alternar estado
  const handleToggleEstado = async (promo: PromoAliado, nuevoEstado: string) => {
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error('Error al actualizar estado');
      setPromos((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, estado: nuevoEstado as any } : p))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Guardar edición
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    try {
      const res = await fetch('/api/admin/promos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPromo),
      });
      if (!res.ok) throw new Error('Error al guardar cambios');
      setPromos((prev) =>
        prev.map((p) => (p.id === editingPromo.id ? editingPromo : p))
      );
      setEditingPromo(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Promociones y Eventos de Aliados ({promos.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Administra las ofertas, ferias o novedades publicadas por los restaurantes y cafeterías.
          </p>
        </div>
        <button
          onClick={fetchPromos}
          className="text-xs font-bold text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-xl hover:bg-gray-50 self-start sm:self-auto"
        >
          🔄 Recargar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Cargando promociones...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          {error}
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-8">
          <span className="text-3xl">🏷️</span>
          <p className="text-sm font-bold text-gray-800 mt-2">Aún no hay promociones creadas</p>
          <p className="text-xs text-gray-500 mt-1">
            Los aliados pueden publicarlas con su enlace `/publicar-promo?aliado=slug-aliado`
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Aliado</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Título & Oferta</th>
                <th className="py-3 px-4">Fechas</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Destacado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{p.aliado_nombre}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">/{p.aliado_slug}</span>
                      <a
                        href={`/publicar-promo?aliado=${p.aliado_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-amber-700 hover:underline"
                        title="Abrir formulario de publicación"
                      >
                        [+ Nueva Promo]
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-gray-100 text-gray-800 border">
                      {p.tipo}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-gray-900 block line-clamp-1">{p.titulo}</span>
                    {p.precio_promo && (
                      <span className="text-emerald-700 font-extrabold text-[11px]">
                        {p.precio_promo}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                    {p.fecha_inicio.split('T')[0]}
                    {p.fecha_fin ? ` al ${p.fecha_fin.split('T')[0]}` : ''}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={p.estado}
                      onChange={(e) => handleToggleEstado(p, e.target.value)}
                      className={`text-[11px] font-bold rounded-lg border px-2 py-1 ${
                        p.estado === 'ACTIVO'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-gray-300 bg-gray-50 text-gray-600'
                      }`}
                    >
                      <option value="ACTIVO">ACTIVO</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="VENCIDO">VENCIDO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleDestacado(p)}
                      className={`text-sm px-2 py-0.5 rounded-lg border transition ${
                        p.destacado
                          ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      {p.destacado ? '★ Sí' : '☆ No'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setEditingPromo(p)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de edición */}
      {editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Editar Promoción</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={editingPromo.titulo}
                  onChange={(e) => setEditingPromo({ ...editingPromo, titulo: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  required
                  value={editingPromo.descripcion}
                  onChange={(e) => setEditingPromo({ ...editingPromo, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Precio Original</label>
                  <input
                    type="text"
                    value={editingPromo.precio_original || ''}
                    onChange={(e) => setEditingPromo({ ...editingPromo, precio_original: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Precio Promo</label>
                  <input
                    type="text"
                    value={editingPromo.precio_promo || ''}
                    onChange={(e) => setEditingPromo({ ...editingPromo, precio_promo: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Lugar</label>
                <input
                  type="text"
                  value={editingPromo.lugar || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, lugar: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPromo(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-petroleo rounded-xl hover:bg-[#0E2E2E]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
