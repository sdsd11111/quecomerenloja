# 📊 Documentación de Estrategia SEO Hub & Spoke: quecomerenloja.com

> **Fecha:** 2026-10-09  
> **Fuente de datos:** Google Keyword Planner (Periodo Sep 2025 – Ago 2026)  
> **Ubicación de archivos fuente:** `Planificador palabras clave/*.xlsx`

---

## 1. Validación de Fiabilidad de los Datos
- Los 3 reportes exportados provienen del **Planificador de Palabras Clave de Google Ads**.
- Contienen métricas auditadas de volumen mensual promedio (`Avg. monthly searches`), estacionalidad interanual y nivel de competencia.
- Se confirma que las palabras clave locales prioritarias están concentradas en platos emblemáticos y momentos de consumo de alta intención comercial (cenas y fines de semana).

---

## 2. Matriz de Volúmenes Reales y Clasificación

### A. Palabras Clave de Alto Tráfico (≥ 5.000 búsquedas/mes)
| Término | Búsquedas Promedio / Mes | Tendencia Reciente | Rol en la Arquitectura |
| :--- | :---: | :---: | :--- |
| `restaurantes loja` | **5.000** | Estable | Keyword pilar / Home & `/restaurantes` |
| `repe lojano` | **5.000** | Estable | Spoke insignia de Almuerzo |
| `la casa de la humita y el tamal lojano` | **5.000** | Estable | Término comercial con intención de desayuno |

### B. Palabras Clave de Medio Tráfico (500 búsquedas/mes)
| Término | Búsquedas Promedio / Mes | Tendencia Reciente | Rol en la Arquitectura |
| :--- | :---: | :---: | :--- |
| `tamales lojanos` | **500** | Estable | Spoke de Desayuno (`/platos/tamales-lojanos`) |
| `cecina lojana` | **500** | Estable | Spoke de Almuerzo (`/platos/cecina-lojana`) |
| `cafeterias loja` / `cafeterias en loja` | **500** | Estable | Hub temático (`/cafe-de-loja`) |
| `pizzas en loja` / `pizza loja` | **500** | +900% en términos derivados | Spoke de Cena (`/platos/pizza-loja`) |
| `alitas loja` | **500** | Estable | Spoke de Cena (`/platos/alitas-loja`) |
| `hamburguesas loja` | **500** | Estable | Spoke de Cena (`/platos/hamburguesas-loja`) |
| `chifa loja` | **500** | Estable | Spoke de Almuerzo/Cena (`/platos/chifa-loja`) |
| `platos tipicos de loja` | **500** | Estable | Soporte transversal |
| `mejores restaurantes en loja` | **500** | **+900% ⚡** | Landing de intención alta |

### C. Términos Emergentes de Gran Crecimiento (+900% o nuevos)
| Término | Estado / Crecimiento | Oportunidad Identificada |
| :--- | :---: | :--- |
| `desayunos en loja` | **+900%** | Captura directa desde el Hub `/desayunos-en-loja` |
| `pizzeria loja` / `pizza a domicilio loja` | **+900% / Infinito** | Integrado en `/platos/pizza-loja` |
| `marisquerias en loja` | **+900%** | Conectado con `/platos/parihuela-loja` |
| `lugares para comer en loja` | **+900%** | Cubierto en Home y Hubs de momento |

---

## 3. Estado de Ejecución de las Páginas

### Hubs Principales
1. **Desayunos:** [`/desayunos-en-loja`](http://localhost:3001/desayunos-en-loja)  
   - Spokes conectados: `tamales-lojanos`, `humitas-loja`, `/cafe-de-loja`.
2. **Almuerzos:** [`/almuerzos-loja`](http://localhost:3001/almuerzos-loja)  
   - Spokes conectados: `repe-lojano`, `cecina-lojana`, `arveja-con-guineo`, `cuy-asado-loja`, `parihuela-loja`, `chifa-loja`.
3. **Cenas & Comida Nocturna:** [`/comida-rapida-loja`](http://localhost:3001/comida-rapida-loja)  
   - Spokes conectados: `pizza-loja`, `alitas-loja`, `hamburguesas-loja`, `chifa-loja`, `cuy-asado-loja`, `parihuela-loja`.

### Nuevos Spokes Creados con la Plantilla Definitiva:
- ✅ [`/platos/pizza-loja`](http://localhost:3001/platos/pizza-loja)
- ✅ [`/platos/alitas-loja`](http://localhost:3001/platos/alitas-loja)
- ✅ [`/platos/hamburguesas-loja`](http://localhost:3001/platos/hamburguesas-loja)
- ✅ [`/platos/chifa-loja`](http://localhost:3001/platos/chifa-loja)

Todos los nuevos spokes cuentan con:
- Hero optimizado al 70vh sin oscurecimiento invasivo.
- Bloque de **3 Plazas Disponibles B2B** para restaurantes aliados.
- **Mapa interactivo de Loja (Leaflet / OpenStreetMap)** con geolocalización y cálculo de cercanía.
- Acordeón FAQ semántico con marcado JSON-LD `FAQPage`.
- Registro formal en `lib/platos-data.ts` y en `app/sitemap.ts`.
