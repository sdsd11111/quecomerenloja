# PLAN DE IMPLEMENTACIÓN — QUECOMERENLOJA.COM
**Objetivo:** Dominar búsquedas de comida en Loja y monetizar con membresías B2B de restaurantes.

---

## DATOS REALES DE GOOGLE TRENDS (Ecuador, Oct 2026)

### Ranking de búsquedas por volumen relativo:

**Grupo 1 — Intención general:**
| Keyword | Índice Relativo | Señal |
|---|---|---|
| `que comer en loja` | **100** (pico histórico) | → HOME |
| `desayunos loja` | **85** (pico reciente) | → Página de desayunos |
| `repe lojano` | **20** (constante) | → Desde Guayas + Pichincha = turistas |
| `restaurantes loja` | **12-15** (constante local) | → Directorio socios |
| `donde comer en loja` | **bajo** (canibalizado por "qué comer") | → HOME también |

**Grupo 2 — Platos típicos:**
| Keyword | Índice Relativo | Señal |
|---|---|---|
| `cafe de loja` | **100** (el más buscado de platos) | → Página propia obligatoria |
| `tamales lojanos` | **35** | → Buscado desde Quito (turistas) |
| `cecina lojana` | **moderado** | → Loja + Pichincha |
| `cuy asado loja` | **localizado** | → Pastaza + local |
| `horchata lojana` | **bajo exacto** | → Parte de café/horchata |

---

## JERARQUÍA DE PÁGINAS (ordenadas por demanda real)

```
PRIORIDAD 1 — HOME (captura "qué comer" + "donde comer" + "comida loja")
PRIORIDAD 2 — /cafe-de-loja/ (mayor volumen en platos, búsqueda nacional)
PRIORIDAD 3 — /donde-comer/desayunos-en-loja (índice 85, alta conversión)
PRIORIDAD 4 — /platos-tipicos/repe-lojano (turistas Guayas+Pichincha)
PRIORIDAD 5 — /platos-tipicos/tamales-lojanos (turistas Quito)
PRIORIDAD 6 — /platos-tipicos/cecina-lojana (Loja + viajeros)
PRIORIDAD 7 — /platos-tipicos/cuy-asado-loja (premium turístico)
PRIORIDAD 8 — /donde-comer/almuerzos-menu-del-dia (local diario)
PRIORIDAD 9 — /bares-y-noche/ (expansión)
PRIORIDAD 10 — /restaurantes/[slug] (solo socios pagos)
PRIORIDAD 11 — /para-negocios/ (conversión B2B)
```

---

## PLAN DE IMPLEMENTACIÓN — 4 FASES

---

### FASE 1: FUNDACIÓN SEO (Semana 1-2)
**Meta:** Que Google empiece a rastrear el sitio con estructura correcta.

#### 1.1 Arreglar/mejorar lo que ya existe
- [ ] `app/page.tsx` → HOME con H1: "¿Qué comer en Loja?" + contenido real
- [ ] `app/layout.tsx` → Meta title/description correctos por página
- [ ] `app/sitemap.ts` → Agregar TODAS las URLs nuevas
- [ ] `app/robots.ts` → Verificar que permite indexación
- [ ] Verificar que Google Search Console tiene el sitemap enviado

#### 1.2 Estructura de datos (JSON-LD Schema)
- `Restaurant` schema para cada restaurante socio
- `FAQPage` schema en cada página de plato
- `BreadcrumbList` en todas las páginas internas
- `LocalBusiness` schema en HOME

---

### FASE 2: PÁGINAS PILARES DE PLATOS (Semana 2-3)
**Meta:** Rankear los keywords de comida típica que buscan desde todo Ecuador.

Cada página sigue esta estructura obligatoria (para ganarle a Wikipedia y blogs):

```
H1: "¿Dónde comer [PLATO] en Loja? — Guía Definitiva 2026"
│
├── RESPUESTA RÁPIDA (Featured Snippet):
│   Qué es, ingredientes, precio promedio ($X-$Y), horario
│
├── ESPACIO COMERCIAL (componente <SocioVerificado />):
│   - Si hay socio: Foto HD + Badge + WhatsApp directo
│   - Si no hay socio: CTA "¿Preparas el mejor [PLATO]? Destaca aquí"
│
├── ZONAS Y LUGARES TRADICIONALES:
│   Texto editorial sin dar SEO gratis a nadie específico
│
├── FAQ CON SCHEMA (3-5 preguntas):
│   - ¿Cuánto cuesta? ¿Dónde se consigue? ¿A qué hora?
│
└── CTA AL ASESOR IA:
    "Pregúntale a nuestro Asesor qué [PLATO] está disponible hoy"
```

**Páginas a crear:**
- [ ] `app/platos-tipicos/repe-lojano/page.tsx`
- [ ] `app/platos-tipicos/cecina-lojana/page.tsx`
- [ ] `app/platos-tipicos/cuy-asado-loja/page.tsx`
- [ ] `app/platos-tipicos/tamales-lojanos/page.tsx`
- [ ] `app/platos-tipicos/arveja-con-guineo/page.tsx`
- [ ] `app/platos-tipicos/page.tsx` (HUB madre)

