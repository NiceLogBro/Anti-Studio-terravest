# TerraYield AI

TerraYield AI is a React and TypeScript app for exploring distressed investment properties and reviewing their financial, soil, crop, zoning, grant, and lien details. The app combines a Vite frontend, a shared API router, Firebase authentication/storage, and optional Gemini-powered analysis. Locally, Express hosts the API and Vite development middleware; Cloudflare uses the same API router in a Worker.

Property listings are generated in memory when the API starts; they are demo data, not a persistent listing database. User sign-in, saved properties, and validation records use the configured Firebase project.

## Requirements

- Node.js 20.19+ or 22.12+
- A Firebase project configured in `firebase-applet-config.json`
- A Gemini API key for AI-powered analysis and advisor features (optional for local startup)

## Local development

```sh
npm install --legacy-peer-deps
npm run dev
```

The local server listens on port `3000` by default. Set `PORT` to use another port and `GEMINI_API_KEY` to enable Gemini-backed routes. Copy `.env.example` to `.env` for local secrets; do not commit real credentials.
The legacy peer-dependency flag is needed because the current Vite and `esbuild` package ranges have conflicting optional peer requirements.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express with the Vite development middleware |
| `npm start` | Start the local server |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Run the TypeScript check |
| `npm test` | Run API and underwriting unit tests |
| `npm run deploy` | Build and deploy the Cloudflare Worker and static assets (Wrangler 4) |

## API

The API serves generated property data and provides these routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/properties` | Return the in-memory property collection |
| `POST` | `/api/analyze-custom-property` | Generate an analysis for submitted parcel details |
| `POST` | `/api/ask-property-advisor` | Ask a question about a property |
| `POST` | `/api/deep-research/validate-property` | Build a property legitimacy and soil validation report |
| `POST` | `/api/chat` | Send a chat conversation to the advisor |
| `POST` | `/api/maps/grounded-places` | Find nearby places using Gemini Maps grounding |

AI-backed routes require `GEMINI_API_KEY`; the app also includes local validation and fallback behavior when AI results are unavailable. Generated financial, legal, zoning, and agronomic information is for research only and should be independently verified.

## Cloudflare Workers deployment

`wrangler.jsonc` deploys the built Vite assets and a Worker-native API router. `/api/*` requests run the API first; other requests are served from the static asset binding with SPA fallback. Cloudflare observability is disabled in this configuration.

1. Authenticate Wrangler with `npx wrangler login`.
2. Set the server-side Gemini key: `npx wrangler secret put GEMINI_API_KEY`.
3. Run `npm run deploy`.

The Firebase web configuration remains client-side and must be configured for the deployment domain in Firebase Authentication. The API's generated property collection remains in memory per Worker isolate and is not durable storage.
