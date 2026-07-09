import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import { AppShell } from "@/components/AppShell";
import { crowdData, queueData, notifications } from "@/lib/mock-data";
import {
  Users, Clock, MapPin, Ticket, CalendarDays, Bell,
  Crosshair, UtensilsCrossed, Car, AlertTriangle,
  ChevronRight, ArrowRight, Navigation, ShoppingBag,
} from "lucide-react";

export const Route = createFileRoute("/fan")({
  head: () => ({
    meta: [
      { title: "Fan Dashboard — Arena Intelligence" },
      { name: "description", content: "Your digital ticket, real-time crowd and queue updates, and seat navigation." },
    ],
  }),
  component: FanPage,
});

const fanNav = [
  { icon: Ticket, label: "My Tickets", desc: "Manage & transfer", href: "/fan/tickets" },
  { icon: UtensilsCrossed, label: "Food Courts", desc: "4 nearby, 3-5 min walk" },
  { icon: ShoppingBag, label: "Adidas Official Store", desc: "0.2 km · Proceed North" },
  { icon: ShoppingBag, label: "FIFA Merch Zone", desc: "0.5 km · Near Gate C" },
  { icon: AlertTriangle, label: "Emergency Help", desc: "Nearest: Gate B Medical" },
];

function FanPage() {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on a child route like /fan/tickets
  const isChildRoute = location.pathname !== '/fan';
  
  // If on a child route, render the outlet
  if (isChildRoute) {
    return <Outlet />;
  }

  return (
    <AppShell title="Match Day" subtitle="Team A vs Team B · Gate B · Section 204, Row 12, Seat 7">
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── DIGITAL TICKET ── */}
        <Link
          to="/fan/tickets"
          className="block lg:row-span-2 rounded-2xl overflow-hidden relative transition-transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
          style={{
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(0,0,0,0.09)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* Ticket Notches */}
          <div className="absolute top-[80px] -left-3 size-6 bg-background rounded-full border-r border-white/10 z-10" />
          <div className="absolute top-[80px] -right-3 size-6 bg-background rounded-full border-l border-white/10 z-10" />

          {/* Green header band */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">Digital Ticket</p>
              <p className="text-sm font-extrabold text-white mt-0.5">Concept Event Night</p>
            </div>
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <Ticket className="size-5 text-white" />
            </div>
          </div>

          <div className="p-6">
            {/* Match info */}
            <div className="mb-5 pb-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight">
                Team A <span style={{ color: "#64748B" }}>vs</span> Team B
              </div>
              <div className="text-sm mt-1.5 flex items-center gap-3" style={{ color: "#64748B" }}>
                <span>Today</span>
                <span style={{ color: "rgba(100,116,139,0.30)" }}>·</span>
                <span>19:00 EST</span>
                <span style={{ color: "rgba(100,116,139,0.30)" }}>·</span>
                <span>Stadium Alpha</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center my-6">
              <div className="p-4 rounded-2xl" style={{ background: "#fff" }}>
                <QRCodeSVG value="ARENA-TKT-2891-7X" size={140} />
              </div>
            </div>

            {/* Seat info */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Section", value: "204" },
                { label: "Row", value: "12" },
                { label: "Seat", value: "7" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="text-[9px] uppercase tracking-[0.20em] mb-1.5" style={{ color: "#64748B" }}>{f.label}</div>
                  <div className="text-2xl font-extrabold text-slate-900">{f.value}</div>
                </div>
              ))}
            </div>

            {/* Verified badge */}
            <div
              className="flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] mb-3"
              style={{ color: "#0E9F6E" }}
            >
              <Ticket className="size-3" />
              Present at Gate B · Verified by Arena Intelligence
            </div>

            {/* Prominent CTA Button */}
            <div
              className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all shadow-lg group-hover:shadow-[0_0_30px_rgba(14,159,110,0.4)]"
              style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2 group-hover:scale-105 transition-transform">
                Click Here For Ticket
              </span>
              <ArrowRight className="size-5 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Perforation line */}
          <div className="absolute top-[92px] left-4 right-4 h-px border-t-2 border-dashed border-white/10 z-0" />
        </Link>

        {/* ── STAT CARDS ── */}
        <StatCard
          label="Live Crowd"
          value="52.8K"
          sub="Est. peak at 19:30"
          icon={<Users className="size-5" />}
          index={0}
        />
        <StatCard
          label="Your Gate Wait"
          value="4 min"
          sub="Gate B — shorter than avg"
          icon={<Clock className="size-5" />}
          index={1}
          positive
        />

        {/* ── QUICK NAVIGATION ── */}
        <div
          className="rounded-2xl p-5 lg:col-span-2 flex flex-col gap-6"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          {/* Big CTA for Find My Seat */}
          <button
            onClick={() => setIs3DModalOpen(true)}
            className="group w-full flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(14,159,110,0.4)]"
            style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <MapPin className="size-6 text-slate-900" />
              </div>
              <div className="text-left text-slate-900">
                <div className="text-lg font-extrabold tracking-tight group-hover:text-slate-900 transition-colors">Launch 3D Seat Viewer</div>
                <div className="text-xs text-slate-900/90 font-medium">Interactive Stadium Alpha Preview</div>
              </div>
            </div>
            <div className="size-10 rounded-full bg-black/20 flex items-center justify-center shrink-0 transition-all group-hover:translate-x-2 group-hover:bg-black/30">
              <ArrowRight className="size-5 text-slate-900" />
            </div>
          </button>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Stadium Directory</h2>
                <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Nearby facilities & directions</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fanNav.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <div
                    className="size-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.20)" }}
                  >
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{item.label}</div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: "#64748B" }}>{item.desc}</div>
                  </div>
                </>
              );
              
              if ("href" in item && item.href) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-3 rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.99]"
                    style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    {content}
                  </Link>
                );
              }
              
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    // Quick nav items don't need a specific action yet since we pulled out 3D Modal
                  }}
                  className="flex items-center gap-3 rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── GATE QUEUES ── */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Gate Queues</h2>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Live wait times</p>
            </div>
          </div>
          <div className="space-y-3">
            {queueData.slice(0, 5).map((q) => (
              <div key={q.gate}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-900">{q.gate}</span>
                  <span
                    className="font-bold"
                    style={{ color: q.wait > 10 ? "#D92D20" : q.wait > 6 ? "#F4B400" : "#0E9F6E" }}
                  >
                    {q.wait} min
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${q.capacity}%`,
                      background: q.wait > 10 ? "#D92D20" : q.wait > 6 ? "#F4B400" : "#0E9F6E",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CROWD FLOW CHART ── */}
        <div
          className="rounded-2xl p-5 lg:col-span-2"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Crowd Flow</h2>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>Live vs projected attendance</p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
              style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
            >
              94% confidence
            </span>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <AreaChart data={crowdData}>
                <defs>
                  <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E9F6E" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0E9F6E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(11,22,30,0.96)", border: "1px solid rgba(14,159,110,0.22)", borderRadius: 10 }}
                  labelStyle={{ color: "#64748B", fontSize: 10 }}
                  itemStyle={{ fontSize: 11, fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="crowd" stroke="#0E9F6E" fill="url(#crowdGrad)" strokeWidth={2} name="Live" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── MATCH SCHEDULE ── */}
        <div
          className="rounded-2xl p-5 lg:col-span-2"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-slate-900">Match Schedule</h2>
          </div>
          <div className="space-y-2">
            {[
              { t: "Today 19:00", m: "Team A vs Team B", v: "Stadium Alpha", live: true },
              { t: "Sat 17:30", m: "Team C vs Team D", v: "Stadium Alpha" },
              { t: "Sun 20:00", m: "Team E vs Team F", v: "Stadium Alpha" },
            ].map((m) => (
              <div
                key={m.m}
                className="flex items-center justify-between p-3.5 rounded-xl transition-colors"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{m.m}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>{m.t} · {m.v}</div>
                </div>
                {m.live && (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.18em]"
                    style={{ background: "rgba(217,45,32,0.15)", color: "#D92D20", border: "1px solid rgba(217,45,32,0.25)" }}
                  >
                    Live
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── NOTIFICATIONS ── */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-slate-900">Updates</h2>
          </div>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="text-sm font-medium text-slate-900">{n.title}</div>
                <div className="text-[10px] mt-1" style={{ color: "#64748B" }}>{n.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEAT NAVIGATION MAP ── */}
        <div
          className="rounded-2xl overflow-hidden lg:col-span-3"
          style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">Seat Navigation</h2>
            </div>
            <Link
              to={"/fan/tactical" as any}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline"
            >
              <Crosshair className="size-3.5" />
              Full Blueprint
            </Link>
          </div>

          <div
            className="relative h-64 flex items-center justify-center overflow-hidden"
            style={{ background: "radial-gradient(ellipse at center, rgba(14,159,110,0.12) 0%, rgba(7,20,28,0.95) 70%)" }}
          >
            {/* Simple stadium blueprint rings */}
            <div className="absolute inset-8 rounded-[40%] border-2" style={{ borderColor: "rgba(14,159,110,0.15)" }} />
            <div className="absolute inset-16 rounded-[40%] border" style={{ borderColor: "rgba(14,159,110,0.10)" }} />
            <div className="absolute inset-24 rounded-[40%] border" style={{ borderColor: "rgba(14,159,110,0.08)" }} />

            {/* Field label */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]"
              style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
            >
              PITCH
            </div>

            {/* Area labels */}
            {[
              { pos: "top-4 left-8", label: "Merch Shops", color: "rgba(14,159,110,0.12)", border: "rgba(14,159,110,0.25)", text: "#0E9F6E" },
              { pos: "top-4 right-8", label: "First Aid", color: "rgba(217,45,32,0.10)", border: "rgba(217,45,32,0.25)", text: "#D92D20" },
              { pos: "bottom-4 left-8", label: "Food Court", color: "rgba(212,175,55,0.10)", border: "rgba(212,175,55,0.25)", text: "#D4AF37" },
              { pos: "bottom-4 right-8", label: "Parking C", color: "rgba(170,184,194,0.08)", border: "rgba(100,116,139,0.20)", text: "#64748B" },
            ].map((area) => (
              <div
                key={area.label}
                className={`absolute ${area.pos} rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]`}
                style={{ background: area.color, border: `1px solid ${area.border}`, color: area.text }}
              >
                {area.label}
              </div>
            ))}

            {/* Your seat pulse */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-8 right-16 size-4 rounded-full"
              style={{ background: "#0E9F6E", boxShadow: "0 0 20px rgba(14,159,110,0.70)" }}
            />
            <div
              className="absolute top-6 right-22 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#0E9F6E" }}
            >
              ← Your Seat
            </div>

            {/* Walk info */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.10)", backdropFilter: "blur(12px)" }}
            >
              <Navigation className="size-3.5 text-primary" />
              3 min walk from Gate B · Section 204
            </div>
          </div>
        </div>
      </div>

      {/* ── 3D SEAT & PITCH VIEWER MODAL ── */}
      <AnimatePresence>
        {is3DModalOpen && (
          <Modal3D
            onClose={() => setIs3DModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function Modal3D({ onClose }: { onClose: () => void }) {
  const [cameraAngle, setCameraAngle] = useState<"pitch" | "seats" | "sky">("pitch");
  const [kickTarget, setKickTarget] = useState<{ x: number; y: number; bx: number; by: number; rx: number; ry: number; id: number } | null>(null);
  const [impactParticles, setImpactParticles] = useState<{ x: number; y: number; id: number }[]>([]);

  const handlePitchClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    
    // Normalize and extend for roll
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    // Bounce target (short hop)
    const bx = x + nx * 50;
    const by = y + ny * 50;
    
    // Roll end (off screen)
    const rx = x + nx * 200;
    const ry = y + ny * 200;

    setKickTarget({ x, y, bx, by, rx, ry, id });

    // Play impact visual on flight end (700ms)
    setTimeout(() => {
      setImpactParticles((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setImpactParticles((prev) => prev.filter((p) => p.id !== id));
      }, 700);
    }, 700);
  };

  const transformStyle = useMemo(() => {
    if (cameraAngle === "seats") {
      return "perspective(1200px) rotateX(68deg) rotateY(0deg) rotateZ(-78deg) scale(1.15) translateZ(-40px)";
    }
    if (cameraAngle === "sky") {
      return "perspective(1200px) rotateX(25deg) rotateY(0deg) rotateZ(0deg) scale(0.85)";
    }
    return "perspective(1200px) rotateX(55deg) rotateY(0deg) rotateZ(-12deg) scale(0.95)";
  }, [cameraAngle]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(7,20,28,0.85)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="w-full max-w-4xl h-[680px] rounded-2xl flex flex-col overflow-hidden text-slate-900 border text-left shadow-2xl relative"
        style={{ background: "rgba(255,255,255,0.96)", borderColor: "rgba(0,0,0,0.08)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-black/5 z-10 shrink-0">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">3D Virtual MetLife Seat Preview</h2>
            <p className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>Tap the pitch to shoot/kick the soccer ball to the stands!</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center bg-black/5 border border-black/10 hover:bg-black/10 transition active:scale-95 cursor-pointer outline-none"
          >
            <span className="text-sm font-extrabold text-slate-900">✕</span>
          </button>
        </div>

        {/* 3D Scene Viewport */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black/40">
          {/* Instructions Overlay */}
          <div className="absolute top-4 left-6 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/8 text-[9px] font-mono tracking-widest text-slate-300 pointer-events-none uppercase">
            🏟️ Left-Click Field to Shoot Football
          </div>

          <div
            className="relative w-[680px] h-[400px] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: transformStyle,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              onClick={handlePitchClick}
              className="absolute inset-x-20 inset-y-10 rounded-[4px] border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-crosshair"
              style={{
                background: "repeating-linear-gradient(90deg, #2e7d32, #2e7d32 30px, #388e3c 30px, #388e3c 60px)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Soccer field markings */}
              <div className="absolute inset-0 border border-white/30 m-3 pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full border border-white/30 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 bg-white/60 rounded-full pointer-events-none" />
              
              {/* Penalty boxes */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-44 h-16 border border-white/30 pointer-events-none" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-44 h-16 border border-white/30 pointer-events-none" />

              {/* Tapped impact rings */}
              {impactParticles.map((imp) => (
                <motion.div
                  key={imp.id}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 2.5, 3.5], opacity: [1, 0.8, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute size-14 border border-primary rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ left: imp.x, top: imp.y, background: "rgba(14,159,110,0.15)" }}
                >
                  <span className="text-[7px] font-mono tracking-widest font-black text-primary uppercase">HIT!</span>
                </motion.div>
              ))}

              {/* Static resting football (hidden when kicked) */}
              {!kickTarget && (
                <div className="absolute top-1/2 left-1/2 size-5 z-40 pointer-events-none -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
                  <svg viewBox="0 0 100 100" className="size-full">
                    <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="3" />
                    <polygon points="50,38 60,45 56,57 44,57 40,45" fill="black" />
                    <polygon points="50,18 38,8 62,8" fill="black" />
                    <polygon points="78,38 90,25 90,50" fill="black" />
                    <polygon points="68,75 50,90 32,75" fill="black" />
                    <polygon points="22,38 10,25 10,50" fill="black" />
                    <line x1="50" y1="38" x2="50" y2="18" stroke="black" strokeWidth="2.5" />
                    <line x1="60" y1="45" x2="78" y2="38" stroke="black" strokeWidth="2.5" />
                    <line x1="56" y1="57" x2="68" y2="75" stroke="black" strokeWidth="2.5" />
                    <line x1="44" y1="57" x2="32" y2="75" stroke="black" strokeWidth="2.5" />
                    <line x1="40" y1="45" x2="22" y2="38" stroke="black" strokeWidth="2.5" />
                  </svg>
                </div>
              )}

              {/* Animated flying football with bounce and roll */}
              {kickTarget && (
                <motion.div
                  key={kickTarget.id}
                  initial={{ left: "50%", top: "50%", scale: 0.8, rotate: 0, opacity: 1 }}
                  animate={{
                    left: ["50%", `${kickTarget.x}px`, `${kickTarget.bx}px`, `${kickTarget.rx}px`],
                    top: ["50%", `${kickTarget.y}px`, `${kickTarget.by}px`, `${kickTarget.ry}px`],
                    scale: [0.8, 2.4, 0.9, 1.4, 0.9, 0.7],
                    rotate: [0, 1080],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 2.0,
                    left: { times: [0, 0.35, 0.6, 1], ease: "easeOut" },
                    top: { times: [0, 0.35, 0.6, 1], ease: "easeOut" },
                    scale: { times: [0, 0.175, 0.35, 0.475, 0.6, 1], ease: "easeInOut" },
                    rotate: { duration: 2.0, ease: "linear" },
                    opacity: { times: [0, 0.8, 1] }
                  }}
                  className="absolute size-8 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                >
                  <svg viewBox="0 0 100 100" className="size-full drop-shadow-[0_15px_12px_rgba(0,0,0,0.85)]">
                    <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="3" />
                    <polygon points="50,38 60,45 56,57 44,57 40,45" fill="black" />
                    <polygon points="50,18 38,8 62,8" fill="black" />
                    <polygon points="78,38 90,25 90,50" fill="black" />
                    <polygon points="68,75 50,90 32,75" fill="black" />
                    <polygon points="22,38 10,25 10,50" fill="black" />
                    <line x1="50" y1="38" x2="50" y2="18" stroke="black" strokeWidth="2.5" />
                    <line x1="60" y1="45" x2="78" y2="38" stroke="black" strokeWidth="2.5" />
                    <line x1="56" y1="57" x2="68" y2="75" stroke="black" strokeWidth="2.5" />
                    <line x1="44" y1="57" x2="32" y2="75" stroke="black" strokeWidth="2.5" />
                    <line x1="40" y1="45" x2="22" y2="38" stroke="black" strokeWidth="2.5" />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* WEST STAND */}
            <div
              className="absolute left-8 top-10 bottom-10 w-11 border-r border-white/10 flex items-center justify-center"
              style={{
                transform: "rotateY(75deg) translateZ(-16px)",
                background: "repeating-linear-gradient(90deg, #0a131a, #0a131a 4px, #182a38 4px, #182a38 8px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 bg-black/40" /> {/* shading overlay */}
              <span className="text-[7px] font-mono tracking-widest text-[#64748B]/40 -rotate-90 uppercase relative z-10">WEST_STAND_VIP</span>
            </div>

            {/* ── 3D SEAT STANDS (EAST WALL / TICKET SEAT) ── */}
            <div
              className="absolute right-8 top-10 bottom-10 w-11 border-l border-white/10 flex flex-col justify-between p-2"
              style={{
                transform: "rotateY(-75deg) translateZ(-16px)",
                background: "repeating-linear-gradient(90deg, #182a38, #182a38 4px, #0a131a 4px, #0a131a 8px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 bg-black/40" /> {/* shading overlay */}
              <div className="h-full w-full relative flex items-center justify-center z-10">
                <span className="text-[7px] font-mono tracking-widest text-[#64748B]/40 rotate-90 uppercase">EAST_STAND_SEC_204</span>
                
                {/* Selected seat indicator pin (counter-rotated to face camera) */}
                <div
                  className="absolute top-[38%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-default z-20"
                  style={{ transform: "translateZ(15px) rotateY(75deg)" }}
                >
                  <div className="bg-primary text-white text-xs font-black px-4 py-2 rounded-xl shadow-[0_12px_24px_rgba(14,159,110,0.8)] mb-2 whitespace-nowrap animate-bounce uppercase tracking-widest text-center border-2 border-white/20">
                    <div className="text-sm mb-1">Your Seat Area</div>
                    <div className="text-[10px] font-bold opacity-100 tracking-widest text-white">Seat 7 • VIP Club</div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-0 size-10 bg-primary rounded-full animate-ping opacity-60" />
                    <span className="size-4 bg-primary border-[3px] border-white rounded-full shadow-[0_0_20px_rgba(14,159,110,1)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* NORTH STAND WALL */}
            <div
              className="absolute top-0 left-20 right-20 h-10 border-b border-white/10 flex items-center justify-center"
              style={{
                transform: "rotateX(-75deg) translateZ(-12px)",
                background: "repeating-linear-gradient(0deg, #0a131a, #0a131a 4px, #182a38 4px, #182a38 8px)",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="text-[7px] font-mono tracking-widest text-[#64748B]/40 uppercase relative z-10">NORTH_GOAL_STAND</span>
            </div>

            {/* SOUTH STAND WALL */}
            <div
              className="absolute bottom-0 left-20 right-20 h-10 border-t border-white/10 flex items-center justify-center"
              style={{
                transform: "rotateX(75deg) translateZ(-12px)",
                background: "repeating-linear-gradient(0deg, #182a38, #182a38 4px, #0a131a 4px, #0a131a 8px)",
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="text-[7px] font-mono tracking-widest text-[#64748B]/40 uppercase relative z-10">SOUTH_GOAL_STAND</span>
            </div>
          </div>
        </div>

        {/* Control & Telemetry Panel */}
        <div className="p-6 border-t border-black/5 bg-black/5 flex flex-wrap items-center justify-between gap-6 shrink-0 z-10">
          {/* Camera Controls */}
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>3D Camera Perspective</label>
            <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
              {(["pitch", "seats", "sky"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCameraAngle(mode)}
                  className="px-4 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  style={
                    cameraAngle === mode
                      ? { background: "rgba(14,159,110,0.15)", color: "#0F172A", border: "1px solid rgba(14,159,110,0.20)" }
                      : { color: "#64748B", background: "transparent", border: "1px solid transparent" }
                  }
                >
                  {mode === "pitch" ? "Center Field" : mode === "seats" ? "Section 204" : "Tactical Sky"}
                </button>
              ))}
            </div>
          </div>

          {/* Seat Telemetry info */}
          <div className="flex gap-6 items-center">
            <div className="text-left font-mono border-r border-black/10 pr-6">
              <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Selected Seat</p>
              <p className="text-xs text-slate-900 font-extrabold mt-0.5">Section 204, Row 12, Seat 7</p>
            </div>
            <div className="text-left font-mono border-r border-black/10 pr-6">
              <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Field View</p>
              <p className="text-xs text-primary font-extrabold mt-0.5">100% Unobstructed</p>
            </div>
            <div className="text-left font-mono">
              <p className="text-[9px] uppercase tracking-wider text-[#64748B] font-bold">Comfort Rating</p>
              <p className="text-xs text-slate-900 font-extrabold mt-0.5">VIP Club Seat</p>
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  index = 0,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  index?: number;
  positive?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-2xl p-5 card-lift"
      style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.20em]" style={{ color: "#64748B" }}>{label}</span>
        {icon && (
          <div
            className="size-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.18)", color: "#0E9F6E" }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
      {sub && <div className="text-xs mt-2" style={{ color: positive ? "#0E9F6E" : "#64748B" }}>{sub}</div>}
    </motion.div>
  );
}
