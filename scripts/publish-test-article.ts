import fetch from 'node-fetch';

async function testLocalWebhook() {
  const url = 'http://localhost:3001/api/webhooks/blog';
  const apiKey = 'qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2';

  const payload = {
    titulo: 'Guía Gastronómica: Dónde comer el mejor Repe Lojano en 2026',
    slug: 'donde-comer-mejor-repe-lojano',
    resumen: 'Ruta detallada por las mejores huecas de Loja para probar el auténtico repe con guineo verde, quesillo fresco campesino y aguacate.',
    contenido: `## El Secreto del Auténtico Repe Lojano

El repe no es simplemente una sopa de guineo verde: es el corazón de la identidad culinaria lojana. Su textura cremosa se logra batiendo la sopa con el tradicional molinillo de madera, sin agregar harinas ni espesantes artificiales.

### Ingredientes Tradicionales
- **Guineo verde:** recién cosechado de los valles cercanos.
- **Quesillo fresco campesino:** que se desmenuza al final de la cocción.
- **Cilantro de pozo:** finamente picado.
- **Acompañamiento:** una buena rodaja de aguacate lojano y ají de pepa.

### Huecas recomendadas en la ciudad de Loja
1. **Mama Lola (San Sebastián):** Porción generosa servida en plato de barro tradicional.
2. **El Fogón Lojano:** Sabor ahumado de leña y atención familiar de primera.
3. **Tradición y Sabor:** Ideal para el almuerzo del fin de semana cerca del parque central.`,
    imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80',
    imagen_alt: 'Plato tradicional de repe lojano con aguacate y quesillo',
    categoria: 'Tradición Lojana',
    canton_slug: 'loja',
    etiquetas: ['repe lojano', 'donde comer en loja', 'platos tipicos', 'huecas de loja'],
    autor: 'Equipo Editorial Qué Comer en Loja',
    tiempo_lectura: 4,
    publicado: true,
  };

  try {
    console.log('🚀 Enviando JSON al Webhook en http://localhost:3001/api/webhooks/blog ...');
    const res = await (globalThis.fetch || fetch)(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json();
    console.log('📡 HTTP Status:', res.status);
    console.log('📦 Respuesta del Webhook:\n', JSON.stringify(data, null, 2));

    // Consultar el frontend público local
    console.log('\n🔍 Consultando renderizado del artículo en el navegador: http://localhost:3001/blog/donde-comer-mejor-repe-lojano ...');
    const getRes = await (globalThis.fetch || fetch)('http://localhost:3001/blog/donde-comer-mejor-repe-lojano');
    console.log('🌐 Frontend Status:', getRes.status);
    const html = await getRes.text();
    const hasTitle = html.includes('Dónde comer el mejor Repe Lojano en 2026');
    const hasSchema = html.includes('BlogPosting');
    const hasCanonical = html.includes('blog/donde-comer-mejor-repe-lojano');
    
    console.log('✅ ¿Título H1 / SEO renderizado?:', hasTitle);
    console.log('✅ ¿Datos estructurados Schema.org presentes?:', hasSchema);
    console.log('✅ ¿Etiqueta Canonical correcta?:', hasCanonical);
  } catch (err: any) {
    console.error('❌ Error llamando al webhook local en 3001:', err.message);
  }
}

testLocalWebhook();
