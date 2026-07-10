import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Activity, Clock, ShieldCheck,
  ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2,
  Bell, ChevronDown, MoreHorizontal, Target, Radio,
  Thermometer, Zap, ArrowUp, ArrowDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { generateAdminRecommendation } from "@/lib/ai";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Arena Intelligence — Admin Operations Console" },
      { name: "description", content: "FIFA-grade stadium operations dashboard. Real-time attendance, crowd flow, security, and analytics." },
    ],
  }),
  component: Admin,
});

const attendanceTrend = [
  { time: "18:00", current: 18200, forecast: 17800 },
  { time: "18:30", current: 28500, forecast: 26000 },
  { time: "19:00", current: 38800, forecast: 36000 },
  { time: "19:15", current: 44200, forecast: 42000 },
  { time: "19:30", current: 49600, forecast: 47000 },
  { time: "19:45", current: 51200, forecast: 50000 },
  { time: "20:00", current: 52840, forecast: 52000 },
];

const gateQueues = [
  { gate: "Gate A — North", wait: 3, capacity: 42 },
  { gate: "Gate B — VIP", wait: 1, capacity: 18 },
  { gate: "Gate C — East", wait: 7, capacity: 71 },
  { gate: "Gate D — South", wait: 12, capacity: 88 },
  { gate: "Gate E — West", wait: 4, capacity: 55 },
];

const incidents = [
  { time: "20:08", type: "info", msg: "Section 14 occupancy at 94% — monitoring closely." },
  { time: "20:04", type: "warning", msg: "Gate D queue elevated — operational recommendation: redirect to Gate A." },
  { time: "19:58", type: "success", msg: "Medical station Alpha replenished. All units operational." },
  { time: "19:51", type: "critical", msg: "DENSITY THRESHOLD EXCEEDED — Block 22 West. Security dispatched." },
  { time: "19:44", type: "info", msg: "VIP concourse cleared. Crowd flow nominal." },
  { time: "19:38", type: "info", msg: "Sensor heartbeat: 48/48 units responsive." },
];

const sectionOccupancy = [
  { name: "North", value: 94 },
  { name: "South", value: 82 },
  { name: "East", value: 97 },
  { name: "West", value: 88 },
  { name: "VIP", value: 76 },
  { name: "Press", value: 61 },
];

