# Arena Intelligence

Arena Intelligence is a smart-stadium operations demo for FIFA World Cup 2026 scenarios. It combines operations dashboards, fan tools, emergency workflows, simulated live signals, and the Arena IQ retrieval-augmented assistant.

## What it includes

- Operations, security, emergency, tournament, and fan-facing routes.
- Simulated live queues, parking, washroom occupancy, gate crowd levels, and weather.
- Arena IQ: Groq-powered answers grounded in the local `stadium-data` knowledge base and relevant live data.
- Accessibility, guest-service, navigation, ticketing, food, medical, security, and event data.
- Unit tests for security utilities, live-data selection, RAG request validation/ranking, UI primitives, and server error behavior.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A Groq API key for chat responses
- A Gemini API key only when regenerating the vector index

## Run locally

```bash
npm install
```

Create `.env.local` with the runtime keys:

```dotenv
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

Then start the app:

```bash
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:3000`).

## Dataset and AI workflow

Stadium knowledge lives in `stadium-data/*.json`. The assistant reads live operational data at request time and uses `stadium-data/vector-index.json` for semantic retrieval.

After changing a dataset file, regenerate the index with a server-side Gemini key:

```bash
npm run data:index
```

Do not expose API keys in browser-prefixed environment variables or commit them to scripts. The index command calls Gemini's embedding API and can take a few minutes for large datasets.

## Quality checks

```bash
npm test
npm run test:coverage
npm run build
```

## Project layout

```text
src/
  actions/       Server functions, including Arena IQ chat
  components/    Shared UI components
  lib/           AI, RAG, live-data, security, and utility modules
  routes/        TanStack routes for each product surface
stadium-data/    Source JSON data and the generated vector index
scripts/         Dataset generation and indexing utilities
```

## Deployment

Build with `npm run build` and deploy the generated Nitro application to a Node-compatible environment. Configure `GROQ_API_KEY` and, if you plan to rebuild the index in that environment, `GEMINI_API_KEY` as server-only secrets.

## License

Private and proprietary. All rights reserved.
