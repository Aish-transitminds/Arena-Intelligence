export interface BusData {
  id: string;
  route: string;
  eta: number; // minutes
  status: "on-time" | "delayed" | "arriving";
  occupancy: number;
  lat: number;
  lng: number;
}

export let currentBuses: BusData[] = [];

export const setGlobalBuses = (buses: BusData[]) => {
  currentBuses = buses;
};
