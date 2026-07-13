export interface BusData {
  id: string;
  route: string;
  eta: number; // minutes
  status: "on-time" | "delayed" | "arriving";
  occupancy: number;
  lat: number;
  lng: number;
}

export let currentBuses: BusData[] = [
  { id: "BMTC-402", route: "Majestic → Gate 1", eta: 2, status: "on-time", occupancy: 85, lat: 12.9810, lng: 77.5996 },
  { id: "BMTC-119", route: "Silk Board → Gate 3", eta: 1, status: "arriving", occupancy: 95, lat: 12.9760, lng: 77.5996 },
  { id: "BMTC-774", route: "Shivajinagar → Gate 2", eta: 3, status: "delayed", occupancy: 40, lat: 12.9788, lng: 77.6030 },
];

export const setGlobalBuses = (buses: BusData[]) => {
  currentBuses = buses;
};
