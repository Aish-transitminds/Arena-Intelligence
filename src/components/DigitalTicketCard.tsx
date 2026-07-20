import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { type TicketItem } from "../lib/bookingStore";
import { type WashroomInfo } from "../lib/assistantHelpers";

interface DigitalTicketCardProps {
  ticket?: TicketItem;
  washroom?: WashroomInfo;
}

export function DigitalTicketCard({ ticket, washroom }: DigitalTicketCardProps) {
  const displayTicket = ticket ?? {
    event: "Unknown Event",
    date: "TBD",
    time: "TBD",
    venue: "TBD",
    section: "--",
    row: "--",
    seat: "--",
    ticketType: "Standard",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 my-3"
    >
      <div className="bg-primary px-5 py-4 text-white">
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">ICC T20 World Cup 2026</div>
          <div className="px-2 py-1 bg-white/20 rounded-md text-[10px] font-bold tracking-widest backdrop-blur-md">{displayTicket.section}</div>
        </div>
        <h3 className="text-xl font-extrabold mt-2 leading-tight">{displayTicket.event}</h3>
        <p className="text-xs opacity-90 font-medium mt-1">{displayTicket.date} · {displayTicket.time}</p>
      </div>
      
      <div className="p-5 flex gap-4 items-center bg-slate-50 border-b border-slate-100">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <QrCode className="size-16 text-slate-900" />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Venue</div>
            <div className="text-sm font-extrabold text-slate-900">{displayTicket.venue}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Row</div>
            <div className="text-sm font-extrabold text-slate-900">{displayTicket.row}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Seat</div>
            <div className="text-sm font-extrabold text-slate-900">{displayTicket.seat}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Type</div>
            <div className="text-sm font-extrabold text-slate-900">{displayTicket.ticketType}</div>
          </div>
        </div>
      </div>

      {washroom ? (
        <div className="px-5 py-4 bg-slate-900 text-white">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-300 mb-2">Nearest restroom</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">ID</div>
              <div className="font-semibold">{washroom.id}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Zone</div>
              <div className="font-semibold">{washroom.zone}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Stand</div>
              <div className="font-semibold">{washroom.nearestStand}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Stalls</div>
              <div className="font-semibold">{washroom.stalls}</div>
            </div>
          </div>
          <p className="text-[11px] opacity-80 mt-3">
            {washroom.type} · {washroom.occupancyPercent}% occupied {washroom.babyCareAvailable ? "· Baby care available" : ""}
          </p>
        </div>
      ) : null}
      
      <div className="bg-white p-3 text-center text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em]">
        Scan at the gate shown on your ticket
      </div>
    </motion.div>
  );
}
