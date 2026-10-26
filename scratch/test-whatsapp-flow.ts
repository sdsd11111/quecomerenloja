import { normalizarTelefono, sonMismoTelefono } from '@/lib/services/evolutionService';
import { extraerPrefijoMenu, parsearMenuFallback } from '@/lib/services/menuParser';

async function testWhatsappFlow() {
  console.log('--- 1. Test de Normalización Telefónica ---');
  const tel1 = normalizarTelefono('593991234567@s.whatsapp.net');
  const tel2 = normalizarTelefono('0991234567');
  const tel3 = normalizarTelefono('+593 99 123 4567');
  const tel4 = normalizarTelefono('991234567');

  console.log('tel1:', tel1);
  console.log('tel2:', tel2);
  console.log('tel3:', tel3);
  console.log('tel4:', tel4);

  const iguales12 = sonMismoTelefono('593991234567@s.whatsapp.net', '0991234567');
  const iguales23 = sonMismoTelefono('0991234567', '+593 99 123 4567');
  const distinto = sonMismoTelefono('0987654321', '0991234567');

  console.log('¿593991234567 == 0991234567?:', iguales12);
  console.log('¿0991234567 == +593 99 123 4567?:', iguales23);
  console.log('¿0987654321 == 0991234567?:', distinto);

  if (!iguales12 || !iguales23 || distinto) {
    throw new Error('Fallo en la normalización telefónica');
  }

  console.log('\n--- 2. Test de Extracción de Prefijos Autorizados ---');
  const prueba1 = extraerPrefijoMenu('MENU: Sopa de Repe y Cecina con arroz $3.50');
  const prueba2 = extraerPrefijoMenu('menu del dia: Seco de chivo y jugo');
  const prueba3 = extraerPrefijoMenu('#MENU: Encebollado mixto');
  const prueba4 = extraerPrefijoMenu('Hola buenas tardes que precio tiene?');
  const prueba5 = extraerPrefijoMenu('PROMO: 2x1 en hamburguesas clásicas');

  console.log('Prueba "MENU:":', prueba1);
  console.log('Prueba "menu del dia:":', prueba2);
  console.log('Prueba "#MENU:":', prueba3);
  console.log('Prueba sin prefijo (debe ser falso):', prueba4.tienePrefijo);
  console.log('Prueba "PROMO:":', prueba5);

  if (!prueba1.tienePrefijo || !prueba2.tienePrefijo || !prueba3.tienePrefijo || prueba4.tienePrefijo || !prueba5.tienePrefijo) {
    throw new Error('Fallo en la detección de prefijos de menú');
  }

  console.log('\n--- 3. Test de Parsing de Menú Determinista ---');
  const parseado = parsearMenuFallback('Almuerzo Ejecutivo Completo\nSopa: Caldo de Gallina Criolla\nSegundo: Cecina Lojana con menestra\nIncluye jugo y postre\nPrecio: $3.75');
  console.log('Parseado:', parseado);

  if (parseado.precioPromo !== '$3.75' || !parseado.titulo.includes('Almuerzo')) {
    throw new Error('Fallo en el parser fallback de menú');
  }

  console.log('\n✅ TODOS LOS TESTS UNITARIOS Y ADVERSARIALES PASARON CON ÉXITO');
}

testWhatsappFlow().catch((e) => {
  console.error('❌ ERROR EN TEST:', e);
  process.exit(1);
});