function Admin() {
  const [isRedirected, setIsRedirected] = useState(false);
  const [restrooms, setRestrooms] = useState([
    { id: "A-North", location: "Concourse North (Gate A)", load: "High", wait: "5 min", status: "Clean", cleanStatus: "Idle" },
    { id: "B-VIP", location: "VIP Club Level (Section 204)", load: "Low", wait: "0 min", status: "Needs Service", cleanStatus: "Idle" },
    { id: "C-East", location: "Concourse East (Gate C)", load: "Medium", wait: "2 min", status: "Clean", cleanStatus: "Idle" },
  ]);
  const [incidentList, setIncidentList] = useState(incidents);
  const [newIncidentMsg, setNewIncidentMsg] = useState("");
  const [liveAttendance, setLiveAttendance] = useState(52840);
  const [occupiedSeats, setOccupiedSeats] = useState(97.8);
  const [avgQueueTime, setAvgQueueTime] = useState(4.2);
  const [opsScore, setOpsScore] = useState(97.4);
  const [recommendation, setRecommendation] = useState("Elevated queue detected at Gate D. Redirect fans from Sector 14 ingress to Gate A to reduce peak load by an estimated 38%.");
  const [recommendationBusy, setRecommendationBusy] = useState(false);
  const [showRecommendationReasoning, setShowRecommendationReasoning] = useState(false);
  const [recommendationMeta, setRecommendationMeta] = useState<{prompt:string; rawResponse:string} | null>(null);

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentMsg.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setIncidentList([
      { time: timeStr, type: "critical", msg: newIncidentMsg.trim() },
      ...incidentList,
    ]);
    setNewIncidentMsg("");
  };

  const handleDispatchClean = (id: string) => {
    setRestrooms(
      restrooms.map((r) =>
        r.id === id ? { ...r, cleanStatus: "En Route", status: "Service Scheduled" } : r
      )
    );
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setIncidentList([
      { time: timeStr, type: "success", msg: `Cleaning team dispatched to Restroom Block ${id}.` },
      ...incidentList,
    ]);
  };

  const handleDeployRedirect = async () => {
    setIsRedirected(true);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setIncidentList([
      { time: timeStr, type: "success", msg: `Gate D redirect signal deployed. Ingress traffic rerouting to Gate A.` },
      ...incidentList,
    ]);
    setRecommendationBusy(true);
    try {
      const result = await generateAdminRecommendation(
        [
          { gate: "Gate A", wait: 3 + Math.round(Math.random() * 2), capacity: 40 + Math.round(Math.random() * 10) },
          { gate: "Gate D", wait: 8 + Math.round(Math.random() * 4), capacity: 70 + Math.round(Math.random() * 12) },
        ],
        [
          { name: "North", value: 90 + Math.round(Math.random() * 6) },
          { name: "East", value: 94 + Math.round(Math.random() * 4) },
        ],
      );
      setRecommendation(result.recommendation);
      setRecommendationMeta({ prompt: result.prompt, rawResponse: result.rawResponse });
      setShowRecommendationReasoning(true);
    } catch {
      setRecommendation("Rebalance ingress toward Gate A and reduce the load around the East stand to maintain stable flow.");
    } finally {
      setRecommendationBusy(false);
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveAttendance((current) => Math.max(50000, Math.min(54500, current + Math.round((Math.random() - 0.5) * 220))));
      setOccupiedSeats((current) => Math.max(94.5, Math.min(99.2, current + (Math.random() - 0.5) * 0.7)));
      setAvgQueueTime((current) => Math.max(2.4, Math.min(7.5, current + (Math.random() - 0.5) * 0.6)));
      setOpsScore((current) => Math.max(95.5, Math.min(99.1, current + (Math.random() - 0.5) * 0.35)));
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  const liveAttendanceLabel = useMemo(() => liveAttendance.toLocaleString(), [liveAttendance]);
  const occupiedSeatsLabel = useMemo(() => `${occupiedSeats.toFixed(1)}%`, [occupiedSeats]);
  const avgQueueTimeLabel = useMemo(() => `${avgQueueTime.toFixed(1)}m`, [avgQueueTime]);
  const opsScoreLabel = useMemo(() => `${opsScore.toFixed(1)}%`, [opsScore]);

  return (
    <AppShell title="Operations Console" subtitle="Concept Ops Platform · Stadium Alpha · Match Day Operations">
      <div className="flex flex-wrap items-center justify-end gap-4 mb-8">        {/* Status indicators */}
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 6px rgba(14,159,110,0.60)" }} />
            Sensors: <span className="text-primary ml-1">48/48</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 6px rgba(14,159,110,0.60)" }} />
            Systems: <span className="text-primary ml-1">Nominal</span>
          </div>
        </div>
      </div>


        {/* ── KPI GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <KPICard
            label="Live Attendance"
            value={liveAttendanceLabel}
            sub="Capacity: 54,000"
            delta="Live"
            trend="up"
            icon={<Users className="size-5" />}
            highlight
          />
          <KPICard
            label="Occupied Seats"
            value={occupiedSeatsLabel}
            sub="Normal occupancy flow"
            delta="Optimal"
            icon={<Target className="size-5" />}
          />
          <KPICard
            label="Avg Queue Time"
            value={avgQueueTimeLabel}
            sub="Across 12 active gates"
            delta="Stable"
            icon={<Clock className="size-5" />}
          />
          <KPICard
            label="Operations Score"
            value={opsScoreLabel}
            sub="All systems nominal"
            delta="Active"
            icon={<ShieldCheck className="size-5" />}
          />
        </div>

        {/* ── SECONDARY ALERTS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <AlertPill icon={<AlertCircle className="size-4" />} label="Medical Alerts" value="2 Active" tone="warning" />
          <AlertPill icon={<ShieldCheck className="size-4" />} label="Security Status" value="All Clear" tone="success" />
          <AlertPill icon={<Zap className="size-4" />} label="Crowd Forecast" value="Peak in 18 min" tone="info" />
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-12 gap-6">

          {/* ── LEFT: Charts ── */}
          <div className="col-span-12 xl:col-span-8 space-y-6">

            {/* Attendance Chart */}
            <div
              className="rounded-2xl p-7 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Attendance Flow</h2>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>Live vs Forecast · Today</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: "#64748B" }} />
                    <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>Forecast</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#64748B" }}>
                    <ChevronDown className="size-3" /> Filter
                  </button>
                </div>
              </div>
              <div className="h-48 sm:h-64 w-full">
                <ResponsiveContainer>
                  <AreaChart data={attendanceTrend}>
                    <defs>
                      <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0E9F6E" stopOpacity={0.30} />
                        <stop offset="100%" stopColor="#0E9F6E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.97)",
                        border: "1px solid rgba(14,159,110,0.25)",
                        borderRadius: 12,
                        backdropFilter: "blur(20px)",
                        padding: "10px 14px",
                      }}
                      itemStyle={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}
                      labelStyle={{ fontSize: 10, color: "#64748B", marginBottom: 6 }}
                    />
                    <Area type="monotone" dataKey="current" stroke="#0E9F6E" fill="url(#attendGrad)" strokeWidth={2.5} animationDuration={1800} name="Live" />
                    <Area type="monotone" dataKey="forecast" stroke="#64748B" fill="transparent" strokeWidth={1.5} strokeDasharray="6 4" name="Forecast" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gate Queue Bar Chart */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Gate Wait Times</h2>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>Visual comparison · Live</p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
                >
                  Live
                </span>
              </div>
              <div className="h-48 sm:h-56 w-full">
                <ResponsiveContainer>
                  <BarChart data={gateQueues} layout="vertical" barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
                    <XAxis type="number" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} unit=" min" />
                    <YAxis type="category" dataKey="gate" stroke="#64748B" fontSize={10} axisLine={false} tickLine={false} width={110} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.97)",
                        border: "1px solid rgba(14,159,110,0.25)",
                        borderRadius: 12,
                        backdropFilter: "blur(20px)",
                        padding: "10px 14px",
                      }}
                      itemStyle={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}
                      labelStyle={{ fontSize: 10, color: "#64748B", marginBottom: 6 }}
                      formatter={(value: number) => [`${value} min`, "Wait Time"]}
                    />
                    <Bar dataKey="wait" radius={[0, 6, 6, 0]} animationDuration={1400}>
                      {gateQueues.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.wait > 10 ? "#D92D20" : entry.wait > 6 ? "#F4B400" : "#0E9F6E"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Section Occupancy */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Section Occupancy</h2>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>Live capacity by zone</p>
                </div>
                <button className="size-9 rounded-xl flex items-center justify-center transition" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#64748B" }}>
                  <MoreHorizontal className="size-4" />
                </button>
              </div>

              {/* Donut chart + progress bars side by side */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Donut Chart */}
                <div className="w-full lg:w-48 h-48 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={sectionOccupancy}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        animationDuration={1500}
                        stroke="none"
                      >
                        {sectionOccupancy.map((entry, index) => (
                          <Cell
                            key={`pie-${index}`}
                            fill={entry.value >= 95 ? "#D92D20" : entry.value >= 85 ? "#F4B400" : "#0E9F6E"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255,255,255,0.97)",
                          border: "1px solid rgba(14,159,110,0.25)",
                          borderRadius: 12,
                          padding: "8px 12px",
                        }}
                        itemStyle={{ fontSize: 11, fontWeight: 700 }}
                        formatter={(value: number, name: string) => [`${value}%`, `${name} Stand`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 space-y-4">
                  {sectionOccupancy.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-900">{s.name} Stand</span>
                        <span
                          className="font-bold"
                          style={{ color: s.value >= 95 ? "#D92D20" : s.value >= 85 ? "#F4B400" : "#0E9F6E" }}
                        >
                          {s.value}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              s.value >= 95
                                ? "linear-gradient(90deg, #D92D20, #FF4D3D)"
                                : s.value >= 85
                                ? "linear-gradient(90deg, #F4B400, #FFC72C)"
                                : "linear-gradient(90deg, #0E9F6E, #3CB371)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Crowd Density Heatmap */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Live Crowd Heatmap</h2>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>Top-down density visualization</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
                  <div className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: "#0E9F6E" }}/> <span style={{ color: "#64748B" }}>Optimal</span></div>
                  <div className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: "#F4B400" }}/> <span style={{ color: "#64748B" }}>High</span></div>
                  <div className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: "#D92D20" }}/> <span style={{ color: "#64748B" }}>Critical</span></div>
                </div>
              </div>
              <div className="w-full flex items-center justify-center py-6">
                <CrowdHeatmap data={sectionOccupancy} />
              </div>
            </div>

            {/* Gate Queue Table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="px-7 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-900">Gate Queue Status</h2>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>Live wait times & capacity</p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
                >
                  Live
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <th className="text-left px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>Gate</th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>Wait Time</th>
                    <th className="text-right px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#64748B" }}>Load</th>
                  </tr>
                </thead>
                <tbody>
                  {gateQueues.map((g, i) => (
                    <tr
                      key={g.gate}
                      className="transition-colors"
                      style={{ borderBottom: i < gateQueues.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,159,110,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-7 py-4 font-medium text-slate-900">{g.gate}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className="font-bold"
                          style={{ color: g.wait > 10 ? "#D92D20" : g.wait > 6 ? "#F4B400" : "#0E9F6E" }}
                        >
                          {g.wait} min
                        </span>
                      </td>
                      <td className="px-7 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${g.capacity}%`,
                                background:
                                  g.capacity >= 80
                                    ? "linear-gradient(90deg, #D92D20, #FF4D3D)"
                                    : g.capacity >= 60
                                    ? "#F4B400"
                                    : "#0E9F6E",
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-900">{g.capacity}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="col-span-12 xl:col-span-4 space-y-6">

            {/* Operational Recommendation */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.90)",
                border: isRedirected ? "1px solid rgba(14,159,110,0.25)" : "1px solid rgba(0,0,0,0.06)",
                borderLeft: "4px solid #0E9F6E",
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="size-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.20)" }}
                >
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">Operational Recommendation</h3>
                  <p className="text-[10px] mt-0.5 uppercase tracking-[0.14em]" style={{ color: "#64748B" }}>Flow Analysis · Gate D</p>
                </div>
              </div>
              <p className="text-sm leading-7 mb-5" style={{ color: "#64748B" }}>
                {recommendationBusy ? "Generating an AI recommendation from live gate and occupancy data…" : recommendation}
              </p>
              <button
                type="button"
                onClick={() => setShowRecommendationReasoning((v) => !v)}
                className="mb-4 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-900"
                style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.22)" }}
              >
                {showRecommendationReasoning ? "Hide AI reasoning" : "Show AI reasoning"}
              </button>
              {showRecommendationReasoning && recommendationMeta && (
                <div className="mb-4 rounded-xl p-3 text-sm" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#64748B" }}>Prompt / Response</p>
                  <p className="text-slate-900 font-semibold">Prompt</p>
                  <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-5" style={{ color: "#64748B" }}>{recommendationMeta.prompt}</pre>
                  <p className="mt-3 text-slate-900 font-semibold">Raw Response</p>
                  <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-5" style={{ color: "#64748B" }}>{recommendationMeta.rawResponse}</pre>
                </div>
              )}
              {isRedirected ? (
                <div className="space-y-3">
                  <div
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-primary text-center bg-primary/10 border border-primary/25 cursor-default"
                  >
                    Signal Active — Ingress Diverted
                  </div>
                  <p className="text-[11px] leading-5" style={{ color: "#0E9F6E" }}>
                    ✓ Digital signage updated. Gate D wait time reducing. Inflow re-routed successfully to Gate A.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleDeployRedirect}
                  className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 0 20px rgba(14,159,110,0.20)" }}
                >
                  Dispatch Redirect Signal
                </button>
              )}
            </div>

            {/* Restrooms Operations Panel */}
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="size-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">Amenities &amp; Restrooms</h3>
              </div>
              <div className="space-y-3.5">
                {restrooms.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl flex items-center justify-between"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{res.location}</h4>
                      <p className="text-[10px] mt-1" style={{ color: "#64748B" }}>
                        Load: <span className="text-slate-900 font-semibold">{res.load}</span> · Wait: <span className="text-slate-900 font-semibold">{res.wait}</span>
                      </p>
                      <p className="text-[10px] mt-1.5 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: res.status === "Clean" ? "#0E9F6E" : "#D92D20" }} />
                        <span style={{ color: res.status === "Clean" ? "#0E9F6E" : "#FF6B5B" }}>{res.status}</span>
                      </p>
                    </div>
                    {res.cleanStatus === "En Route" ? (
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-lg cursor-default">
                        Crew En Route
                      </span>
                    ) : res.status === "Needs Service" ? (
                      <button
                        onClick={() => handleDispatchClean(res.id)}
                        className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-900 bg-red-600 hover:bg-red-500 px-2.5 py-1.5 rounded-lg transition active:scale-95 cursor-pointer border-none outline-none"
                      >
                        Dispatch Crew
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg cursor-default">
                        Nominal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Score Gauge */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900 mb-1">Operations Score</h3>
              <p className="text-[10px] uppercase tracking-[0.14em] mb-6" style={{ color: "#64748B" }}>Overall readiness index</p>

              <div className="flex items-center justify-center py-4">
                <div className="relative size-44 group cursor-pointer">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="7" />
                    <motion.circle
                      initial={{ strokeDashoffset: 270 }}
                      animate={{ strokeDashoffset: 270 * (1 - 0.974) }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      cx="50" cy="50" r="43"
                      fill="none"
                      stroke="#0E9F6E"
                      strokeWidth="7"
                      strokeDasharray="270"
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 8px rgba(14,159,110,0.50))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none">97</span>
                    <span className="text-lg font-bold text-primary mt-0.5">%</span>
                    <span className="text-[10px] uppercase tracking-[0.20em] mt-2" style={{ color: "#64748B" }}>Nominal</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: "#64748B" }}>Response Latency</p>
                  <p className="text-lg font-extrabold text-slate-900">0.42<span className="text-xs ml-1" style={{ color: "#64748B" }}>ms</span></p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: "#64748B" }}>Sensor Accuracy</p>
                  <p className="text-lg font-extrabold text-slate-900">99.8<span className="text-xs ml-1" style={{ color: "#64748B" }}>%</span></p>
                </div>
              </div>
            </div>

            {/* Recent Events Feed */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
            >
              <div
                className="px-6 py-5 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900">Live Incident Feed</h3>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full"
                  style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.18)", color: "#0E9F6E" }}
                >
                  Live
                </span>
              </div>
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {incidentList.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex gap-3 rounded-xl px-3 py-3 transition-colors"
                      style={{
                        background:
                          log.type === "critical"
                            ? "rgba(217,45,32,0.06)"
                            : log.type === "warning"
                            ? "rgba(244,180,0,0.05)"
                            : "transparent",
                        border:
                          log.type === "critical"
                            ? "1px solid rgba(217,45,32,0.12)"
                            : log.type === "warning"
                            ? "1px solid rgba(244,180,0,0.10)"
                            : "1px solid transparent",
                      }}
                    >
                      <div
                        className="size-1.5 rounded-full mt-2 shrink-0"
                        style={{
                          background:
                            log.type === "critical"
                              ? "#D92D20"
                              : log.type === "warning"
                              ? "#F4B400"
                              : log.type === "success"
                              ? "#0E9F6E"
                              : "#64748B",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs leading-5"
                          style={{
                            color:
                              log.type === "critical"
                                ? "#FF6B5B"
                                : log.type === "warning"
                                ? "#FFC72C"
                                : "#64748B",
                            fontWeight: log.type === "critical" ? 700 : 500,
                          }}
                        >
                          {log.msg}
                        </p>
                        <p className="text-[10px] mt-0.5 font-mono" style={{ color: "rgba(100,116,139,0.50)" }}>
                          {log.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Form to log incidents */}
              <form onSubmit={handleAddIncident} className="p-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  placeholder="Log custom operational incident..."
                  value={newIncidentMsg}
                  onChange={(e) => setNewIncidentMsg(e.target.value)}
                  className="flex-1 bg-transparent rounded-lg px-3 py-2 text-xs text-slate-900 border border-white/10 focus:outline-none focus:border-primary/50 placeholder:text-slate-600 outline-none transition"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-primary hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  Log
                </button>
              </form>
              <div
                className="px-6 py-3 flex items-center gap-2"
                style={{ borderTop: "1px solid rgba(0,0,0,0.05)", background: "rgba(7,20,28,0.40)" }}
              >
                <Radio className="size-3 text-primary animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: "#64748B" }}>
                  Receiving live telemetry…
                </span>
              </div>
            </div>
          </div>
        </div>



      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-8 mt-8 flex flex-col xl:flex-row items-center justify-between gap-6"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <span className="size-2 rounded-full bg-primary" style={{ boxShadow: "0 0 6px rgba(14,159,110,0.60)" }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#64748B" }}>
            All Systems Operational
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(100,116,139,0.50)" }}>
          <span>Uptime: <span style={{ color: "#64748B" }}>421d 14h 22m</span></span>
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Emergency Overrides</a>
        </div>
        <div
          className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", color: "#64748B" }}
        >
          v4.2.1
        </div>
      </footer>
    </AppShell>
  );
}

