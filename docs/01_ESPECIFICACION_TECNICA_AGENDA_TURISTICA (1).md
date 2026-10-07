# 01_ESPECIFICACION_TECNICA_AGENDA_TURISTICA.md
**Proyecto:** Agenda Turística Loja (`agendaturisticaloja.com`)
**Estrategia SEO & Posicionamiento:** Marca de Búsqueda "Descubre Loja"
**Estado:** Especificación de Replicación Técnica (Basada en la arquitectura de `agendaculturalloja.com`)

---

## 1. Qué es Agenda Turística Loja

Plataforma web turística provincial Zero-App (`agendaturisticaloja.com`) encargada de digitalizar la oferta de hospedaje, atractivos naturales, patrimonio cultural, rutas intercantonales y logística de auxilio en carretera en los **16 cantones de la Provincia de Loja**.

### Rebranding de Dominio y Estrategia SEO
* **Dominio Oficial Confirmado:** `agendaturisticaloja.com` (adquirido y seleccionado por su simetría con `agendaculturalloja.com`).
* **Estrategia SEO "Descubre Loja":** El término verbal *"Descubre Loja"* no se pierde; se posiciona como el concepto ancla en los títulos SEO, metabuscadores, guías editoriales, rutas turísticas y artículos del blog (`/blog/descubre-loja-...`).

---

## 2. Componentes Específicos del Dominio Turístico

1. **Directorio Turístico Cantonal (16 Cantones):** Hoteles boutique, hostales, haciendas, hosterías, miradores, photo spots y patrimonio.
2. **Módulo de Logística y Emergencia en Ruta:** Talleres mecánicos verificados, grúas/auxilio mecánico, rent a car y estaciones de servicio para resolver imprevistos del viajero en carretera.
3. **Asistente Virtual Turístico con Haversine:** Chatbot conversacional que calcula la proximidad exacta en metros/kilómetros entre la ubicación GPS del turista y los hoteles o atractivos cercanos.
4. **Integración con Convenios Cantonales B2G:** Secciones y guías dedicadas para los GADs Municipales suscritos ($4,900/año o posición de Municipio Fundador para el GAD Loja).

---

## 3. Stack Tecnológico Clorado

| Capa | Tecnología | Notas |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.0 (App Router, Turbopack) | Responsive mobile-first Zero-App |
| **UI** | React 19 + Tailwind CSS 4 | Tarjetas interactivas e e-commerce |
| **ORM & BD** | Prisma 7.9.1 con driver adapter MariaDB | Instancia unificada en `lib/prisma.ts` |
| **Motor IA Chatbot** | DeepSeek V3 (`deepseek-chat`) + Groq fallback | RAG de atractivos, hoteles y servicios en ruta |
| **Geolocalización** | OpenStreetMap Nominatim + Haversine | Reverse geocoding y ordenamiento por distancia |
| **i18n Multilingüe** | 6 idiomas (ES, EN, FR, DE, PT, KO) | Diccionario estático + traducción Groq en `/api/translate` |
| **CDN Multimedia** | Bunny CDN (Pipeline Baninet) | Compresión automática WebP |

---

## 4. Esquema de Base de Datos y Entidades
- `cantones` (`id`, `nombre`, `slug`, `descripcion`, `mapaUrl`)
- `atractivos_cantonales` (`id`, `nombre`, `cantonId`, `categoria`, `descripcion`, `ubicacionLat`, `ubicacionLng`, `distancia`, `ruta`, `imagenUrl`, `mapaUrl`, `activo`)
- `aliados_hospedaje` (`id`, `nombre`, `tipo`, `cantonId`, `descripcion`, `ubicacionLat`, `ubicacionLng`, `servicios`, `cuartos`, `rangoPrecio`, `telefonoWhatsapp`, `websiteUrl`, `imagenUrl`, `destacado`, `activo`)
- `servicios_ruta` (`id`, `nombre`, `tipo` `TALLER` | `GRUA` | `RENT_A_CAR` | `GASOLINERA`, `ubicacionLat`, `ubicacionLng`, `telefono`, `disponible24h`)
- `chat_sessions` / `chat_messages` (Persistencia conversacional CRM con geolocalización)

---

## 5. Rutas de la Aplicación

```
agenda-turistica-loja/
├── app/
│   ├── page.tsx                           # Portada: Buscador cantonal, mapa interactivo, atractivos
│   ├── cantones/[slug]/page.tsx           # Ficha de cantón con patrimonio y hoteles del sector
│   ├── hospedaje/
│   │   ├── page.tsx                       # Catálogo de hoteles y hostales filtrable
│   │   └── [slug]/page.tsx                # Landing de hotel verificado con reserva directa a WhatsApp
│   ├── auxilio-en-ruta/page.tsx           # Directorio de emergencia (grúas, talleres, mecánica)
│   ├── descubre-loja/                     # Hub de artículos y guías SEO "Descubre Loja"
│   └── api/
│       ├── chat/route.ts                  # Motor IA conversacional turístico con Haversine
│       └── geo-decode/route.ts            # Geolocalización Nominatim
```
