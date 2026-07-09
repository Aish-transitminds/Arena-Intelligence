import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ChevronLeft,
  Ticket,
  Share2,
  Gift,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Users,
  Zap,
  MoreVertical,
  Download,
  QrCode,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/fan/tickets")({
  head: () => ({
    meta: [
      { title: "My Tickets — Arena Intelligence" },
      { name: "description", content: "Manage, transfer, and view all your event tickets" },
    ],
  }),
  component: FanTicketsPage,
});

interface TicketItem {
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

const MOCK_TICKETS: TicketItem[] = [
  {
    id: "TKT-001-2024",
    event: "Team A vs Team B",
    date: "Today",
    time: "19:00 EST",
    venue: "Stadium Alpha · Gate B",
    section: "204",
    row: "12",
    seat: "7",
    price: 150,
    status: "active",
    qrCode: "ARENA-TKT-2891-7X",
    transferable: true,
    resalable: true,
    upgradeable: true,
    ownerName: "Anirudh Bharadwaj",
    ticketType: "Premium VIP",
    transactionId: "TXN-20240709-001547",
    purchaseDate: "July 5, 2024",
    entryTime: "17:30 EST",
    exitTime: "22:30 EST",
    barcode: "|||||||||||||||||||",
  },
  {
    id: "TKT-002-2024",
    event: "Championship Finals",
    date: "Next Friday",
    time: "20:30 EST",
    venue: "MetLife Stadium · Gate C",
    section: "108",
    row: "5",
    seat: "12",
    price: 280,
    status: "upcoming",
    qrCode: "ARENA-TKT-2892-8Y",
    transferable: true,
    resalable: false,
    upgradeable: true,
    ownerName: "Anirudh Bharadwaj",
    ticketType: "VIP Deluxe",
    transactionId: "TXN-20240707-000892",
    purchaseDate: "July 3, 2024",
    barcode: "|||||||||||||||||||",
  },
  {
    id: "TKT-003-2024",
    event: "Seasonal Playoff Round 2",
    date: "2 weeks",
    time: "18:00 EST",
    venue: "Meadowlands Sports Complex",
    section: "215",
    row: "20",
    seat: "3",
    price: 195,
    status: "upcoming",
    qrCode: "ARENA-TKT-2893-9Z",
    transferable: true,
    resalable: true,
    upgradeable: false,
    ownerName: "Anirudh Bharadwaj",
    ticketType: "Standard",
    transactionId: "TXN-20240706-005521",
    purchaseDate: "July 1, 2024",
    barcode: "|||||||||||||||||||",
  },
  {
    id: "TKT-004-2023",
    event: "Team A vs Team C",
    date: "Last Month",
    time: "19:00 EST",
    venue: "Stadium Alpha",
    section: "150",
    row: "8",
    seat: "15",
    price: 120,
    status: "used",
    qrCode: "ARENA-TKT-2890-6W",
    transferable: false,
    resalable: false,
    upgradeable: false,
    ownerName: "Anirudh Bharadwaj",
    ticketType: "Standard",
    transactionId: "TXN-20240605-003215",
    purchaseDate: "June 1, 2024",
    entryTime: "18:45 EST",
    exitTime: "22:00 EST",
    barcode: "|||||||||||||||||||",
  },
];

interface FanProfile {
  name: string;
  email: string;
  memberId: string;
  memberLevel: "bronze" | "silver" | "gold" | "platinum";
  joinDate: string;
  totalTickets: number;
  totalSpent: number;
  favoriteVenue: string;
  upcomingEvents: number;
}

const MOCK_FAN_PROFILE: FanProfile = {
  name: "Anirudh Bharadwaj",
  email: "anirudh.bharadwaj@example.com",
  memberId: "FAN-2024-89472",
  memberLevel: "gold",
  joinDate: "2022",
  totalTickets: 12,
  totalSpent: 2840,
  favoriteVenue: "Stadium Alpha",
  upcomingEvents: 3,
};

function FanTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(MOCK_TICKETS[0]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "history">("active");

  const getFilteredTickets = (status: "active" | "upcoming" | "history") => {
    if (status === "active") return MOCK_TICKETS.filter((t) => t.status === "active");
    if (status === "upcoming") return MOCK_TICKETS.filter((t) => t.status === "upcoming");
    if (status === "history") return MOCK_TICKETS.filter((t) => t.status === "used");
    return [];
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      active: {
        bg: "rgba(14,159,110,0.15)",
        text: "#0E9F6E",
        label: "Active",
        icon: <CheckCircle2 className="size-3.5" />,
      },
      upcoming: {
        bg: "rgba(59,179,179,0.15)",
        text: "#3BB3B3",
        label: "Upcoming",
        icon: <Clock className="size-3.5" />,
      },
      used: {
        bg: "rgba(170,184,194,0.10)",
        text: "#64748B",
        label: "Used",
        icon: <CheckCircle2 className="size-3.5" />,
      },
    };
    const config = configs[status] || configs.used;
    return config;
  };