/* ── KPI Card ── */
function KPICard({
  label,
  value,
  sub,
  delta,
  trend,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  sub: string;
  delta: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl p-6 relative overflow-hidden card-lift"
      style={{
        background: "rgba(255,255,255,0.90)",
        border: highlight ? "1px solid rgba(14,159,110,0.18)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: highlight ? "0 0 32px rgba(14,159,110,0.06)" : "none",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#64748B" }}>
          {label}
        </span>
        <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,0,0,0.03)", color: "#64748B" }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        <div className="flex items-center gap-3 mt-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.16em] px-2 py-1 rounded-md"
            style={{
              background: trend === "down" ? "rgba(217,45,32,0.10)" : "rgba(14,159,110,0.10)",
              color: trend === "down" ? "#D92D20" : "#0E9F6E",
            }}
          >
            {trend === "up" && <ArrowUp className="size-3 inline mr-1" />}
            {trend === "down" && <ArrowDown className="size-3 inline mr-1" />}
            {delta}
          </span>
          <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "#64748B" }}>
            {sub}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AlertPill({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "success" | "warning" | "critical" | "info" }) {
  const colors = {
    success: { bg: "rgba(14,159,110,0.10)", text: "#0E9F6E", border: "rgba(14,159,110,0.20)" },
    warning: { bg: "rgba(244,180,0,0.10)", text: "#F4B400", border: "rgba(244,180,0,0.20)" },
    critical: { bg: "rgba(217,45,32,0.10)", text: "#D92D20", border: "rgba(217,45,32,0.20)" },
    info: { bg: "rgba(59,130,246,0.10)", text: "#3B82F6", border: "rgba(59,130,246,0.20)" },
  };
  const c = colors[tone];
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: "rgba(255,255,255,0.90)", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">{label}</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: c.text }}>{value}</span>
    </div>
  );
}

