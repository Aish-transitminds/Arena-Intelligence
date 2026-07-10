/**
 * build-index.js
 * Reads stadium-data/*.json, converts records into natural-language chunks,
 * embeds each chunk with Gemini's embedding model, and saves a local vector index.
 *
 * This uses a flat JSON file as the vector store — perfect for a hackathon/demo.
 * For production, swap `saveIndex`/`loadIndex` for Pinecone, Supabase pgvector, etc.
 *
 * Requires: GEMINI_API_KEY in your environment
 * Run: node scripts/build-index.js
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "stadium-data");
const OUT_FILE = path.join(DATA_DIR, "vector-index.json");
const API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = "gemini-embedding-2";

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

// ---------- Turn each JSON record into a plain-English sentence ----------
// This is the most important step for RAG quality: the LLM only ever sees
// these sentences, never the raw JSON, so make each one self-contained.
function recordToText(fileName, record) {
  switch (fileName) {
    case "gates.json":
      return `Gate ${record.name} (${record.id}) is in the ${record.zone} zone, entry type ${record.entryType}, current crowd level: ${record.crowdLevel}. Nearest parking lot: ${record.nearestParkingLot}.`;
    case "stands.json":
      return `Stand ${record.name} (${record.id}) is a ${record.tier} stand in the ${record.zone} zone near ${record.nearestGate}, capacity ${record.capacity} seats.`;
    case "food_courts.json":
      return `${record.name} (${record.id}) is near ${record.nearestGate} in the ${record.zone} zone. Seating capacity ${record.seatingCapacity}. Current queue: ${record.queueLength} people, estimated wait ${record.waitTimeMinutes} minutes.`;
    case "restaurants.json":
      return `${record.name} (${record.id}) is located in food court ${record.foodCourtId}, serves ${record.cuisine} cuisine with options for ${record.dietaryOptions.join(" and ")}, price range ${record.priceRange}.`;
    case "menu.json":
      return `${record.name} is a ${record.type} menu item at restaurant ${record.restaurantId}, priced ₹${record.price}. Currently ${record.available ? "available" : "sold out"}.`;
    case "parking.json":
      return `Parking zone ${record.id} in lot ${record.lot} is ${record.type} parking near ${record.nearestGate}, capacity ${record.capacity}, currently ${record.availableSlots} slots available.`;
    case "washrooms.json":
      return `Washroom ${record.id} is a ${record.type} washroom near stand ${record.nearestStand} in the ${record.zone} zone, ${record.stalls} stalls, currently ${record.occupancyPercent}% occupied.${record.babyCareAvailable ? " Baby care station available." : ""}`;
    case "medical.json":
      return `${record.name} (${record.id}) is in the ${record.zone} zone near ${record.nearestGate}, staffed by ${record.staffOnDuty} people. Services: ${record.services.join(", ")}.`;
    case "emergency.json":
      return `Emergency procedure ${record.id} for ${record.type} incidents in the ${record.zone} zone (priority: ${record.priority}): ${record.procedure}`;
    case "shops.json":
      return `${record.name} (${record.id}) is a ${record.type} shop near ${record.nearestGate} in the ${record.zone} zone. ${record.openNow ? "Currently open." : "Currently closed."}`;
    case "teams.json":
      return `${record.name} (${record.id}) is based in ${record.city}, founded in ${record.founded}. Home ground: ${record.homeGround}.`;
    case "players.json":
      return `${record.name} (${record.id}) plays as a ${record.position} for team ${record.teamId}, jersey number ${record.jerseyNumber}, age ${record.age}.`;
    case "matches.json":
      return `Match ${record.id} on ${record.date} at ${record.venue}: ${record.result}. Attendance: ${record.attendance}.`;
    case "events.json":
      return `${record.name} (${record.id}) is scheduled on ${record.date}, gates open at ${record.gatesOpen}, expected attendance ${record.expectedAttendance}.`;
    case "navigation.json":
      return `Route from ${record.from} to ${record.to}: ${record.distanceMeters} meters, about ${record.estimatedWalkMinutes} minutes walk.${record.accessibleRoute ? " Wheelchair accessible." : ""}`;
    case "faqs.json":
      return `Q: ${record.question} A: ${record.answer} (Category: ${record.category})`;
    case "announcements.json":
      return `Announcement (${record.priority}) at ${record.timestamp}: ${record.message}`;
    case "guest_services.json":
      return `Guest service ${record.name} (${record.id}) is ${record.location}. Hours: ${record.hours}. Services: ${record.services.join(", ")}.`;
    case "ticketing.json":
      return `Ticketing info: tiers are ${record.tiers.map((t) => `${t.name} (${t.priceRange})`).join(", ")}. Refund policy: ${record.refundPolicy} Transfer policy: ${record.transferPolicy}`;
    case "accessibility.json":
      return `Accessibility: wheelchair entrances at ${record.wheelchairEntrances.join(", ")}. Sensory room available at ${record.sensoryRoom.location}. ${record.signLanguageInterpreters}`;
    case "rules.json":
      return `Stadium rule (${record.id}): ${record.text}`;
    case "stadium.json":
      return `${record.name} in ${record.city} has a capacity of ${record.capacity}, opened in ${record.opened}. Facilities include ${record.facilities.vipLounges} VIP lounges, kids play area, prayer room, baby care room, ${record.facilities.wifiZones} Wi-Fi zones, and ${record.facilities.chargingStations} charging stations. Metro: ${record.facilities.metroConnection}.`;
    case "security.json":
      return `Security: ${record.cctvCameraCount} CCTV cameras stadium-wide, ${record.staffOnDuty} security staff on duty. Bag policy: ${record.bagPolicy} Prohibited items: ${record.prohibitedItems.join(", ")}.`;
    default:
      return JSON.stringify(record);
  }
}

// ---------- Gemini batch embedding call ----------
async function embedBatch(texts) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:batchEmbedContents?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: texts.map((text) => ({
          model: `models/${EMBED_MODEL}`,
          content: { parts: [{ text }] },
        })),
      }),
    },
  );
  if (!res.ok) throw new Error(`Embedding API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.embeddings.map((emb) => emb.values);
}

// ---------- Build the index ----------
async function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") && f !== "vector-index.json");
  const chunks = [];

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
    const records = Array.isArray(raw) ? raw : [raw];
    for (const record of records) {
      // skip the giant cctvAll array inside security.json, one summary sentence is enough
      if (file === "security.json") {
        chunks.push({ id: `security-summary`, source: file, text: recordToText(file, record) });
        continue;
      }
      chunks.push({
        id: record.id || `${file}-${chunks.length}`,
        source: file,
        text: recordToText(file, record),
      });
    }
  }

  console.log(
    `Prepared ${chunks.length} chunks. Embedding (this calls the API ${chunks.length} times)...`,
  );

  const indexed = [];
  const BATCH = 90;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await embedBatch(batch.map((c) => c.text));
    batch.forEach((c, j) => indexed.push({ ...c, vector: vectors[j] }));
    console.log(
      `  embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}. Waiting 60s for rate limit...`,
    );
    if (i + BATCH < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 62000));
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(indexed));
  console.log(`\n✓ Saved vector index with ${indexed.length} chunks to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
