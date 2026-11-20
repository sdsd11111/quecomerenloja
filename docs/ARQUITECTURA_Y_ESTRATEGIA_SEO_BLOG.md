# Arquitectura, Posicionamiento SEO y Estrategia de Enlazado (Blog Silo)
**Proyecto:** Qué Comer en Loja (`quecomerenloja.com`)  
**Ecosistema:** Plataforma gastronómica de alta conversión + SEO Local + Bridge WhatsApp.

---

## 1. Mapa de Rutas y Páginas del Proyecto

El sitio está estructurado en torno a **3 intenciones de búsqueda principales**:
1. **Intención Transaccional Inmediata:** ¿Qué comer hoy? Promociones del día y cartas directas.
2. **Intención Local por Nicho/Momento:** Desayunos, almuerzos, comida rápida, cafés, bares/noche.
3. **Intención Específica por Plato:** Búsqueda exacta del plato tradicional o popular lojano.

```
quecomerenloja.com/
│
├── /                              # HOME: Buscador omnicanal, Promos activas, Aliados destacados, Acceso rápido
├── /que-comer-hoy                 # HUB: Decisor dinámico según la hora del día y antojo
├── /buscar                        # MOTOR: Búsqueda dinámica con filtros facetados por plato, categoría y zona
├── /restaurantes                  # DIRECTORIO: Índice general de restaurantes y aliados
│   └── /restaurantes/[slug]       # FICHA ALIADO: Menú, WhatsApp directo, horarios, ubicación, fotos
├── /promos                        # ARCHIVO: Catálogo de promociones vigentes
│   └── /promos/[slug]             # LANDING PROMO: Menú del día / Promo individual con OpenGraph dinámico para WhatsApp
│
├── CATEGORÍAS POR MOMENTO (Landing Pages SEO Transaccionales):
│   ├── /desayunos-en-loja         # "Dónde desayunar en Loja", bolones, café, tamales, quimbolitos
│   ├── /almuerzos-loja            # "Menú del día Loja", almuerzos ejecutivos, huecas de almuerzo
│   ├── /cafe-de-loja              # "Cafeterías en Loja", café de altura, Vilcabamba, Chaguarpamba
│   ├── /comida-rapida-loja        # "Hamburguesas, pizzas, alitas en Loja a domicilio"
│   ├── /bares-y-noche             # "Bares en Loja", cocteles, picaditas nocturnas, vida bohemia
│   ├── /eventos-gastronomicos     # Festivales gastronómicos, FIAVL, ferias culinarias
│   └── /cenas-navidenas-loja      # Específica de temporada: Cenas navideñas, pavos, perniles y banquetes
│
├── CATÁLOGO DE PLATOS (/platos) — ARQUITECTURA HÍBRIDA (DINÁMICA + ISR):
│   ├── /platos                    # Directorio general con buscador y filtros por sección
│   │
│   ├── ⚡ PÁGINAS ESTÁTICAS HEREDADAS / DEDICADAS (Primeras 14 implementadas):
│   │   ├── /platos/repe-lojano           # Repe tradicional
│   │   ├── /platos/cecina-lojana         # Cecina tradicional a la brasa
│   │   ├── /platos/arveja-con-guineo     # Tradición lojana
│   │   ├── /platos/tamales-lojanos       # Tamal lojano con café
│   │   ├── /platos/humitas-loja          # Humitas de choclo tierno
│   │   ├── /platos/quimbolitos-loja      # Quimbolitos al vapor
│   │   ├── /platos/cuy-asado-loja        # Cuy asado tradicional
│   │   ├── /platos/bolones-en-loja       # Bolón de verde (queso, chicharrón, mixto)
│   │   ├── /platos/seco-de-pollo-loja    # Seco de pollo tradicional
│   │   ├── /platos/parihuela-loja        # Marisquerías y mariscos en Loja
│   │   ├── /platos/chifa-loja            # Chifas y comida oriental
│   │   ├── /platos/pizza-loja            # Pizzerías artesanales a la leña
│   │   ├── /platos/hamburguesas-loja     # Hamburguesas artesanales
│   │   └── /platos/alitas-loja           # Alitas BBQ y picantes
│   │
│   └── 🚀 RUTA DINÁMICA DE BASE DE DATOS (/platos/[slug]):
│       └── Maneja el catálogo COMPLETO de los 62 platos estructurados y 1,768 opciones reales de cartas:
│           • Secciones: Tradicional Lojana (12), Desayunos (5), Mariscos (11), Carnes y Asados (7), 
│             Secos y Caldos (9), Comida Rápida (9), Saludable/Bebidas/Fusión (9).
│           • Lee de MySQL (`platos_catalogo` + `plato_restaurantes`).
│           • Genera metadata, Schema Recipe, FAQPage dinámico y tabla de precios/restaurantes reales observados en Loja.
│
├── CONVERSIÓN Y COMERCIAL:
│   ├── /formulario                # Registro de nuevos restaurantes / alta de aliados
│   ├── /publicar-promo            # Interfaz para que restaurantes suban su menú del día
│   ├── /cotizaciones/[codigo]     # Generador de cotizaciones para aliados (versión web + PDF imprimible)
│   │
├── BLOG & CONTENIDO (/blog):
│   ├── /blog                      # Archivo de artículos y guías gastronómicas
│   └── /blog/[slug]               # Lectura de artículo con schema Article y CTA transaccional
│
└── SISTEMA & APIs (/api):
    ├── /api/promos/upload         # Subida a CDN Bunny de fotos de platos (6MB máx)
    ├── /api/bridge/publicar-prueba# Endpoint webhook consumido por el bot de WhatsApp para publicar platos
    ├── /api/bridge/cotizacion     # Generador de cotizaciones por API
    └── /api/chat                  # Asistente virtual gastronómico
```

