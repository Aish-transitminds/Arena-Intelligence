/**
 * lib/liveData.js
 * Simulates "live" stadium data (queues, occupancy, parking) so demos feel real
 * without a real IoT feed. Static data (from stadium-data/*.json) stays in the
 * vector index; THIS data is looked up fresh on every request.
 *
 * In production, replace `readBase()` with real sensor/API data (Vercel KV,
 * Supabase, a websocket feed, etc). Keep the shape the same and the rest of
 * the RAG pipeline doesn't need to change.
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "stadium-data");

function jitter(value, min, max) {
  const delta = Math.round((Math.random() - 0.5) * (max - min) * 0.2);
  return Math.max(min, Math.min(max, value + delta));
}

// Returns freshly-jittered live values for food courts, parking, and washrooms.
function getLiveSnapshot() {
  const foodCourts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "food_courts.json"), "utf-8"));
  const parking = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "parking.json"), "utf-8"));
  const washrooms = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "washrooms.json"), "utf-8"));
  const gates = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "gates.json"), "utf-8"));

  return {
    foodCourts: foodCourts.map((fc) => ({
      id: fc.id,
      name: fc.name,
      queueLength: jitter(fc.queueLength, 0, 40),
      waitTimeMinutes: jitter(fc.waitTimeMinutes, 1, 20),
    })),
    parking: parking.map((p) => ({
      id: p.id,
      lot: p.lot,
      availableSlots: jitter(p.availableSlots, 0, p.capacity),
    })),
    washrooms: washrooms.map((w) => ({
      id: w.id,
      occupancyPercent: jitter(w.occupancyPercent, 0, 100),
    })),
    gates: gates.map((g) => ({
      id: g.id,
      crowdLevel: Math.random() > 0.85 ? (["Low", "Moderate", "High"])[Math.floor(Math.random() * 3)] : g.crowdLevel,
    })),
    weather: {
      temperatureC: jitter(28, 20, 38),
      rainProbability: jitter(15, 0, 60),
    },
    timestamp: new Date().toISOString(),
  };
}

// Pulls out only the live entries relevant to a query, matched by simple
// keyword overlap against name/id fields. Cheap, no embeddings needed since
// this data is small and re-fetched every call anyway.
function getRelevantLiveData(query, snapshot) {
  const q = query.toLowerCase();
  const wantsFood = /food|eat|restaurant|court|hungry|snack/.test(q);
  const wantsParking = /park|car|vehicle|slot/.test(q);
  const wantsWashroom = /washroom|restroom|toilet|bathroom/.test(q);
  const wantsGate = /gate|crowd|entry|entrance/.test(q);
  const wantsWeather = /weather|rain|temperature|hot|cold/.test(q);

  const out = {};
  if (wantsFood) out.foodCourts = snapshot.foodCourts;
  if (wantsParking) out.parking = snapshot.parking;
  if (wantsWashroom) out.washrooms = snapshot.washrooms;
  if (wantsGate) out.gates = snapshot.gates;
  if (wantsWeather) out.weather = snapshot.weather;

  return out;
}

module.exports = { getLiveSnapshot, getRelevantLiveData };
