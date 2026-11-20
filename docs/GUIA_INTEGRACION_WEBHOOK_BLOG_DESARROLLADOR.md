# Guía Definitiva y Exhaustiva de Integración: Webhook del Blog SEO
**Proyecto:** Qué Comer en Loja (`quecomerenloja.com`)  
**Dirigido a:** Programadores externos, agencias de posicionamiento SEO, integradores de IA (Make, n8n, ChatGPT/Claude Bots).  
**Versión:** 2.0 (Completa con todas las posibilidades de JSON y formatos)

---

## 1. Fundamentos Técnicos del Endpoint

* **Método HTTP:** `POST`
* **URL Producción:** `https://quecomerenloja.com/api/webhooks/blog`
* **URL Desarrollo Local:** `http://localhost:3001/api/webhooks/blog`
* **Headers Obligatorios:**
  ```http
  Content-Type: application/json; charset=utf-8
  x-blog-key: qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2
  ```
  *(También soporta: `Authorization: Bearer qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2`)*

* **Lógica Idempotente (Upsert):**
  - **Si el `slug` NO existe:** Crea el artículo nuevo (`201 Created`).
  - **Si el `slug` YA existe:** Actualiza contenido, metadatos, tags y actualiza `fecha_modificacion = NOW()` sin duplicar (`200 OK`).
* **Indexación y Caché Automática:** Cada llamada invalida la caché ISR de Next.js (`/blog` y `/blog/[slug]`) y actualiza el `sitemap.xml` para Googlebot.

---

## 2. Todas las Posibilidades de Envío del JSON

A continuación se detallan los 4 escenarios de envío que el sistema procesa a la perfección:

---

### Posibilidad A: El JSON Completo / "Máximo Nivel SEO y Multimedia"
*(Recomendado para guías definitivas, artículos pilares o notas con video e imágenes intermedias).*

```json
{
  "titulo": "Las 7 Mejores Huecas para Comer Cecina en Loja: Guía Gastronómica 2026",
  "slug": "mejores-huecas-cecina-loja",
  "resumen": "Descubre dónde comer la auténtica cecina lojana asada al carbón de leña con yuca suave, mote y ají de pepa tradicional. Precios, ubicaciones y secretos culinarios.",
  "contenido": "## 1. El Secreto del Asado Lojano\nLa cecina lojana es un corte fino de cerdo marinado con ajo morado, achiote artesanal y sal en grano de Zapotillo...\n\n![Plato de cecina recién asada](https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80)\n\n### Huecas recomendadas en la ciudad\n1. **El Fogón Lojano:** Tradición de más de 30 años en San Sebastián.\n2. **Cecinas de Catamayo:** Sabor ahumado inconfundible.\n\n| Hueca | Especialidad | Rango de Precio | Ubicación |\n| :--- | :--- | :--- | :--- |\n| El Fogón Lojano | Cecina tradicional | $5.00 - $6.50 | San Sebastián |\n| Asadero Don Pepe | Cecina mixta con costilla | $6.00 - $7.50 | Vía a Vilcabamba |\n\n> **Consejo local:** Pide siempre ají de pepa extra y acompáñalo con café de altura lojano recién pasado.\n\nPara ver la técnica tradicional de asado en leña:\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "imagen": "https://quecomerenloja.com/platos/cecina-lojana.webp",
  "imagen_alt": "Plato típico de cecina lojana tradicional con mote caliente y ensalada",
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "categoria": "Huecas y Tradición",
  "canton_slug": "loja",
  "etiquetas": [
    "cecina lojana",
    "donde comer en loja",
    "platos tipicos de loja",
    "huecas tradicionales",
    "asados en loja"
  ],
  "autor": "Comité Gastronómico Qué Comer en Loja",
  "tiempo_lectura": 6,
  "publicado": true
}
```

**¿Qué ocurre visualmente con este JSON?**
1. La cabecera activa pestañas interactivas: **[📷 Foto del Plato]** y **[🎥 Ver Video]**.
2. La imagen intermedia `![alt](url)` se coloca centrada, con bordes redondeados y sombra suave.
3. El enlace de YouTube en el texto se convierte automáticamente en un reproductor de video incrustado.
4. La tabla de precios se formatea con encabezado oscuro y filas alternadas.

---

### Posibilidad B: El JSON Mínimo Obligatorio
*(Para publicaciones rápidas, notas breves o noticias de eventos).*

```json
{
  "titulo": "Festival del Café Lojano 2026: Fechas y Cafeterías Participantes",
  "slug": "festival-del-cafe-lojano-2026",
  "resumen": "Todo lo que necesitas saber sobre el festival de café de especialidad de Loja con catas abiertas y barismo.",
  "contenido": "## Vuelve la Fiesta del Café a Loja\nEste mes se reunirán los mejores productores de Vilcabamba, Chaguarpamba y Puyango en la plaza central de San Sebastián para ofrecer catas en vivo y venta de café premiado con Taza Dorada.",
  "imagen": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80"
}
```

**¿Qué valores asume el sistema por defecto si no los envías?**
* `publicado`: Se asume `true`.
* `categoria`: Se asume `"Gastronomía"`.
* `canton_slug`: Se asume `"loja"`.
* `autor`: Se asume `"Equipo Editorial Qué Comer en Loja"`.
* `imagen_alt`: Toma automáticamente el valor del `titulo`.
* `tiempo_lectura`: Se calcula de forma automática contando las palabras del `contenido`.
* `video_url`: Se omite y solo se muestra la fotografía principal.

---

### Posibilidad C: Artículo en Modo Borrador (Draft)
*(Ideal cuando el redactor externo quiere enviar el post pero prefiere que el administrador del sitio lo revise antes de que sea visible al público).*

