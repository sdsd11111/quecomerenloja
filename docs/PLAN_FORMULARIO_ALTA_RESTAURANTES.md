# Plan + estado: Formulario de alta de restaurantes (`quecomerenloja.com/formulario`)

**Proyecto:** Qué Comer en Loja (`quecomerenloja.com`)
**Objetivo comercial:** que el piloto de $10/mes se active rápido. El restaurante llena **un** formulario y sube la foto de su carta; nosotros creamos la ficha, cargamos los platos y publicamos.
**Principio:** cero formularios complejos, cero paneles para el dueño. Todo lo que no sepamos leer de una foto, se lo preguntamos por WhatsApp.

> Este formulario es el disparador del plan piloto descrito en la cotización `COT-2026-001` (Chimichurri Fast Food y los siguientes 39 aliados).

---

## 0. Estado actual: **F0 + F1 + F2 construidos y probados** ✅

| Pieza | Archivo | Estado |
| :--- | :--- | :--- |
| Formulario público (4 pasos) | `app/formulario/page.tsx` + `components/FormularioAlta.tsx` | ✅ probado |
| Endpoint de alta | `app/api/formulario/route.ts` | ✅ probado |
| Lectura de la carta (OCR + IA) | `lib/services/cartaOcr.ts` | ✅ probado (4 platos leídos con precios) |
| Panel de solicitudes | `app/admin/solicitudes/page.tsx` + `app/api/admin/solicitudes/**` | ✅ probado |
| Publicación de la ficha | `lib/publicar-solicitud.ts` | ✅ probado (ficha + platos + menú) |
| Tablas | `solicitudes_alta`, `solicitud_archivos` | ✅ se crean solas al primer envío |
| Enlaces en el sitio | Header (menú lateral) y Footer ("Hazte aliado") | ✅ |
| Datos de prueba | — | ✅ eliminados (BD y Bunny) |

**Prueba de extremo a extremo ejecutada:** envío → folio `ALT-2026-000X` → OCR de la carta → borrador con 4 platos y precios → publicación → el plato aparece en `/api/search/catalog` → limpieza total de los datos de prueba.

---

## 0-B. Plan v2: formulario simple, ubicación exacta y alta automática como aliado

> Pedido: formulario corto, **sin datos reales de ejemplo**, **sin** cuenta bancaria / teléfono
> secundario / correo personal, **ubicación exacta de Google Maps sí o sí**, y que la solicitud
> se convierta sola en un aliado visible en `/admin` que después aparece en el resto de páginas.

### 1. Formulario: qué se quita y qué se queda

| Campo | Decisión | Motivo |
| :--- | :--- | :--- |
| Nombre comercial | **Se queda** (obligatorio) | Identifica al aliado |
| RUC o cédula | **Se queda, pero opcional** | Solo hace falta si luego facturamos; hoy la tabla `aliados` ni siquiera tiene esa columna |
| Teléfono secundario | **Se quita** | El WhatsApp principal basta |
| Correo personal | **Se quita** | El correo del establecimiento basta |
| **Cuenta bancaria** | **Se quita** | No la pide el alta y es dato sensible |
| Dirección + referencias | **Se quedan** | Texto legible para la ficha |
| Horarios | **Se queda** | Alimenta la ficha y el chat |
| Tipo de restaurante, momentos, rango de precio | **Se quedan** | Alimentan el buscador por plato y por momento |
| **Ubicación exacta** | **Se agrega (obligatoria)** | Sin `lat/lng` el aliado no tiene pin en el mapa |
| Carta / fotos | **Se quedan** | Alimentan el menú y el SEO |

Nada de etiquetas "· obligatorio": los campos obligatorios se marcan con un asterisco y se validan
al avanzar de paso.

**Ejemplos 100 % ficticios** (nunca datos de clientes reales):
`Restaurante de Ejemplo` · `0987654321` · `correo@restaurante-ejemplo.com` ·
`Av. Siempre Viva 123 y Calle Ficticia, Loja` · `Lun-Dom 10:00 a 22:00`.

