const { google } = require('./node_modules/googleapis');
const fs = require('fs');

const auth = new google.auth.JWT({
  email: "search-console-api@cesar-reyes.iam.gserviceaccount.com",
  key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDY3kwi24m2GWEK\nzRgZ5wGA1ds4m8rx8CwK4+xCOLXlbZnZuzX4gMgtMoQVsElD1edh62TDSZaUWgmZ\nupMY6CMejxEdOgQwY2jr7FUIIHmS0oEEPlZsWkQquGPN6K4KayV4z8xgklUFakTI\n8WE5lhRvwRwGZDZg2QtPmhUQQi20Zx/Z7KoIPiWnGg8j2H3ckp7dkt/hA8uZMtEa\n7HZk7+HqnIzALsOcgvkh+ZeMB/7AbtwMka3gXYw1frg1Oms9eMyruVKNngLemQzx\naQTziDYYN+639XefWzGNm0DChZN5N5rLb182gi0QkVh6gKXjOFt8fexhcDYeDsn7\n9qJ7jsYrAgMBAAECggEAYqz3EI86wDgY/xylwDdraC8mUcIVW/MvXv8pA1KhdRRj\nAf5cRsd2DZakIeg11d9Qqi28id0EXlj/cErD3nvVavSm0VkSCeBZn6tHX2zDVGpi\nmMcydJe314ZRpyGdexEYmjlWoYRDmjSpupKV7elbQCQqN8BGO9fV/TC7L8wk1qWV\nG8govg2SD/8BrjmyODFAFV3k+SIWFdhFVJ+JDUBWf7ryU174teR1FRn45jJKZ9/I\nxScQiAvvBaUHQILE0rEaGMJQooYeKQw2s9SrWJ2TRtuVzW5glexKObrxXIH8vBQ8\n802wPuVLfQrnsHUqfNQBM5fV27+SN5QVtD04cN5zAQKBgQDtQ/K6dE2CK5YS3uCK\n6ZB1KhEAVfLMt5KxIaOX3ZDQ9HDWyUJDfkBW2jGQok/X8+UiEgTtE/1y4aYc7z3h\npFv6l5Nhiwvql6ENOYT/K6+r0kAXmgHrbsIPoYqhCY68qvCVOSVpqfuE8A+AWoe6\nOZdZ3MMISVLfjg/U1CLtah2RAQKBgQDp/gummFh/r9LDl/ghOSkySzRHeQvGKkxz\nJ5SQ3LyzV3x/1EWzul9eOglMdEZs5NuNk+RYGn2P4H5XMJeuuExWBt9OGkwjdBV8\ndks/N09Ix25PzfnzreSQLuf8cNfRx1hkqr8P8D6btc9C+7/OG914W5YeHF57Nv0N\nu0q8kPxrKwKBgA6dgeU0ZtXe43a0HfbQnmJpPfTcVoF/yVx56v7e2h3VAOJqMVfA\n/iubczQqm2p9Dp9DpuQHuDQMbFQZ9KDio/vSvHRkwU4pGvWalnO1eDPIVsRda0La\nZr/ZvpVe5lj+2qUGiSRyIRk2RG4upW+2Pnl9nNH02lMFCDqe+qvPPpUBAoGBAIiA\nw5s0VKxojbO8++ulxPqqFJ19Z/j6xA6JkInRu+ODrgWEeAUZPHljsfj/+/WarNoy\n5IrhKU69z/ZdSp+KtD2bVLnjbXdhSQeKmusOARqb/SZhKueVEjlqo7sIuV6PxGk1\nkrBhnqSHs5mH86TxbInCJBj8w8FtmsJf+IF4s0hxAoGAWI+U/XnNw0Y27juQ81r9\nt83X7m2p05udofwMQ+88cIb0C5s4NRkJSX7EOyWmpnFYTw5VSUkWhSNLIap7Wh4o\n90/+YPZsDBFb4LocLIohYzI0hfJYGRvT6Ck7Tmut9lt3fkmRo9rxVqK1JOzYnHiO\nGTj8+LxcyRgT/Ly0ltczH58=\n-----END PRIVATE KEY-----\n",
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const sc = google.searchconsole({ version: 'v1', auth });

// Palabras clave relacionadas con comida en Loja que queremos filtrar del ecosistema
const FOOD_KEYWORDS = [
  'comer', 'comida', 'restaurante', 'almuerzo', 'desayuno', 'cena', 'merienda',
  'repe', 'cecina', 'cuy', 'gallina', 'tamal', 'humita', 'fritada', 'arveja',
  'guineo', 'horchata', 'café', 'cafe', 'cafeteria', 'bar', 'hueca', 'menu',
  'plato', 'sopa', 'típico', 'tipico', 'gastronomía', 'gastronomia', 'loja',
  'catamayo', 'vilcabamba', 'valle', 'food', 'breakfast', 'lunch', 'eat'
];

async function fetchAllQueries(siteUrl, label) {
  const allRows = [];
  let startRow = 0;
  const rowLimit = 1000;
  
  while (true) {
    try {
      const res = await sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: '2023-01-01',
          endDate: '2026-10-08',
          dimensions: ['query'],
          rowLimit,
          startRow,
          dataState: 'all'
        }
      });
      const rows = res.data.rows || [];
      allRows.push(...rows);
      if (rows.length < rowLimit) break;
      startRow += rowLimit;
    } catch (e) {
      console.error(`Error en ${label}:`, e.message);
      break;
    }
  }
  return allRows;
}

