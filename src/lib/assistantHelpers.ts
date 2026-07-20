import { type TicketItem } from "./bookingStore";
import washroomsData from "../../stadium-data/washrooms.json";

export type WashroomInfo = {
  id: string;
  nearestStand: string;
  zone: string;
  type: string;
  stalls: number;
  occupancyPercent: number;
  babyCareAvailable: boolean;
};

const GATE_ZONE_MAP: Record<string, string> = {
  A: "East",
  B: "West",
  C: "North",
  D: "South",
};

function parseGateLabel(venue: string): string | null {
  const match = venue.match(/Gate\s*([A-Za-z0-9]+)/i);
  return match?.[1]?.toUpperCase() ?? null;
}

function zoneForTicket(ticket: TicketItem): string {
  const gateLabel = parseGateLabel(ticket.venue);
  if (gateLabel && GATE_ZONE_MAP[gateLabel]) {
    return GATE_ZONE_MAP[gateLabel];
  }

  const sectionNumber = Number(ticket.section.replace(/\D/g, ""));
  if (!Number.isNaN(sectionNumber)) {
    if (sectionNumber >= 100 && sectionNumber < 150) return "East";
    if (sectionNumber >= 150 && sectionNumber < 200) return "South";
    if (sectionNumber >= 200 && sectionNumber < 250) return "West";
    return "North";
  }

  return "East";
}

function findNearestWashrooms(zone: string): WashroomInfo[] {
  return (washroomsData as any[])
    .filter((w) => String(w.zone).toLowerCase() === zone.toLowerCase())
    .map((w) => ({
      id: String(w.id),
      nearestStand: String(w.nearestStand),
      zone: String(w.zone),
      type: String(w.type),
      stalls: Number(w.stalls ?? 0),
      occupancyPercent: Number(w.occupancyPercent ?? 0),
      babyCareAvailable: Boolean(w.babyCareAvailable),
    }));
}

export function getNearestWashroomForTicket(ticket: TicketItem): WashroomInfo {
  const desiredZone = zoneForTicket(ticket);
  const candidates = findNearestWashrooms(desiredZone);
  const fallback = (washroomsData as any[]).map((w) => ({
    id: String(w.id),
    nearestStand: String(w.nearestStand),
    zone: String(w.zone),
    type: String(w.type),
    stalls: Number(w.stalls ?? 0),
    occupancyPercent: Number(w.occupancyPercent ?? 0),
    babyCareAvailable: Boolean(w.babyCareAvailable),
  }));

  const source = candidates.length > 0 ? candidates : fallback;
  return source.reduce((best, current) => {
    if (current.occupancyPercent < best.occupancyPercent) return current;
    if (current.occupancyPercent === best.occupancyPercent && current.stalls > best.stalls) return current;
    return best;
  }, source[0]);
}

export function buildTicketResponse(
  question: string,
  tickets: TicketItem[],
): { text: string; renderTicket: boolean; renderMap: boolean; ticket?: TicketItem; washroom?: WashroomInfo } | null {
  const lowerQuestion = question.toLowerCase();
  const isTicketQuery = /(ticket|booking|pass|seat|my ticket|my seat|booking id|booked|show my tickets|ticket details|ticket status)/i.test(question);
  const wantsWashroom = /(washroom|restroom|bathroom|closest restroom|nearest restroom|closest washroom|nearest washroom|toilet|restroom)/i.test(question);
  const wantsMap = /(map|direction|navigate|route|way to)/i.test(question);

  if (!isTicketQuery && !wantsWashroom) {
    return null;
  }

  if (tickets.length === 0) {
    return {
      text: "I could not find any booked tickets for your account. Please make sure you are signed in and have a ticket booked before asking for seat or restroom directions.",
      renderTicket: false,
      renderMap: false,
    };
  }

  const bookedTickets = tickets.filter((ticket) => ticket.status !== "used");
  const primaryTicket = bookedTickets.length > 0 ? bookedTickets[0] : tickets[0];
  const activeCount = bookedTickets.length;
  const ticketSummary = `Your booked ticket is for ${primaryTicket.event} on ${primaryTicket.date} at ${primaryTicket.venue}. Your seat is Section ${primaryTicket.section}, Row ${primaryTicket.row}, Seat ${primaryTicket.seat}.`;
  const spendSummary = activeCount > 1 ? ` You have ${activeCount} active/upcoming bookings in your account.` : "";

  let text = ticketSummary + spendSummary;
  let renderTicket = true;
  let renderMap = wantsMap || wantsWashroom;
  let washroom;

  if (wantsWashroom) {
    washroom = getNearestWashroomForTicket(primaryTicket);
    text += ` The nearest restroom from your seat is ${washroom.id} (${washroom.type}) near ${washroom.nearestStand} in the ${washroom.zone} zone. It currently has about ${washroom.occupancyPercent}% occupancy and ${washroom.stalls} stalls.`;
    if (washroom.babyCareAvailable) {
      text += " Baby care facilities are available there.";
    }
  }

  if (isTicketQuery && !wantsWashroom) {
    if (/where|how|direction|nearest/.test(lowerQuestion)) {
      const nearestWashroom = getNearestWashroomForTicket(primaryTicket);
      text += ` For restrooms, head to ${nearestWashroom.id} in the ${nearestWashroom.zone} zone near ${nearestWashroom.nearestStand}.`;
      washroom = nearestWashroom;
      renderMap = true;
    }
  }

  return {
    text,
    renderTicket,
    renderMap,
    ticket: primaryTicket,
    washroom,
  };
}
