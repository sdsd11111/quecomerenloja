import json

with open(r'd:\Abel paginas\Que comer en Loja\que-comer-en-loja\docs\08_KEYWORDS_GOOGLE_ADS_RAW.json', encoding='utf-8') as f:
    kws = json.load(f)

md = []
md.append('# REPORTE DEFINITIVO DE DEMANDA REAL — GOOGLE KEYWORD PLANNER')
md.append('## Total: 89 Keywords Reales de Google Ads | Mercado Loja / Ecuador | Sept 2025 - Ago 2026')
md.append('\n---\n')

md.append('## 📊 1. RESUMEN EJECUTIVO DE HALLAZGOS REALES')
md.append('- **Término Rey Absoluto:** `repe lojano` (5.000 búsquedas/mes). Es el estandarte gastronómico indiscutible.')
md.append('- **Término Comercial Rey:** `restaurantes loja` (5.000 búsquedas/mes) con pujas publicitarias de hasta **$0.85 USD/clic**.')
md.append('- **El Nicho de Oro Publicitario:** `chifa loja` (500 búsquedas/mes) tiene el **CPC más alto de Loja: $0.94 USD/clic**.')
md.append('- **Boom de Crecimiento (+900%):** `desayunos en loja`, `alitas loja`, `mejores restaurantes en loja` y `lugares para comer en loja` han crecido +900% este año.')
md.append('- **Comida Rápida:** La gente **NO** busca "comida rápida" (solo 50 búsquedas). Buscan exactamente el producto: `pizzas en loja` (500), `hamburguesas loja` (500) y `alitas loja` (500).')

md.append('\n---\n')
md.append('## 🏆 2. TIER 1: MEGA VOLUMEN (1.000 a 5.000 búsquedas/mes)')
md.append('| Palabra Clave | Búsquedas/Mes | Tendencia 3M | Crecimiento YoY | CPC Alto | Oportunidad SEO |')
md.append('| :--- | :--- | :--- | :--- | :--- | :--- |')
for k in kws:
    if k['avg'] >= 1000:
        cpc = f"${k['top_high']}" if k['top_high'] else "-"
        md.append(f"| **{k['kw']}** | **{k['avg']}** | {k['three_m']} | {k['yoy']} | {cpc} | Titular H1 y Página Principal |")

md.append('\n---\n')
md.append('## ⚡ 3. TIER 2: ALTA DEMANDA COMERCIAL (500 búsquedas/mes)')
md.append('| Palabra Clave | Búsquedas/Mes | Tendencia 3M | Crecimiento YoY | CPC Alto | Función en la Arquitectura Web |')
md.append('| :--- | :--- | :--- | :--- | :--- | :--- |')
for k in kws:
    if k['avg'] == 500:
        cpc = f"${k['top_high']}" if k['top_high'] else "-"
        md.append(f"| **{k['kw']}** | **{k['avg']}** | {k['three_m']} | {k['yoy']} | {cpc} | Categoría Principal / Guía |")

md.append('\n---\n')
md.append('## 🚀 4. TIER 3: TENDENCIAS EN EXPLOSIÓN (+900% YoY / 3M)')
md.append('| Palabra Clave | Búsquedas/Mes | Crecimiento | CPC Alto | Acción Inmediata |')
md.append('| :--- | :--- | :--- | :--- | :--- |')
for k in kws:
    if '900%' in k['three_m'] or '900%' in k['yoy']:
        cpc = f"${k['top_high']}" if k['top_high'] else "-"
        md.append(f"| **{k['kw']}** | {k['avg']} | **+900%** | {cpc} | Crear sección prioritaria |")

md.append('\n---\n')
md.append('## 🧭 5. PLAN DE POSICIONAMIENTO DESDE LA HOME Y ARQUITECTURA DE PÁGINAS')
md.append('### A. La Página Home (`/`)')
md.append('- **H1 Principal:** *"Dónde comer en Loja: Restaurantes, Huecas y Platos Típicos"*.')
md.append('- **Buscador con sugerencias reales:** `Repe lojano`, `Restaurantes Loja`, `Alitas`, `Pizzas`, `Chifa`, `Desayunos`, `Cecina`.')
md.append('- **Bloques de Categorías basadas en la data:**')
md.append('  1. **Platos Típicos e Insignes:** Repe Lojano (5K), Cecina (500), Tamales y Humitas (500).')
md.append('  2. **Desayunos & Cafés:** Crecimiento +900% en `desayunos en loja` y `cafeterias loja` (500).')
md.append('  3. **Comida de Noche / Piqueos:** Pizzas (500), Hamburguesas (500), Alitas (+900%).')
md.append('  4. **Chifas & Cenas:** Chifa en Loja (500, CPC más alto $0.94).')

md.append('\n### B. Landing Pages Satélite que nacerán de la Home')
md.append('1. `/platos/repe-lojano` -> Rankear para los 5.000 usuarios mensuales de repe.')
md.append('2. `/restaurantes` -> Ranking general: *"Los Mejores Restaurantes en Loja"* (+900%).')
md.append('3. `/desayunos` -> *"Dónde Desayunar en Loja: Cafeterías y Tamales"* (+900%).')
md.append('4. `/pizzas-y-hamburguesas` -> *"Pizzas, Hamburguesas y Alitas en Loja"* (Demanda nocturna).')
md.append('5. `/chifas` -> *"Los Mejores Chifas de Loja"* (Monetización de anuncios y CPC alto).')

with open(r'd:\Abel paginas\Que comer en Loja\que-comer-en-loja\docs\08_ANALISIS_GOOGLE_KEYWORD_PLANNER.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(md))

print('REPORTE_CREADO_CON_EXITO')
