# Documentación Oficial: Sistema Dinámico de Aliados Gastronómicos

## 1. Resumen Ejecutivo
Se implementó un sistema integral y dinámico para la gestión de aliados (Restaurantes y Cafeterías) en **Qué Comer en Loja**.
El objetivo es permitir que desde el panel administrativo (`/admin`) se puedan dar de alta, editar, georreferenciar, asignar etiquetas de momentos (desayuno, almuerzo, cena) y platos tradicionales a cada aliado, reflejándose automáticamente en:
1. **El directorio general** (`/restaurantes`).
2. **Las páginas por momento** (`/desayunos-en-loja`, `/almuerzos-loja`, `/comida-rapida-loja`).
3. **Las páginas individuales de cada plato tradicional** (`/platos/*` mediante `PlazasDisponiblesPlato`).
4. **El mapa interactivo satelital y de distancias** (`MapaLeafletLoja`).
5. **El Chatbot de IA** (`CHATBOT_DB_URL`).

---

## 2. Base de Datos y Compatibilidad con el Chatbot

### Bases de Datos Involucradas
1. **`GASTRONOMIA_DB_URL`** (`quecomerlojadinamic-313931562a`): Base de datos principal de la plataforma web.
2. **`CHATBOT_DB_URL`** (`botempresas`): Base de datos compartida que consume el bot para recomendar locales y platos.