function CrowdHeatmap({ data }: { data: { name: string; value: number }[] }) {
  const getColor = (val: number) => {
    if (val >= 95) return "rgba(217,45,32,0.9)";
    if (val >= 85) return "rgba(244,180,0,0.9)";
    return "rgba(14,159,110,0.9)";
  };

  const getSection = (name: string) => data.find(d => d.name === name)?.value || 0;

  return (
    <div className="relative size-64 sm:size-80 flex items-center justify-center p-8 bg-slate-50 rounded-full border border-slate-200 shadow-inner">
      {/* Pitch */}
      <div className="absolute w-24 h-40 border-2 border-emerald-400 rounded-lg bg-emerald-100 flex items-center justify-center shadow-md">
         <div className="w-16 h-16 border-2 border-emerald-400 rounded-full flex items-center justify-center" />
         <div className="absolute top-0 w-12 h-6 border-b-2 border-l-2 border-r-2 border-emerald-400" />
         <div className="absolute bottom-0 w-12 h-6 border-t-2 border-l-2 border-r-2 border-emerald-400" />
      </div>

      {/* North Stand */}
      <motion.div 
        className="absolute top-2 w-32 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
        animate={{ backgroundColor: getColor(getSection("North")) }}
        transition={{ duration: 1.5 }}
      >
        NORTH ({getSection("North").toFixed(1)}%)
      </motion.div>

      {/* South Stand */}
      <motion.div 
        className="absolute bottom-2 w-32 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
        animate={{ backgroundColor: getColor(getSection("South")) }}
        transition={{ duration: 1.5 }}
      >
        SOUTH ({getSection("South").toFixed(1)}%)
      </motion.div>

      {/* West Stand */}
      <motion.div 
        className="absolute left-2 w-8 h-32 rounded-full flex items-center justify-center shadow-lg"
        animate={{ backgroundColor: getColor(getSection("West")) }}
        transition={{ duration: 1.5 }}
      >
        <span className="-rotate-90 text-[10px] font-bold text-white whitespace-nowrap">WEST ({getSection("West").toFixed(1)}%)</span>
      </motion.div>

      {/* East Stand */}
      <motion.div 
        className="absolute right-2 w-8 h-32 rounded-full flex items-center justify-center shadow-lg"
        animate={{ backgroundColor: getColor(getSection("East")) }}
        transition={{ duration: 1.5 }}
      >
        <span className="rotate-90 text-[10px] font-bold text-white whitespace-nowrap">EAST ({getSection("East").toFixed(1)}%)</span>
      </motion.div>

      {/* VIP Stand */}
      <motion.div 
        className="absolute top-6 right-6 w-16 h-8 rounded-full flex items-center justify-center shadow-lg rotate-45"
        animate={{ backgroundColor: getColor(getSection("VIP")) }}
        transition={{ duration: 1.5 }}
      >
        <span className="text-[8px] font-bold text-white whitespace-nowrap">VIP ({getSection("VIP").toFixed(1)}%)</span>
      </motion.div>
      
      {/* Press Stand */}
      <motion.div 
        className="absolute bottom-6 left-6 w-16 h-8 rounded-full flex items-center justify-center shadow-lg rotate-45"
        animate={{ backgroundColor: getColor(getSection("Press")) }}
        transition={{ duration: 1.5 }}
      >
        <span className="text-[8px] font-bold text-white whitespace-nowrap">PRESS ({getSection("Press").toFixed(1)}%)</span>
      </motion.div>
    </div>
  );
}
