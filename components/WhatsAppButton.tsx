import { whatsappURL } from "@/lib/whatsapp";

interface Props {
  number: string;
  text: string;
  label?: string;
  className?: string;
}

/** Enlace real si hay número válido; si no, un estado honesto "próximamente". */
export function WhatsAppButton({ number, text, label = "Escribir por WhatsApp →", className = "" }: Props) {
  const url = whatsappURL(number, text);
  const base = "inline-flex w-full items-center justify-center rounded-lg border px-4 py-3 text-[11px] font-bold transition";
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`${base} border-[#d9e4d2] bg-[#eaf0e4] text-[#3c6446] hover:bg-[#dce8d5] ${className}`}>
        {label}
      </a>
    );
  }
  return (
    <span aria-disabled="true" className={`${base} cursor-default border-line bg-transparent text-muted ${className}`}>
      WhatsApp disponible al activar el negocio
    </span>
  );
}
