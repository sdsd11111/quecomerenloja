# 🗺️ MAPA DE ARQUITECTURA SEO Y POSICIONAMIENTO — quecomerenloja.com
## Basado en 89 Palabras Clave Reales de Google Ads (Keyword Planner)

---

## 📊 1. DIAGRAMA GLOBAL DE ARQUITECTURA Y FLUJO DE TRÁFICO

```mermaid
graph TD
    classDef home fill:#8B3A2A,stroke:#5E2419,stroke-width:2px,color:#fff;
    classDef satelite fill:#2D5A27,stroke:#1E3E1A,stroke-width:2px,color:#fff;
    classDef comercial fill:#C97A2B,stroke:#8C5119,stroke-width:2px,color:#fff;
    classDef cluster fill:#2E4057,stroke:#1A2533,stroke-width:2px,color:#fff;

    HOME["🏠 HOME quecomerenloja.com<br/><b>5.000 b/m: restaurantes loja</b><br/><b>500 b/m (+900%): mejores restaurantes en loja</b>"]:::home

    %% Nodos Satélites de Platos
    REPE["🥣 /platos/repe-lojano<br/><b>5.000 b/m: repe lojano</b><br/>(Plato Rey de Loja)"]:::satelite
    CECINA["🥩 /platos/cecina-lojana<br/><b>500 b/m: cecina lojana</b><br/>(Asado tradicional)"]:::satelite
    TAMALES["🌽 /platos/tamales-lojanos<br/><b>500 b/m (+900%): tamales lojanos</b><br/>(Casa de la humita y tamal)"]:::satelite

    %% Nodos de Intención Comercial / Búsquedas de Tipo
    REST["🍽️ /restaurantes<br/><b>Directorio Completo</b><br/>Almuerzos, Alta Cocina, Huecas"]:::comercial
    CAFE["☕ /cafe-de-loja<br/><b>500 b/m: cafeterias loja</b><br/><b>+900%: desayunos en loja</b>"]:::cluster
    RAPIDA["🍕 /comida-rapida-loja<br/><b>+900%: alitas loja</b><br/><b>500 b/m: pizzas & hamburguesas</b>"]:::cluster
    CHIFA["🥢 /chifas<br/><b>500 b/m: chifa loja</b><br/>(CPC más alto: $0.94 USD)"]:::cluster

    %% Enlaces desde la Home
    HOME -->|Card Platos Insignes| REPE
    HOME -->|Card Platos Insignes| CECINA
    HOME -->|Card Platos Insignes| TAMALES
    HOME -->|Explorar Restaurantes| REST
    HOME -->|Categoría Desayunos| CAFE
    HOME -->|Categoría Comida Rápida| RAPIDA
    HOME -->|Búsquedas Populares| CHIFA

    %% Enlazado Cruzado (Interlinking)
    REPE -.->|¿Con qué acompañar?| CECINA
    CECINA -.->|Entrada clásica| REPE
    TAMALES -.->|Maridaje con café| CAFE
    CAFE -.->|Ver tamales típicos| TAMALES
    RAPIDA -.->|Opciones de cena| CHIFA
    CHIFA -.->|Otras opciones nocturnas| RAPIDA

    %% Retorno a la Home y Directorio
    REPE -->|Dónde comer en Loja| REST
    CECINA -->|Dónde comer en Loja| REST
    TAMALES -->|Dónde comer en Loja| REST
```

---

## 📋 2. MATRIZ DE VOLUMEN REAL Y PÁGINAS DESTINO

| Nivel | URL Destino | Keywords Principales | Búsquedas/Mes | Intención de Búsqueda | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Pilar** | `/` (Home) | `restaurantes loja`, `donde comer en loja`, `lugares para comer en loja` | **5.000 / +900%** | General, orientación, descubrimiento | ✅ **Implementado** |
| **Satélite 1** | `/platos/repe-lojano` | `repe lojano`, `repe blanco`, `comida tipica loja` | **5.000** | Transaccional / Informativo (Plato insignia) | ✅ **Implementado** |
| **Satélite 2** | `/platos/cecina-lojana` | `cecina lojana`, `cecina loja`, `cecina con yuca` | **500** | Tradición, asados, dónde comer cecina | ⏳ *En proceso* |
| **Satélite 3** | `/platos/tamales-lojanos` | `tamales lojanos`, `casa de la humita y el tamal lojano`, `humita y tamal` | **500 (+900%)** | Desayunos, tradición, meriendas | ⏳ *En proceso* |
| **Cluster Café**| `/cafe-de-loja` | `cafeterias loja`, `cafeterias en loja`, `desayunos en loja` | **500 (+900%)** | Café de altura, tertulia, desayuno | ⏳ *Por optimizar* |
| **Cluster Noche**| `/comida-rapida-loja` | `alitas loja`, `pizzas en loja`, `hamburguesas loja` | **1.500 (+900%)** | Comida rápida, salidas en grupo, noche | ⏳ *Por crear* |
| **Cluster CPC** | `/chifas` | `chifa loja`, `mejores chifas loja` | **500 ($0.94 CPC)** | Almuerzos abundantes, cena en familia | ⏳ *Por crear* |

---

## 🎯 3. ESTRATEGIA DE ENLAZADO INTERNO (LINK JUICE DISTRIBUTION)

1. **La Home como Distribuidor de Autoridad:**
   - La Home contiene enlaces directos en H2/cards hacia los 3 platos insignia (`repe`, `cecina`, `tamales`) y hacia los 3 clusters de categoría (`cafeterías/desayunos`, `comida rápida`, `chifas`).
2. **Las Páginas Satélites canalizan al Directorio:**
   - Cada página de plato típico incluye un bloque `"Dónde comer este plato hoy"` que filtra y muestra restaurantes con fichas directas, llevando tráfico al negocio local.
3. **Páginas Hermanas Cruzadas:**
   - Enlaces contextuales entre `repe` y `cecina` (el combo clásico lojano).
   - Enlaces contextuales entre `tamales` y `cafeterías`.
