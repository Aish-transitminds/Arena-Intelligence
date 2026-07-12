import { describe, it, expect, vi } from "vitest";
// We're mocking the server function for unit testing logic that would run on server
import { askGeminiRAG } from "./chat.server";

// Mock dependencies
vi.mock("../lib/liveData", () => ({
  getLiveSnapshot: vi.fn(() => ({})),
  getRelevantLiveData: vi.fn(() => ({})),
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    validator: () => ({
      handler: (fn: (args: { data: unknown }) => unknown) => fn,
    }),
  }),
}));

describe("chat.server - askGeminiRAG", () => {
  it("returns a safe error response if message is missing", async () => {
     simulating bad input
    await expect(
      askGeminiRAG({ data: { personaContext: "staff", lang: "en" } }),
    ).resolves.toMatchObject({ answer: expect.stringContaining("Missing 'message'"), sources: [] });
  });
});
