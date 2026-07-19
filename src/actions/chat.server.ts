import { createServerFn } from "@tanstack/react-start";
import { getLiveSnapshot, getRelevantLiveData } from "../lib/liveData";
import {
  buildRAGContext,
  retrieveTopChunks,
  validateRAGRequest,
  type VectorChunk,
} from "../lib/rag";
import { sanitizeText } from "../lib/security";
import vectorIndexData from "../../stadium-data/vector-index.json";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const queryCache = new Map<string, { answer: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function checkServerRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 50; // 50 requests per minute
  const windowMs = 60000;

  const record = rateLimitMap.get(ip);
  if (!record || record.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count += 1;
  rateLimitMap.set(ip, record);
  return true;
}

function getGeminiKey() {
  return process.env.GEMINI_API_KEY;
}

function getGroqKey() {
  return process.env.GROQ_API_KEY;
}

function getCohereKey() {
  return process.env.COHERE_API_KEY;
}

const EMBED_MODEL = "gemini-embedding-2";
const CHAT_MODEL = "llama-3.3-70b-versatile"; // Groq model
const TOP_K = 20; // Fetch more chunks initially
const TOP_N_RERANK = 4; // Top chunks to send to LLM after re-ranking

let cachedIndex: VectorChunk[] | undefined;
function loadIndex(): VectorChunk[] {
  if (cachedIndex) return cachedIndex;
  cachedIndex = Array.isArray(vectorIndexData) ? (vectorIndexData as VectorChunk[]) : [];
  return cachedIndex;
}

async function embedQuery(text: string): Promise<number[]> {
  const key = getGeminiKey();
  if (!key) throw new Error("Gemini API key is missing");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
      }),
    },
  );
  if (!res.ok) throw new Error(`Embedding error: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { embedding?: { values?: unknown } };
  if (
    !Array.isArray(data.embedding?.values) ||
    !data.embedding.values.every((value) => typeof value === "number")
  ) {
    throw new Error("Embedding response did not include a numeric vector");
  }
  return data.embedding.values;
}

async function reRankChunks(
  query: string,
  chunks: Array<VectorChunk & { score: number }>,
): Promise<Array<VectorChunk & { score: number }>> {
  if (chunks.length === 0) return [];
  const key = getCohereKey();
  
  // If no Cohere key is set, fallback to original vector similarity
  if (!key) {
    console.warn("No Cohere API key provided. Falling back to vector similarity search.");
    return chunks.slice(0, TOP_N_RERANK);
  }

  const res = await fetch("https://api.cohere.com/v1/rerank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "X-Client-Name": "Arena-Intelligence",
    },
    body: JSON.stringify({
      model: "rerank-english-v3.0",
      query: query,
      documents: chunks.map((c) => c.text),
      top_n: TOP_N_RERANK,
    }),
  });

  if (!res.ok) {
    console.error(`Cohere rerank error: ${res.status} ${await res.text()}`);
    return chunks.slice(0, TOP_N_RERANK); // Fallback
  }

  const data = (await res.json()) as { results?: Array<{ index: number; relevance_score: number }> };
  if (!data.results) return chunks.slice(0, TOP_N_RERANK); // Fallback

  const rerankedChunks: Array<VectorChunk & { score: number }> = [];
  for (const result of data.results) {
    const originalChunk = chunks[result.index];
    if (originalChunk) {
      rerankedChunks.push({
        ...originalChunk,
        score: result.relevance_score,
      });
    }
  }

  return rerankedChunks;
}

async function askGroq(
  question: string,
  staticContext: string,
  liveContext: unknown,
  personaContext: string,
  lang: string,
  conversationHistory: Array<{ role: "user" | "ai"; text: string }> = []
) {
  const key = getGroqKey();
  if (!key) throw new Error("Groq API key is missing");

  const systemPrompt = `You are Arena IQ, the intelligent operations assistant for Arena Intelligence Stadium during the FIFA World Cup 2026.
${personaContext}

Respond ONLY in ${lang}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences. Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.

Answer ONLY using the facts provided below. If the answer isn't in the provided data, say you don't have that information rather than guessing.
Be concise, friendly, and specific. CRITICAL: When recommending food, items, or stores, you MUST explicitly state the store name, its exact location in the stadium, and its distance/wait time if applicable. If comparing options (e.g., food items within a budget), recommend the best complete option, clearly state the store name and location, and explain why. Ensure your answer is grammatically complete and makes logical sense.
Never invent bookings, events, or payments.

STATIC STADIUM DATA (background facts):
${staticContext}

LIVE DATA (current status, queues, occupancy right now):
${JSON.stringify(liveContext, null, 2)}`;

  const formattedHistory = conversationHistory.map(h => ({
    role: h.role === "ai" ? "assistant" : "user",
    content: h.text
  }));

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: question },
      ],
      temperature: 0.2,
      max_tokens: 150,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
}

export const askGeminiRAG = createServerFn({ method: "POST" })
  .validator(validateRAGRequest)
  .handler(async ({ data }) => {
    try {
      const { message, personaContext, lang, conversationHistory } = validateRAGRequest(data);

      const ip = "client-ip";
      if (!checkServerRateLimit(ip)) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      const cleanMessage = sanitizeText(message);
      if (!cleanMessage) {
        throw new Error("Invalid or empty message after sanitization.");
      }
      
      const cacheKey = `${lang}:${cleanMessage.toLowerCase()}`;
      const cached = queryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return { answer: cached.answer, sources: [] };
      }

      // Intent extraction
      const isBookingQuery = /ticket|booking|pass|seat|sit|bought/i.test(cleanMessage);

      const index = loadIndex();
      let staticContext = "";
      let topChunks: Array<VectorChunk & { score: number }> = [];

      if (index.length > 0 && !isBookingQuery) {
        const queryVector = await embedQuery(cleanMessage);
        const initialChunks = retrieveTopChunks(queryVector, index as VectorChunk[], TOP_K);
        topChunks = await reRankChunks(cleanMessage, initialChunks);
        staticContext = buildRAGContext(topChunks);
      } else {
        staticContext = "No static data needed or indexed for this query.";
      }

      const liveSnapshot = getLiveSnapshot();
      const liveContext = getRelevantLiveData(cleanMessage, liveSnapshot);

      const answer = await askGroq(cleanMessage, staticContext, liveContext, personaContext, lang, conversationHistory);

      queryCache.set(cacheKey, { answer, timestamp: Date.now() });

      return {
        answer,
        sources: topChunks.map((c) => ({
          id: c.id,
          source: c.source,
          score: Number(c.score.toFixed(3)),
        })),
      };
    } catch (error: unknown) {
      console.error("askGeminiRAG server error:", error);
      const message = error instanceof Error ? error.message : "Unknown server error";
      return {
        answer: `I'm having trouble processing your request right now. Please try again in a moment.`,
        sources: [],
      };
    }
  });
