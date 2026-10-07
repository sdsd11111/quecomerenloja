# Qué Comer en Loja — Estrategia, mapa de sitio y branding

## 1. Posicionamiento

**Promesa:** La ruta gastronómica verificada de Loja: qué hay hoy en cada mesa, y contacto directo con el restaurante. Sin apps, sin comisiones.

**Qué es:** portal de descubrimiento, recomendación y tráfico gastronómico (marca de GuIAloja).
**Qué NO es:** plataforma de delivery ni generador de menús QR (eso es ActivaQR).

**Diferenciadores (en orden de peso):**
1. Menú del día real, actualizado por audio de WhatsApp ("devolver la pelotita").
2. Búsqueda por plato o ingrediente (repe, cecina, alverja con guineo).
3. Asesor IA con recomendación por cercanía (Haversine).
4. Sello Verificado GuIAloja con fecha de verificación visible.
5. Café de Loja como ruta temática propia.

**Públicos:** turista (busca "qué comer en Loja"), lojano (busca "dónde almorzar hoy"), dueño de negocio (B2B: $40/$60 mensual, Top 5 IA $4.500/5 años).

**Tono:** ecuatoriano, cálido y claro. "De una", "cerquita", "qué rico"; "bacán" solo ocasionalmente.

## 2. Mapa de páginas (multipágina)

| Ruta | Propósito |
|---|---|
| `/` | Portada: buscador, categorías, menús de hoy, asesor, CTA negocios |
| `/restaurantes` | Catálogo con filtros (categoría, momento, cerca de mí) |
| `/restaurantes/[slug]` | Ficha: menú del día, platos, WhatsApp, mensaje preestructurado |
| `/menu-del-dia` | Todos los menús de hoy con frescura verificada |
| `/buscar` | Búsqueda por plato o ingrediente (`?q=repe`) |
| `/cafe-de-loja` | Ruta temática de cafeterías de especialidad |
| `/bares-y-noche` | Bares y vida nocturna |
| `/para-negocios` | Sello Verificado, planes, cómo funciona el audio |
| `/blog` y `/blog/[slug]` | Guías SEO (ver abajo) |
| `/contacto` | Sugerir restaurante, reportar error, sumarse |
| `/api/chat` | Asesor IA (DeepSeek con respaldo demo) |
| `/sitemap.xml`, `/robots.txt` | SEO técnico |

## 3. ¿Blog? Sí

Es el motor de tráfico orgánico a largo plazo. Cada artículo captura una intención de búsqueda y empuja a fichas y al buscador.

- "Qué comer en Loja: platos que debes probar"
- "Café de Loja: guía para empezar"
- "Cómo funciona el menú del día por WhatsApp" (también capta dueños)
- Siguientes: repe vs. cecina, dónde desayunar, comida tradicional por barrio, cenas y bares.

Enlazar con `agendaturisticaloja.com` ("Descubre Loja") para pasar autoridad al hermano turístico.

## 4. Marca

**Nombre:** qué comer *en loja.* (la última palabra en terracota). Submarca: "La ruta gastronómica · GuIAloja".
**Marca de símbolo:** hoja/arco en terracota dentro de un óvalo.

### Paleta (tomada de tu HTML)

| Token | Hex | Uso |
|---|---|---|
| `clay` | `#8B3A2A` | Primario, CTA, marca |
| `gold` | `#C8922A` | Acentos, foco, detalles |
| `cream` | `#FAF3E0` | Fondo base |
| `green` | `#4A7C59` | Verificado, asesor IA, WhatsApp |
| `ink` | `#1A1208` | Texto |
| `muted` | `#746653` | Texto secundario |
| `line` | `#E5DCCB` | Bordes |
| `paper` | `#FFFDF8` | Tarjetas |
| `bronze` | `#88602E` | Categoría Café |
| `slate` | `#263A42` | Categoría Bares y noche |

(La paleta verde profundo de `astra.md` queda descartada: se usa la del HTML, como pediste.)

### Tipografía
- **Titulares:** Playfair Display (500–700, cursiva para énfasis).
- **Texto e interfaz:** Inter (400–800).
- Cargadas con `next/font` (sin parpadeo, autoalojadas).

### Reglas visuales
Esquinas 16–22 px, sombras suaves, textura andina en el hero, etiquetas "Demo" siempre visibles mientras los datos no sean reales, foco dorado accesible.
