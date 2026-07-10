import { createServerFn } from "@tanstack/react-start";
import fs from "fs";
import path from "path";
import { getLiveSnapshot, getRelevantLiveData } from "../lib/liveData";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const EMBED_MODEL = "gemini-embedding-2";
const CHAT_MODEL = "llama-3.3-70b-versatile"; // Groq model
const TOP_K = 8;

let cachedIndex: any = null;
function loadIndex() {
  if (cachedIndex) return cachedIndex;
  const indexPath = path.join(process.cwd(), "stadium-data", "vector-index.json");
  if (!fs.existsSync(indexPath)) return []; // Return empty if not generated yet
  cachedIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return cachedIndex;
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedQuery(text: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
      }),
    }
  );
  if (!res.ok) throw new Error(`Embedding error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.embedding.values;
}

function retrieveTopChunks(queryVector: number[], index: any[], k: number) {
  const scored = index.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryVector, chunk.vector),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

async function askGroq(question: string, staticContext: string, liveContext: any, personaContext: string, lang: string) {
  const systemPrompt = `You are Arena IQ, the intelligent operations assistant for Narendra Modi FIFA Stadium during the FIFA World Cup 2026.
${personaContext}

Respond ONLY in ${lang}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences. Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.

Answer ONLY using the facts provided below. If the answer isn't in the provided data, say you don't have that information rather than guessing.
Be concise, friendly, and specific (mention exact gate/stand/food court names, wait times, and distances when relevant). If comparing options (e.g. two food courts), recommend the better one and explain why in one sentence.

STATIC STADIUM DATA (background facts):
${staticContext}

LIVE DATA (current status, queues, occupancy right now):
${JSON.stringify(liveContext, null, 2)}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.2,
      max_tokens: 150,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "I couldn't generate a response.";
}

export const askGeminiRAG = createServerFn({ method: "POST" })
  .validator((data: { message: string; personaContext: string; lang: string }) => data)
  .handler(async ({ data }) => {
    const { message, personaContext, lang } = data;
    if (!message || typeof message !== "string") {
      throw new Error("Missing 'message' in request");
    }

    const index = loadIndex();
    let staticContext = "";
    let topChunks: any[] = [];
    
    if (index.length > 0) {
      const queryVector = await embedQuery(message);
      topChunks = retrieveTopChunks(queryVector, index, TOP_K);
      staticContext = topChunks.map((c) => `- ${c.text}`).join("\n");
    } else {
      staticContext = "No static data indexed yet.";
    }

    const liveSnapshot = getLiveSnapshot();
    const liveContext = getRelevantLiveData(message, liveSnapshot);

    const answer = await askGroq(message, staticContext, liveContext, personaContext, lang);

    return {
      answer,
      sources: topChunks.map((c) => ({ id: c.id, source: c.source, score: Number(c.score.toFixed(3)) })),
    };
  });
