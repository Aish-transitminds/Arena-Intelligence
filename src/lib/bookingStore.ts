export interface TicketItem {
  id: string;
  event: string;
  date: string;
  time: string;
  venue: string;
  section: string;
  row: string;
  seat: string;
  price: number;
  status: "active" | "used" | "upcoming";
  qrCode: string;
  transferable: boolean;
  resalable: boolean;
  upgradeable: boolean;
  ownerName: string;
  ticketType: string;
  transactionId: string;
  purchaseDate: string;
  entryTime?: string;
  exitTime?: string;
  barcode: string;
}

const STORAGE_KEY = "arena-booking-history";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getBookedTickets(): TicketItem[] {
  const storage = getStorage();
  if (!storage) return [];
  const data = storage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function bookTicket(ticket: Omit<TicketItem, "id" | "transactionId" | "purchaseDate" | "qrCode" | "barcode" | "status" | "transferable" | "resalable" | "upgradeable" | "ownerName" | "ticketType">, quantity: number = 1): TicketItem[] {
  const storage = getStorage();
  if (!storage) return [];
  
  const currentTickets = getBookedTickets();
  const newTickets: TicketItem[] = [];

  for (let i = 0; i < quantity; i++) {
    const newId = `TKT-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}-${new Date().getFullYear()}`;
    const newTicket: TicketItem = {
      ...ticket,
      id: newId,
      transactionId: `TXN-${new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)}-${Math.floor(Math.random() * 1000)}`,
      purchaseDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      qrCode: `ARENA-TKT-${Math.random().toString(36).substring(7).toUpperCase()}`,
      barcode: "|||||||||||||||||||",
      status: "upcoming",
      transferable: true,
      resalable: true,
      upgradeable: true,
      ownerName: "Authenticated Fan", // Ideally fetched from auth state
      ticketType: "Standard Entry"
    };
    newTickets.push(newTicket);
  }

  const updatedTickets = [...currentTickets, ...newTickets];
  storage.setItem(STORAGE_KEY, JSON.stringify(updatedTickets));
  
  // Dispatch a custom event so UI can instantly update
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("arena-tickets-updated"));
  }
  
  return newTickets;
}

export function clearBookings(): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("arena-tickets-updated"));
  }
}
