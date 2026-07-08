export const crowdData = [
  { time: "12:00", crowd: 1200, predicted: 1400 },
  { time: "13:00", crowd: 2800, predicted: 3000 },
  { time: "14:00", crowd: 5400, predicted: 5200 },
  { time: "15:00", crowd: 8900, predicted: 9200 },
  { time: "16:00", crowd: 14200, predicted: 14000 },
  { time: "17:00", crowd: 18500, predicted: 18800 },
  { time: "18:00", crowd: 22400, predicted: 22000 },
  { time: "19:00", crowd: 24800, predicted: 25000 },
  { time: "20:00", crowd: 25200, predicted: 25400 },
];

export const queueData = [
  { gate: "Gate A", wait: 4, capacity: 85 },
  { gate: "Gate B", wait: 12, capacity: 95 },
  { gate: "Gate C", wait: 2, capacity: 45 },
  { gate: "Gate D", wait: 8, capacity: 72 },
  { gate: "Gate E", wait: 15, capacity: 98 },
  { gate: "Gate F", wait: 6, capacity: 60 },
];

export const revenueData = [
  { day: "Mon", tickets: 42000, concessions: 18000, merch: 9500 },
  { day: "Tue", tickets: 38000, concessions: 15500, merch: 8200 },
  { day: "Wed", tickets: 51000, concessions: 22000, merch: 11500 },
  { day: "Thu", tickets: 48000, concessions: 21000, merch: 10200 },
  { day: "Fri", tickets: 72000, concessions: 34000, merch: 16500 },
  { day: "Sat", tickets: 98000, concessions: 45000, merch: 22000 },
  { day: "Sun", tickets: 89000, concessions: 41000, merch: 19500 },
];

export const fixtures = [
  { id: 1, home: "Titans FC", away: "Nova Rangers", date: "Jul 12", time: "19:00", venue: "Arena One", status: "Upcoming" },
  { id: 2, home: "Phoenix United", away: "Storm City", date: "Jul 13", time: "17:30", venue: "Arena Two", status: "Upcoming" },
  { id: 3, home: "Iron Wolves", away: "Solar Knights", date: "Jul 14", time: "20:00", venue: "Arena One", status: "Upcoming" },
  { id: 4, home: "Titans FC", away: "Phoenix United", date: "Jul 08", time: "19:00", venue: "Arena One", status: "Live", homeScore: 2, awayScore: 1 },
  { id: 5, home: "Nova Rangers", away: "Iron Wolves", date: "Jul 05", time: "19:00", venue: "Arena Two", status: "Final", homeScore: 3, awayScore: 3 },
];

export const leaderboard = [
  { rank: 1, team: "Titans FC", played: 12, won: 10, drawn: 1, lost: 1, points: 31 },
  { rank: 2, team: "Phoenix United", played: 12, won: 8, drawn: 3, lost: 1, points: 27 },
  { rank: 3, team: "Nova Rangers", played: 12, won: 7, drawn: 2, lost: 3, points: 23 },
  { rank: 4, team: "Iron Wolves", played: 12, won: 6, drawn: 2, lost: 4, points: 20 },
  { rank: 5, team: "Storm City", played: 12, won: 5, drawn: 3, lost: 4, points: 18 },
  { rank: 6, team: "Solar Knights", played: 12, won: 3, drawn: 2, lost: 7, points: 11 },
];

export const notifications = [
  { id: 1, type: "info", title: "Gate B experiencing delays", time: "2m ago" },
  { id: 2, type: "success", title: "Your seat upgrade was approved", time: "18m ago" },
  { id: 3, type: "warning", title: "Weather advisory: light rain at 20:00", time: "1h ago" },
];

export const alerts = [
  { id: 1, level: "critical", zone: "Section 204", message: "Density threshold exceeded", time: "just now" },
  { id: 2, level: "warning", zone: "Gate E", message: "Wait time > 15 minutes", time: "3m ago" },
  { id: 3, level: "info", zone: "Concession B", message: "Restock needed within 20m", time: "12m ago" },
];