---

## 2. Palabras Clave y Posicionamiento SEO

El sitio ataca 3 tipos de keywords en Google:

### A. Keywords de Intención Comercial / Transaccional Inmediata
* `donde comer en loja`
* `que comer en loja`
* `mejores restaurantes en loja`
* `almuerzos en loja hoy`
* `menu del dia loja`
* `comida a domicilio loja`
* `cenas navideñas en loja`

### B. Keywords por Momento y Categoría
* `desayunos en loja` / `donde desayunar en loja`
* `cafeterias en loja` / `mejor cafe de loja`
* `bares en loja` / `donde salir de noche en loja`
* `hamburguesas en loja` / `pizzas en loja a domicilio`

### C. Keywords de Platos Típicos (Búsqueda de Descubrimiento y Turistas)
* `donde comer repe lojano` / `mejor repe en loja`
* `cecina lojana donde comer` / `cecina en loja recomendada`
* `tamales lojanos autenticos` / `humitas en loja`
* `cuy asado loja restaurantes`

---

## 3. Secciones y Componentes Clave en Cada Página

| Tipo de Página | Secciones Principales | Objetivo de Conversión |
|---|---|---|
| **Home (`/`)** | Hero con selector interactivo ("¿Qué te provoca?"), Ticker de Promos vigentes, Categorías rápidas, Grid de Aliados con badge de verificación, Reseñas, Footer con links a platos. | Retener al usuario y llevarlo a WhatsApp o a una promo en menos de 2 clics. |
| **Categorías (`/almuerzos-loja`, etc.)** | H1 SEO optimizado, Grid de restaurantes que ofrecen ese servicio, botón directo a WhatsApp con mensaje pre-rellenado, FAQs con datos estructurados (Schema.org). | Posicionar en los primeros 3 lugares de Google para la búsqueda de la categoría. |
| **Página de Plato (`/platos/[slug]`)** | Carga dinámica desde MySQL (`platos_catalogo` + `plato_restaurantes`). Renderiza: foto hero CDN, historia y cultura, ingredientes clave, precios observados en Loja ($), listado de restaurantes reales con direcciones y precios de carta, FAQs de Google (FAQPage Schema), y botón de reserva/pedido. | Resolver la duda del usuario ("dónde comer X plato en Loja") y dirigirlo al restaurante aliado o a WhatsApp. |
| **Página de Promo (`/promos/[slug]`)** | Foto real del plato, badge de restaurante verificado, precio de oferta, vigencia del día (`Válido: DD de Mes`), botón grande de WhatsApp verde (`💬 Contactar a WhatsApp`), Schema `Offer`. | Convertir el link compartido en WhatsApp o Facebook directamente en un pedido. |
| **Artículo de Blog (`/blog/[slug]`)** | Encabezado editorial, tiempo de lectura, cuerpo con H2/H3 enriquecidos, tarjeta de producto/aliado incrustada, enlace contextual hacia `/platos/...` o `/restaurantes/...`. | Atraer tráfico orgánico informativo y derivarlo a páginas transaccionales. |

