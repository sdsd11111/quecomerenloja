/** Devuelve un enlace wa.me válido o null si el número no está configurado. */
export function whatsappURL(number: string, text: string): string | null {
  return /^\d{8,15}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : null;
}
