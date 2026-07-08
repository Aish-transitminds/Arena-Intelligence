import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, BarChart, Bar, CartesianGrid } from "recharts";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { crowdData, queueData, notifications } from "@/lib/mock-data";
import { Users, Clock, MapPin, Ticket, CalendarDays, Bell } from "lucide-react";

export const Route = createFileRoute("/fan")({
  head: () => ({
    meta: [
      { title: "Fan Dashboard — ArenaIQ AI" },
      { name: "description", content: "Your digital ticket, real-time crowd and queue predictions, and seat navigation." },
    ],
  }),
  component: FanPage,
});

function FanPage() {
  return (
    <AppShell title="Match Day" subtitle="Titans FC vs Nova Rangers · Gate B · Section 204, Row 12, Seat 7">
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Digital Ticket */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 lg:row-span-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-primary-glow">Digital Ticket</div>
            <div className="mt-2 text-2xl font-bold">Titans FC <span className="text-muted-foreground">vs</span> Nova Rangers</div>
            <div className="text-sm text-muted-foreground mt-1">Jul 12 · 19:00 · Arena One</div>

            <div className="my-6 flex justify-center">
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeSVG value="ARENAIQ-TKT-2891-7X" size={160} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <TicketField label="Section" value="204" />
              <TicketField label="Row" value="12" />
              <TicketField label="Seat" value="7" />
            </div>
            <div className="mt-4 p-3 rounded-xl glass text-xs text-muted-foreground text-center">
              Present at Gate B · Verified by ArenaIQ
            </div>
          </div>
        </motion.div>

        <StatCard label="Predicted Crowd" value="25.4K" delta="+8%" icon={<Users className="size-5" />} index={0} />
        <StatCard label="Your Gate Wait" value="6 min" delta="-3 min" icon={<Clock className="size-5" />} index={1} />

        {/* Crowd prediction chart */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Crowd Prediction</div>
              <div className="text-xs text-muted-foreground">Live vs AI forecast</div>
            </div>
            <div className="text-xs text-accent">94% confidence</div>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={crowdData}>
                <defs>
                  <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.13 185)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.13 185)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="time" stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 140)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="crowd" stroke="oklch(0.72 0.13 185)" fill="url(#c1)" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="oklch(0.82 0.13 210)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Queue Prediction */}
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold">Gate Queues</div>
          <div className="text-xs text-muted-foreground mb-3">Live wait times</div>
          <div className="space-y-2.5">
            {queueData.slice(0, 5).map((q) => (
              <div key={q.gate}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{q.gate}</span>
                  <span className={q.wait > 10 ? "text-warning" : "text-accent"}>{q.wait} min</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${q.capacity}%`,
                    background: q.wait > 10 ? "var(--warning)" : "var(--accent)"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="size-4 text-primary-glow" />
            <div className="text-sm font-semibold">Match Schedule</div>
          </div>
          <div className="space-y-2">
            {[
              { t: "Today 19:00", m: "Titans FC vs Nova Rangers", v: "Arena One", live: true },
              { t: "Sat 17:30", m: "Phoenix United vs Storm City", v: "Arena Two" },
              { t: "Sun 20:00", m: "Iron Wolves vs Solar Knights", v: "Arena One" },
            ].map((m) => (
              <div key={m.m} className="flex items-center justify-between p-3 rounded-xl glass">
                <div>
                  <div className="text-sm font-medium">{m.m}</div>
                  <div className="text-xs text-muted-foreground">{m.t} · {m.v}</div>
                </div>
                {m.live && <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive border border-destructive/30">LIVE</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="size-4 text-primary-glow" />
            <div className="text-sm font-semibold">Notifications</div>
          </div>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="p-3 rounded-xl glass">
                <div className="text-sm">{n.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seat Nav */}
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-primary-glow" />
            <div className="text-sm font-semibold">Seat Navigation</div>
          </div>
          <div className="relative h-64 rounded-xl overflow-hidden border border-border" style={{
            background: "radial-gradient(ellipse at center, oklch(0.55 0.12 150 / 0.35), oklch(0.20 0.06 140))"
          }}>
            <div className="absolute inset-6 rounded-full border-2 border-accent/40" />
            <div className="absolute inset-16 rounded-full border-2 border-accent/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">PITCH</div>
            <motion.div
              animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-8 right-12 size-3 rounded-full bg-primary shadow-[0_0_20px_oklch(0.72_0.13_185)]"
            />
            <div className="absolute top-6 right-16 text-xs text-primary-glow">Your seat →</div>
            <div className="absolute bottom-4 left-4 text-xs glass rounded-lg px-3 py-1.5"><Ticket className="size-3 inline mr-1" /> 3 min walk from Gate B</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl glass">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-0.5">{value}</div>
    </div>
  );
}