  const filteredTickets = getFilteredTickets(activeTab);

  return (
    <AppShell title="My Tickets" subtitle="Manage and view all your tickets across events">
      {/* ── FAN PROFILE CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 rounded-2xl p-6 grid lg:grid-cols-4 gap-6"
        style={{
          background: "rgba(255,255,255,0.90)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
        }}
      >
        {/* Fan Profile Info */}
        <div className="lg:col-span-2 flex items-center gap-6">
          <div
            className="size-20 rounded-xl flex items-center justify-center shrink-0 text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
            }}
          >
            {MOCK_FAN_PROFILE.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {MOCK_FAN_PROFILE.name}
            </h2>
            <p className="text-sm mb-2" style={{ color: "#64748B" }}>
              {MOCK_FAN_PROFILE.email}
            </p>
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                style={{
                  background:
                    MOCK_FAN_PROFILE.memberLevel === "platinum"
                      ? "rgba(192,192,192,0.20)"
                      : MOCK_FAN_PROFILE.memberLevel === "gold"
                      ? "rgba(255,193,7,0.20)"
                      : MOCK_FAN_PROFILE.memberLevel === "silver"
                      ? "rgba(192,192,192,0.15)"
                      : "rgba(205,127,50,0.20)",
                  color:
                    MOCK_FAN_PROFILE.memberLevel === "platinum"
                      ? "#C0C0C0"
                      : MOCK_FAN_PROFILE.memberLevel === "gold"
                      ? "#FFC107"
                      : MOCK_FAN_PROFILE.memberLevel === "silver"
                      ? "#C0C0C0"
                      : "#CD7F32",
                  border:
                    MOCK_FAN_PROFILE.memberLevel === "platinum"
                      ? "1px solid rgba(192,192,192,0.30)"
                      : MOCK_FAN_PROFILE.memberLevel === "gold"
                      ? "1px solid rgba(255,193,7,0.30)"
                      : MOCK_FAN_PROFILE.memberLevel === "silver"
                      ? "1px solid rgba(192,192,192,0.20)"
                      : "1px solid rgba(205,127,50,0.30)",
                }}
              >
                {MOCK_FAN_PROFILE.memberLevel} member
              </span>
              <span style={{ color: "#64748B" }} className="text-xs">
                Since {MOCK_FAN_PROFILE.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="text-2xl font-bold text-slate-900">
              {MOCK_FAN_PROFILE.upcomingEvents}
            </div>
            <div className="text-xs mt-1" style={{ color: "#64748B" }}>
              Upcoming Events
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="text-2xl font-bold text-slate-900">
              {MOCK_FAN_PROFILE.totalTickets}
            </div>
            <div className="text-xs mt-1" style={{ color: "#64748B" }}>
              Total Tickets
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="text-2xl font-bold text-slate-900">
              ${MOCK_FAN_PROFILE.totalSpent}
            </div>
            <div className="text-xs mt-1" style={{ color: "#64748B" }}>
              Total Spent
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="text-sm font-bold text-slate-900">
              {MOCK_FAN_PROFILE.favoriteVenue}
            </div>
            <div className="text-xs mt-1" style={{ color: "#64748B" }}>
              Favorite Venue
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── MEMBER ID & DETAILS ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#64748B" }}>
            Member ID
          </p>
          <p className="text-lg font-mono font-bold text-slate-900">
            {MOCK_FAN_PROFILE.memberId}
          </p>
        </div>
        <button
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "rgba(14,159,110,0.15)",
            border: "1px solid rgba(14,159,110,0.30)",
            color: "#0E9F6E",
          }}
        >
          View Full Profile
        </button>
      </motion.div>

      {/* ── TICKET LIST & DETAILS ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── TICKET LIST ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div
            className="flex gap-1 rounded-xl p-1.5"
            style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            {(["active", "upcoming", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all uppercase tracking-wider ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                style={
                  activeTab === tab
                    ? {
                        background: "linear-gradient(135deg, rgba(14,159,110,0.2), rgba(60,179,177,0.1))",
                        border: "1px solid rgba(14,159,110,0.3)",
                      }
                    : {}
                }
              >
                {tab === "active" && `Active (${getFilteredTickets("active").length})`}
                {tab === "upcoming" && `Upcoming (${getFilteredTickets("upcoming").length})`}
                {tab === "history" && `History (${getFilteredTickets("history").length})`}
              </button>
            ))}
          </div>

          {/* Ticket Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {filteredTickets.map((ticket, idx) => {
                const statusConfig = getStatusBadge(ticket.status);
                const isSelected = selectedTicket?.id === ticket.id;

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`relative rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-green-500/50" : ""
                    }`}
                    style={{
                      background: isSelected
                        ? "rgba(14,159,110,0.1)"
                        : "rgba(255,255,255,0.90)",
                      border: isSelected
                        ? "1px solid rgba(14,159,110,0.4)"
                        : "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="size-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: "rgba(14,159,110,0.15)",
                              border: "1px solid rgba(14,159,110,0.25)",
                            }}
                          >
                            <Ticket className="size-4 text-green-400" />
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">
                            {ticket.event}
                          </h3>
                        </div>

                        <div className="text-xs space-y-1 mb-3" style={{ color: "#64748B" }}>
                          <p>📅 {ticket.date} · {ticket.time}</p>
                          <p>📍 {ticket.venue}</p>
                          <p className="font-mono">
                            Section {ticket.section} · Row {ticket.row} · Seat {ticket.seat}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                            style={{
                              background: statusConfig.bg,
                              color: statusConfig.text,
                            }}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            ${ticket.price}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <button
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="size-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── TICKET DETAIL PANEL ── */}
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(0,0,0,0.09)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">
                  Ticket Details
                </p>
                <p className="text-sm font-extrabold text-white mt-0.5">
                  {selectedTicket.event}
                </p>
              </div>
              <div
                className="size-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.25)" }}
              >
                <Ticket className="size-5 text-white" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Owner & Type */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div className="space-y-3 text-sm">
                  <div>
                    <span style={{ color: "#64748B", fontSize: "11px" }} className="uppercase tracking-wider">
                      Ticket Owner
                    </span>
                    <p className="text-slate-900 font-bold text-lg mt-1">
                      {selectedTicket.ownerName}
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Ticket Type</span>
                    <span className="text-slate-900 font-semibold">{selectedTicket.ticketType}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowQRModal(true)}
                className="flex justify-center cursor-pointer"
              >
                <div
                  className="p-5 rounded-2xl hover:shadow-xl transition-shadow"
                  style={{ background: "#fff" }}
                >
                  <QRCodeSVG value={selectedTicket.qrCode} size={160} />
                </div>
              </motion.div>

              {/* Event & Time Info */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Event</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedTicket.event}
                    </span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Date</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedTicket.date}
                    </span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Event Time</span>
                    <span className="text-slate-900 font-semibold">
                      {selectedTicket.time}
                    </span>
                  </div>
                  {selectedTicket.entryTime && (
                    <>
                      <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>Entry Time</span>
                        <span className="text-slate-900 font-semibold">
                          {selectedTicket.entryTime}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedTicket.exitTime && (
                    <>
                      <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                      <div className="flex justify-between">
                        <span style={{ color: "#64748B" }}>Exit Time</span>
                        <span className="text-slate-900 font-semibold">
                          {selectedTicket.exitTime}
                        </span>
                      </div>
                    </>
                  )}
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Venue</span>
                    <span className="text-slate-900 font-semibold text-right">
                      {selectedTicket.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seat Info */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p style={{ color: "#64748B", fontSize: "11px" }} className="uppercase tracking-wider">
                      Section
                    </p>
                    <p className="text-slate-900 font-bold text-lg mt-1">{selectedTicket.section}</p>
                  </div>
                  <div style={{ borderLeft: "1px solid rgba(0,0,0,0.06)", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
                    <p style={{ color: "#64748B", fontSize: "11px" }} className="uppercase tracking-wider">
                      Row
                    </p>
                    <p className="text-slate-900 font-bold text-lg mt-1">{selectedTicket.row}</p>
                  </div>
                  <div>
                    <p style={{ color: "#64748B", fontSize: "11px" }} className="uppercase tracking-wider">
                      Seat
                    </p>
                    <p className="text-slate-900 font-bold text-lg mt-1">{selectedTicket.seat}</p>
                  </div>
                </div>
              </div>

              {/* Price & Transaction */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Price</span>
                    <span className="text-slate-900 font-bold text-base">${selectedTicket.price}</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Transaction ID</span>
                    <span className="text-slate-900 font-mono text-xs">{selectedTicket.transactionId}</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}></div>
                  <div className="flex justify-between">
                    <span style={{ color: "#64748B" }}>Purchase Date</span>
                    <span className="text-slate-900 font-semibold text-xs">{selectedTicket.purchaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Barcode */}
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <p style={{ color: "#64748B", fontSize: "11px" }} className="uppercase tracking-wider mb-3">
                  Barcode
                </p>
                <p className="text-slate-900 font-mono text-lg letter-spacing-wide tracking-widest">
                  {selectedTicket.barcode}
                </p>
              </div>

              {/* Status Badge */}
              {selectedTicket.status !== "used" && (
                <div
                  className="flex items-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold"
                  style={{
                    background: "rgba(14,159,110,0.08)",
                    border: "1px solid rgba(14,159,110,0.18)",
                    color: "#0E9F6E",
                  }}
                >
                  <CheckCircle2 className="size-4" />
                  Valid for entry · Scan at gate
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {selectedTicket.status !== "used" && (
                  <>
                    {selectedTicket.transferable && (
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "rgba(14,159,110,0.20)",
                          border: "1px solid rgba(14,159,110,0.30)",
                          color: "#0E9F6E",
                        }}
                      >
                        <Share2 className="size-4" />
                        Transfer Ticket
                      </button>
                    )}

                    {selectedTicket.resalable && (
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "rgba(59,179,179,0.20)",
                          border: "1px solid rgba(59,179,179,0.30)",
                          color: "#3BB3B3",
                        }}
                      >
                        <TrendingUp className="size-4" />
                        List for Resale
                      </button>
                    )}

                    {selectedTicket.upgradeable && (
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          background: "rgba(255,193,7,0.15)",
                          border: "1px solid rgba(255,193,7,0.30)",
                          color: "#FFC107",
                        }}
                      >
                        <Zap className="size-4" />
                        Upgrade Seat
                      </button>
                    )}
                  </>
                )}

                <button
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(0,0,0,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                >
                  <Download className="size-4" />
                  Download Ticket
                </button>
              </div>

              {/* Ticket ID */}
              <div
                className="rounded-xl p-3 text-center text-xs font-mono"
                style={{
                  background: "rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  color: "#64748B",
                }}
              >
                ID: {selectedTicket.id}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQRModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl p-8"
              style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.10)" }}
            >
              <div className="flex flex-col items-center gap-6">
                <div
                  className="p-8 rounded-2xl"
                  style={{ background: "#fff" }}
                >
                  <QRCodeSVG value={selectedTicket?.qrCode || ""} size={280} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-900 font-semibold">
                    Present this QR code at the gate
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "#64748B" }}
                  >
                    {selectedTicket?.qrCode}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
