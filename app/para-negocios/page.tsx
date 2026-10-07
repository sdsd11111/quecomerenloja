import type { Metadata } from "next";
import { PLANS, SITE } from "@/lib/site";
import { PageHero, Wrap } from "@/components/PageHero";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Para negocios: Sello Verificado GuIAloja",
  description: "Publica tu menú del día por audio de WhatsApp, aparece en búsquedas por plato y en las recomendaciones del Asesor IA.",
  alternates: { canonical: "/para-negocios" },
};

const BENEFITS = [
  "Aparecer cuando el turista pregunta “¿dónde comer en Loja?”",
  "Publicación del menú del día por audio de WhatsApp, con tu confirmación en 1 clic.",
  "Contacto directo sin comisiones de delivery: ahorro potencial del 20–30% frente a servicios que las cobran.",
  "Fotos de tus platos en alta definición, optimizadas para cargar rápido.",
  "Sello Verificado GuIAloja con fecha de verificación visible.",
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="TU COCINA MERECE SER DESCUBIERTA" title={<>¿Tienes un restaurante, café o bar en <em className="text-[#e1b45f]">Loja?</em></>}>
        Publica tu menú del día enviando un audio por WhatsApp. Sin formularios. Sin paneles. Sin complicaciones.
      </PageHero>
      <Wrap className="grid gap-12 py-14 md:grid-cols-2 md:gap-16">
        <div>
          <ul className="space-y-3 text-sm">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-3"><span className="font-extrabold text-green">✓</span>{b}</li>
            ))}
          </ul>
          <p className="mt-5 text-[10px] text-muted">El ahorro depende del servicio comparado. El tiempo de carga depende de la conexión y de la optimización final; no es una garantía.</p>
          <h2 className="mt-10 text-2xl">Así funciona el audio</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Envías una nota de voz con los platos y precios de hoy.</li>
            <li>Te devolvemos una vista previa por WhatsApp.</li>
            <li>Confirmas con un clic y tu menú queda publicado.</li>
          </ol>
        </div>
        <div className="h-fit rounded-[18px] border border-[#dfd2b9] bg-paper p-8 shadow-[0_14px_35px_#56361308]">
          <h2 className="mb-2 text-[26px]">Una ficha. Muchas nuevas mesas.</h2>
          <p className="mb-5 text-[11px] text-muted">Visibilidad premium y contacto directo. No somos una plataforma de delivery ni un generador de menús QR.</p>
          <table className="w-full border-collapse text-xs">
            <caption className="sr-only">Planes para negocios gastronómicos, precios en dólares estadounidenses</caption>
            <thead>
              <tr className="border-b border-line text-left text-[10px] font-medium text-muted">
                <th scope="col" className="py-2.5">Plan</th>
                <th scope="col" className="py-2.5 text-right">Precio · USD</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((p) => (
                <tr key={p.name} className="border-b border-line align-top">
                  <td className="py-5"><span className="block font-bold">{p.name}</span><span className="mt-1 block text-[10px] text-muted">{p.detail}</span></td>
                  <td className="py-5 text-right"><span className="whitespace-nowrap text-lg font-bold text-clay">${p.month}<small className="text-[10px] font-normal">/mes</small></span><span className="block text-[11px] text-muted">${p.year}/año</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="py-4 text-center text-[11px] text-clay">Pague 10 meses, quédese con 12.<small className="block text-[10px] text-muted">Sin permanencia forzosa.</small></p>
          <WhatsAppButton number={SITE.businessWhatsApp} text="Hola, quiero solicitar mi ficha en quecomerenloja.com. ¿Me cuentan los planes?" label="Solicitar mi ficha →" className="!bg-clay !text-white !border-clay" />
          <p className="mt-4 border-t border-dashed border-line pt-4 text-center text-[10px] text-muted">
            Posicionamiento <strong className="text-ink">Top 5 IA</strong> · <strong className="text-ink">$4,500 por 5 años</strong><br />
            Consulta condiciones y disponibilidad con GuIAloja.
          </p>
        </div>
      </Wrap>
    </>
  );
}
