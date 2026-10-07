import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageHero, Wrap } from "@/components/PageHero";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contacto y sugerencias",
  description: "Recomienda un restaurante, reporta información incorrecta o solicita incorporar tu negocio.",
  alternates: { canonical: "/contacto" },
};

const REASONS = [
  { t: "Recomendar un restaurante", m: "Hola, quiero recomendar un restaurante para Qué Comer en Loja:" },
  { t: "Reportar información incorrecta", m: "Hola, quiero reportar información incorrecta en Qué Comer en Loja:" },
  { t: "Solicitar incorporación de mi negocio", m: "Hola, quiero incorporar mi negocio a Qué Comer en Loja." },
  { t: "Hablar con el equipo", m: "Hola, quisiera hablar con el equipo de Qué Comer en Loja." },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="CONTACTO" title={<>Cuéntanos, <em className="text-[#e1b45f]">te escuchamos</em></>}>
        Escríbenos por WhatsApp: es la forma más rápida.
      </PageHero>
      <Wrap className="grid gap-5 py-12 md:grid-cols-2">
        {REASONS.map((r) => (
          <div key={r.t} className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="mb-4 text-xl">{r.t}</h2>
            <WhatsAppButton number={SITE.businessWhatsApp} text={r.m} label="Escribir por WhatsApp →" />
          </div>
        ))}
      </Wrap>
    </>
  );
}