### 2. Ubicación exacta: tres formas de obtenerla

1. **Pegar el enlace de Google Maps** → se extraen las coordenadas con `extractGpsFromGoogleMaps`
   (ya existe en `lib/maps-extractor.ts` y ya lo usa el panel de aliados).
2. **Botón "Usar mi ubicación actual"** → `navigator.geolocation` (el restaurante está en el local).
3. **Clic en el mapa** → mini mapa Leaflet centrado en Loja; el clic deja el pin exacto.

La ubicación es **obligatoria**: sin `lat/lng` no se puede publicar la ficha (quedaría sin pin en
`/restaurantes`, en el mapa y en el chat).

Datos que se guardan: `direccion` (texto), `lat`, `lng`, `mapaUrl` (enlace de Google Maps) y
`referencias`. Con eso el aliado aparece con su pin en el mapa, su ficha y su botón de WhatsApp.

### 3. Flujo: el formulario crea el aliado y el admin lo publica

```
Envío del formulario
   ├─ crea la SOLICITUD (folio ALT-AAAA-####) con carta + OCR en segundo plano
   └─ crea el ALIADO en la tabla `aliados` con activo = 0  ← ya se ve en /admin
                ↓
   /admin (pestaña Aliados): el restaurante aparece, se puede editar ahí mismo
   /admin/solicitudes: revisión de la carta + borrador de platos + "Publicar"
                ↓
   "Publicar ficha" → activa el aliado (activo = 1), publica platos y menú
                ↓
   Aparece solo en /restaurantes, /que-comer-hoy, el mapa, el chat y el buscador por plato
```

El paso de "Publicar" **no crea un aliado nuevo**: actualiza el que ya existe (mismo nombre, misma
ubicación) para no duplicar fichas.

### 4. Tareas del sprint — **✅ implementadas**

| # | Tarea | Archivo | Estado |
| :--- | :--- | :--- | :--- |
| 1 | Limpiar campos y ejemplos ficticios | `components/FormularioAlta.tsx` | ✅ |
| 2 | Nuevo paso de ubicación con Leaflet + GPS + enlace | `components/FormularioAlta.tsx` | ✅ |
| 3 | Validar `lat/lng` y guardar `mapaUrl` | `app/api/formulario/route.ts` | ✅ |
| 4 | Crear el aliado (inactivo) al enviar y vincularlo | `lib/publicar-solicitud.ts` | ✅ |
| 5 | Al publicar: activar el aliado existente en vez de duplicarlo | `lib/publicar-solicitud.ts` | ✅ |
| 6 | Panel: mostrar el aliado vinculado, las coordenadas y el enlace a Maps | `app/admin/solicitudes/page.tsx` | ✅ |

**Comprobado en producción** (2026-11-12): envío → `ALT-2026-0001` → aliado #13 creado **inactivo** con
coordenadas y enlace de Maps → "Publicar" → **el mismo aliado #13 pasa a activo** (sin duplicados) →
4 platos y 4 enlaces en el catálogo → limpieza de los datos de prueba.

**Nota de seguridad:** los scripts de prueba limpian **por id**, nunca por nombre (un borrado por
nombre llegó a tocar dos platos reales del catálogo; se restauraron desde el dump
`/root/migracion_dbs/db_gastronomia.sql` y se verificaron).

---


