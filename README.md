# 🏟️ Arena Intelligence: Smart-Stadium Operations

![Arena Intelligence](https://img.shields.io/badge/Status-Active-success) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

Arena Intelligence is a next-generation smart-stadium operations platform, built specifically to handle the immense scale and complexity of the **FIFA World Cup 2026**. 

## 🌟 Our Ideology & Vision
Managing a stadium of 80,000+ passionate fans during a World Cup match is a logistical nightmare. Our vision with Arena Intelligence is to bridge the gap between static stadium infrastructure and real-time crowd dynamics using AI. We empower both the **fans** (finding the fastest food queues, nearest medical help) and the **operations team** (monitoring bottlenecks, emergency routing) through a single, intelligent interface: **Arena IQ**.

---

## 🏗️ Architecture & Flowchart

Arena IQ utilizes an advanced **Retrieval-Augmented Generation (RAG)** pipeline to answer complex questions instantly, pulling from both static stadium blueprints and live telemetry data.

```mermaid
graph TD
    User([User Prompt]) --> API[TanStack Server Action]
    API --> Embed[Gemini Embedding API]
    Embed --> VectorDB[(Local Vector Index)]
    VectorDB -- Returns Top 20 Chunks --> ReRanker[Cohere Re-Ranker]
    
    ReRanker -- Scores & Filters --> BestChunks[Top 4 Best Chunks]
    
    Live[Live Telemetry Data] --> ContextBuilder
    BestChunks --> ContextBuilder[RAG Context Builder]
    
    ContextBuilder --> LLM[Groq Llama 3 70B]
    LLM --> Response([AI Response])
```

---

## 🛠️ Technology Stack

- **Framework:** [TanStack Start](https://tanstack.com/start/latest) (React)
- **Bundler:** Vite
- **Deployment:** Vercel
- **AI / LLM:** [Groq](https://groq.com/) (Running Llama-3.3-70b-versatile for blazing-fast inference)
- **Embeddings:** Google Gemini (`gemini-embedding-2`)
- **Re-ranking:** Cohere (`rerank-english-v3.0`)
- **Knowledge Base:** Flat JSON Vector Store (perfect for edge deployments)

---

## 🚨 The Groq "Request Too Large" Problem & Our Solution

During development, as our stadium dataset grew massively, we encountered a critical architecture bottleneck. 

### The Problem
Groq's LPUs provide incredible text-generation speed, but their models have strict context window limits (~8,000 tokens). Initially, our vector database was blindly retrieving large chunks of data (up to 6,000 characters) and stuffing them into the prompt. This caused Groq to throw **"request too large"** errors, crashing the assistant.

### The Solution: Two-Stage Retrieval with Cohere
Instead of sacrificing dataset size or switching to a slower LLM, we implemented a state-of-the-art **Re-ranker architecture**:
1. **Micro-Chunking:** We pre-processed the JSON dataset into dense, single-sentence chunks.
2. **Wide Net Retrieval:** We increased the initial vector retrieval to grab the Top 20 matching chunks.
3. **Semantic Re-ranking:** We pipe those 20 chunks through the **Cohere Re-rank API**, which scores exactly how well each chunk answers the specific user query.
4. **Precision Injection:** We take only the absolute best **Top 4** chunks and send them to Groq. 

*Result: Zero API errors, blazing-fast latency, and highly precise, hallucination-free answers.*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- `GROQ_API_KEY` (For LLM responses)
- `COHERE_API_KEY` (For RAG Re-ranking)
- `GEMINI_API_KEY` (Only needed if regenerating the vector index)

### Run Locally

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your keys:
```dotenv
GROQ_API_KEY=your_groq_api_key
COHERE_API_KEY=your_cohere_api_key
GEMINI_API_KEY=your_gemini_api_key
```

3. Start the application:
```bash
npm run dev
```

### Dataset Management
Stadium knowledge lives in `stadium-data/*.json`. If you update these files, regenerate the semantic index:
```bash
npm run data:index
```

## 🛡️ License
Private and proprietary. All rights reserved.
