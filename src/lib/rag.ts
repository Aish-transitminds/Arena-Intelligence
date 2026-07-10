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
};

export const DEFAULT_LANGUAGE = "English";
export const MAX_MESSAGE_LENGTH = 1_000;

export function validateRAGRequest(data: unknown): Required<RAGRequest> {
  if (!data || typeof data !== "object") {
    throw new Error("A chat request is required");
  }

  const { message, personaContext = "", lang = DEFAULT_LANGUAGE } = data as RAGRequest;
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
