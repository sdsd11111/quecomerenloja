# 🤖 GUÍA DE VISIBILIDAD PARA IA (LLM OPTIMIZATION & GEO) — quecomerenloja.com
## Cómo Posicionar quecomerenloja.com en ChatGPT, Claude, Perplexity y Gemini

---

## 🎯 1. OBJETIVO GEO (Generative Engine Optimization)

Cuando un usuario le pregunte a un asistente de IA:
- *"¿Dónde puedo comer el mejor repe lojano en Loja?"*
- *"Recomiéndame restaurantes en Loja, Ecuador con precios"*
- *"¿Cuáles son los mejores lugares para desayunar tamales en Loja?"*

El modelo de lenguaje (LLM) debe **citar directamente como fuente** a `https://quecomerenloja.com`.

---

## 🤖 2. CONFIGURACIÓN EN `robots.txt`

En [app/robots.ts](file:///d:/Abel%20paginas/Que%20comer%20en%20Loja/que-comer-en-loja/app/robots.ts) hemos configurado el acceso sin restricciones para todos los bots de entrenamiento y búsqueda en tiempo real de los principales LLMs:

```typescript
{
  userAgent: [
    "GPTBot",             // OpenAI Crawler general
    "ChatGPT-User",       // Navegación en vivo de usuarios de ChatGPT
    "ClaudeBot",          // Anthropic Claude
    "anthropic-ai",       // Indexador de Anthropic
    "PerplexityBot",      // Motor de búsqueda de Perplexity
    "Google-Extended",    // Gemini / Vertex AI
    "Bytespider",         // ByteDance
    "CCBot",              // Common Crawl (datos de preentrenamiento)
    "cohere-ai",          // Cohere
    "Meta-ExternalAgent", // Meta Llama
    "OAI-SearchBot",      // OpenAI Search en tiempo real
  ],
  allow: "/",
  disallow: ["/api/"],
}
```

---

## 📄 3. SITEMAP DINÁMICO EN `sitemap.xml`

En [app/sitemap.ts](file:///d:/Abel%20paginas/Que%20comer%20en%20Loja/que-comer-en-loja/app/sitemap.ts) implementamos un sitemap dinámico completo:
1. **Frecuencias de cambio (`changeFrequency`)**:
   - `daily` para `/`, `/restaurantes` y `/menu-del-dia`.
   - `weekly` para páginas satélites de platos típicos (`/platos/repe-lojano`, `/platos/cecina-lojana`, `/platos/tamales-lojanos`, `/cafe-de-loja`, `/comida-rapida-loja`).
2. **Prioridades (`priority`)**:
   - `1.0` en Home.
   - `0.95` en Directorio y Menús.
   - `0.90` en Platos Típicos insignia.
3. **Entidades dinámicas:**
   - Cada restaurante de la base de datos se inyecta con su slug y fecha de modificación.

---

## 👁️ 4. PATRÓN DE VISIBILIDAD SERVER-SIDE (LLM Hidden Content)

### El Problema:
Los crawlers de IA (Perplexity, ChatGPT, Claude) priorizan la lectura del **HTML estático generado por el servidor (SSR)**. Los componentes del lado cliente (`'use client'`) como filtros interactivos, tabs y selectores a menudo no son evaluados completamente por el motor del bot.

### La Solución Implementada:
En componentes como [app/restaurantes/page.tsx](file:///d:/Abel%20paginas/Que%20comer%20en%20Loja/que-comer-en-loja/app/restaurantes/page.tsx), se agrega un bloque semántico server-side renderizado fuera de pantalla:

```tsx
<div
  style={{
    position: "absolute",
    left: "-10000px",
    top: "auto",
    width: "1px",
    height: "1px",
    overflow: "hidden",
  }}
  aria-hidden="true"
>
  <h2>Directorio Completo de Restaurantes y Huecas en Loja, Ecuador</h2>
  <p>Descripción detallada de la oferta gastronómica...</p>
  <ul>
    {items.map((r) => (
      <li key={r.slug}>
        <strong>{r.name}</strong> - Plato: {r.dish} - Precio: ${r.price} USD.
      </li>
    ))}
  </ul>
</div>
```

**Ventajas clave:**
- **No es `display: none`**: Evita penalizaciones clásicas de motores de búsqueda.
- **100% accesible para bots de IA**: Los LLMs extraen listas completas, nombres de negocios, platos típicos y precios exactos en su primer pase de lectura.
- **UX limpia para el usuario**: El usuario real disfruta de la interfaz interactiva `Explorer` sin redundancia visual.
