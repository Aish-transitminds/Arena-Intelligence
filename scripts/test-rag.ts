import { askGeminiRAG } from "../src/actions/chat.server";

async function testRAG() {
  const questions = [
    "Where can I get vegetarian food and what is the wait time?",
    "What is the crowd level at Gate 3 and where should I park?",
    "There is a fire near the North stands, what should I do?"
  ];

  for (const q of questions) {
    console.log(`\n\n--- Testing Question: "${q}" ---`);
    try {
      const response = await askGeminiRAG({
        data: {
          message: q,
          personaContext: "You are talking to a Fan.",
          lang: "English"
        }
      });
      console.log("Response:", response.answer);
      console.log("Sources Retained:", response.sources?.length);
      console.log("Sources:", response.sources);
    } catch (e) {
      console.error("Error:", e);
    }
  }
}

testRAG();
