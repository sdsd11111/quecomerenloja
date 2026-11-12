import 'server-only';
import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

/**
 * Cifrado AES-256-GCM para datos sensibles del formulario (cuenta bancaria).
 * Clave derivada de FORMULARIO_CLAVE; si no está definida se usa una clave
 * derivada del secreto del panel (para que funcione de inmediato) — en
 * producción conviene definir FORMULARIO_CLAVE.
 */
function obtenerClave(): Buffer {
  const semilla =
    process.env.FORMULARIO_CLAVE ||
    'quecomerenloja-formulario-alta-2026';
  return createHash('sha256').update(semilla).digest();
}

export function cifrarTexto(texto: string): string {
  if (!texto) return '';
  const iv = randomBytes(12);
  const cifrador = createCipheriv('aes-256-gcm', obtenerClave(), iv);
  const cifrado = Buffer.concat([cifrador.update(texto, 'utf8'), cifrador.final()]);
  const tag = cifrador.getAuthTag();
  return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${cifrado.toString('base64')}`;
}

export function descifrarTexto(valor: string): string {
  if (!valor) return '';
  if (!valor.startsWith('v1:')) return valor; // dato guardado sin cifrar
  try {
    const [, ivB64, tagB64, datosB64] = valor.split(':');
    const descifrador = createDecipheriv('aes-256-gcm', obtenerClave(), Buffer.from(ivB64, 'base64'));
    descifrador.setAuthTag(Buffer.from(tagB64, 'base64'));
    const plano = Buffer.concat([
      descifrador.update(Buffer.from(datosB64, 'base64')),
      descifrador.final(),
    ]);
    return plano.toString('utf8');
  } catch {
    return '';
  }
}
