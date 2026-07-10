/**
 * app/api/chat/route.js
 * The core RAG endpoint: embed query -> cosine similarity search over the
 * local vector index -> merge with live data -> ask Gemini -> return answer.
 *
 * Env vars needed (set in Vercel project settings):
 *   GEMINI_API_KEY
 */
import fs from "fs";
import path from "path";
import { getLiveSnapshot, getRelevantLiveData } from "../../../lib/liveData";

const API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = "text-embedding-004";
const CHAT_MODEL = "gemini-2.0-flash";
const TOP_K = 8;

let cachedIndex = null;
function loadIndex() {
  if (cachedIndex) return cachedIndex;
  const indexPath = path.join(process.cwd(), "stadium-data", "vector-index.json");
  cachedIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return cachedIndex;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedQuery(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${API_KEY}`,
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

function retrieveTopChunks(queryVector, index, k) {
  const scored = index.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryVector, chunk.vector),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

async function askGemini(question, staticContext, liveContext) {
  const systemPrompt = `You are the official AI assistant for Arena Intelligence Stadium.
Answer ONLY using the facts provided below. If the answer isn't in the provided
data, say you don't have that information rather than guessing.
Be concise, friendly, and specific (mention exact gate/stand/food court names,
wait times, and distances when relevant). If comparing options (e.g. two food
courts), recommend the better one and explain why in one sentence.

STATIC STADIUM DATA:
${staticContext}

LIVE DATA (current, right now):
${JSON.stringify(liveContext, null, 2)}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: question }] }],
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
}

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing 'message' in request body" }, { status: 400 });
    }

    const index = loadIndex();
    const queryVector = await embedQuery(message);
    const topChunks = retrieveTopChunks(queryVector, index, TOP_K);
    const staticContext = topChunks.map((c) => `- ${c.text}`).join("\n");

    const liveSnapshot = getLiveSnapshot();
    const liveContext = getRelevantLiveData(message, liveSnapshot);

    const answer = await askGemini(message, staticContext, liveContext);

    return Response.json({
      answer,
      sources: topChunks.map((c) => ({ id: c.id, source: c.source, score: Number(c.score.toFixed(3)) })),
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