---

## 4. Estrategia de Silo: Cómo Vincular el Blog para Posicionar y Dar Soluciones

El blog **no debe ser solo informativo**; su función es actuar como la puerta de entrada de tráfico orgánico amplio para canalizarlo hacia **soluciones reales (restaurantes y platos que se pueden pedir ya)**.

### Estructura de Enlazado Interno (Hub & Spoke / Silo Gastronómico):

```
                       [ B L O G ]
               (Artículo Educativo / Guía)
            "Ruta del Repe Lojano: Las 5 Huecas
                 Imprescindibles de la Ciudad"
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[ PÁGINA DE PLATO ]                   [ FICHA DEL RESTAURANTE ]
  /platos/repe-lojano                  /restaurantes/mama-rebeca
(Explica el plato, receta              (Menú completo, fotos,
 y lista todos los lugares)            ubicación exacta, botón WhatsApp)
       │                                       │
       └───────────────────┬───────────────────┘
                           ▼
                 [ PROMO / PEDIDO HOY ]
          /promos/repe-con-aguacate-almuerzo
               (Conversión transaccional:
               "Pide tu menú del día por WhatsApp")
```

### Reglas para redactar y vincular artículos del Blog:

1. **El Gancho Solución (Call To Action Contextual):**
   * En cada mención de un plato en el texto, colocar un enlace interno exacto:
     - *"...si buscas probar el auténtico [repe lojano](/platos/repe-lojano) con quesillo fresco..."*
     - *"...acompañado de una tradicional [cecina lojana](/platos/cecina-lojana) recién asada..."*
2. **Cajas de Recomendación Directa dentro del artículo:**
   * A mitad y final del artículo, incluir una caja destacada (Widget de Aliado):
     > 💡 **¿Dónde probarlo hoy mismo?**  
     > Encuentra los almuerzos y preparaciones recomendadas de hoy en [Menús del Día en Loja](/almuerzos-loja) o haz tu pedido directo al restaurante aliado.
3. **Cluster Temático por Silo:**
   * **Silo Desayunos/Café:**
     - *Artículo:* "Guía definitiva del café lojano y sus acompañantes tradicionales".
     - *Links salientes:* `/cafe-de-loja`, `/desayunos-en-loja`, `/platos/tamales-lojanos`, `/platos/humitas-loja`.
   * **Silo Tradición Lojana:**
     - *Artículo:* "Historia y secretos de la cecina lojana: de la leña al plato".
     - *Links salientes:* `/platos/cecina-lojana`, `/restaurantes`, `/que-comer-hoy`.
   * **Silo Temporada (Navidad / Fin de Año):**
     - *Artículo:* "Opciones de banquetes y cenas navideñas en Loja para empresas y familias".
     - *Links salientes:* `/cenas-navidenas-loja`.
4. **Beneficio SEO:**
   * Transfiere autoridad temática (*Topic Authority*) hacia las landings principales (`/`, `/almuerzos-loja`, `/platos/...`).
   * Google entiende que el portal cubre la gastronomía de Loja tanto en profundidad enciclopédica (Blog) como en disponibilidad transaccional en tiempo real (Promos y Aliados).
