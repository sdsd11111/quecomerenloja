# Guía Definitiva y Exhaustiva de Integración: Webhook del Blog SEO
**Proyecto:** Qué Comer en Loja (`quecomerenloja.com`)  
**Dirigido a:** Programadores externos, agencias de posicionamiento SEO, integradores de IA (Make, n8n, ChatGPT/Claude Bots).  
**Versión:** 3.1 (Fix crítico: /blog ahora force-dynamic — artículos visibles al instante tras webhook)

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
* **Indexación y Caché:** `/blog` y `/blog/[slug]` son `force-dynamic` — cada vez que el usuario visita `/blog`, Next.js va directo a la base de datos. Un artículo publicado por el webhook aparece **en la siguiente carga de página**, sin esperas de caché.

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

---

## 6. Sistema SEO y OpenGraph: Guía Completa para el Programador

> **Respuesta directa:** Sí, el OG es completamente dinámico. Cada artículo genera su propia imagen de previsualización (1200×630 px) de forma automática en el servidor — tanto para WhatsApp, como para Facebook, LinkedIn, Twitter/X y Google Discover. El programador externo NO tiene que hacer nada especial: el sistema lee los campos del JSON y genera todo.

---

### 6.1 ¿Qué genera automáticamente el sistema por cada artículo?

Cuando el webhook recibe un JSON y crea/actualiza un artículo, el sistema genera los siguientes metadatos SEO **de forma automática**, sin que el redactor externo tenga que hacer nada más:

| Metadato | Valor generado | Campo del JSON que lo alimenta |
| :--- | :--- | :--- |
| `og:title` | `{titulo} \| Qué Comer en Loja` | `titulo` |
| `og:description` | El resumen del artículo | `resumen` |
| `og:url` | `https://quecomerenloja.com/blog/{slug}` | `slug` |
| `og:type` | `article` (siempre) | — |
| `og:locale` | `es_EC` (siempre) | — |
| `og:site_name` | `Qué Comer en Loja` (siempre) | — |
| `og:image` | Imagen branded 1200×630 (ver sección 6.2) | `imagen` + `titulo` + `categoria` |
| `article:published_time` | Fecha de publicación ISO 8601 | `fecha_publicacion` (auto-asignada) |
| `article:modified_time` | Fecha de última modificación | `fecha_modificacion` (auto-actualizada en UPSERT) |
| `article:section` | La categoría del artículo | `categoria` |
| `article:tag` | Las etiquetas del artículo | `etiquetas` |
| `twitter:card` | `summary_large_image` (siempre) | — |
| `twitter:label1` / `data1` | Tiempo de lectura | `tiempo_lectura` |
| `twitter:label2` / `data2` | Categoría del artículo | `categoria` |
| **Schema.org** `BlogPosting` | JSON-LD completo en el `<head>` | Todos los campos del JSON |
| `canonical URL` | `https://quecomerenloja.com/blog/{slug}` | `slug` |

---

### 6.2 La imagen OG: cómo funciona exactamente

El sistema usa **Next.js `ImageResponse`** (Satori/Vercel OG) para generar una imagen branded por servidor, en tiempo real, con estas características:

- **Dimensiones exactas garantizadas:** 1200 × 630 px, PNG — cumple el estándar mínimo de WhatsApp, Facebook y LinkedIn sin ningún recorte.
- **Si se envía `imagen` en el JSON:** La imagen del artículo se usa como fondo semi-transparente (22% de opacidad) detrás del diseño branded. No importa si es 4:3, 16:9 o cuadrada — el sistema la adapta con `object-fit: cover`.
- **Si NO se envía `imagen`:** Se genera de todas formas una tarjeta branded completamente válida con el título, categoría y resumen.
- **Nunca falla WhatsApp:** La imagen se sirve desde la misma URL del sitio (`/blog/{slug}/opengraph-image`), siempre HTTPS, sin redirecciones.

**La URL de la imagen OG de cada artículo es:**
```
https://quecomerenloja.com/blog/{slug}/opengraph-image
```

**Diseño de la imagen branded:**
```
┌─────────────────────────────────────────────────────────────┐
│▌  Qué Comer en Loja · quecomerenloja.com        [círculos]  │
│▌                                                            │
│▌  [GASTRONOMÍA]  ← pill categoria                          │
│▌                                                            │
│▌  TÍTULO DEL ARTÍCULO                                       │
│▌  EN LETRAS GRANDES                                         │
│▌                                                            │
│▌  Resumen corto del artículo visible aquí...                │
│▌                                                            │
│▌  ───── 6 min de lectura                                   │
└─────────────────────────────────────────────────────────────┘
   ↑ Barra cítrico #D0DB61   Fondo petróleo #153E3E
```

---

### 6.3 Recomendaciones de imagen para máximo CTR en redes sociales

