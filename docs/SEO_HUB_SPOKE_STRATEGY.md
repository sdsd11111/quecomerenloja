# 📊 Estrategia SEO Hub & Spoke — quecomerenloja.com
## Documentación de Investigación y Plan de Implementación

> Última actualización: 2026-10-10 | Fuente: Google Keyword Planner (Sep 2025 – Ago 2026)

---

## 1. Data Real de Búsqueda (Google Keyword Planner)

### 🔴 Volumen ALTO (5.000/mes)
| Keyword | Vol/mes | Estado |
|---|---|---|
| `restaurantes loja` | 5.000 | Hub `/restaurantes` ✅ |
| `repe lojano` | 5.000 | Spoke `/platos/repe-lojano` ✅ |
| `la casa de la humita y el tamal lojano` | 5.000 | Spoke `/platos/tamales-lojanos` ✅ |

### 🟠 Volumen MEDIO (500–1.000/mes)
| Keyword | Vol/mes | Estado |
|---|---|---|
| `cecina lojana` | 500 | Spoke `/platos/cecina-lojana` ✅ |
| `desayunos en loja` | 500 | Hub `/desayunos-en-loja` ✅ |
| `pizza loja` | 500 | Spoke `/platos/pizza-loja` ✅ |
| `alitas loja` | 500 | Spoke `/platos/alitas-loja` ✅ |
| `hamburguesas loja` | 500 | Spoke `/platos/hamburguesas-loja` ✅ |
| `chifa loja` | 500 | Spoke `/platos/chifa-loja` ✅ |
| `cuy asado loja` | 800 | Spoke `/platos/cuy-asado-loja` ✅ |
| `cafe de loja` | 1.000 | Hub `/cafe-de-loja` ✅ |

### 🟡 Volumen BAJO-MEDIO (100–400/mes)
| Keyword | Vol/mes | Estado |
|---|---|---|
| `arveja con guineo` | 300 | Spoke `/platos/arveja-con-guineo` ✅ |
| `humitas loja` | 200 | Spoke `/platos/humitas-loja` ✅ |
| `quimbolitos loja` | 200 | Spoke `/platos/quimbolitos-loja` ✅ |
| `bolones en loja` | 300 | Spoke `/platos/bolones-en-loja` ✅ |
| `parihuela loja` | 400 | Spoke `/platos/parihuela-loja` ✅ |
| `seco de pollo loja` | 300 | Spoke `/platos/seco-de-pollo-loja` ✅ |
| `bares en loja` | 300 | Hub `/bares-y-noche` ✅ |

---

## 2. Arquitectura Hub & Spoke Implementada

```
quecomerenloja.com (HOME)
├── /desayunos-en-loja [HUB - desayuno]
│   ├── /platos/tamales-lojanos ✅ (nueva plantilla)
│   ├── /platos/humitas-loja ✅ (nueva plantilla)
│   ├── /platos/bolones-en-loja ✅ (nueva plantilla)
│   └── /platos/quimbolitos-loja ✅ (nueva plantilla)
│
├── /almuerzos-loja [HUB - almuerzo]
│   ├── /platos/repe-lojano ✅ (nueva plantilla)
│   ├── /platos/cecina-lojana ✅ (nueva plantilla)
│   ├── /platos/arveja-con-guineo ✅ (nueva plantilla)
│   ├── /platos/cuy-asado-loja ✅ (nueva plantilla)
│   ├── /platos/parihuela-loja ✅ (nueva plantilla)
│   └── /platos/seco-de-pollo-loja ✅ (nueva plantilla)
│
├── /comida-rapida-loja [HUB - cena]
│   ├── /platos/pizza-loja ✅ (nueva plantilla)
│   ├── /platos/alitas-loja ✅ (nueva plantilla)
│   ├── /platos/hamburguesas-loja ✅ (nueva plantilla)
│   └── /platos/chifa-loja ✅ (nueva plantilla)
│
├── /cafe-de-loja [HUB transversal]
├── /bares-y-noche [HUB nocturno] ✅ (reescrito completo)
└── /restaurantes [Hub comercial - plazas libres]
```

---

## 3. Plantilla Estándar de Platos (nueva plantilla v2)

Todos los `/platos/` deben usar esta estructura:
1. **Hero 70vh** con imagen de fondo y tarjeta blanca flotante
2. **Breadcrumb SEO** con enlace al hub correcto  
3. **Sección de descripción** + ficha gastronómica (grid 2 columnas)
4. **`PlazasDisponiblesPlato`** — 3 plazas libres para aliados
5. **`MapaLeafletLoja`** — mapa interactivo de Loja
6. **FAQ acordeón** con schema `FAQPage`
7. **CTA transversal** enlazando al hub o plato relacionado

### ✅ Estado de implementación (todos migrados):
| Página | Plantilla v2 |
|---|---|
| `/platos/tamales-lojanos` | ✅ |
| `/platos/humitas-loja` | ✅ |
| `/platos/bolones-en-loja` | ✅ |
| `/platos/quimbolitos-loja` | ✅ |
| `/platos/repe-lojano` | ✅ |
| `/platos/cecina-lojana` | ✅ |
| `/platos/arveja-con-guineo` | ✅ |
| `/platos/cuy-asado-loja` | ✅ |
| `/platos/parihuela-loja` | ✅ |
| `/platos/seco-de-pollo-loja` | ✅ |
| `/platos/pizza-loja` | ✅ |
| `/platos/alitas-loja` | ✅ |
| `/platos/hamburguesas-loja` | ✅ |
| `/platos/chifa-loja` | ✅ |

---

## 4. Páginas Eliminadas o Redirigidas
- `/menu-del-dia` — **Eliminada** (borrada por decisión del cliente)
- `/contacto` — **Eliminada** (borrada por decisión del cliente)

---

## 5. Componentes SEO Clave
- **`PlazasDisponiblesPlato`**: 3 plazas libres para aliados comerciales por plato
- **`MapaLeafletLoja`**: Mapa interactivo centrado en Loja con markers reales
- **Schema markup**: `Recipe`, `FAQPage`, `BreadcrumbList` en todas las páginas de platos

---

## 6. Próximos pasos recomendados
- [ ] Crear imágenes reales para platos que aún usan `/hero-loja.jpg`
- [ ] Publicar en dominio `quecomerenloja.com` y enviar sitemap a Google Search Console
- [ ] Monitorear rankings en 30/60/90 días para los keywords objetivo
- [ ] Conseguir primeros aliados comerciales para las plazas disponibles
