import { notFound } from 'next/navigation';
import { getCotizacionByCodigo, numeroALetrasDolares } from '@/lib/cotizaciones-db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ codigo: string }>;
}

export default async function CotizacionPage({ params }: PageProps) {
  const { codigo } = await params;
  const cot = await getCotizacionByCodigo(codigo);

  if (!cot) {
    notFound();
  }

  const esAnual = cot.plan === 'anual';
  const letrasTotal = numeroALetrasDolares(cot.total);
  const fechaEmision = new Date(cot.createdAt).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const fechaValidez = new Date(new Date(cot.createdAt).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const msgWa = encodeURIComponent(
    `Hola Qué Comer en Loja, deseo aprobar y activar la propuesta formal ${cot.codigo} para ${cot.restaurante_nombre}.`
  );

  return (
    <div className="min-h-screen bg-neutral-100 py-6 sm:py-12 print:p-0 print:bg-white text-slate-800">
      {/* Botones de acción flotantes (se ocultan al imprimir) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="text-xs font-bold text-[#153E3E] hover:underline flex items-center gap-1.5"
        >
          ← Volver a Qué Comer en Loja
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/593963410409?text=${msgWa}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-sm hover:brightness-105"
          >
            💬 Aprobar propuesta por WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#153E3E] text-white font-bold text-xs shadow-sm hover:bg-[#1F5252] cursor-pointer"
            id="btn-print"
          >
            📥 Imprimir / Guardar en PDF
          </button>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var btn = document.getElementById('btn-print');
              if (btn) btn.onclick = function() { window.print(); };
            });
          `,
        }}
      />

      {/* DOCUMENTO OFICIAL A4 */}
      <main className="max-w-[210mm] mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl print:border-none print:shadow-none print:rounded-none overflow-hidden p-8 sm:p-14">
        {/* ENCABEZADO */}
        <header className="border-b-2 border-[#153E3E] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#153E3E] flex items-center justify-center p-2 text-white font-black text-lg">
                QC
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#153E3E] tracking-tight">
                  QUÉ COMER EN LOJA
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C7355]">
                  Guía Gastronómica y Plataforma Digital Oficial
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Loja, Ecuador · info@quecomerenloja.com · +593 96 341 0409
            </p>
          </div>

          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100">
            <span className="text-[10px] uppercase font-extrabold text-[#8C7355] tracking-widest block">
              Cotización Comercial
            </span>
            <span className="text-xl font-black text-[#153E3E] block">
              {cot.codigo}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">
              Fecha: {fechaEmision}
            </span>
          </div>
        </header>

        {/* METADATOS: CLIENTE Y DETALLES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#EBE3D5]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C7355] block mb-2">
              Preparado para:
            </span>
            <h2 className="text-lg font-bold text-[#153E3E]">
              {cot.cliente_nombre}
            </h2>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Restaurante / Negocio: <span className="font-bold">{cot.restaurante_nombre}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              📱 Teléfono: +{cot.telefono}
            </p>
            {cot.email && (
              <p className="text-xs text-slate-600">
                ✉️ Email: {cot.email}
              </p>
            )}
            {cot.direccion && (
              <p className="text-xs text-slate-600">
                📍 Ubicación: {cot.direccion}
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                Términos Comerciales:
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="flex justify-between">
                  <span>Validez de la oferta:</span>
                  <span className="font-bold text-[#153E3E]">15 días ({fechaValidez})</span>
                </p>
                <p className="flex justify-between">
                  <span>Forma de pago:</span>
                  <span className="font-bold">Transferencia / Depósito</span>
                </p>
                <p className="flex justify-between">
                  <span>Modalidad:</span>
                  <span className="font-bold uppercase text-[#8C7355]">
                    {esAnual ? 'Suscripción Anual (1 Mes Gratis)' : 'Suscripción Mensual Libre'}
                  </span>
                </p>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 italic border-t border-slate-200 mt-2">
              Activación inmediata tras confirmación de pago.
            </div>
          </div>
        </section>

        {/* TABLA DE SERVICIOS */}
        <section className="my-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#153E3E] text-[#153E3E] font-black uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Ítem</th>
                  <th className="py-2.5">Descripción del Servicio</th>
                  <th className="py-2.5 text-center">Cant.</th>
                  <th className="py-2.5 text-right">Precio Unit.</th>
                  <th className="py-2.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 font-mono text-slate-400">01</td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-sm text-[#153E3E] block">
                      {esAnual
                        ? 'Plan Anual de Presencia Gastronómica (12 Meses)'
                        : 'Plan Mensual de Presencia Gastronómica'}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                      Ficha verificada en la web oficial, publicación y difusión de menús diarios por WhatsApp, enlaces directos de pedidos y reservas sin comisiones, e indexación en Google.
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono">1</td>
                  <td className="py-3.5 text-right font-mono font-bold">${cot.subtotal.toFixed(2)}</td>
                  <td className="py-3.5 text-right font-mono font-bold">${cot.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-mono text-slate-400">02</td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-sm text-[#153E3E] block">
                      Alta, Configuración y Verificación Inicial
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Digitalización de platos, carga de logotipo, fotos, horarios y conexión al bot oficial.
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-mono">1</td>
                  <td className="py-3.5 text-right font-mono font-bold">$0.00</td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-700">GRATIS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-slate-200 pt-4">
            <div className="max-w-xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Valor en Letras:
              </span>
              <p className="text-xs font-bold text-[#153E3E] italic">
                {letrasTotal}
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${cot.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>IVA (15%):</span>
                <span className="font-mono font-bold">${cot.iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white bg-[#153E3E] p-3 rounded-xl shadow-xs">
                <span>TOTAL:</span>
                <span className="font-mono text-[#D0DB61]">${cot.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* CONDICIONES */}
        <footer className="border-t border-slate-200 pt-6 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-500 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Beneficios Incluidos:
            </h4>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Publicación directa vía bot de WhatsApp en 1 minuto.</li>
              <li>Sin contratos de permanencia en el plan mensual.</li>
              <li>Cero comisiones por pedidos o reservas generadas.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cuenta para Pago:
            </h4>
            <p>Banco de Loja / Banco Pichincha (Cuenta de Ahorros)</p>
            <p>Titular: César Reyes Jaramillo · CI: 1104882196</p>
            <p>Email comprobantes: info@quecomerenloja.com</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
