import { describe, it, expect, vi } from 'vitest';
// We're mocking the server function for unit testing logic that would run on server
import { askGeminiRAG } from './chat.server';

// Mock dependencies
vi.mock('../lib/liveData', () => ({
  getLiveSnapshot: vi.fn(() => ({})),
  getRelevantLiveData: vi.fn(() => ({})),
}));

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(() => false), // simulate no vector index to simplify tests
    readFileSync: vi.fn(() => '[]'),
  }
}));

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    validator: () => ({
      handler: (fn: any) => fn
    })
  })
}));

// We'll mock the actual export to just test our error throws for validation
describe('chat.server - askGeminiRAG', () => {
  it('throws an error if message is missing', async () => {
    // @ts-expect-error simulating bad input
    await expect(askGeminiRAG({ data: { personaContext: 'staff', lang: 'en' } }))
      .rejects.toThrow("Missing 'message' in request");
  });

  // Note: the full tanstack serverFn cannot easily be fully executed in jsdom unit tests
  // without the actual Vite backend running, but we can verify our input validation
  // logic throws as expected.
});
