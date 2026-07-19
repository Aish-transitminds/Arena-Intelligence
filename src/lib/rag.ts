export type VectorChunk = {
  id: string;
  source: string;
  text: string;
  vector: number[];
};

export type RAGRequest = {
  message: string;
  personaContext?: string;
  lang?: string;
  conversationHistory?: Array<{ role: "user" | "ai"; text: string }>;
};

export const DEFAULT_LANGUAGE = "English";
export const MAX_MESSAGE_LENGTH = 1_000;
export const MAX_RAG_CONTEXT_CHARACTERS = 6_000;
const MAX_CHUNK_CHARACTERS = 1_800;

export function validateRAGRequest(data: unknown): Required<RAGRequest> {
  if (!data || typeof data !== "object") {
    throw new Error("A chat request is required");
  }

  const { message, personaContext = "", lang = DEFAULT_LANGUAGE, conversationHistory = [] } = data as RAGRequest;
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Missing 'message' in request");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
  }
  if (typeof personaContext !== "string" || typeof lang !== "string") {
    throw new Error("Invalid chat request metadata");
  }

  return {
    message: message.trim(),
    personaContext: personaContext.trim(),
    lang: lang.trim() || DEFAULT_LANGUAGE,
    conversationHistory: Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-5) // Keep last 5 turns for context window efficiency
      : [],
  };
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    normA += a[index] ** 2;
    normB += b[index] ** 2;
  }

  if (!normA || !normB) return 0;
  return dot / Math.sqrt(normA * normB);
}

export function retrieveTopChunks(
  queryVector: number[],
  index: VectorChunk[],
  limit = 8,
): Array<VectorChunk & { score: number }> {
  return index
    .filter((chunk) => Array.isArray(chunk.vector))
    .map((chunk) => ({ ...chunk, score: cosineSimilarity(queryVector, chunk.vector) }))
    .filter((chunk) => Number.isFinite(chunk.score) && chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, limit));
}

/**
 * Keeps retrieved context below the upstream model's token-rate budget.  The
 * source label survives clipping so answers remain grounded and debuggable.
 */
export function buildRAGContext(
  chunks: Array<Pick<VectorChunk, "source" | "text">>,
  maxCharacters = MAX_RAG_CONTEXT_CHARACTERS,
): string {
  if (maxCharacters <= 0) return "";

  const lines: string[] = [];
  let remaining = maxCharacters;

  for (const chunk of chunks) {
    if (remaining <= 0) break;

    const text = chunk.text.trim();
    if (!text) continue;
    const clippedText = text.slice(0, MAX_CHUNK_CHARACTERS);
    const suffix = clippedText.length < text.length ? "…" : "";
    const line = `- [${chunk.source}] ${clippedText}${suffix}`;
    lines.push(line.slice(0, remaining));
    remaining -= line.length + 1;
  }

  return lines.join("\n");
}