Aunque el sistema NO depende de la imagen enviada para generar el OG, enviar una buena imagen mejora la experiencia dentro del artículo:

| Criterio | Recomendación |
| :--- | :--- |
| **Formato** | JPEG, WebP o PNG (preferir WebP por peso) |
| **Dimensiones ideales** | 1200 × 800 px o más (proporción 3:2) |
| **Peso máximo** | Menos de 500 KB |
| **URL** | Siempre HTTPS. Sin redirecciones. Dominio estable. |
| **Sin texto en la imagen** | El sistema ya superpone el título — evitar imágenes con texto propio |
| **Foco central** | El sujeto principal debe estar centrado (el overlay puede recortar los bordes) |

**Ejemplo de imagen recomendada:**
```json
"imagen": "https://quecomerenloja.com/platos/cecina-lojana.webp"
```

---

### 6.4 Cómo verificar el OG de un artículo publicado

Después de publicar un artículo vía webhook, el programador puede verificar el OG con estas herramientas:

| Herramienta | URL | Para qué sirve |
| :--- | :--- | :--- |
| **Facebook Debugger** | `https://developers.facebook.com/tools/debug/?q=https://quecomerenloja.com/blog/{slug}` | Facebook, Messenger, WhatsApp |
| **Twitter Card Validator** | `https://cards-dev.twitter.com/validator` | Twitter/X |
| **OpenGraph.xyz** | `https://www.opengraph.xyz/url/https://quecomerenloja.com/blog/{slug}` | Vista previa visual rápida |
| **LinkedIn Post Inspector** | `https://www.linkedin.com/post-inspector/inspect/https://quecomerenloja.com/blog/{slug}` | LinkedIn |
| **Ver imagen OG directo** | `https://quecomerenloja.com/blog/{slug}/opengraph-image` | Verificar imagen branded |

> **Importante para WhatsApp:** WhatsApp cachea el preview. Si se actualiza un artículo, pegar el link en WhatsApp puede mostrar el preview viejo por hasta 7 días. Usar el Facebook Debugger para forzar re-scraping.

---

### 6.5 Schema.org BlogPosting (Rich Results en Google)

Cada artículo incluye automáticamente un bloque `<script type="application/ld+json">` con los datos estructurados completos que Google usa para Rich Results:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://quecomerenloja.com/blog/{slug}"
  },
  "headline": "Título del artículo",
  "description": "Resumen del artículo",
  "image": ["URL de la imagen del artículo"],
  "datePublished": "2026-11-20T00:00:00.000Z",
  "dateModified": "2026-11-20T00:00:00.000Z",
  "author": {
    "@type": "Organization",
    "name": "Autor o Equipo Editorial",
    "url": "https://quecomerenloja.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Qué Comer en Loja",
    "url": "https://quecomerenloja.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://quecomerenloja.com/logo-oficial.png"
    }
  },
  "articleSection": "Huecas y Tradición",
  "keywords": "cecina lojana, donde comer en loja, huecas"
}
```

> Para validar Rich Results: `https://search.google.com/test/rich-results?url=https://quecomerenloja.com/blog/{slug}`

---

### 6.6 Resumen de qué campos del JSON impactan en SEO

```
titulo     → <title>, og:title, twitter:title, Schema.org headline
resumen    → meta description, og:description, twitter:description, Schema.org description
slug       → canonical URL, og:url, URL del artículo en el sitio
imagen     → Fondo semi-transparente de la imagen OG branded (el OG siempre se genera)
imagen_alt → alt text de la imagen dentro del artículo
categoria  → og:article:section, twitter:data2, Schema.org articleSection, pill de categoría
etiquetas  → og:article:tag[], Schema.org keywords, pills en el artículo
autor      → Schema.org author, caja de autor al final del artículo
tiempo_lectura → twitter:data1, indicador de tiempo en el artículo y en la imagen OG
fecha_publicacion → og:article:published_time, Schema.org datePublished
publicado  → Si es false/0: artículo NO indexable por Google, NO aparece en /blog
```


---

## 7. Visibilidad de Artículos en `/blog`: Comportamiento Garantizado

> **Respuesta directa al programador externo:** Desde la versión 3.1 del sistema, `/blog` es `force-dynamic`. Esto significa que el listado va directo a la base de datos en cada carga — **no hay caché que esperar**. Un artículo con `publicado: true` aparece en el listado en la siguiente carga de la página `/blog` después de que el webhook responda `200 OK` o `201 Created`.

---

### 7.1 Flujo completo del webhook hasta visibilidad

