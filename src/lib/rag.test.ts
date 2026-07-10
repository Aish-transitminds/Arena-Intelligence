import { describe, expect, it } from "vitest";
import { buildRAGContext, cosineSimilarity, retrieveTopChunks, validateRAGRequest } from "./rag";

describe("RAG helpers", () => {
  it("validates and normalizes chat requests", () => {
    expect(validateRAGRequest({ message: "  Where is Gate 1?  " })).toEqual({
      message: "Where is Gate 1?",
      personaContext: "",
      lang: "English",
    });
    expect(() => validateRAGRequest({ message: "" })).toThrow("Missing 'message'");
    expect(() => validateRAGRequest({ message: "x".repeat(1001) })).toThrow("1000 characters");
  });

  it("handles incompatible and zero vectors safely", () => {
    expect(cosineSimilarity([1, 0], [1])).toBe(0);
    expect(cosineSimilarity([0, 0], [1, 0])).toBe(0);
  });

  it("returns only useful chunks in descending similarity order", () => {
    const chunks = [
      { id: "best", source: "gates.json", text: "Gate 1", vector: [1, 0] },
      { id: "other", source: "parking.json", text: "Lot A", vector: [0.4, 0.6] },
      { id: "opposite", source: "rules.json", text: "Rules", vector: [-1, 0] },
    ];

    expect(retrieveTopChunks([1, 0], chunks, 2).map(({ id }) => id)).toEqual(["best", "other"]);
  });

  it("caps and labels RAG context before it is sent to a model", () => {
    const context = buildRAGContext(
      [
        { source: "gates.json", text: "Gate details".repeat(300) },
        { source: "parking.json", text: "Parking details".repeat(300) },
      ],
      2_000,
    );

    expect(context.length).toBeLessThanOrEqual(2_000);
    expect(context).toContain("[gates.json]");
    expect(context).toContain("…");
  });
});