async function main() {
  await auth.authorize();
  console.log('✅ Autenticado en GSC\n');

  const sites = [
    { url: 'sc-domain:quecomerenloja.com',    label: 'QueComerEnLoja' },
    { url: 'sc-domain:agendaturisticaloja.com', label: 'AgendaTuristica' },
    { url: 'sc-domain:agendaculturalloja.com',  label: 'AgendaCultural' },
    { url: 'https://hotelelcardenalloja.com/',   label: 'HotelCardenal' },
    { url: 'sc-domain:cesarreyesjaramillo.com',  label: 'CesarReyes' }
  ];

  const masterData = {};
  const foodKeywordsFromAll = [];

  for (const site of sites) {
    console.log(`\n📊 Extrayendo: ${site.label}...`);
    const rows = await fetchAllQueries(site.url, site.label);
    console.log(`   → ${rows.length} queries totales`);
    masterData[site.label] = rows;

    // Filtrar solo las relacionadas con comida/loja
    const foodRelated = rows.filter(r => {
      const q = r.keys[0].toLowerCase();
      return FOOD_KEYWORDS.some(kw => q.includes(kw));
    });
    console.log(`   → ${foodRelated.length} queries relacionadas con comida/Loja`);
    foodKeywordsFromAll.push(...foodRelated.map(r => ({ ...r, source: site.label })));
  }

  // Deduplicar y ordenar por impresiones + clicks
  const keywordMap = {};
  for (const row of foodKeywordsFromAll) {
    const q = row.keys[0].toLowerCase();
    if (!keywordMap[q]) {
      keywordMap[q] = { query: q, clicks: 0, impressions: 0, sources: new Set() };
    }
    keywordMap[q].clicks += row.clicks;
    keywordMap[q].impressions += row.impressions;
    keywordMap[q].sources.add(row.source);
  }

  const sorted = Object.values(keywordMap)
    .sort((a, b) => (b.impressions + b.clicks * 10) - (a.impressions + a.clicks * 10));

  // Guardar reporte completo
  let report = '# INVESTIGACIÓN SEO REAL - KEYWORDS COMIDA EN LOJA\n';
  report += `Extraído de Google Search Console el ${new Date().toISOString()}\n\n`;
  report += '## TODOS LOS KEYWORDS RELACIONADOS CON COMIDA (ordenados por relevancia)\n\n';
  report += '| Keyword | Clicks | Impresiones | Fuentes |\n';
  report += '|---------|--------|-------------|--------|\n';

  for (const kw of sorted) {
    report += `| ${kw.query} | ${kw.clicks} | ${kw.impressions} | ${[...kw.sources].join(', ')} |\n`;
  }

  // También sacar top keywords por cada sitio
  report += '\n\n## DETALLE POR SITIO\n\n';
  for (const [label, rows] of Object.entries(masterData)) {
    report += `### ${label}\n`;
    report += `Total queries: ${rows.length}\n\n`;
    report += '| Query | Clicks | Impressiones | Posición |\n';
    report += '|-------|--------|-------------|----------|\n';
    const top = rows.slice(0, 200);
    for (const r of top) {
      report += `| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${r.position?.toFixed(1) || 'N/A'} |\n`;
    }
    report += '\n';
  }

  fs.writeFileSync('docs/04_GSC_RESEARCH_REAL.md', report, 'utf8');
  console.log('\n\n✅ Reporte guardado en docs/04_GSC_RESEARCH_REAL.md');
  console.log(`📊 Total keywords de comida/Loja encontrados: ${sorted.length}`);
  console.log('\n🔝 TOP 30 Keywords MÁS RELEVANTES:');
  sorted.slice(0, 30).forEach((kw, i) => {
    console.log(`${i+1}. "${kw.query}" → ${kw.clicks} clicks, ${kw.impressions} imp [${[...kw.sources].join('+')}]`);
  });
}

main().catch(console.error);
