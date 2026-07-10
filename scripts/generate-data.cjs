/**
 * generate-data.js
 * Generates a full, internally-consistent fictional stadium dataset.
 * Run: node scripts/generate-data.js
 * Output: ./stadium-data/*.json
 */
const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "stadium-data");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ---------- CONFIG: tune scale here ----------
const COUNTS = {
  gates: 12,
  stands: 40,
  foodCourts: 18,
  restaurantsPerCourt: 3, // ~54 restaurants
  itemsPerRestaurant: 7, // ~350+ menu items
  shops: 50,
  washrooms: 80,
  elevators: 20,
  escalators: 30,
  parkingLots: 10,
  zonesPerLot: 20, // 200 parking zones
  faqs: 250,
  players: 100,
  teams: 20,
  matches: 50,
  announcements: 100,
  emergencyProcedures: 300,
  cctvCameras: 1200,
  navigationPaths: 600,
};

// ---------- helpers ----------
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (n, len = 2) => String(n).padStart(len, "0");
const save = (name, data) => {
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2));
  console.log(`✓ ${name} (${Array.isArray(data) ? data.length : Object.keys(data).length} records)`);
};

const ZONES = ["North", "South", "East", "West"];
const FOOD_TYPES = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Fast Food", "Beverages", "Desserts"];
const CUISINES = ["Indian", "Mexican", "Italian", "Chinese", "Continental", "American", "Middle Eastern"];
const MENU_NAMES = [
  "Paneer Tikka Wrap", "Chicken Burger", "Veggie Nachos", "Cold Coffee", "Masala Fries",
  "Margherita Pizza Slice", "Falafel Bowl", "Butter Chicken Roll", "Cheese Sandwich",
  "Fresh Lime Soda", "Choco Lava Cake", "Grilled Corn", "Veg Momos", "Chicken Momos",
  "Pav Bhaji", "Cold Drink", "Popcorn Tub", "Nachos with Salsa", "Hot Dog", "Ice Cream Cup",
];
const SHOP_TYPES = ["Merchandise", "Jersey Store", "Souvenir Kiosk", "Sportswear", "Fan Gear", "Bookstore"];
const FIRST_NAMES = ["Arjun", "Rohit", "Vikram", "Kabir", "Aditya", "Rahul", "Sameer", "Dev", "Ishaan", "Neel",
  "Marco", "Liam", "Noah", "Ethan", "Lucas", "Diego", "Carlos", "Andre", "Jamal", "Omar"];
const LAST_NAMES = ["Sharma", "Verma", "Khan", "Patel", "Singh", "Mehta", "Rao", "Gupta", "Silva", "Costa",
  "Fernandez", "Johnson", "Williams", "Brown", "Clarke", "Rodriguez", "Hussain", "Iyer", "Nair", "Reddy"];
const TEAM_CITIES = ["Mumbai", "Delhi", "Chennai", "Bengaluru", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Guwahati", "Indore", "Chandigarh", "Ranchi", "Nagpur", "Kochi", "Surat", "Bhopal",
  "Patna", "Vizag"];
const POSITIONS = ["Batsman", "Bowler", "All-Rounder", "Wicketkeeper", "Forward", "Midfielder", "Defender", "Goalkeeper"];

// ---------- 1. stadium.json ----------
const stadium = {
  id: "STD001",
  name: "Arena Intelligence Stadium",
  city: "Mumbai",
  capacity: 52000,
  opened: 2014,
  surface: "Hybrid grass",
  facilities: {
    vipLounges: 4,
    kidsPlayArea: true,
    prayerRoom: true,
    babyCareRoom: true,
    wifiZones: 22,
    chargingStations: 45,
    metroConnection: "Arena Metro Station (Line 3), 400m from Gate 1",
    shuttleBuses: ["Shuttle A: City Center - Gate 1", "Shuttle B: North Parking - Gate 7"],
  },
};
save("stadium.json", stadium);

// ---------- 2. gates.json ----------
const gates = [];
for (let i = 1; i <= COUNTS.gates; i++) {
  gates.push({
    id: `G${i}`,
    name: `Gate ${i}`,
    zone: ZONES[i % 4],
    entryType: i % 3 === 0 ? "VIP/Premium" : "General",
    crowdLevel: rand(["Low", "Moderate", "High"]),
    nearestParkingLot: `P${((i - 1) % COUNTS.parkingLots) + 1}`,
    accessible: true,
  });
}
save("gates.json", gates);

