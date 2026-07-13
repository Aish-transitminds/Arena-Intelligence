/**
 * src/lib/liveData.ts
 * Simulates "live" stadium data (queues, occupancy, parking) so demos feel real
 * without a real IoT feed. Static data (from stadium-data/*.json) stays in the
 * vector index; THIS data is looked up fresh on every request.
 */
import foodCourtsData from "../../stadium-data/food_courts.json";
import parkingData from "../../stadium-data/parking.json";
import washroomsData from "../../stadium-data/washrooms.json";
import gatesData from "../../stadium-data/gates.json";
import { currentBuses } from "./transportState";

function jitter(value: number, min: number, max: number) {
  const delta = Math.round((Math.random() - 0.5) * (max - min) * 0.2);
  return Math.max(min, Math.min(max, value + delta));
}

// Returns freshly-jittered live values for food courts, parking, and washrooms.
export function getLiveSnapshot() {
  const foodCourts = foodCourtsData;
  const parking = parkingData;
  const washrooms = washroomsData;
  const gates = gatesData;

  return {
    foodCourts: foodCourts.map((fc: any) => ({
      id: fc.id,
      name: fc.name,
      queueLength: jitter(fc.queueLength, 0, 40),
      waitTimeMinutes: jitter(fc.waitTimeMinutes, 1, 20),
    })),
    parking: parking.map((p: any) => ({
      id: p.id,
      lot: p.lot,
      availableSlots: jitter(p.availableSlots, 0, p.capacity),
    })),
    washrooms: washrooms.map((w: any) => ({
      id: w.id,
      occupancyPercent: jitter(w.occupancyPercent, 0, 100),
    })),
    gates: gates.map((g: any) => ({
      id: g.id,
      crowdLevel: Math.random() > 0.85 ? (["Low", "Moderate", "High"])[Math.floor(Math.random() * 3)] : g.crowdLevel,
    })),
    buses: currentBuses.map((b) => ({
      id: b.id,
      route: b.route,
      eta: b.eta,
      status: b.status,
      occupancy: b.occupancy,
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
export function getRelevantLiveData(query: string, snapshot: any) {
  const q = query.toLowerCase();
  const wantsFood = /food|eat|restaurant|court|hungry|snack/.test(q);
  const wantsParking = /park|car|vehicle|slot/.test(q);
  const wantsWashroom = /washroom|restroom|toilet|bathroom/.test(q);
  const wantsGate = /gate|crowd|entry|entrance/.test(q);
  const wantsWeather = /weather|rain|temperature|hot|cold/.test(q);
  const wantsBus = /bus|transport|transit|majestic|silk board|shivajinagar|koramangala|indiranagar|route|eta/.test(q);

  const out: any = {};
  if (wantsFood) out.foodCourts = snapshot.foodCourts;
  if (wantsParking) out.parking = snapshot.parking;
  if (wantsWashroom) out.washrooms = snapshot.washrooms;
  if (wantsGate) out.gates = snapshot.gates;
  if (wantsWeather) out.weather = snapshot.weather;
  if (wantsBus) out.buses = snapshot.buses;

  return out;
}
