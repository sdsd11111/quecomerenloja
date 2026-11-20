/**
 * Test Suite Adversarial para el Webhook de Publicación de Blog
 * Valida:
 * 1. Rechazo sin Token (401)
 * 2. Rechazo con Token Inválido (401)
 * 3. Rechazo por Faltantes de Contrato (422)
 * 4. Inserción exitosa de Artículo Nuevo (201)
 * 5. Actualización Idempotente con mismo Slug (200 - Upsert)
 */

import { POST } from '../app/api/webhooks/blog/route';

async function runAdversarialTests() {
  console.log('🧪 Iniciando batería de pruebas adversariales del Webhook Blog...\n');
  const validKey = process.env.BLOG_WEBHOOK_KEY || 'qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2';
  process.env.BLOG_WEBHOOK_KEY = validKey;

  let passed = 0;
  let total = 0;

  // Test 1: Sin Token
  total++;
  try {
    const req = new Request('http://localhost:3000/api/webhooks/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Test' }),
    });
    const res = await POST(req);
    const data = await res.json();
    if (res.status === 401) {
      console.log('✅ TEST 1 PASADO: Bloqueo sin API Key (401 Unauthorized)');
      passed++;
    } else {
      console.error('❌ TEST 1 FALLÓ: Esperaba 401 y obtuve', res.status, data);
    }
  } catch (err: any) {
    console.error('❌ TEST 1 ERROR:', err.message);
  }

  // Test 2: Token incorrecto
  total++;
  try {
    const req = new Request('http://localhost:3000/api/webhooks/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': 'clave_falsa_123',
      },
      body: JSON.stringify({ titulo: 'Test' }),
    });
    const res = await POST(req);
    if (res.status === 401) {
      console.log('✅ TEST 2 PASADO: Bloqueo con Clave Falsa (401 Unauthorized)');
      passed++;
    } else {
      console.error('❌ TEST 2 FALLÓ: Esperaba 401 y obtuve', res.status);
    }
  } catch (err: any) {
    console.error('❌ TEST 2 ERROR:', err.message);
  }

  // Test 3: Carga incompleta (violación de contrato)
  total++;
  try {
    const req = new Request('http://localhost:3000/api/webhooks/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': validKey,
      },
      body: JSON.stringify({
        titulo: 'Corto',
        slug: '', // Vacío
        resumen: 'Muy corto',
        contenido: 'Poco texto',
        imagen: 'no-es-url',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    if (res.status === 422 && data.detalles?.length >= 3) {
      console.log('✅ TEST 3 PASADO: Detección estricta de contrato (422 Unprocessable Entity -', data.detalles.length, 'errores detectados)');
      passed++;
    } else {
      console.error('❌ TEST 3 FALLÓ: Esperaba 422 con array de errores y obtuve', res.status, data);
    }
  } catch (err: any) {
    console.error('❌ TEST 3 ERROR:', err.message);
  }

  // Test 4: Creación de Post Completo (INSERT)
  total++;
  const testSlug = `guia-cecina-test-${Date.now().toString().slice(-4)}`;
  try {
    const validPayload = {
      titulo: 'Guía de la Auténtica Cecina Lojana y sus Mejores Huecas',
      slug: testSlug,
      resumen: 'Un recorrido gastronómico por los asaderos tradicionales de Loja donde se prepara la cecina más jugosa al carbón.',
      contenido: '## El Secreto del Marinado Lojano\nLa cecina lojana es uno de los platos insignia del sur de Ecuador. Se prepara con lomo fino de cerdo cortado finamente y marinado con ajo, sal y achiote...\n\n### Acompañantes Indispensables\n- Yuca cocida al vapor\n- Mote recién cocido\n- Ají de pepa molido en piedra',
      imagen: 'https://quecomerenloja.com/platos/cecina-lojana.webp',
      imagen_alt: 'Plato tradicional de cecina lojana con ensalada y mote',
      categoria: 'Tradición Lojana',
      etiquetas: ['cecina', 'donde comer en loja', 'platos tipicos'],
      canton_slug: 'loja',
      autor: 'Redacción Gastronómica',
      publicado: true,
      tiempo_lectura: 4,
    };

    const req = new Request('http://localhost:3000/api/webhooks/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': validKey,
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    if (res.status === 201 && data.action === 'created') {
      console.log('✅ TEST 4 PASADO: Inserción Exitosa en MySQL (201 Created) -> ID:', data.id, 'Slug:', data.slug);
      passed++;
    } else {
      console.error('❌ TEST 4 FALLÓ: Esperaba 201 created y obtuve', res.status, data);
    }
  } catch (err: any) {
    console.error('❌ TEST 4 ERROR:', err.message);
  }

  // Test 5: Re-envío Idempotente del mismo Post con cambio (UPDATE / UPSERT)
  total++;
  try {
    const updatePayload = {
      titulo: 'Guía de la Auténtica Cecina Lojana (Edición Actualizada 2026)',
      slug: testSlug,
      resumen: 'Un recorrido gastronómico actualizado por los asaderos tradicionales de Loja con precios e información 2026.',
      contenido: '## Contenido extendido y verificado para 2026...\nLa cecina lojana sigue siendo el plato preferido de los turistas y locales.',
      imagen: 'https://quecomerenloja.com/platos/cecina-lojana.webp',
      imagen_alt: 'Cecina lojana actualizada',
      categoria: 'Tradición Lojana',
      etiquetas: ['cecina', 'actualizado 2026'],
      canton_slug: 'loja',
      autor: 'Redacción Gastronómica Especializada',
      publicado: true,
      tiempo_lectura: 6,
    };

    const req = new Request('http://localhost:3000/api/webhooks/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': validKey,
      },
      body: JSON.stringify(updatePayload),
    });

    const res = await POST(req);
    const data = await res.json();

    if (res.status === 200 && data.action === 'updated') {
      console.log('✅ TEST 5 PASADO: Upsert / Actualización Idempotente (200 OK) -> Slug conservado:', data.slug);
      passed++;
    } else {
      console.error('❌ TEST 5 FALLÓ: Esperaba 200 updated y obtuve', res.status, data);
    }
  } catch (err: any) {
    console.error('❌ TEST 5 ERROR:', err.message);
  }

  console.log(`\n===================================`);
  console.log(`🏁 RESULTADO: ${passed}/${total} PRUEBAS SUPERADAS`);
  console.log(`===================================\n`);
}

runAdversarialTests();