---

### FASE 3: PÁGINAS DE MOMENTO DEL DÍA (Semana 3-4)
**Meta:** Capturar búsquedas de urgencia "tengo hambre ahora".

- [ ] `app/donde-comer/desayunos-en-loja/page.tsx`
  - H1: "Desayunos en Loja: Los Mejores Lugares para Empezar el Día"
  - Keywords: "desayunos loja", "donde desayunar en loja", "tamales lojanos"
  
- [ ] `app/donde-comer/almuerzos-menu-del-dia/page.tsx`
  - H1: "Almuerzos en Loja: Menú del Día desde $2.50"
  - Keywords: "almuerzos loja", "menu del dia loja", "almuerzo económico"
  
- [ ] `app/cafe-de-loja/page.tsx` ← YA EXISTE, mejorar contenido
  - H1: "Café de Loja: La Capital Cafetalera del Ecuador"
  - Keywords: "cafe de loja", "cafeterias loja", "ruta del cafe loja"

- [ ] `app/bares-y-noche/page.tsx` ← YA EXISTE, mejorar contenido

---

### FASE 4: CONVERSIÓN B2B (Semana 4+)
**Meta:** Empezar a vender membresías.

- [ ] `app/para-negocios/page.tsx` ← YA EXISTE, rediseñar con datos reales
- [ ] Componente `<SocioVerificadoBanner />` — modular, aparece en TODAS las páginas de plato
- [ ] Sistema de `restaurantes/[slug]` — fichas individuales SOLO para socios pagos
- [ ] Configurar Asesor IA para recomendar socios prioritariamente

---

## ARQUITECTURA DE COMPONENTES A CONSTRUIR

```typescript
// Componentes nuevos necesarios:

<SocioVerificadoBanner restauranteId={string | null} plato={string} />
// Muestra ficha de socio O CTA de venta si no hay socio

<PlatoCard { plato, descripcion, precio, imagen, href } />
// Tarjeta de plato típico para la HOME y HUBs

<MomentDelDia />
// Sección "¿Qué buscas?" con 4 botones: Desayuno/Almuerzo/Café/Noche

<ZonasGastronomicas />
// Mapa visual: Centro | El Valle | Catamayo | Vilcabamba

<FAQSchema { preguntas } />
// FAQs con JSON-LD automático

<MenuDelDiaFeed />
// Feed dinámico de menús del día (cuando haya socios)
```

---

## ESTRUCTURA DEL CONTENIDO DE LA HOME

```
┌─────────────────────────────────────────────────────┐
│ HERO                                                 │
│ H1: "¿Qué comer en Loja?"                           │
│ Sub: Platos típicos, restaurantes y cafeterías       │
│ [Explorar Platos] [Desayunos de hoy]                 │
├─────────────────────────────────────────────────────┤
│ ¿QUÉ ESTÁS BUSCANDO? (4 cards)                      │
│ 🌅 Desayunos | 🍽️ Almuerzos | ☕ Café | 🍹 Noche   │
├─────────────────────────────────────────────────────┤
│ PLATOS TÍPICOS DE LOJA (6 cards en grid)            │
│ Repe | Cecina | Cuy | Tamales | Café | Fritada       │
├─────────────────────────────────────────────────────┤
│ MENÚ DEL DÍA (dinámico — socios activos)            │
│ "¿Qué hay de almuerzo hoy?"                         │
├─────────────────────────────────────────────────────┤
│ ZONAS GASTRONÓMICAS                                  │
│ Centro | El Valle | Catamayo | Vilcabamba            │
├─────────────────────────────────────────────────────┤
│ CAFÉ DE LOJA (destaque especial — mayor búsqueda)   │
│ Ruta del café + Horchata                             │
├─────────────────────────────────────────────────────┤
│ PARA NEGOCIOS (B2B discreto)                        │
│ "¿Tienes un restaurante? Llega a miles de turistas"  │
└─────────────────────────────────────────────────────┘
```

---

## MÉTRICAS DE ÉXITO (KPIs a medir en GSC)

| Métrica | Meta Mes 1 | Meta Mes 3 | Meta Mes 6 |
|---|---|---|---|
| Páginas indexadas | 5+ | 15+ | 25+ |
| Impresiones totales | 50+ | 500+ | 2,000+ |
| Keywords en top 10 | 0 | 3+ | 10+ |
| Socios B2B afiliados | 0 | 2-3 | 8-10 |
| Ingresos mensuales | $0 | $120-$180 | $480-$600 |

---

## SIGUIENTE ACCIÓN INMEDIATA

**Arrancar por la HOME.** Es la página de mayor impacto y la que establece la autoridad del sitio. Una vez bien hecha, todas las demás páginas heredan su fuerza SEO.