### Esquema de la Tabla `aliados`
```sql
CREATE TABLE IF NOT EXISTS aliados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'GASTRONOMIA' o 'CAFETERIA'
  imagenUrl VARCHAR(500) NULL,
  servicios TEXT NULL,
  telefono VARCHAR(100) NULL,
  destacado TINYINT(1) DEFAULT 1,
  activo TINYINT(1) DEFAULT 1,
  descripcion TEXT NOT NULL,
  mapaUrl VARCHAR(500) NULL,
  rangoPrecio VARCHAR(100) NULL,
  redesUrl VARCHAR(500) NULL,
  ubicacion VARCHAR(255) NOT NULL,
  websiteUrl VARCHAR(500) NULL,
  ubicacionLat DECIMAL(10, 7) NULL,
  ubicacionLng DECIMAL(10, 7) NULL,
  estrellas INT DEFAULT 5,
  cuartos TEXT NULL, -- Metadata JSON: { "momentos": [...], "platos": [...] }
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ⚠️ Regla de Oro sobre la Base de Datos:
- **No se modificaron ni renombraron columnas existentes**, para **no romper el chatbot** que ya lee de esta misma estructura.
- Para almacenar las etiquetas avanzadas (`momentos` y `platos`) requeridas por el frontend sin crear migraciones destructivas en producción, se utilizó el campo `cuartos` almacenando un JSON estructurado:
  ```json
  {
    "momentos": ["desayuno", "almuerzo"],
    "platos": ["repe-lojano", "tamales-lojanos"]
  }
  ```
- Si `cuartos` está vacío, el sistema cuenta con un **fallback semántico inteligente**: deduce el momento por el `tipo` ('CAFETERIA' -> desayuno, 'GASTRONOMIA' -> almuerzo/cena) y por palabras clave en la descripción.
- Toda operación de alta, actualización o baja en `GASTRONOMIA_DB_URL` se replica automáticamente a `CHATBOT_DB_URL` para mantener ambas bases de datos 100% sincronizadas.

---

## 3. Endpoints de la API

### 3.1. API Pública: `/api/aliados` (Método: `GET`)
Retorna los aliados activos para el consumo de componentes cliente y servidores:
- **`GET /api/aliados`**: Retorna todos los aliados activos ordenados por destacados.
- **`GET /api/aliados?tipo=CAFETERIA`** o `?tipo=GASTRONOMIA`: Filtra por tipo de negocio.
- **`GET /api/aliados?momento=desayuno`** (`almuerzo` | `cena`): Filtra según el momento del día.
- **`GET /api/aliados?plato=tamales-lojanos&platoNombre=Tamales`**: Filtra aliados que preparen ese plato tradicional o tengan coincidencia semántica.

### 3.2. API Administrativa: `/api/admin/aliados` (Requiere Cookie `admin_session_token`)
- **`GET /api/admin/aliados`**: Lista todos los aliados (activos e inactivos).
- **`POST /api/admin/aliados`**: Crea un nuevo aliado tanto en `GASTRONOMIA_DB_URL` como en `CHATBOT_DB_URL`.
- **`PUT /api/admin/aliados`**: Actualiza datos, ubicación GPS, fotos, momentos y platos asociados.
- **`DELETE /api/admin/aliados?id={id}`**: Da de baja el aliado en ambas bases de datos.

---

## 4. Componentes y Páginas Integradas

### 4.1. Panel Administrativo (`/admin`)
- Componente: `AdminAliadosSection.tsx` en `components/admin/AdminAliadosSection.tsx`.
- Permite gestionar toda la ficha del local: nombre, tipo, WhatsApp, foto, selector de coordenadas GPS (con presets de zonas de Loja como Calle Lourdes, San Sebastián, El Valle, etc.), selección de momentos (`desayuno`, `almuerzo`, `cena`) y checkboxes con los platos típicos lojanos.

### 4.2. Directorio General (`/restaurantes`)
- Archivo: `app/restaurantes/page.tsx` y `components/ExplorerPlazas.tsx`.
- Carga SSR en tiempo real los aliados reales activos con filtro de búsqueda por texto, filtro por Restaurante / Cafetería, y tarjetas con botón de WhatsApp directo preconfigurado.

### 4.3. Páginas por Momento del Día
- **Desayunos** (`app/desayunos-en-loja/page.tsx`):
  - Consulta `getAliadosByMomento('desayuno')`.
  - Muestra socios verificados de desayuno/cafetería y slots vacantes de postulación.
- **Almuerzos** (`app/almuerzos-loja/page.tsx`):
  - Consulta `getAliadosByMomento('almuerzo')`.
  - Muestra restaurantes verificados con menú diario y contacto a WhatsApp.
- **Cenas y Noche** (`app/comida-rapida-loja/page.tsx`):
  - Consulta `getAliadosByMomento('cena')`.
  - Muestra locales de alitas, pizzas, hamburguesas y chifas con pedidos directos.

### 4.4. Páginas de Platos Típicos (`/platos/*`)
- Componente: `components/PlatoTemplateSections.tsx` (`PlazasDisponiblesPlato`).
- Consulta `/api/aliados?plato=...` de forma dinámica en cada plato. Si hay locales que preparan ese plato específico (según las etiquetas asignadas en el admin), los posiciona en los primeros puestos. Si no, muestra los aliados destacados con fallback.

### 4.5. Mapa Satelital Interactivo (`MapaLeafletLoja.tsx`)
- Archivo: `components/MapaLeafletLoja.tsx`.
- Lee los aliados que tengan coordenadas registradas (`ubicacionLat`, `ubicacionLng`).
- Muestra marcadores diferenciados:
  - **Marcador Esmeralda con estrella `★`**: Para Socios Gastronómicos Verificados.
  - **Marcador Teal `📍`**: Para Plazas o Sectores Emblemáticos.
- Al hacer clic en un aliado o usar "📍 Usar mi ubicación":
  - Calcula la distancia en metros o kilómetros en tiempo real mediante la fórmula de Haversine.
  - Abre la ficha del socio con su foto, horario, rango de precios y botón directo para **contactar por WhatsApp**.

---

## 5. Ingesta Inteligente de Menú (IA / OCR) y Radar de Oportunidades SEO

### 5.1. El Problema Resuelto
Anteriormente, asociar los platos a un restaurante requería marcar manualmente checkboxes individuales. Con la nueva arquitectura:
1. El usuario puede pegar **cualquier texto desordenado de una carta o menú** (extraído con IA, ChatGPT, Google Lens u OCR de una foto).
2. El motor [`lib/menu-normalizer.ts`](file:///d:/Abel%20paginas/Que%20comer%20en%20Loja/que-comer-en-loja/lib/menu-normalizer.ts) analiza y normaliza el texto:
   - Extrae precios en dólares (`$`).
   - Descarta nombres de negocios y títulos de sección (`RESTAURANTE`, `DESAYUNOS:`, etc.).
   - Utiliza un diccionario de sinónimos lojanos (`repe`, `repe blanco`, `humita`, `tamal de pollo`, `cecina asada`, `arveja con guineo`, `alitas`, `pizza`, `chifa`, etc.).
   - Asocia automáticamente los slugs correspondientes a `form.platos`.
   - Activa los momentos del día pertinentes (`desayuno`, `almuerzo`, `cena`).
   - Sugiere el rango de precios del restaurante en base al mínimo y máximo encontrado en la carta.

### 5.2. Detección de Platos Sin Página Creada (Oportunidades SEO)
El normalizador compara cada plato detectado contra el catálogo de páginas existentes (`PLATOS` en `lib/platos-data.ts`).
- Si el plato **tiene página**: lo vincula directamente (`/platos/[slug]`).
- Si el plato **NO tiene página aún**:
  - Muestra una alerta amarilla: `⚠️ Platos Sin Página en la Web (X Oportunidades SEO)`.
  - Muestra el nombre del plato, precio detectado y genera el slug sugerido (ej: `Chivo al hueco zocorrano` -> `/platos/chivo-al-hueco-zocorrano`).
  - Proporciona un botón para **copiar la URL sugerida** y saber exactamente qué página o artículo crear en la web para captar tráfico orgánico de Google.

### 5.3. Radar Global de Platos Faltantes en el Admin
En la barra superior de `/admin`, se incluyó el botón:
`🎯 Radar SEO: Platos Sin Página`
Abre un centro de control con la lista de especialidades gastronómicas de Loja de alta demanda que aún no cuentan con página dedicada (como *Chivo al Hueco, Trucha Frita, Tigrillo Lojano, Hornado, Caldo de Gallina Criolla*), mostrando su volumen estimado de búsqueda y la zona gastronómica para planificar la creación de nuevas páginas canónicas.