```
1. Programador llama POST /api/webhooks/blog con publicado: true
   └─→ Webhook responde 201 Created (o 200 OK si es update)
   └─→ Artículo guardado en MySQL con publicado = 1

2. Usuario (o bot) carga https://quecomerenloja.com/blog
   └─→ Next.js (force-dynamic) consulta MySQL directamente
   └─→ Muestra todos los posts WHERE publicado = 1
   └─→ El artículo nuevo aparece en el listado ✅

3. Usuario carga https://quecomerenloja.com/blog/{slug}
   └─→ Artículo individual también force-dynamic
   └─→ Renderiza el artículo completo ✅

4. Googlebot indexa automáticamente en la próxima visita al sitemap
   └─→ https://quecomerenloja.com/sitemap.xml (también dinámico)
```

---

### 7.2 Causa del problema histórico (ya corregido en v3.1)

Antes de esta versión, `/blog` usaba `export const revalidate = 60` (ISR — Incremental Static Regeneration). Esto significa:

- La página se **pre-renderizaba estáticamente** y se guardaba en caché.
- Aunque el webhook llamara `revalidatePath('/blog')`, en entornos self-hosted (Docker sin Vercel) el comportamiento de invalidación on-demand puede no dispararse inmediatamente.
- El artículo podía tardar **hasta 60 segundos** en aparecer — o no aparecer hasta la siguiente visita que disparara la regeneración.

**La solución aplicada:** Cambiar a `force-dynamic` en `/blog/page.tsx`. Esto garantiza que el listado siempre lea de MySQL en tiempo real, sin esperas ni ambigüedades.

---

### 7.3 Tabla de diagnóstico: "Mi artículo no aparece en /blog"

| Síntoma | Causa probable | Solución |
| :--- | :--- | :--- |
| El webhook respondió `201 Created` pero el artículo no aparece | Se creó con `publicado: false` | Enviar de nuevo el mismo JSON con `publicado: true` → responderá `200 OK updated` |
| El webhook respondió `200 OK updated` pero sigue sin aparecer | La versión anterior del servidor tenía caché ISR de 60s | **Ya corregido en v3.1** — después del deploy no ocurre |
| El webhook respondió `401 Unauthorized` | La clave `x-blog-key` está mal copiada | Verificar que sea exactamente: `qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2` |
| El webhook respondió `422 Unprocessable` | Falta un campo obligatorio | Ver el array `detalles` en la respuesta JSON — indica qué campo falla |
| El artículo tiene URL `https://quecomerenloja.com/blog/{slug}` y da 404 | El slug en la DB no coincide con el que se intenta visitar | El sistema limpia el slug: elimina acentos, minúsculas, reemplaza espacios por guiones. Verificar el `slug` devuelto en la respuesta del webhook |
| El listado muestra el artículo pero sin imagen (placeholder) | La URL de `imagen` no es accesible públicamente | Usar URLs HTTPS permanentes, sin autenticación, sin redirecciones |

---

### 7.4 Verificación rápida post-publicación (checklist para el programador externo)

```bash
# 1. Verificar que el artículo existe en el listado público
curl https://quecomerenloja.com/blog | grep "prueba-ai-redactor"

# 2. Verificar que el artículo individual carga
curl -I https://quecomerenloja.com/blog/prueba-ai-redactor-2026-11-20
# Esperado: HTTP/2 200

# 3. Verificar que la imagen OG se genera
curl -I https://quecomerenloja.com/blog/prueba-ai-redactor-2026-11-20/opengraph-image
# Esperado: HTTP/2 200, content-type: image/png

# 4. Verificar que el sitemap incluye el artículo
curl https://quecomerenloja.com/sitemap.xml | grep "prueba-ai-redactor"
```

---

### 7.5 Prompt completo para el bot/redactor externo (mkt-wa u otro sistema)

Este es el payload mínimo que el bot debe enviar para que un artículo sea **visible inmediatamente** en el sitio:

```json
{
  "titulo": "Título del artículo (mínimo 5 caracteres)",
  "slug": "url-del-articulo-en-minusculas-con-guiones",
  "resumen": "Resumen del artículo de al menos 15 caracteres. Aparece como meta description en Google.",
  "contenido": "## Primer subtítulo\nCuerpo del artículo en Markdown. Mínimo 50 caracteres.",
  "imagen": "https://url-de-imagen-publica.com/foto.jpg",
  "publicado": true
}
```

> **⚠️ Regla de oro:** Si `publicado` es `false` o `0`, el artículo se guarda en la base de datos pero **nunca aparece en `/blog` ni es indexado por Google**. Para publicarlo después, enviar el mismo JSON con `publicado: true` — el sistema hace UPSERT y lo actualiza sin crear duplicado.

**Para publicar directamente (sin pasar por borrador):**
```json
{ "publicado": true }   ← o simplemente omitir el campo (default: true)
```

**Para guardar como borrador para revisión:**
```json
{ "publicado": false }  ← o 0
```

**Para publicar un borrador que ya existe:**
```json
{ "slug": "el-mismo-slug-de-antes", "publicado": true, ...resto del JSON... }
```
El webhook detecta que el slug ya existe → hace UPDATE → artículo visible al instante.
