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
  const emisionDate = new Date(cot.createdAt);
  const fechaEmision = emisionDate.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const validezDate = new Date(emisionDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fechaValidez = validezDate.toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const msgWa = encodeURIComponent(
    `Hola César, revisé la propuesta comercial ${cot.codigo} para ${cot.restaurante_nombre} y deseo confirmar el plan.`
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: "League Spartan";
              src: url("/cotizaciones-assets/league-spartan.woff2") format("woff2");
              font-weight: 100 900;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: "Plus Jakarta Sans";
              src: url("/cotizaciones-assets/jakarta.woff2") format("woff2");
              font-weight: 200 800;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: "Plus Jakarta Sans";
              src: url("/cotizaciones-assets/jakarta-italic.woff2") format("woff2");
              font-weight: 200 800;
              font-style: italic;
              font-display: swap;
            }

            :root {
              --petroleo: #153E3E;
              --petroleo-oscuro: #0E2E2E;
              --petroleo-medio: #1F5252;
              --citrico: #D0DB61;
              --grafito: #1F2928;
              --porcelana: #F5F6F1;
              --niebla: #DCE4E0;
              --muted: #5C7270;
              --blanco: #FFFFFF;
              --rojo: #8B3A2A;
              --fuente-titulo: "League Spartan", Georgia, serif;
              --fuente-texto: "Plus Jakarta Sans", Arial, sans-serif;
            }

            * { box-sizing: border-box; }

            .doc-container {
              font-family: var(--fuente-texto);
              color: var(--grafito);
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            table.pagina {
              width: 210mm;
              min-height: 297mm;
              border-collapse: collapse;
              table-layout: fixed;
              background: var(--blanco);
              margin: 0 auto;
            }
            table.pagina > thead > tr > td,
            table.pagina > tfoot > tr > td,
            table.pagina > tbody > tr > td { padding: 0; }
            .celda-cuerpo { vertical-align: top; }

            .doc-header {
              position: relative;
              height: 33mm;
              background: var(--petroleo);
              color: var(--blanco);
              overflow: hidden;
              padding: 8mm 15mm 0;
            }
            .hdr-inner {
              position: relative;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8mm;
            }
            .hdr-brand { display: flex; flex-direction: column; gap: 2.4mm; }
            .hdr-logo { width: 56mm; height: auto; display: block; }
            .hdr-doc { text-align: right; flex-shrink: 0; padding-top: .5mm; }
            .hdr-kicker {
              display: inline-block;
              font-size: 6.4pt;
              font-weight: 700;
              letter-spacing: .2em;
              text-transform: uppercase;
              color: var(--citrico);
              border: .3mm solid rgba(208,219,97,.4);
              border-radius: 99px;
              padding: 1mm 2.8mm;
              margin-bottom: 2.4mm;
            }
            .hdr-title {
              font-family: var(--fuente-titulo);
              font-size: 22pt;
              font-weight: 800;
              letter-spacing: .04em;
              line-height: .95;
              margin: 0;
              color: var(--blanco);
            }
            .hdr-number {
              margin: 2mm 0 0;
              font-size: 7.6pt;
              letter-spacing: .09em;
              text-transform: uppercase;
              color: rgba(245,246,241,.7);
            }
            .hdr-number strong { color: var(--citrico); font-weight: 700; }
            .hdr-rule {
              position: absolute;
              left: 0; right: 0; bottom: 0;
              height: 1.6mm;
              background: var(--citrico);
            }

            .doc-body { padding: 7mm 15mm 2mm; font-size: 8.4pt; }
            .meta-grid {
              display: grid;
              grid-template-columns: 1.06fr .94fr;
              gap: 4.5mm;
              align-items: stretch;
            }
            .card {
              border-radius: 3mm;
              padding: 4.2mm 5mm;
              min-height: 29mm;
            }
            .card--cliente {
              background: var(--blanco);
              border: .3mm solid var(--niebla);
              border-left: 1.3mm solid var(--petroleo);
            }
            .card--detalles { background: var(--porcelana); border: .3mm solid var(--niebla); }
            .card-label {
              font-size: 6.4pt;
              font-weight: 800;
              letter-spacing: .17em;
              text-transform: uppercase;
              color: var(--muted);
              margin: 0 0 2.2mm;
              display: flex;
              align-items: center;
              gap: 1.6mm;
            }
            .card-label::before {
              content: "";
              width: 1.7mm; height: 1.7mm;
              background: var(--citrico);
              border-radius: 50%;
              display: inline-block;
            }
            .cliente-nombre {
              font-family: var(--fuente-titulo);
              font-size: 11.5pt;
              font-weight: 700;
              letter-spacing: -.01em;
              line-height: 1.15;
              margin: 0 0 1mm;
              color: var(--petroleo);
            }
            .cliente-linea {
              font-size: 7.7pt;
              line-height: 1.5;
              color: var(--muted);
              margin: 0;
            }
            .cliente-linea strong { color: var(--grafito); font-weight: 600; }

            .detalle-lista { display: grid; gap: 1.1mm; }
            .detalle-fila {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              gap: 3mm;
              font-size: 7.7pt;
              line-height: 1.4;
            }
            .detalle-fila span { color: var(--muted); white-space: nowrap; }
            .detalle-fila strong { color: var(--grafito); font-weight: 700; text-align: right; }

            .intro {
              font-size: 8.2pt;
              line-height: 1.5;
              color: var(--muted);
              margin: 3.5mm 0 0;
              max-width: 168mm;
            }

            .seccion-titulo {
              font-family: var(--fuente-titulo);
              font-size: 7.8pt;
              font-weight: 800;
              letter-spacing: .17em;
              text-transform: uppercase;
              color: var(--petroleo);
              margin: 4.8mm 0 2.2mm;
              display: flex;
              align-items: center;
              gap: 2.2mm;
            }
            .seccion-titulo::after {
              content: "";
              flex: 1;
              height: .3mm;
              background: var(--niebla);
            }

            table.items {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1mm;
            }
            table.items th {
              background: var(--petroleo);
              color: var(--blanco);
              font-size: 6.4pt;
              font-weight: 700;
              letter-spacing: .15em;
              text-transform: uppercase;
              padding: 2.4mm 3mm;
              border: none;
              text-align: left;
            }
            table.items th.num, table.items td.num { text-align: right; }
            table.items th.cant, table.items td.cant { text-align: center; }
            table.items td {
              padding: 2.8mm 3mm;
              font-size: 7.7pt;
              border-bottom: .28mm solid var(--niebla);
              vertical-align: middle;
            }
            table.items tr:nth-child(even) td { background: var(--porcelana); }
            .item-nombre { font-weight: 700; color: var(--petroleo); display: block; font-size: 8.3pt; }
            .item-detalle { font-size: 7.1pt; color: var(--muted); display: block; line-height: 1.35; margin-top: .6mm; }
            .item-etiqueta {
              display: inline-block;
              margin-top: .8mm;
              font-size: 5.8pt;
              font-weight: 700;
              letter-spacing: .08em;
              text-transform: uppercase;
              color: var(--petroleo);
              background: rgba(208,219,97,.35);
              padding: .4mm 1.8mm;
              border-radius: 99px;
            }
            .mono {
              font-family: "Plus Jakarta Sans", monospace;
              font-variant-numeric: tabular-nums;
            }

            .cierre {
              margin-top: 3.2mm;
              display: grid;
              grid-template-columns: 1fr 76mm;
              gap: 5mm;
              align-items: start;
            }
            .letras {
              border-left: .9mm solid var(--citrico);
              padding: 2.4mm 3.4mm;
              background: var(--porcelana);
              border-radius: 0 2mm 2mm 0;
            }
            .letras span {
              display: block;
              font-size: 5.8pt;
              font-weight: 800;
              letter-spacing: .16em;
              text-transform: uppercase;
              color: var(--muted);
              margin-bottom: .8mm;
            }
            .letras strong {
              font-family: var(--fuente-titulo);
              font-size: 8pt;
              font-weight: 700;
              letter-spacing: .04em;
              color: var(--petroleo);
              display: block;
              line-height: 1.25;
            }

            .totales {
              background: var(--porcelana);
              border: .3mm solid var(--niebla);
              border-radius: 2.6mm;
              padding: 3mm 3.6mm;
            }
            .total-fila {
              display: flex;
              justify-content: space-between;
              font-size: 7.4pt;
              line-height: 1.5;
              color: var(--muted);
            }
            .total-fila strong { color: var(--grafito); font-weight: 700; }
            .total-caja {
              margin-top: 2.2mm;
              background: var(--petroleo);
              color: var(--blanco);
              border-radius: 2.4mm;
              padding: 3.6mm 4.2mm;
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 3mm;
            }
            .total-caja .etq {
              font-size: 6.8pt;
              font-weight: 800;
              letter-spacing: .16em;
              text-transform: uppercase;
              color: rgba(245,246,241,.82);
            }
            .total-caja .etq small {
              display: block;
              font-size: 5.6pt;
              letter-spacing: .1em;
              font-weight: 600;
              color: rgba(245,246,241,.55);
              margin-top: .7mm;
            }
            .total-caja .monto {
              font-family: var(--fuente-titulo);
              font-size: 17pt;
              font-weight: 800;
              letter-spacing: -.01em;
              color: var(--citrico);
              line-height: 1;
              font-variant-numeric: tabular-nums;
            }

            .incluye-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1.8mm 5mm;
              margin-top: 1mm;
            }
            .incluye {
              display: flex;
              align-items: flex-start;
              gap: 2mm;
              font-size: 7.2pt;
              line-height: 1.35;
              color: var(--muted);
            }
            .incluye .check {
              color: var(--petroleo);
              font-weight: 800;
              font-size: 8pt;
              line-height: 1;
              flex-shrink: 0;
              margin-top: .2mm;
            }
            .incluye strong { color: var(--grafito); font-weight: 700; }

            .opcional {
              margin-top: 3.4mm;
              background: #FAF7EF;
              border: .3mm dashed #D8CFAF;
              border-radius: 2.6mm;
              padding: 2.8mm 3.8mm;
              display: grid;
              grid-template-columns: 1fr 48mm;
              gap: 4mm;
              align-items: center;
            }
            .opcional-etq {
              font-size: 5.8pt;
              font-weight: 800;
              letter-spacing: .14em;
              text-transform: uppercase;
              color: #7D6B3B;
              display: block;
              margin-bottom: 1.2mm;
            }
            .opcional h4 {
              font-family: var(--fuente-titulo);
              font-size: 10.5pt;
              font-weight: 700;
              color: var(--petroleo);
              margin: 0 0 1.2mm;
            }
            .opcional p { font-size: 7.5pt; line-height: 1.5; color: var(--muted); margin: 0; }
            .opcional-precio {
              text-align: right;
              border-left: .3mm solid var(--niebla);
              padding-left: 4mm;
            }
            .opcional-precio strong {
              font-family: var(--fuente-titulo);
              font-size: 17pt;
              font-weight: 800;
              color: var(--petroleo);
              display: block;
              line-height: 1;
            }
            .opcional-precio span {
              display: block;
              margin-top: 1.4mm;
              font-size: 6.2pt;
              line-height: 1.45;
              color: var(--muted);
              text-transform: uppercase;
            }

            .formulario-cta {
              display: grid;
              grid-template-columns: 1fr 62mm;
              gap: 6mm;
              align-items: center;
              background: var(--porcelana);
              border: .3mm solid var(--niebla);
              border-left: 1.2mm solid var(--citrico);
              border-radius: 2.6mm;
              padding: 3.6mm 4.4mm;
            }
            .formulario-cta-etq {
              display: block;
              font-size: 6.2pt;
              font-weight: 800;
              letter-spacing: .15em;
              text-transform: uppercase;
              color: var(--muted);
              margin-bottom: 1.1mm;
            }
            .formulario-cta p {
              margin: 0;
              font-size: 9pt;
              line-height: 1.45;
              color: var(--grafito);
              max-width: 92mm;
            }
            .formulario-cta-link {
              text-align: right;
              border-left: .3mm solid var(--niebla);
              padding-left: 4mm;
            }
            .formulario-cta-link strong {
              display: block;
              font-family: var(--fuente-titulo);
              font-size: 11.5pt;
              font-weight: 700;
              color: var(--petroleo);
              line-height: 1.25;
            }
            .formulario-cta-link span {
              display: block;
              margin-top: 1mm;
              font-size: 6.4pt;
              letter-spacing: .08em;
              text-transform: uppercase;
              color: var(--muted);
            }

            .condiciones--amplias {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4mm 7mm;
            }
            .cond-lista { margin: 0; padding: 0; list-style: none; }
            .cond-lista li {
              font-size: 7.7pt;
              line-height: 1.42;
              color: var(--muted);
              padding-left: 3mm;
              position: relative;
              margin-bottom: 1.4mm;
            }
            .cond-lista li::before {
              content: "";
              position: absolute;
              left: 0; top: 1.4mm;
              width: 1.3mm; height: 1.3mm;
              border-radius: 50%;
              background: var(--citrico);
            }
            .cond-lista strong { color: var(--grafito); font-weight: 700; }

            .pasos-lista {
              margin: 0;
              padding: 0;
              list-style: none;
              counter-reset: paso;
              display: grid;
              gap: 2mm;
            }
            .pasos-lista li {
              counter-increment: paso;
              position: relative;
              padding-left: 8mm;
              font-size: 7.8pt;
              line-height: 1.5;
              color: var(--muted);
            }
            .pasos-lista li::before {
              content: counter(paso);
              position: absolute;
              left: 0;
              top: -.2mm;
              width: 5.4mm; height: 5.4mm;
              border-radius: 50%;
              background: #EAF0E7;
              color: var(--petroleo);
              font-size: 6.8pt;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .pasos-lista strong { color: var(--grafito); font-weight: 700; }

            .cierre-cta {
              margin-top: 5mm;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 6mm;
              background: var(--petroleo);
              color: var(--blanco);
              border-radius: 3mm;
              padding: 4.2mm 5.4mm;
              position: relative;
              overflow: hidden;
            }
            .cierre-cta-etq {
              font-size: 6.4pt;
              letter-spacing: .18em;
              text-transform: uppercase;
              color: var(--citrico);
              font-weight: 800;
              display: block;
              margin-bottom: 1mm;
            }
            .cierre-cta p {
              margin: 0;
              font-size: 8.4pt;
              line-height: 1.4;
              color: rgba(245,246,241,.85);
              max-width: 100mm;
            }
            .cierre-cta-datos { text-align: right; flex-shrink: 0; }
            .cierre-cta-datos strong {
              display: block;
              font-family: var(--fuente-titulo);
              font-size: 10pt;
              font-weight: 700;
              color: var(--blanco);
            }
            .cierre-cta-datos span { font-size: 7pt; color: var(--citrico); }

            .firmas {
              margin-top: 10mm;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18mm;
            }
            .firma-linea {
              border-top: .35mm solid var(--petroleo);
              padding-top: 1.5mm;
            }
            .firma-rol {
              font-size: 6.2pt;
              font-weight: 800;
              letter-spacing: .15em;
              text-transform: uppercase;
              color: var(--muted);
              display: block;
              margin-bottom: .7mm;
            }
            .firma-nombre {
              font-size: 8.3pt;
              font-weight: 700;
              color: var(--grafito);
            }
            .firma-dato {
              font-size: 7pt;
              color: var(--muted);
            }

            .gracias {
              margin: 4.5mm 0 0;
              text-align: center;
              font-size: 8.4pt;
              font-style: italic;
              color: var(--petroleo);
            }

            .doc-footer { background: var(--porcelana); height: 24mm; }
            .ftr-rule { height: 1.2mm; background: var(--citrico); }
            .ftr-inner {
              height: 16.2mm;
              padding: 0 15mm;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 6mm;
              border-top: .3mm solid var(--niebla);
            }
            .ftr-marca { display: flex; align-items: center; gap: 2.4mm; }
            .ftr-simbolo {
              width: 6.6mm; height: 6.6mm;
              border-radius: 1.8mm;
              background: var(--petroleo);
              padding: 1.3mm;
              flex-shrink: 0;
            }
            .ftr-simbolo img { width: 100%; height: 100%; display: block; }
            .ftr-nombre {
              font-family: var(--fuente-titulo);
              font-size: 7.8pt;
              font-weight: 700;
              color: var(--petroleo);
              line-height: 1.15;
            }
            .ftr-lema {
              font-size: 6pt;
              letter-spacing: .05em;
              color: var(--muted);
            }
            .ftr-contacto {
              display: flex;
              gap: 2.6mm;
              align-items: center;
              font-size: 6.6pt;
              color: var(--muted);
            }
            .ftr-contacto .punto {
              width: .9mm; height: .9mm;
              border-radius: 50%;
              background: var(--citrico);
              display: inline-block;
            }
            .ftr-lugar {
              font-size: 6.6pt;
              font-weight: 700;
              letter-spacing: .08em;
              text-transform: uppercase;
              color: var(--petroleo);
            }
            .ftr-legal {
              background: var(--blanco);
              padding: 1.4mm 15mm;
              font-size: 5.6pt;
              color: var(--muted);
              display: flex;
              justify-content: space-between;
              border-top: .25mm solid var(--niebla);
            }

            @page {
              size: A4;
              margin: 0;
            }

            @media print {
              html, body { background: var(--blanco); }
              .doc-container { padding: 0; }
              table.pagina { height: 297mm; box-shadow: none; }
              table.pagina + table.pagina { break-before: page; margin-top: 0; }
              .meta-grid, .cierre, .firmas, table.items tr, .letras, .total-caja { break-inside: avoid; }
              .seccion-titulo { break-after: avoid; }
              .gracias { break-inside: avoid; }
              .doc-header, .doc-footer { break-inside: avoid; }
            }

            @media screen {
              .doc-container {
                background: #E7EBE7;
                padding: 24px 12px 56px;
              }
              table.pagina {
                box-shadow: 0 18px 50px rgba(21,62,62,.18), 0 2px 6px rgba(21,62,62,.08);
              }
              table.pagina + table.pagina { margin-top: 26px; }
            }
          `,
        }}
      />

      <div className="doc-container min-h-screen">
        {/* Barra superior flotante de acciones (se oculta al imprimir) */}
        <div className="max-w-[210mm] mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/"
            className="text-xs font-bold text-[#153E3E] hover:underline flex items-center gap-1.5"
          >
            ← Volver a Qué Comer en Loja
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/593986962872?text=${msgWa}`}
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

        {/* ══════════════════════════════════════════════════════════
            HOJA 1 (Página 1 de 2)
            ══════════════════════════════════════════════════════════ */}
        <table className="pagina">
          <thead>
            <tr>
              <td>
                <header className="doc-header">
                  <div className="hdr-inner">
                    <div className="hdr-brand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hdr-logo"
                        src="/cotizaciones-assets/logo-horizontal-inverso-recorte.svg"
                        alt="Qué Comer en Loja"
                      />
                    </div>
                    <div className="hdr-doc">
                      <span className="hdr-kicker">Propuesta comercial</span>
                      <h1 className="hdr-title">COTIZACIÓN</h1>
                      <p className="hdr-number">
                        N.º <strong>{cot.codigo}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="hdr-rule"></div>
                </header>
              </td>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <td>
                <footer className="doc-footer">
                  <div className="ftr-rule"></div>
                  <div className="ftr-inner">
                    <div className="ftr-marca">
                      <div className="ftr-simbolo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/cotizaciones-assets/simbolo-inverso.svg" alt="" />
                      </div>
                      <div>
                        <div className="ftr-nombre">Qué Comer en Loja</div>
                        <div className="ftr-lema">La ruta gastronómica de Loja, en tu bolsillo</div>
                      </div>
                    </div>
                    <div className="ftr-contacto">
                      <span>quecomerenloja.com</span>
                      <span className="punto"></span>
                      <span>WhatsApp +593 98 696 2872</span>
                    </div>
                    <div className="ftr-lugar">Loja — Ecuador</div>
                  </div>
                  <div className="ftr-legal">
                    <span>Documento electrónico emitido por Qué Comer en Loja. Válido como cotización, no como factura.</span>
                    <span>{cot.codigo} · Hoja 1 de 2</span>
                  </div>
                </footer>
              </td>
            </tr>
          </tfoot>

          <tbody>
            <tr>
              <td className="celda-cuerpo">
                <main className="doc-body">
                  <section className="meta-grid">
                    {/* Cliente */}
                    <div className="card card--cliente">
                      <p className="card-label">Preparado para</p>
                      <h2 className="cliente-nombre">{cot.cliente_nombre}</h2>
                      <p className="cliente-linea">
                        <strong>Restaurante:</strong> {cot.restaurante_nombre}
                      </p>
                      {cot.direccion && (
                        <p className="cliente-linea">
                          <strong>Dirección:</strong> {cot.direccion}
                        </p>
                      )}
                      <p className="cliente-linea">
                        <strong>Contacto:</strong> +{cot.telefono}
                        {cot.email ? ` · ${cot.email}` : ''}
                      </p>
                    </div>

                    {/* Detalles */}
                    <div className="card card--detalles">
                      <p className="card-label">Detalles</p>
                      <div className="detalle-lista">
                        <div className="detalle-fila">
                          <span>Fecha de emisión</span>
                          <strong>{fechaEmision}</strong>
                        </div>
                        <div className="detalle-fila">
                          <span>Válida hasta</span>
                          <strong>{fechaValidez}</strong>
                        </div>
                        <div className="detalle-fila">
                          <span>Plan</span>
                          <strong>{esAnual ? 'Plan Anual (1 Mes Gratis)' : 'Piloto de lanzamiento'}</strong>
                        </div>
                        <div className="detalle-fila">
                          <span>Facturación</span>
                          <strong>{esAnual ? 'Anual · 12 meses' : 'Mensual · sin permanencia'}</strong>
                        </div>
                      </div>
                    </div>
                  </section>

                  <p className="intro">
                    Estimado/a {cot.cliente_nombre}, gracias por el tiempo en nuestra conversación. Esta propuesta resume el plan que le comenté para {cot.restaurante_nombre}: que su restaurante aparezca cuando alguien busca un plato o un antojo en Loja, y que su menú del día se publique sin que usted tenga que llenar formularios. <strong>La ficha, la carta y la publicación las hacemos nosotros;</strong> usted solo nos envía la foto del menú por WhatsApp.
                  </p>

                  {/* Plan recomendado */}
                  <h3 className="seccion-titulo">Plan recomendado</h3>
                  <table className="items">
                    <thead>
                      <tr>
                        <th style={{ width: '7%' }}>#</th>
                        <th>Servicio</th>
                        <th className="cant" style={{ width: '11%' }}>Cant.</th>
                        <th className="num" style={{ width: '18%' }}>P. unitario</th>
                        <th className="num" style={{ width: '18%' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="mono">01</td>
                        <td>
                          <span className="item-nombre">
                            {esAnual
                              ? 'Plan Anual de Lanzamiento — Restaurante (12 Meses)'
                              : 'Plan Piloto de Lanzamiento — Restaurante'}
                          </span>
                          <span className="item-detalle">
                            Ficha del restaurante creada por nosotros, publicación diaria del menú, búsqueda por plato o ingrediente, botones de WhatsApp, mapa y pedidos, y sello de negocio verificado.
                          </span>
                        </td>
                        <td className="cant mono">{esAnual ? '12 meses' : '1 mes'}</td>
                        <td className="num mono">${cot.subtotal.toFixed(2)}</td>
                        <td className="num mono">${cot.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="mono">02</td>
                        <td>
                          <span className="item-nombre">Alta y configuración inicial</span>
                          <span className="item-detalle">
                            Creamos su ficha desde cero, cargamos la carta y los platos, y configuramos horarios, ubicación, fotos y enlaces.
                          </span>
                          <span className="item-etiqueta">Incluido en el plan · sin costo de alta</span>
                        </td>
                        <td className="cant mono">1</td>
                        <td className="num mono">$0,00</td>
                        <td className="num mono">$0,00</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="nota-precio text-right text-[6.9pt] text-slate-500 mt-1">
                    Los precios de la tabla no incluyen IVA; el IVA se añade y se desglosa en el resumen de abajo.
                  </p>

                  {/* Totales */}
                  <section className="cierre">
                    <div className="letras">
                      <span>Valor en letras</span>
                      <strong>SON: {letrasTotal}</strong>
                    </div>

                    <div className="totales">
                      <div className="total-fila">
                        <span>{esAnual ? 'Servicio anual (sin IVA)' : 'Servicio mensual (sin IVA)'}</span>
                        <strong className="mono">${cot.subtotal.toFixed(2)}</strong>
                      </div>
                      <div className="total-fila">
                        <span>IVA 15%</span>
                        <strong className="mono">${cot.iva.toFixed(2)}</strong>
                      </div>
                      <div className="total-fila">
                        <span>Alta y configuración</span>
                        <strong>Incluida</strong>
                      </div>
                      <div className="total-caja">
                        <span className="etq">
                          {esAnual ? 'Total Plan Anual' : 'Total primer mes'}
                          <small>USD · con IVA 15%</small>
                        </span>
                        <span className="monto">${cot.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </section>

                  {/* Incluye */}
                  <h3 className="seccion-titulo">Todo esto está incluido</h3>
                  <div className="incluye-grid">
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>Ficha completa creada por nosotros.</strong> Nombre, descripción, horarios, ubicación y fotos de su restaurante.</span>
                    </div>
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>Carga de su carta y sus platos.</strong> Usted envía la carta una vez; nosotros la dejamos lista.</span>
                    </div>
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>Menú del día publicado todos los días.</strong> Solo envíe la foto del menú por WhatsApp.</span>
                    </div>
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>Búsquedas por plato.</strong> Puede aparecer cuando alguien busca «arroz con menestra», «cecina» o su especialidad.</span>
                    </div>
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>WhatsApp, mapa y pedidos.</strong> Un botón directo para que el cliente le escriba, sin intermediarios ni comisiones por pedido.</span>
                    </div>
                    <div className="incluye">
                      <span className="check">✓</span>
                      <span><strong>Sello de negocio verificado.</strong> Revisamos la ficha y la marcamos como verificada antes de publicarla.</span>
                    </div>
                  </div>

                  {/* Opcional */}
                  <div className="opcional">
                    <div>
                      <span className="opcional-etq">Opcional · para restaurantes sin página web</span>
                      <h4>Página web propia con dominio .com</h4>
                      <p>Dominio a su nombre por un año, hosting incluido y el menú siempre actualizado. Incluye un módulo que invita a todos sus clientes a dejar su opinión. Entrega en 10 días hábiles, con 2 rondas de ajustes.</p>
                    </div>
                    <div className="opcional-precio">
                      <strong>$ 200</strong>
                      <span>Pago único<br />Más IVA 15% ($ 230)<br />No incluido en el total</span>
                    </div>
                  </div>
                </main>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ══════════════════════════════════════════════════════════
            HOJA 2 (Página 2 de 2)
            ══════════════════════════════════════════════════════════ */}
        <table className="pagina pagina-2">
          <thead>
            <tr>
              <td>
                <header className="doc-header">
                  <div className="hdr-inner">
                    <div className="hdr-brand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hdr-logo"
                        src="/cotizaciones-assets/logo-horizontal-inverso-recorte.svg"
                        alt="Qué Comer en Loja"
                      />
                    </div>
                    <div className="hdr-doc">
                      <span className="hdr-kicker">Propuesta comercial</span>
                      <h1 className="hdr-title">COTIZACIÓN</h1>
                      <p className="hdr-number">
                        N.º <strong>{cot.codigo}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="hdr-rule"></div>
                </header>
              </td>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <td>
                <footer className="doc-footer">
                  <div className="ftr-rule"></div>
                  <div className="ftr-inner">
                    <div className="ftr-marca">
                      <div className="ftr-simbolo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/cotizaciones-assets/simbolo-inverso.svg" alt="" />
                      </div>
                      <div>
                        <div className="ftr-nombre">Qué Comer en Loja</div>
                        <div className="ftr-lema">La ruta gastronómica de Loja, en tu bolsillo</div>
                      </div>
                    </div>
                    <div className="ftr-contacto">
                      <span>quecomerenloja.com</span>
                      <span className="punto"></span>
                      <span>WhatsApp +593 98 696 2872</span>
                    </div>
                    <div className="ftr-lugar">Loja — Ecuador</div>
                  </div>
                  <div className="ftr-legal">
                    <span>Documento electrónico emitido por Qué Comer en Loja. Válido como cotización, no como factura.</span>
                    <span>{cot.codigo} · Hoja 2 de 2</span>
                  </div>
                </footer>
              </td>
            </tr>
          </tfoot>

          <tbody>
            <tr>
              <td className="celda-cuerpo">
                <main className="doc-body">
                  {/* Lo que necesitamos */}
                  <h3 className="seccion-titulo" style={{ marginTop: 0 }}>Lo que necesitamos de usted</h3>
                  <div className="formulario-cta">
                    <div>
                      <span className="formulario-cta-etq">Un solo paso</span>
                      <p>Llene el formulario de alta: nosotros creamos su ficha, cargamos su carta y publicamos su menú.</p>
                    </div>
                    <div className="formulario-cta-link">
                      <strong>quecomerenloja.com/formulario</strong>
                      <span>o escríbanos por WhatsApp</span>
                    </div>
                  </div>

                  {/* Alcance y condiciones */}
                  <h3 className="seccion-titulo">Alcance y condiciones</h3>
                  <div className="condiciones--amplias">
                    <div>
                      <ul className="cond-lista">
                        <li><strong>Precio piloto:</strong> $10/mes más IVA ($11,50) para los primeros 40 restaurantes, mientras la suscripción esté activa.</li>
                        <li><strong>Pago:</strong> transferencia bancaria mensual; al confirmar el cupo le enviamos los datos de la cuenta. El servicio inicia con el primer pago.</li>
                        <li><strong>Facturación:</strong> mensual y sin permanencia. Puede cancelar avisando con 15 días de anticipación.</li>
                        <li><strong>Actualizaciones:</strong> el plan cubre el menú diario y los cambios de precios u horarios.</li>
                        <li><strong>Publicidad:</strong> no incluye pauta en Google Ads ni en redes sociales; si la necesita, se cotiza aparte.</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="cond-lista">
                        <li><strong>Web opcional ($200 + IVA):</strong> dominio .com a nombre del restaurante por 1 año, hosting por 1 año, menú y módulo de opiniones, entrega en 10 días hábiles y 2 rondas de ajustes. Con IVA 15%: $230. La renovación anual se cobra al costo.</li>
                        <li><strong>Opiniones:</strong> el módulo invita a todos los clientes por igual, sin condicionar la calificación. Cada cliente decide si publica su reseña en Google, conforme a las políticas de Google.</li>
                        <li><strong>Aprobación:</strong> todo contenido se aprueba por WhatsApp antes de publicarse.</li>
                        <li><strong>Responsabilidad:</strong> el restaurante garantiza que precios, horarios y fotos sean exactos, y nos avisa de cualquier cambio.</li>
                        <li><strong>Resultados:</strong> trabajamos la ficha y el contenido para mejorar la visibilidad. No garantizamos una posición específica en Google ni en asistentes de IA: el resultado también depende de la competencia, las reseñas y cada buscador.</li>
                        <li><strong>Impuestos:</strong> precios en USD sin IVA; se añade el 15%.</li>
                        <li><strong>Alcance adicional:</strong> cualquier servicio no descrito en esta cotización se cotiza por separado.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Próximos pasos */}
                  <h3 className="seccion-titulo">Próximos pasos</h3>
                  <ol className="pasos-lista">
                    <li><strong>Confirme el plan.</strong> Un mensaje por WhatsApp es suficiente para reservar su cupo del piloto.</li>
                    <li><strong>Envíenos los datos y la carta.</strong> Publicamos su ficha en un plazo de 48 horas.</li>
                    <li><strong>Empiece a enviar el menú del día.</strong> Nosotros lo publicamos y los clientes pueden contactarlo.</li>
                  </ol>

                  {/* Cierre */}
                  <div className="cierre-cta">
                    <div>
                      <span className="cierre-cta-etq">¿Empezamos?</span>
                      <p>El plan piloto es para 40 restaurantes. Reserve su cupo, llene el formulario y publiquemos {cot.restaurante_nombre}.</p>
                    </div>
                    <div className="cierre-cta-datos">
                      <strong>quecomerenloja.com</strong>
                      <span>WhatsApp +593 98 696 2872</span>
                    </div>
                  </div>

                  {/* Firmas */}
                  <section className="firmas">
                    <div>
                      <div className="firma-linea">
                        <span className="firma-rol">Elaborado por</span>
                        <div className="firma-nombre">César Reyes</div>
                        <div className="firma-dato">Fundador · Qué Comer en Loja</div>
                      </div>
                    </div>
                    <div>
                      <div className="firma-linea">
                        <span className="firma-rol">Aceptado por</span>
                        <div className="firma-nombre">{cot.cliente_nombre}</div>
                        <div className="firma-dato">Fecha: ______ / ______ / ____________</div>
                      </div>
                    </div>
                  </section>

                  <p className="gracias">Gracias por su tiempo. Hecho con cariño en Loja, Ecuador.</p>
                </main>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
