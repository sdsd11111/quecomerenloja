# 01_ESPECIFICACION_TECNICA_QUE_COMER_EN_LOJA.md
**Proyecto:** Qué Comer en Loja / Ruta Gastronómica (`quecomerenloja.com`)
**Estado:** Especificación de Replicación Técnica (Basada en la arquitectura de `agendaculturalloja.com`)

---

## 1. Qué es Qué Comer en Loja

Plataforma web gastronómica Zero-App (`quecomerenloja.com`) dedicada a la promoción interactiva de restaurantes de alta cocina, cafeterías de especialidad (Café de Loja), comida tradicional/huecas, bares, discotecas y vida nocturna de la provincia.

### Marca y Dominio
* **Dominio Oficial Confirmado:** `quecomerenloja.com` (match directo con la intención de búsqueda más alta del turista en Google).
* **Submarca Visual:** *"Ruta Gastronómica"* se mantiene visible en el cabezal y sellos de verificación del portal.

---

## 2. Funcionalidades Específicas de la Plataforma Gastronómica

1. **Búsqueda por Ingredientes & Platillos del Día (Ej: Churrasco, Alverja con Guineo, Repe):**
   - El turista o local puede buscar platillos específicos por su nombre o ingredientes en `quecomerenloja.com` o consultárselo al Asesor IA.
   - El motor busca tanto en la carta fija como en el **Menú del Día** actualizado por los restaurantes.

2. **Publicación del Menú del Día por Audio vía WhatsApp ("Devolver la Pelotita"):**
   - **Cero Fricción para el Dueño:** El propietario o administrador del restaurante simplemente envía un mensaje de audio por WhatsApp describiendo los platos del día (Ej: *"Hoy tenemos churrasco con menestra y alverja con guineo a $3.50"*).
   - **Procesamiento e Interpretación IA:** El bot transcribe el audio, extrae los platillos, precios e ingredientes, genera la publicación preliminar y le **"devuelve la pelotita"** al dueño por WhatsApp con una vista previa: *"Hemos preparado tu menú de hoy, ¿está correcto?"*.
   - **Confirmación en 1 Clic:** El dueño confirma o corrige con un clic, e inmediatamente el menú queda publicado en la web y cargado en el conocimiento del Asesor IA.

3. **Automatización de Datos y Enriquecimiento de Ficha:**
   - Ubicación en mapa, canal de WhatsApp, opciones de delivery y reseñas de Google se automatizan y filtran sin requerir esfuerzo manual del restaurante.
   - Integración opcional con sitio web propio respaldado por la infraestructura hermana ActivaQR (menú móvil interactivo).

4. **Catálogo Gastronómico & Muestra de Platillos (Promoción de Tráfico & Asesor IA):**
   - El portal **NO** es un generador/SaaS de menús QR (función del software hermano **ActivaQR.com**).
   - En `quecomerenloja.com`, el turista consulta la oferta gastronómica del restaurante, visualiza la carta con fotos reales optimizadas a WebP vía Baninet CDN y se canaliza mediante un mensaje preestructurado al WhatsApp del negocio.

5. **Recomendación por Cercanía (Haversine + GPS):**
   - El Asesor IA calcula la distancia exacta en metros a los restaurantes y cafeterías verificados desde la ubicación del cliente.

6. **Sistema de Sugerencias y Reputación Privada:**
   - Reseñas de 1 a 3 estrellas se envían como sugerencia privada al dueño del local para mejorar el servicio.
   - Reseñas de 4 a 5 estrellas se potencian como distintivo público del Sello Verificado GuIAloja.

---

## 3. Stack Tecnológico Clonado

| Capa | Tecnología | Notas |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.0 (App Router, Turbopack) | UI ultra-rápida responsive |
| **UI** | React 19 + Tailwind CSS 4 | Tarjetas interactivas de platillos y menús |
| **ORM & BD** | Prisma 7.9.1 con driver adapter MariaDB | Instancia en `lib/prisma.ts` |
| **Motor IA Chatbot** | DeepSeek V3 (`deepseek-chat`) + Groq fallback | Recomienda platillos y horarios según preferencia |
| **Multimedia** | Bunny CDN (Pipeline Baninet WebP) | Carga instantánea de fotos de menús (1920x1080 -> WebP) |
| **i18n Multilingüe** | 6 idiomas (ES, EN, FR, DE, PT, KO) | Traducción dinámica de menús |

---

## 4. Esquema de Base de Datos y Entidades
- `categorias_gastronomicas` (`id`, `slug`, `nombre` — Ej: Restaurantes, Cafés, Bares, Huecas)
- `aliados_gastronomia` (`id`, `nombre`, `slug`, `tipo`, `descripcion`, `ubicacionLat`, `ubicacionLng`, `direccion`, `horarios`, `rangoPrecio`, `telefonoWhatsapp`, `menuDigitalJson`, `imagenUrl`, `destacado`, `activo`)
- `platos_menu` (`id`, `aliadoId`, `nombre`, `descripcion`, `precio`, `categoriaPlato`, `imagenWebpUrl`, `disponible`)
- `chat_sessions` / `chat_messages` (Persistencia conversacional CRM con geolocalización)

---

## 5. Rutas de la Aplicación

```
que-comer-en-loja/
├── app/
│   ├── page.tsx                           # Portada: Categorías (Café, Alta Cocina, Bares, Huecas)
│   ├── restaurantes/
│   │   ├── page.tsx                       # Catálogo general con filtro por parroquia y precio
│   │   └── [slug]/page.tsx                # Landing con Menú Digital Interactivo y WhatsApp
│   ├── cafe-de-loja/page.tsx              # Ruta especial de cafeterías de especialidad
│   └── api/
│       ├── chat/route.ts                  # Motor IA conversacional gastronómico con Haversine
│       └── upload/route.ts                # Carga de fotos de menú a Bunny CDN
```