| Necesidad | Herramienta real | Nota |
| :--- | :--- | :--- |
| Web / API | Next.js 16 (App Router), React 19, TypeScript | `app/formulario`, `app/api/formulario` |
| BD | mysql2 + pool (`GASTRONOMIA_DB_URL`) | Tablas nuevas creadas con `CREATE TABLE IF NOT EXISTS` (sin migración manual) |
| Archivos | BunnyCDN | `altas/{slug}/…`, reutilizando el patrón de `app/api/promos/upload` |
| OCR de la carta | **Tesseract.js (local, en el servidor)** | `tesseract.js` es el único paquete nuevo (~0 USD, se ejecuta en el VPS) |
| Estructurar el texto | Groq (texto) | Modelos accesibles: `qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `openai/gpt-oss-20b` |
| Panel | rutas `/admin/*` y cookie `admin_session_token` | Mismo acceso que el panel existente |

**Sin claves nuevas:** no se requiere OpenAI, Gemini, ni servicio de visión.

---

## 2. Hallazgos importantes (descubiertos al implementar)

1. **La cuenta de Groq del proyecto no tiene modelos de visión.** Solo 11 modelos accesibles y **ninguno** lee imágenes (`llama-4-scout`, `gemma-3`, `qwen2.5-vl` → 404; `llama-3.2-vision` → desactivado). Por eso el OCR es **Tesseract local** y la IA solo estructura el texto.
2. **`llama-3.3-70b-versatile` tampoco está accesible**, pero se usaba en `lib/services/menuParser.ts` (el bot del menú diario por WhatsApp) y en `lib/chat/chatMemory.ts`. Esos dos archivos ya se corrigieron con cadena de modelos accesibles + fallback determinista. **El bot del menú diario estaba working a medias.**
3. **El esquema real no es el de `db/schema.sql`.** En producción existen `aliados`, `platos_catalogo`, `plato_restaurantes`, `promociones_aliados`; **no existen** `aliados_gastronomia`, `menus_dia`, `platos_menu` ni `categorias_gastronomicas` (las usa `lib/repository.ts`, que por eso cae a datos demo). El formulario publica en las tablas que el sitio sí lee.
4. **El servidor de base de datos está sin espacio** (`ER_INNODB_AUTOEXTEND_SIZE_OUT_OF_RANGE` al escribir el índice FULLTEXT de `platos_catalogo.ingredientes_clave`). El código reintenta sin ese campo para no bloquear el alta, pero **hay que liberar espacio en el disco del VPS** (tarea de infraestructura pendiente).

---

## 3. Rutas

| Ruta | Quién | Qué |
| :--- | :--- | :--- |
| `/formulario` | Público | Formulario de alta (4 pasos). `noindex` |
| `POST /api/formulario` | Público | Recibe multipart, guarda, dispara la lectura |
| `/admin/solicitudes` | Admin | Bandeja + revisión del borrador + publicar |
| `PATCH /api/admin/solicitudes/:id` | Admin | `estado` · `borrador` · `publicar` |
| `DELETE /api/admin/solicitudes/:id` | Admin | Descartar una solicitud |

---

## 4. Flujo del formulario (4 pasos, lo que ve el restaurante)

1. **El restaurante** — nombre comercial, RUC/cédula, propietario, WhatsApp, correo, dirección, referencias, horarios, tipo de cocina, momentos y rango de precio.
2. **Contacto y cobro** — teléfono alterno, correo personal, redes, métodos de pago y cuenta bancaria (cifrada).
3. **Tu carta** — foto/PDF de la carta y fotos del local (o el texto de la carta escrito).
4. **Enviar** — resumen, consentimiento y envío.

- Guardado automático en `localStorage`: se puede dejar y continuar después.
- Al enviar: folio (`ALT-2026-0001`), aviso de publicación en 48 h y botón de WhatsApp.
- Límite: 10 archivos por envío, 6 MB por archivo, 10 envíos por hora y por IP.

---

## 5. Lectura de la carta (OCR + IA)

```
foto de la carta → Tesseract.js (spa+eng, local) → texto
                 → Groq (texto, JSON estricto) → borrador de platos
                 → fallback de reglas si la IA no responde
                 → /admin/solicitudes → revisión humana → publicación
```

**Reglas duras**
1. **Nada se publica solo.** El resultado es un *borrador*; siempre pasa por revisión humana (coherente con la condición "todo contenido se aprueba antes de publicarse").
2. **No se inventan precios**: si no se lee, queda `null` y se marca para revisión.
3. Si el OCR no entiende la imagen, el restaurante escribe la carta a mano y se procesa igual.

**Detalle técnico:** `tesseract.js` necesita salir del empaquetado del servidor (`serverExternalPackages: ['tesseract.js']` en `next.config.ts`), porque su worker script usa `__dirname`. El idioma se cachea en el disco (`TESSDATA_CACHE`, por defecto en el tmp del servidor).

---

## 6. Publicación (qué se escribe y dónde)

| Paso | Tabla | Qué guarda |
| :--- | :--- | :--- |
| 1 | `aliados` | La ficha: nombre, descripción, dirección, WhatsApp, rango de precio, mapa, lat/lng, foto, momentos y platos (JSON en `cuartos`) |
| 2 | `platos_catalogo` | Cada plato del menú, con SEO (título, meta, descripción) y palabras clave |
| 3 | `plato_restaurantes` | El vínculo plato ↔ restaurante (es lo que hace que aparezca en "arroz con menstra", "cecina", etc.) |
| 4 | `promociones_aliados` | La carta como menú vigente (mismo flujo que el bot de WhatsApp), con botón de WhatsApp |

Si un paso falla, el resto se hace igual y el panel muestra el aviso (nunca se pierde el alta).

---

## 7. Modelo de datos (creado automáticamente)

```sql
CREATE TABLE IF NOT EXISTS solicitudes_alta (
  id, folio (único), slug, nombre_comercial, ruc, propietario,
  telefono, telefono_alt, email, email_personal, direccion, referencias,
  lat, lng, horarios, categorias, momentos, rango_precio, servicios,
  metodos_pago, redes_url, cuenta_bancaria (cifrada), notas, carta_texto,
  estado (recibido|en_revision|aprobado|publicado|rechazado),
  motivo_rechazo, borrador (JSON con los platos leídos), aliado_id,
  creado_en, actualizado_en
);

CREATE TABLE IF NOT EXISTS solicitud_archivos (
  id, solicitud_id (FK), tipo (carta|foto), nombre, url, mime, tamano, creado_en
);
```

**Privacidad:** la cuenta bancaria se cifra con AES-256-GCM (`lib/cifrado.ts`, clave `FORMULARIO_CLAVE`) y solo se descifra en el panel con sesión de administrador. Nunca se devuelve en endpoints públicos.

---

## 8. Panel de revisión (`/admin/solicitudes`)

- Bandeja con filtros por estado y búsqueda por nombre.
- Detalle con todos los datos + archivos con vista previa.
- **Borrador editable** de los platos (nombre, precio, palabras clave) con "Agregar plato" y "Guardar borrador".
- Acciones: **Publicar ficha**, **Marcar en revisión**, **Pedir por WhatsApp** (con mensaje prearmado) y **Rechazar**.
- Enlace desde el panel principal (`/admin` → pestaña "Solicitudes de alta").

---

## 9. Seguridad

- Sesión obligatoria (cookie `admin_session_token`) en todas las rutas de administración.
- Validación de tipo y tamaño real de archivo; nombre de archivo saneado; límite de archivos y de envíos por IP.
- Datos bancarios cifrados y nunca expuestos públicamente.
- `/formulario` es `noindex` y los datos no se guardan en logs.

---

## 10. Lo que falta (para el siguiente sprint)

1. **Liberar espacio en el disco del VPS de base de datos** (bloquea el índice FULLTEXT de `platos_catalogo`).
2. **Aviso automático por WhatsApp** al restaurante y al admin cuando entra una solicitud (se puede reusar `sendEvolutionWhatsApp` del bot).
3. **Cobro mensual**: alta de la cuenta bancaria y enlace de pago; hoy se cobra a mano.
4. **Menú diario**: conectar el formulario con el flujo de "devolver la pelotita" para que el menú se actualice por WhatsApp con la misma ficha.
5. **Detectar duplicados** por RUC/teléfono antes de crear la ficha.

---

## 11. Métricas

| Indicador | Meta |
| :--- | :--- |
| Tiempo de llenado | < 8 minutos |
| % de formularios completados | > 70% |
| Alta y publicación reales | ≤ 48 horas |
| Platos correctos tras el OCR (revisados) | > 70% |
| Altas por formulario vs. alta manual | 2× en el primer mes |
