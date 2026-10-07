# Qué Comer en Loja · quecomerenloja.com

Portal gastronómico multipágina de GuIAloja. Next.js (App Router) · React 19 · TypeScript · Tailwind CSS 4 · MySQL (`mysql2`, SQL directo).

Estrategia, mapa de sitio y marca: ver [`BRANDING.md`](./BRANDING.md).

## Arranque rápido

```bash
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

Sin `DATABASE_URL` el sitio funciona con datos de demostración (`lib/data.ts`).

### Con MySQL

```bash
docker compose up -d   # crea la base y carga db/schema.sql + db/seed.sql
# .env.local → DATABASE_URL=mysql://quecomer:quecomer@127.0.0.1:3306/quecomerenloja
```

Sin Docker: ejecuta `db/schema.sql` y luego `db/seed.sql` en tu MySQL 8 / MariaDB 10.6+.

## Estructura

```
app/                 Rutas (páginas, API, sitemap, robots)
components/          UI reutilizable
lib/repository.ts    Acceso a datos (MySQL o demo)
lib/db.ts            Pool mysql2
lib/advisor/         Contrato e integración del Asesor IA
db/                  schema.sql y seed.sql
```

## Asesor IA (tu propio servicio)

El sitio no trae IA. `POST /api/chat` valida la petición, aplica límite de uso y la reenvía a `ADVISOR_API_URL`.

**Sitio → tu asesor** (`POST ADVISOR_API_URL`, con `Authorization: Bearer ADVISOR_API_KEY` si la defines):

```json
{ "message": "Quiero cecina", "history": [{ "role": "user", "content": "..." }], "location": { "latitude": -4.0, "longitude": -79.2 }, "locale": "es-EC" }
```

**Tu asesor → sitio**: responde `{ "reply": "texto" }`.

**Contexto actual** para tu asesor: `GET /api/advisor/context` devuelve negocios, menús del día, precios, coordenadas y `verifiedAt`. Si defines `ADVISOR_API_KEY`, exige el mismo Bearer. Los tipos están en `lib/advisor/types.ts`.

Sin `ADVISOR_API_URL`, el chat usa un recomendador de ejemplo para probar la interfaz.

## Pendientes antes de producción

- Reemplazar los datos de ejemplo por negocios reales (WhatsApp, coordenadas, fotos).
- Flujo de audio de WhatsApp: debe escribir en `menus_dia` y fijar `verificado_en` al confirmar el dueño.
- Definir `NEXT_PUBLIC_BUSINESS_WHATSAPP`.
- Añadir `og:image` con un recurso real publicado.
- Rate limit actual es en memoria; con varias instancias usar Redis o el proxy.

## Scripts

`npm run dev` · `npm run build` · `npm start` · `npm run typecheck`