// ---------- 3. stands.json ----------
const stands = [];
for (let i = 1; i <= COUNTS.stands; i++) {
  const gate = gates[i % gates.length];
  stands.push({
    id: `ST${pad(i, 3)}`,
    name: `Stand ${String.fromCharCode(65 + (i % 26))}${Math.ceil(i / 26)}`,
    zone: gate.zone,
    nearestGate: gate.id,
    tier: rand(["Lower Tier", "Upper Tier", "Premium", "VIP"]),
    capacity: randInt(800, 2200),
    seatRows: randInt(20, 45),
  });
}
save("stands.json", stands);

// ---------- 4. food_courts.json, restaurants.json, menu.json ----------
const foodCourts = [];
const restaurants = [];
const menu = [];
let restId = 1;
let menuId = 1;
const FC_NAMES = ["Alpha", "Beta", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
  "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo"];
for (let i = 0; i < COUNTS.foodCourts; i++) {
  const gate = gates[i % gates.length];
  const fcId = `FC${pad(i + 1, 2)}`;
  foodCourts.push({
    id: fcId,
    name: `Food Court ${FC_NAMES[i % FC_NAMES.length]}`,
    nearestGate: gate.id,
    zone: gate.zone,
    seatingCapacity: randInt(80, 200),
    queueLength: randInt(0, 30),
    waitTimeMinutes: randInt(1, 15),
  });
  for (let r = 0; r < COUNTS.restaurantsPerCourt; r++) {
    const rId = `R${pad(restId, 3)}`;
    const cuisine = rand(CUISINES);
    restaurants.push({
      id: rId,
      name: `${cuisine} ${rand(["Corner", "House", "Kitchen", "Express", "Grill"])}`,
      foodCourtId: fcId,
      cuisine,
      dietaryOptions: [rand(FOOD_TYPES), rand(FOOD_TYPES)],
      priceRange: rand(["$", "$$", "$$$"]),
    });
    for (let m = 0; m < COUNTS.itemsPerRestaurant; m++) {
      menu.push({
        id: `M${pad(menuId, 4)}`,
        restaurantId: rId,
        name: rand(MENU_NAMES),
        type: rand(FOOD_TYPES),
        price: randInt(80, 450),
        available: Math.random() > 0.05,
      });
      menuId++;
    }
    restId++;
  }
}
save("food_courts.json", foodCourts);
save("restaurants.json", restaurants);
save("menu.json", menu);

// ---------- 5. parking.json ----------
const parking = [];
for (let lot = 1; lot <= COUNTS.parkingLots; lot++) {
  const gate = gates[(lot - 1) % gates.length];
  for (let z = 1; z <= COUNTS.zonesPerLot; z++) {
    const capacity = randInt(80, 150);
    parking.push({
      id: `P${lot}-Z${pad(z, 2)}`,
      lot: `P${lot}`,
      nearestGate: gate.id,
      type: lot <= 2 ? "VIP" : "General",
      capacity,
      availableSlots: randInt(0, capacity),
    });
  }
}
save("parking.json", parking);

// ---------- 6. washrooms.json ----------
const washrooms = [];
for (let i = 1; i <= COUNTS.washrooms; i++) {
  const stand = stands[i % stands.length];
  washrooms.push({
    id: `W${pad(i, 2)}`,
    nearestStand: stand.id,
    zone: stand.zone,
    type: rand(["Male", "Female", "Unisex/Accessible"]),
    stalls: randInt(4, 12),
    occupancyPercent: randInt(5, 95),
    babyCareAvailable: i % 10 === 0,
  });
}
save("washrooms.json", washrooms);

// ---------- 7. medical.json ----------
const medical = [];
for (let i = 1; i <= 8; i++) {
  medical.push({
    id: `MED${i}`,
    name: `Medical Center ${i}`,
    zone: ZONES[i % 4],
    nearestGate: gates[(i * 3) % gates.length].id,
    staffOnDuty: randInt(2, 6),
    services: ["First Aid", "Ambulance Standby", "Defibrillator", "Wheelchair Assistance"],
  });
}
save("medical.json", medical);

// ---------- 8. emergency.json ----------
const emergency = [];
const EMERGENCY_TYPES = ["Fire", "Medical", "Crowd Crush", "Structural", "Severe Weather", "Security Threat", "Power Outage"];
for (let i = 1; i <= COUNTS.emergencyProcedures; i++) {
  const type = rand(EMERGENCY_TYPES);
  emergency.push({
    id: `EP${pad(i, 3)}`,
    type,
    zone: rand(ZONES),
    procedure: `In case of ${type.toLowerCase()} near ${rand(ZONES)} zone: alert nearest steward, guide fans to nearest marked exit, do not use elevators, assemble at designated point.`,
    priority: rand(["Low", "Medium", "High", "Critical"]),
  });
}
save("emergency.json", emergency);

