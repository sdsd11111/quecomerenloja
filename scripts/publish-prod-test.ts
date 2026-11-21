import fetch from 'node-fetch';

async function testProductionWebhook() {
  const url = 'https://quecomerenloja.com/api/webhooks/blog';
  const apiKey = 'qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2';

  const heavyArticle = {
    titulo: 'La Gran Ruta Gastronómica de Loja: De las Huecas Centenarias al Café de Especialidad 2026',
    slug: 'gran-ruta-gastronomica-loja-completa',
    resumen: 'Una enciclopedia gastronómica completa de Loja: secretos ancestrales del repe, la cecina a la leña, el tamal lojano, los cafetales premiados de altura y galerías visuales con video.',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
    imagen_alt: 'Mesa servida con gastronomía lojana tradicional en un mesón de madera rústica',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    categoria: 'Guías Monumentales',
    canton_slug: 'loja',
    etiquetas: [
      'gastronomia de loja',
      'cecina lojana',
      'repe lojano',
      'cafe de especialidad',
      'turismo gastronomico ecuador',
      'donde comer en loja',
      'huecas tradicionales',
    ],
    autor: 'Comité Gastronómico Qué Comer en Loja',
    tiempo_lectura: 12,
    publicado: true,
    contenido: `
## Introducción: La Identidad Culinaria más Singular del Ecuador

La cocina de Loja no se parece a ninguna otra en la región andina ecuatoriana. Su aislamiento geográfico histórico y su bendita fertilidad en valles templados como Vilcabamba y Malacatos permitieron que técnicas culinarias prehispánicas y coloniales se conservaran intactas.

> **Dato Histórico:** El repealed o *repe* se consumía originalmente como desayuno energizante por los arrieros que cruzaban la cordillera hacia Zamora y la Amazonía.

---

## 1. El Repe Lojano: Ciencia y Tradición de la Cremosa Sopa Verde

El secreto del verdadero repe reside en un instrumento de madera: **el molinillo**. Cuando el guineo verde se cocina en agua pura de vertiente, los almidones se liberan lentamente. Al batirlo enérgicamente en forma circular, la sopa emulsiona de forma natural hasta adquirir una textura aterciopelada sin necesidad de lácteos espesantes o harinas.

![Cuchara de madera batiendo sopa tradicional](https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=80)

### Ingredientes Esenciales:
1. **Guineo verde (musáceas):** Cortado con cuchillo de hueso o madera para evitar la oxidación temprana.
2. **Quesillo tierno de hacienda:** Sin madurar, con abundante suero que corta la acidez natural.
3. **Cilantro de pozo:** Picado finamente minutos antes de apagar la hornilla.
4. **Aguacate criollo de Vilcabamba:** Se coloca frío al borde del plato caliente para crear el contraste térmico característico.

---

## 2. La Cecina Lojana: El Arte del Fileteado al Carbón

La cecina es técnica milimétrica. A diferencia del charqui o las carnes secas de otras latitudes, la cecina lojana **no se deshidrata al sol hasta endurecerse**; se trata de un lonjeado ultrafino de pulpa de cerdo que se orea por pocas horas con marinada artesanal:

* **Ajo morado de campo machacado**
* **Achiote puro en grano disuelto en manteca**
* **Sal en grano de las salinas de Zapotillo**

![Carne asándose a las brasas de carbón](https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80)

El asado debe hacerse con **carbón de eucalipto o guabo**, manteniendo las brasas vivas pero sin llama directa para caramelizar los azúcares y grasas en menos de 90 segundos por lado.

---

## 3. Video Documental: La Magia de la Cocina en Vivo

Puedes ver en este reportaje la preparación tradicional en leña y el testimonio de las cocineras tradicionales:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

---

## 4. Galería Visual: Tradición en Cada Esquina

Los mercados de Loja (Mercado Central, Centro Comercial y San Sebastián) son el epicentro de la auténtica cocina popular:

| Plato | Hueca Recomendada | Precio Promedio | Horario Ideal |
| :--- | :--- | :--- | :--- |
| **Repe Tradicional** | El Fogón Lojano | $2.50 - $3.50 | 11:30 AM - 2:00 PM |
| **Cecina con Mote y Yuca** | Cecinas de la Catamayo | $5.00 - $7.00 | Almuerzo y Cena |
| **Tamal con Café de Altura** | Café Indera / La Lojanía | $1.50 - $2.50 | 4:30 PM - 7:00 PM |
| **Ají de Pepa y Cuy Asado** | Asadero San Sebastián | $12.00 - $18.00 | Fines de Semana |

![Muestra de café y tamales lojanos](https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&q=80)

---

## 5. El Café de Loja: La Cuna de Taza Dorada

Loja ostenta múltiples títulos mundiales de *Taza Dorada*. Productores en Chaguarpamba, Puyango y Vilcabamba cultivan variedades como **Geisha, Típica Mejorada y Borbón Sidra** a altitudes que superan los 1.900 metros sobre el nivel del mar.

### Notas de Cata Características:
* Fragancia de jazmín y azahares.
* Acidez málica brillante (manzana verde).
* Retrogusto dulce y prolongado a panela y caña de azúcar.

---

## Conclusión

Visitar Loja es una experiencia sensorial obligatoria para cualquier amante del buen comer. Guarda esta guía, compártela y apoya el consumo local en las huecas de nuestra provincia.
`,
  };

  try {
    console.log('🚀 Publicando en VPS PRODUCCIÓN (https://quecomerenloja.com/api/webhooks/blog)...');
    const res = await (globalThis.fetch || fetch)(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blog-key': apiKey,
      },
      body: JSON.stringify(heavyArticle),
    });

    const data: any = await res.json();
    console.log('📡 HTTP Status:', res.status);
    console.log('📦 Respuesta de Producción:', JSON.stringify(data, null, 2));

    console.log('\n🔍 Verificando URL en Producción: https://quecomerenloja.com/blog/gran-ruta-gastronomica-loja-completa');
    const getRes = await (globalThis.fetch || fetch)('https://quecomerenloja.com/blog/gran-ruta-gastronomica-loja-completa');
    console.log('🌐 Frontend Producción Status:', getRes.status);
  } catch (err: any) {
    console.error('❌ Error en producción:', err.message);
  }
}

testProductionWebhook();
