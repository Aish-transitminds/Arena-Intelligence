import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Minus,
  Plus,
  Lock
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
    venue: "Narendra Modi FIFA Stadium · Gate C",
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

const TICKET_PRICES: Record<string, number> = {
  Classic: 150,
  Gold: 300,
  Diamond: 600,
};

function FanTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(MOCK_TICKETS[0]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "history">("active");

  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyType, setBuyType] = useState<"Classic" | "Gold" | "Diamond">("Gold");

  useEffect(() => {
    if (window.location.search.includes("buy=true")) {
      setShowBuyModal(true);
    }
  }, []);

  const handleBuyTicket = () => {
    const newTickets: TicketItem[] = Array.from({ length: buyQuantity }).map((_, i) => ({
      id: `TKT-00${tickets.length + i + 1}-2024`,
      event: "Royal Challengers vs Mumbai Indians",
      date: "Tomorrow",
      time: "18:00 IST",
      venue: "M. Chinnaswamy Stadium · Gate 2",
      section: "112",
      row: "G",
      seat: String(24 + i),
      price: TICKET_PRICES[buyType],
      status: "active",
      qrCode: `ARENA-TKT-${Date.now()}-${i}`,
      transferable: true,
      resalable: true,
      upgradeable: true,
      ownerName: MOCK_FAN_PROFILE.name,
      ticketType: buyType,
      transactionId: `TXN-${Date.now()}-${i}`,
      purchaseDate: new Date().toLocaleDateString(),
      barcode: "|||||||||||||||||||",
    }));

    setTickets([...newTickets, ...tickets]);
    setSelectedTicket(newTickets[0]);
    setShowBuyModal(false);
    setActiveTab("active");
    
    // reset form
    setBuyQuantity(1);
    setBuyType("Gold");
  };

  const getFilteredTickets = (status: "active" | "upcoming" | "history") => {
    if (status === "active") return tickets.filter((t) => t.status === "active");
    if (status === "upcoming") return tickets.filter((t) => t.status === "upcoming");
    if (status === "history") return tickets.filter((t) => t.status === "used");
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowBuyModal(true)}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
          >
            Buy Tickets
          </button>
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
        </div>
      </motion.div>

      {/* ── TICKET LIST & DETAILS ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── TICKET LIST ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            {/* Tab Navigation */}
            <div
              className="flex gap-1 rounded-xl p-1.5 flex-1"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {(["active", "upcoming", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all uppercase tracking-wider ${
                    activeTab === tab
                      ? "text-white shadow-md"
                      : "text-slate-500 hover:text-slate-700 hover:bg-black/5"
                  }`}
                  style={
                    activeTab === tab
                      ? {
                          background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                          border: "1px solid rgba(14,159,110,0.4)",
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

            {/* Big Action Button */}
            <button
              onClick={() => setShowBuyModal(true)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
            >
              + Buy New Ticket
            </button>
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
                        ? "rgba(240, 253, 244, 0.95)"
                        : "rgba(255,255,255,0.90)",
                      border: isSelected
                        ? "2px solid rgba(14,159,110,0.6)"
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
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowQRModal(true)}
                className="flex justify-center cursor-pointer"
              >
                <div
                  className="p-5 rounded-2xl hover:shadow-xl transition-shadow relative overflow-hidden group"
                  style={{ background: "#fff" }}
                >
                  <div className="transition-all duration-300 blur-sm opacity-30 group-hover:blur-md">
                    <QRCodeSVG value={selectedTicket.qrCode} size={160} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 drop-shadow-md">
                    <Lock className="size-8 mb-2" />
                    <span className="text-xs font-black uppercase tracking-widest text-center px-2">Ticket Hidden</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Tap to View</span>
                  </div>
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

      {/* Buy Ticket Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Buy Tickets</h3>
              <p className="text-sm text-slate-500 mb-6">Select ticket type and quantity for the upcoming match.</p>
              
              <div className="space-y-5 mb-8">
                {/* Event Info */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-900">Royal Challengers vs Mumbai Indians</h4>
                      <p className="text-xs text-slate-500">M. Chinnaswamy Stadium</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Tomorrow • 18:00 IST</p>
                </div>

                {/* Ticket Type Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Ticket Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Classic", "Gold", "Diamond"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setBuyType(type)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border-2 ${
                          buyType === type
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                        }`}
                      >
                        {type}
                        <div className="text-[10px] font-normal opacity-80 mt-0.5">${TICKET_PRICES[type]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div>
                    <label className="text-sm font-bold text-slate-900 block">Quantity</label>
                    <p className="text-xs text-slate-500">Max 8 tickets per transaction</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100">
                    <button
                      onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                      className="size-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
                      disabled={buyQuantity <= 1}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="font-bold text-slate-900 w-4 text-center">{buyQuantity}</span>
                    <button
                      onClick={() => setBuyQuantity(Math.min(8, buyQuantity + 1))}
                      className="size-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
                      disabled={buyQuantity >= 8}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium text-sm">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900">${TICKET_PRICES[buyType] * buyQuantity}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyTicket}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 4px 15px rgba(14,159,110,0.3)" }}
                >
                  Confirm Purchase
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