```json
{
  "titulo": "Secretos del Cuy Asado en San Sebastián y sus Acompañantes",
  "slug": "secretos-del-cuy-asado-loja",
  "resumen": "Borrador de investigación sobre los asaderos tradicionales de cuy en la ciudad de Loja.",
  "contenido": "## Historia del Cuy Asado en Loja\nContenido en revisión pendiente de validar precios con los locales...",
  "imagen": "https://quecomerenloja.com/platos/cuy-asado-loja.webp",
  "categoria": "Tradición",
  "publicado": false
}
```
* **Efecto:** El artículo se guarda en la base de datos pero **NO aparece en `/blog` ni es indexable por Google** hasta que cambie a `publicado: true`.

---

### Posibilidad D: Envío con Formatos Alternativos de Etiquetas y Tiempos
*(El sistema es flexible y tolera variaciones habituales de integradores externos).*

```json
{
  "titulo": "Ruta de los Mejores Bolones de Verde en Loja",
  "slug": "ruta-mejores-bolones-verde-loja",
  "resumen": "De chicharrón, queso o mixtos: dónde comer los mejores bolones para el desayuno en Loja.",
  "contenido": "## Desayuno de Campeones en Loja\nEl bolón de verde con café filtrado es una religión mañanera...",
  "imagen": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
  "etiquetas": "desayunos en loja, bolones, cafe de loja, huecas",
  "tiempo_lectura": "4",
  "publicado": 1,
  "canton_slug": "catamayo"
}
```
* **Tolerancia:** `etiquetas` puede ser un texto separado por comas o un Array. `tiempo_lectura` puede ser string o número. `publicado` puede ser booleano (`true`/`false`) o entero (`1`/`0`).

---

## 3. Guía de Formatos Adentro del `contenido` (Markdown y Multimedia)

El campo `contenido` soporta todas las características de formato editorial:

| Elemento | Sintaxis en el JSON | Resultado Visual |
| :--- | :--- | :--- |
| **Título de sección** | `## Subtítulo Principal` | Encabezado H2 en color Petróleo (`#153E3E`) con línea separadora. |
| **Subsección** | `### Detalle de Hueca` | Encabezado H3 en tipografía League Spartan. |
| **Imágenes Intermedias** | `![Descripción](https://url-imagen.jpg)` | Imagen centrada, contenida a 480px máximo, con esquinas redondeadas y sombra. |
| **Videos Embebidos** | `https://www.youtube.com/watch?v=ID` | Se detecta automáticamente la URL suelta de YouTube/Vimeo/MP4 y se incrusta el reproductor responsivo. |
| **Citas / Tips** | `> **Dato:** La cecina no lleva vinagre.` | Cuadro destacado con borde Cítrico (`#D0DB61`) y fondo suave. |
| **Tablas** | `\| Plato \| Precio \|\n\| Repe \| $2.50 \|` | Tabla con encabezado Petróleo y filas tipo cebra. |
| **Enlaces** | `[Conoce más sobre el Repe](/platos/repe-lojano)` | Enlace estilizado con transición y color de marca. |

---

## 4. Códigos de Respuesta HTTP

| Código | Significado | Explicación |
| :--- | :--- | :--- |
| **`201 Created`** | Post Creado | El `slug` era nuevo; se guardó y se invalidó la caché al instante. |
| **`200 OK`** | Post Actualizado | El `slug` ya existía; se actualizaron los campos sin duplicar el registro. |
| **`401 Unauthorized`** | No Autorizado | El header `x-blog-key` falta o no coincide con la clave del servidor. |
| **`422 Unprocessable`** | Error de Validación | Falta un campo obligatorio o no cumple la longitud mínima (devuelve un array con cada detalle exacto). |
| **`400 Bad Request`** | JSON Malformado | El cuerpo de la petición no es un JSON sintácticamente válido. |
| **`500 Server Error`** | Error del Servidor | Problema interno de conexión a la base de datos. |

---

## 5. Scripts de Prueba Rápidos para Copiar y Pegar

### cURL
```bash
curl -X POST https://quecomerenloja.com/api/webhooks/blog \
  -H "Content-Type: application/json" \
  -H "x-blog-key: qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2" \
  -d '{
    "titulo": "Ruta del Mejor Café de Altura en Loja",
    "slug": "ruta-mejor-cafe-de-altura-loja",
    "resumen": "Guía completa de las cafeterías de especialidad más premiadas de Loja y Vilcabamba.",
    "contenido": "## Loja, Capital Cafetalera del Ecuador\nEl café de especialidad de Loja cuenta con denominación de origen...",
    "imagen": "https://quecomerenloja.com/platos/cafe-loja.webp",
    "categoria": "Cafeterías",
    "etiquetas": ["cafe de loja", "cafeterias", "vilcabamba"],
    "publicado": true
  }'
```

### Python
```python
import requests

url = "https://quecomerenloja.com/api/webhooks/blog"
headers = {
    "Content-Type": "application/json",
    "x-blog-key": "qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2"
}

payload = {
    "titulo": "Guía de las Mejores Huecas de Almuerzo en Loja",
    "slug": "mejores-huecas-almuerzo-loja",
    "resumen": "Dónde encontrar menú del día con sabor casero, sopa tradicional y segundo abundante.",
    "contenido": "## El Almuerzo Tradicional Lojano\nEn Loja el almuerzo es sagrado: siempre incluye sopa caliente...",
    "imagen": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
    "categoria": "Almuerzos",
    "publicado": True
}

res = requests.post(url, json=payload, headers=headers)
print("Status:", res.status_code)
print("Respuesta:", res.json())
```
