# Especificación de Integración: Webhook de Publicación de Blog
**Destino:** `Qué Comer en Loja` (quecomerenloja.com)  
**Endpoint:** `POST https://quecomerenloja.com/api/webhooks/blog` (o `http://localhost:3000/api/webhooks/blog` en desarrollo)

---

## 1. Autenticación y Headers
Toda solicitud debe incluir la clave de autorización configurada:

| Header | Valor | Requerido |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Sí |
| `x-blog-key` | `qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2` | Sí |

*(También se acepta el formato estándar `Authorization: Bearer qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2`).*

---

## 2. Contrato JSON (Payload)

```json
{
  "titulo": "Las 7 mejores huecas para comer Cecina en Loja (Guía 2026)",
  "slug": "mejores-huecas-cecina-loja",
  "resumen": "Descubre dónde comer la auténtica cecina lojana con yuca al vapor, mote y ají de pepa tradicional. Precios, ubicaciones y secretos culinarios.",
  "contenido": "## 1. El Secreto de la Cecina Tradicional\nLa cecina lojana es un corte fino de cerdo marinado con ajo, sal y achiote, asado al carbón...\n\n### Huecas recomendadas\n- **El Fogón Lojano:** Ubicado en la calle Sucre...\n- **Asadero Don Pepe:** Especialidad en carnes...",
  "imagen": "https://quecomerenloja.com/platos/cecina-lojana.webp",
  "imagen_alt": "Plato de cecina lojana tradicional asada a la brasa con mote y ensalada",
  "video_url": "https://www.youtube.com/watch?v=ejemplo",
  "categoria": "Huecas y Tradición",
  "canton_slug": "loja",
  "etiquetas": ["cecina lojana", "donde comer en loja", "platos tipicos de loja", "almuerzos"],
  "autor": "Redacción Qué Comer en Loja",
  "tiempo_lectura": 5,
  "publicado": true
}
```

### Descripción de Campos y Validación Estricta

| Campo | Tipo | Obligatorio | Regla de Validación / SEO |
| :--- | :--- | :--- | :--- |
| `titulo` | String | **Sí** | Mínimo 5 caracteres. Se renderiza como `H1` y Meta Title. |
| `slug` | String | **Sí** | Mínimo 3 caracteres. URL amigable (ej: `guia-repe-lojano`). Se normaliza automáticamente (sin acentos, minúsculas, guiones). |
| `resumen` | String | **Sí** | Mínimo 15 caracteres. Es el extracto del post y la `meta description` para Google. |
| `contenido` | String | **Sí** | Mínimo 50 caracteres. Soporta Markdown estándar (`##`, `###`, listas, negritas) o HTML limpio. |
| `imagen` | String | **Sí** | URL absoluta (`https://...`). Imagen principal del post y `og:image`. |
| `imagen_alt` | String | No | Texto alternativo de la imagen para SEO (si se omite, usa el `titulo`). |
| `video_url` | String | No | URL de YouTube o Vimeo para incrustar reproductor responsive. |
| `categoria` | String | No | Nombre de la categoría (ej: "Tradición", "Cafeterías"). Por defecto: "Gastronomía". |
| `canton_slug`| String | No | Cantón relacionado (ej: `loja`, `vilcabamba`, `catamayo`). Por defecto: `loja`. |
| `etiquetas` | Array o String | No | Palabras clave. Puede ser `["tag1", "tag2"]` o `"tag1, tag2"`. |
| `autor` | String | No | Nombre del autor/redactor. Por defecto: "Equipo Qué Comer en Loja". |
| `tiempo_lectura` | Número | No | Minutos estimados de lectura. Si no se envía, se calcula automáticamente por palabras. |
| `publicado` | Boolean | No | `true` (visible al público) o `false` (borrador). Por defecto: `true`. |

---

## 3. Respuestas HTTP y Códigos de Estado

### ✅ Creación Exitosa (`201 Created`):
```json
{
  "success": true,
  "action": "created",
  "id": 14,
  "slug": "mejores-huecas-cecina-loja",
  "url": "https://quecomerenloja.com/blog/mejores-huecas-cecina-loja",
  "execution_time_ms": 115,
  "seo_preview": {
    "title": "Las 7 mejores huecas para comer Cecina en Loja (Guía 2026) | Blog Qué Comer en Loja",
    "description": "Descubre dónde comer la auténtica cecina lojana...",
    "image": "https://quecomerenloja.com/platos/cecina-lojana.webp",
    "tags": ["cecina lojana", "donde comer en loja"]
  }
}
```

### 🔄 Actualización Idempotente / Upsert (`200 OK`):
Si el artículo ya existe con ese `slug`, se actualiza su contenido, etiquetas y `fecha_modificacion = NOW()` sin duplicar el registro:
```json
{
  "success": true,
  "action": "updated",
  "id": 14,
  "slug": "mejores-huecas-cecina-loja",
  "url": "https://quecomerenloja.com/blog/mejores-huecas-cecina-loja",
  "execution_time_ms": 94
}
```

### ❌ Error de Validación de Contrato (`422 Unprocessable Entity`):
```json
{
  "error": "Error de validación de contrato",
  "detalles": [
    "El campo 'resumen' es obligatorio y debe tener al menos 15 caracteres (meta description SEO).",
    "El campo 'imagen' es obligatorio y debe ser una URL válida (ej: https://... o ruta absoluta)."
  ]
}
```

### ❌ Error de Autenticación (`401 Unauthorized`):
```json
{
  "error": "No autorizado. Header x-blog-key inválido o ausente."
}
```

---

## 4. Ejemplo en cURL para Pruebas

```bash
curl -X POST https://quecomerenloja.com/api/webhooks/blog \
  -H "Content-Type: application/json" \
  -H "x-blog-key: qcel-blog-2026-Hk9LmP4wQz7XvBnRtY2" \
  -d '{
    "titulo": "Ruta del Mejor Café de Altura en Loja",
    "slug": "ruta-mejor-cafe-de-altura-loja",
    "resumen": "Guía completa de las cafeterías de especialidad más premiadas de Loja y Vilcabamba.",
    "contenido": "## Loja, Capital Cafetalera del Ecuador\nEl café de especialidad de Loja cuenta con denominación de origen reconocida a nivel mundial...",
    "imagen": "https://quecomerenloja.com/platos/cafe-loja.webp",
    "categoria": "Cafeterías",
    "etiquetas": ["cafe de loja", "cafeterias", "vilcabamba"],
    "publicado": true
  }'
```
