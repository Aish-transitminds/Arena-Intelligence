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
  { id: 1, home: "India", away: "Australia", date: "Jun 12", time: "19:00", venue: "Narendra Modi Stadium", status: "Upcoming" },
  { id: 2, home: "India", away: "Pakistan", date: "Jun 13", time: "17:30", venue: "Narendra Modi Stadium", status: "Upcoming" },
  { id: 3, home: "England", away: "Australia", date: "Jun 14", time: "20:00", venue: "Eden Gardens", status: "Upcoming" },
  { id: 4, home: "India", away: "England", date: "Jun 08", time: "19:00", venue: "Narendra Modi Stadium", status: "Live", homeScore: "2", awayScore: "1" },
  { id: 5, home: "Mumbai Indians", away: "Chennai Super Kings", date: "Jun 05", time: "19:00", venue: "Narendra Modi Stadium", status: "Final", homeScore: "3", awayScore: "0" },
];

export const leaderboard = [
  { rank: 1, team: "Argentina", played: 3, won: 3, drawn: 0, lost: 0, points: 9 },
  { rank: 2, team: "Germany", played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
  { rank: 3, team: "USA", played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
  { rank: 4, team: "Mexico", played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
  { rank: 5, team: "Brazil", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
  { rank: 6, team: "France", played: 3, won: 0, drawn: 1, lost: 2, points: 1 },
];

export const notifications = [
  { id: 1, type: "info", title: "Gate B experiencing delays", time: "2m ago" },
  { id: 2, type: "success", title: "Your seat upgrade was approved", time: "18m ago" },
  { id: 3, type: "warning", title: "Weather advisory: clear conditions forecast", time: "1h ago" },
];

export const alerts = [
  { id: 1, level: "critical", zone: "Section 204", message: "Density threshold exceeded", time: "just now" },
  { id: 2, level: "warning", zone: "Gate E", message: "Wait time > 15 minutes", time: "3m ago" },
  { id: 3, level: "info", zone: "Concession B", message: "Restock needed within 20m", time: "12m ago" },
];
