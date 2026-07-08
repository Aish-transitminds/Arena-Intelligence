import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { crowdData, queueData, revenueData, alerts } from "@/lib/mock-data";
import { Users, DollarSign, AlertTriangle, Activity } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ArenaIQ AI" },
      { name: "description", content: "Real-time attendance, queue analytics, revenue and alerts for stadium operations." },
    ],
  }),
  component: Admin,
});

function Admin() {
  return (
    <AppShell title="Operations Command" subtitle="Live · Arena One · Jul 12 · 19:00 kickoff">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Attendance" value="24,812" delta="+8%" icon={<Users className="size-5" />} index={0} />
        <StatCard label="Revenue Today" value="$284K" delta="+12%" icon={<DollarSign className="size-5" />} index={1} />
        <StatCard label="Active Alerts" value="3" delta="+1" icon={<AlertTriangle className="size-5" />} index={2} />
        <StatCard label="System Load" value="62%" delta="-4%" icon={<Activity className="size-5" />} index={3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Crowd Analytics</div>
              <div className="text-xs text-muted-foreground">Actual vs predicted attendance</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={crowdData}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.13 185)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.13 185)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.13 210)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.82 0.13 210)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="time" stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 140)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="crowd" stroke="oklch(0.72 0.13 185)" fill="url(#a1)" strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" stroke="oklch(0.82 0.13 210)" fill="url(#a2)" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold mb-3">Live Alerts</div>
          <div className="space-y-2">
            {alerts.map((a) => {
              const c = a.level === "critical" ? "destructive" : a.level === "warning" ? "warning" : "primary";
              return (
                <div key={a.id} className={`p-3 rounded-xl glass border-l-2`} style={{ borderLeftColor: `var(--${c})` }}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wider" style={{ color: `var(--${c})` }}>{a.level}</div>
                    <div className="text-[10px] text-muted-foreground">{a.time}</div>
                  </div>
                  <div className="text-sm font-medium mt-1">{a.zone}</div>
                  <div className="text-xs text-muted-foreground">{a.message}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Queue analytics */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="text-sm font-semibold mb-1">Queue Analytics</div>
          <div className="text-xs text-muted-foreground mb-4">Wait time and capacity per gate</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="gate" stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 140)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Bar dataKey="wait" fill="oklch(0.72 0.13 185)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="capacity" fill="oklch(0.82 0.13 210)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap placeholder */}
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold mb-1">Density Heatmap</div>
          <div className="text-xs text-muted-foreground mb-3">Section-level occupancy</div>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 64 }).map((_, i) => {
              // Deterministic per-cell intensity to avoid SSR/client hydration mismatch
              const intensity = Math.abs(Math.sin(i * 1.7 + 0.4));
              const color = intensity > 0.8 ? "oklch(0.65 0.23 25)"
                : intensity > 0.6 ? "oklch(0.78 0.16 70)"
                : intensity > 0.3 ? "oklch(0.82 0.13 210)"
                : "oklch(0.28 0.03 230)";
              return <div key={i} className="aspect-square rounded" style={{ background: color, opacity: 0.4 + intensity * 0.6 }} />;
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded" style={{ background: "oklch(0.82 0.13 210)" }} /> Safe</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded" style={{ background: "oklch(0.78 0.16 70)" }} /> Busy</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded" style={{ background: "oklch(0.65 0.23 25)" }} /> Dense</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="text-sm font-semibold mb-1">Revenue Breakdown</div>
          <div className="text-xs text-muted-foreground mb-4">Tickets · Concessions · Merch</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 130)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.05 140)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="tickets" stackId="a" fill="oklch(0.72 0.13 185)" />
                <Bar dataKey="concessions" stackId="a" fill="oklch(0.82 0.13 210)" />
                <Bar dataKey="merch" stackId="a" fill="oklch(0.78 0.16 70)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