// ---------- 9. shops.json ----------
const shops = [];
for (let i = 1; i <= COUNTS.shops; i++) {
  const gate = gates[i % gates.length];
  shops.push({
    id: `SHOP${pad(i, 2)}`,
    name: `${rand(SHOP_TYPES)} ${i}`,
    type: rand(SHOP_TYPES),
    nearestGate: gate.id,
    zone: gate.zone,
    openNow: Math.random() > 0.1,
  });
}
save("shops.json", shops);

// ---------- 10. teams.json ----------
const teams = [];
for (let i = 1; i <= COUNTS.teams; i++) {
  teams.push({
    id: `TM${pad(i, 2)}`,
    name: `${TEAM_CITIES[i % TEAM_CITIES.length]} ${rand(["Warriors", "Titans", "Kings", "Strikers", "Panthers", "Riders"])}`,
    city: TEAM_CITIES[i % TEAM_CITIES.length],
    founded: randInt(1998, 2020),
    homeGround: i % 3 === 0 ? "Arena Intelligence Stadium" : `${TEAM_CITIES[i % TEAM_CITIES.length]} Stadium`,
  });
}
save("teams.json", teams);

// ---------- 11. players.json ----------
const players = [];
for (let i = 1; i <= COUNTS.players; i++) {
  const team = teams[i % teams.length];
  players.push({
    id: `PL${pad(i, 3)}`,
    name: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
    teamId: team.id,
    position: rand(POSITIONS),
    jerseyNumber: randInt(1, 99),
    age: randInt(19, 38),
  });
}
save("players.json", players);

// ---------- 12. matches.json ----------
const matches = [];
for (let i = 1; i <= COUNTS.matches; i++) {
  const home = rand(teams);
  let away = rand(teams);
  while (away.id === home.id) away = rand(teams);
  const homeScore = randInt(0, 5);
  const awayScore = randInt(0, 5);
  matches.push({
    id: `MTC${pad(i, 3)}`,
    homeTeam: home.name,
    awayTeam: away.name,
    date: `202${randInt(2, 6)}-${pad(randInt(1, 12))}-${pad(randInt(1, 28))}`,
    venue: "Arena Intelligence Stadium",
    result: `${home.name} ${homeScore} - ${awayScore} ${away.name}`,
    attendance: randInt(30000, 52000),
  });
}
save("matches.json", matches);

// ---------- 13. events.json ----------
const events = [];
for (let i = 1; i <= 15; i++) {
  events.push({
    id: `EV${pad(i, 2)}`,
    name: rand(["Championship Final", "Fan Fest", "Concert Night", "Youth Tournament", "Charity Match"]),
    date: `2026-${pad(randInt(7, 12))}-${pad(randInt(1, 28))}`,
    gatesOpen: "5:00 PM",
    expectedAttendance: randInt(20000, 52000),
  });
}
save("events.json", events);

// ---------- 14. navigation.json ----------
const navigation = [];
for (let i = 1; i <= COUNTS.navigationPaths; i++) {
  const from = rand(gates).id;
  let toStand = rand(stands).id;
  navigation.push({
    id: `NAV${pad(i, 3)}`,
    from,
    to: toStand,
    distanceMeters: randInt(30, 400),
    estimatedWalkMinutes: randInt(1, 8),
    accessibleRoute: Math.random() > 0.2,
  });
}
save("navigation.json", navigation);

// ---------- 15. faqs.json ----------
const FAQ_TEMPLATES = [
  ["Can I bring outside food into the stadium?", "Outside food and beverages are not permitted. Food courts inside offer a wide range of options."],
  ["Is re-entry allowed if I leave the stadium?", "Re-entry is not allowed once you exit through any gate."],
  ["Are pets allowed?", "Pets are not allowed, except certified service animals."],
  ["What time do gates open?", "Gates typically open 2 hours before the scheduled event start time."],
  ["Is parking free?", "General parking has standard rates; VIP lots require a prepaid pass."],
  ["Can I bring a professional camera?", "Professional cameras with detachable lenses require a media pass."],
  ["Is there Wi-Fi in the stadium?", "Free Wi-Fi is available in designated zones near concourses and food courts."],
  ["Where is the lost and found?", "Lost and found is located at the Guest Services desk near Gate 1."],
];
const faqs = [];
for (let i = 1; i <= COUNTS.faqs; i++) {
  const [q, a] = FAQ_TEMPLATES[i % FAQ_TEMPLATES.length];
  faqs.push({ id: `FAQ${pad(i, 3)}`, question: q, answer: a, category: rand(["General", "Tickets", "Food", "Parking", "Accessibility", "Security"]) });
}
save("faqs.json", faqs);

// ---------- 16. announcements.json ----------
const announcements = [];
for (let i = 1; i <= COUNTS.announcements; i++) {
  announcements.push({
    id: `ANN${pad(i, 3)}`,
    message: rand([
      "Kickoff delayed by 15 minutes due to weather.",
      "Free water refill stations now open near all food courts.",
      "Gate 4 experiencing heavy inflow, please use Gate 5 or 6.",
      "Half-time entertainment begins in 5 minutes on the main screen.",
      "Lost child reported near Stand C3, please contact nearest steward.",
    ]),
    timestamp: new Date(Date.now() - randInt(0, 7200) * 1000).toISOString(),
    priority: rand(["Info", "Warning", "Urgent"]),
  });
}
save("announcements.json", announcements);

// ---------- 17. accessibility.json ----------
const accessibility = {
  wheelchairEntrances: gates.filter((g) => g.accessible).map((g) => g.id),
  accessibleWashrooms: washrooms.filter((w) => w.type === "Unisex/Accessible").map((w) => w.id),
  elevators: Array.from({ length: COUNTS.elevators }, (_, i) => ({
    id: `EL${pad(i + 1, 2)}`,
    zone: rand(ZONES),
    status: Math.random() > 0.05 ? "Operational" : "Under Maintenance",
  })),
  escalators: Array.from({ length: COUNTS.escalators }, (_, i) => ({
    id: `ESC${pad(i + 1, 2)}`,
    zone: rand(ZONES),
    status: Math.random() > 0.05 ? "Operational" : "Under Maintenance",
  })),
  sensoryRoom: { available: true, location: "Near Gate 3, Level 1" },
  signLanguageInterpreters: "Available on request at Guest Services, 48hr advance notice preferred",
};
save("accessibility.json", accessibility);

// ---------- 18. ticketing.json ----------
const ticketing = {
  tiers: [
    { name: "General", priceRange: "₹500-₹1200" },
    { name: "Premium", priceRange: "₹1500-₹3000" },
    { name: "VIP Lounge", priceRange: "₹5000-₹12000" },
  ],
  refundPolicy: "Refunds available up to 48 hours before event, minus 10% processing fee.",
  transferPolicy: "Tickets can be transferred once via the official app.",
  childPolicy: "Children under 3 enter free without a separate seat.",
};
save("ticketing.json", ticketing);

// ---------- 19. security.json ----------
const cctv = Array.from({ length: COUNTS.cctvCameras }, (_, i) => ({
  id: `CAM${pad(i + 1, 4)}`,
  zone: ZONES[i % 4],
  status: Math.random() > 0.02 ? "Active" : "Offline",
}));
const security = {
  cctvCameraCount: COUNTS.cctvCameras,
  cctvSample: cctv.slice(0, 20), // full 1200 stored, sample shown for readability
  staffOnDuty: randInt(300, 400),
  bagPolicy: "Bags larger than A4 size are not permitted. All bags subject to search at entry.",
  prohibitedItems: ["Weapons", "Fireworks", "Laser pointers", "Glass bottles", "Drones"],
};
fs.writeFileSync(path.join(OUT_DIR, "security.json"), JSON.stringify({ ...security, cctvAll: cctv }, null, 2));
console.log(`✓ security.json (${COUNTS.cctvCameras} cameras + staff/policy data)`);

// ---------- 20. rules.json ----------
const rules = [
  "No smoking anywhere inside the stadium premises.",
  "Alcohol is served only at licensed counters to guests above 21.",
  "Standing on seats or blocking aisles is prohibited.",
  "Flags and banners must not obstruct other spectators' view.",
  "Unruly behavior may result in immediate ejection without refund.",
  "Photography is allowed; flash photography is discouraged during play.",
];
save("rules.json", rules.map((r, i) => ({ id: `RULE${pad(i + 1, 2)}`, text: r })));

console.log("\nAll stadium-data files generated in:", OUT_DIR);
