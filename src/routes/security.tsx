import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getStoredRole,
  readAuditEvents,
  RATE_LIMIT_STORAGE_KEY,
  clearStoredRole,
} from "@/lib/security";
import {
  ShieldCheck,
  Camera,
  Users,
  AlertTriangle,
  Eye,
  Lock,
  Scan,
  UserX,
  Crown,
  Radio,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [{ title: "Security Dashboard — Arena Intelligence" }],
  }),
  component: Security,
});

const cameraZones = [
  { id: "CAM-N1", zone: "North Gate", status: "active" },
  { id: "CAM-N2", zone: "North Concourse", status: "active" },
  { id: "CAM-E1", zone: "East Stand", status: "active" },
  { id: "CAM-S1", zone: "South Gate", status: "warning" },
  { id: "CAM-W1", zone: "West Concourse", status: "active" },
  { id: "CAM-V1", zone: "VIP Entrance", status: "active" },
];

const patrols = [
  { zone: "North Stand", team: "Alpha-1", status: "On Patrol", eta: "—" },
  { zone: "East Concourse", team: "Bravo-3", status: "On Patrol", eta: "—" },
  { zone: "South Gate", team: "Delta-2", status: "Responding", eta: "3 min" },
  { zone: "VIP Level", team: "Echo-1", status: "Standby", eta: "—" },
];

function Security() {
  const [role, setRole] = useState(getStoredRole());
  const [buckets, setBuckets] = useState<any[]>([]);

  useEffect(() => {
    const s = sessionStorage;
    const keys: any[] = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i) as string;
      if (k.startsWith(RATE_LIMIT_STORAGE_KEY))
        keys.push({ key: k, value: s.getItem(k) });
    }
    setBuckets(keys);
  }, []);

  function handleClearRole() {
    clearStoredRole();
    setRole(getStoredRole());
  }

  return (
    <AppShell themeVariant="enterprise" title="Security Dashboard" subtitle="Stadium Security Operations · Narendra Modi FIFA Stadium">

      {/* ── THREAT LEVEL + ACCESS STATS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <SecurityKPI
          label="Threat Level"
          value="LOW"
          sub="All sectors clear"
          icon={<ShieldCheck className="size-5" />}
          tone="green"
        />
        <SecurityKPI
          label="Credential Scans"
          value="41,280"
          sub="Today's total"
          icon={<Scan className="size-5" />}
          tone="green"
        />
        <SecurityKPI
          label="Denied Entries"
          value="14"
          sub="0.03% rejection rate"
          icon={<UserX className="size-5" />}
          tone="yellow"
        />
        <SecurityKPI
          label="VIP Check-ins"
          value="482"
          sub="Skybox + club level"
          icon={<Crown className="size-5" />}
          tone="green"
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT: Camera Grid + Patrols */}
        <div className="col-span-12 xl:col-span-8 space-y-6">

          {/* Camera Zones Grid */}
          <div
            className="rounded-2xl p-7"
            className="bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">Camera Zones</h2>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Live surveillance feed status</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" style={{ boxShadow: "0 0 6px rgba(14,159,110,0.60)" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#0E9F6E" }}>
                  {cameraZones.filter((c) => c.status === "active").length}/{cameraZones.length} Online
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameraZones.map((cam, i) => (
                <motion.div
                  key={cam.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    border: `1px solid ${cam.status === "warning" ? "rgba(244,180,0,0.25)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  {/* Simulated feed placeholder */}
                  <div
                    className="h-24 rounded-lg mb-3 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.80))",
                      border: "1px solid rgba(0,0,0,0.04)",
                    }}
                  >
                    <Camera className="size-8" style={{ color: "rgba(100,116,139,0.20)" }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">{cam.zone}</p>
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{cam.id}</p>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
                      style={{
                        background: cam.status === "active" ? "rgba(14,159,110,0.12)" : "rgba(244,180,0,0.12)",
                        border: `1px solid ${cam.status === "active" ? "rgba(14,159,110,0.25)" : "rgba(244,180,0,0.25)"}`,
                        color: cam.status === "active" ? "#0E9F6E" : "#F4B400",
                      }}
                    >
                      {cam.status === "active" ? "Live" : "Alert"}
                    </span>
                  </div>
                  {/* Blinking recording indicator */}
                  <div className="absolute top-6 right-6 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-red-400">REC</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Patrols */}
          <div
            className="rounded-2xl overflow-hidden"
            className="bg-card border border-border"
          >
            <div className="px-7 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">Active Patrols</h2>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Security team deployment</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="size-3 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#0E9F6E" }}>
                  Live Tracking
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <th className="text-left px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>Zone</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>Team</th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>Status</th>
                    <th className="text-right px-7 py-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {patrols.map((p, i) => (
                    <tr
                      key={p.team}
                      className="transition-colors"
                      style={{ borderBottom: i < patrols.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,159,110,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-7 py-4 font-medium text-foreground flex items-center gap-2">
                        <MapPin className="size-3.5 text-primary" />
                        {p.zone}
                      </td>
                      <td className="px-4 py-4" style={{ color: "var(--muted-foreground)" }}>{p.team}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                          style={{
                            background:
                              p.status === "On Patrol"
                                ? "rgba(14,159,110,0.12)"
                                : p.status === "Responding"
                                ? "rgba(244,180,0,0.12)"
                                : "rgba(0,0,0,0.05)",
                            border: `1px solid ${
                              p.status === "On Patrol"
                                ? "rgba(14,159,110,0.25)"
                                : p.status === "Responding"
                                ? "rgba(244,180,0,0.25)"
                                : "rgba(0,0,0,0.10)"
                            }`,
                            color:
                              p.status === "On Patrol"
                                ? "#0E9F6E"
                                : p.status === "Responding"
                                ? "#F4B400"
                                : "#64748B",
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-7 py-4 text-right text-xs font-bold" style={{ color: p.eta !== "—" ? "#F4B400" : "#64748B" }}>
                        {p.eta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="col-span-12 xl:col-span-4 space-y-6">

          {/* Threat Gauge */}
          <div
            className="rounded-2xl p-7"
            className="bg-card border border-border"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground mb-1">Threat Assessment</h3>
            <p className="text-[10px] uppercase tracking-[0.14em] mb-6" style={{ color: "var(--muted-foreground)" }}>Current security posture</p>
            <div className="flex items-center justify-center py-4">
              <div className="relative size-44">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="7" />
                  <motion.circle
                    initial={{ strokeDashoffset: 270 }}
                    animate={{ strokeDashoffset: 270 * 0.85 }}
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
                  <ShieldCheck className="size-8 text-primary mb-1" />
                  <span className="text-2xl font-extrabold text-foreground tabular-nums tracking-tight tabular-nums">SAFE</span>
                  <span className="text-[10px] uppercase tracking-[0.20em] mt-1" style={{ color: "var(--muted-foreground)" }}>All Clear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div
            className="rounded-2xl p-6"
            className="bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lock className="size-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">Access Control</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div>
                  <p className="text-xs font-bold text-foreground">Role</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Current session</p>
                </div>
                <span className="text-sm font-bold uppercase px-3 py-1 rounded-full" style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.25)", color: "#0E9F6E" }}>
                  {role}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div>
                  <p className="text-xs font-bold text-foreground">Rate Limit Buckets</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Active session limits</p>
                </div>
                <span className="text-sm font-bold text-foreground">{buckets.length}</span>
              </div>
            </div>
            <button
              onClick={handleClearRole}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] text-foreground transition hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{ background: "linear-gradient(135deg, #D92D20, #FF4D3D)", boxShadow: "0 0 16px rgba(217,45,32,0.20)" }}
            >
              Clear Role Token
            </button>
          </div>

          {/* Security Protocols */}
          <div
            className="rounded-2xl p-6"
            className="bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="size-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">Active Protocols</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "Perimeter Scan", status: "Active" },
                { name: "Bag Check Enforcement", status: "Active" },
                { name: "Counter-Drone System", status: "Active" },
                { name: "Facial Recognition", status: "Standby" },
                { name: "Evacuation Protocol", status: "Standby" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 px-1" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <span className="text-xs text-foreground">{p.name}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                    style={{
                      background: p.status === "Active" ? "rgba(14,159,110,0.12)" : "rgba(0,0,0,0.05)",
                      border: `1px solid ${p.status === "Active" ? "rgba(14,159,110,0.22)" : "rgba(0,0,0,0.08)"}`,
                      color: p.status === "Active" ? "#0E9F6E" : "#64748B",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ── Security KPI Card ── */
function SecurityKPI({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  tone: "green" | "yellow" | "red";
}) {
  const colors = {
    green: { bg: "rgba(14,159,110,0.10)", border: "rgba(14,159,110,0.18)", text: "#0E9F6E" },
    yellow: { bg: "rgba(244,180,0,0.10)", border: "rgba(244,180,0,0.18)", text: "#F4B400" },
    red: { bg: "rgba(217,45,32,0.10)", border: "rgba(217,45,32,0.18)", text: "#D92D20" },
  }[tone];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.90)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </span>
        <div
          className="size-10 rounded-xl flex items-center justify-center"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
        >
          {icon}
        </div>
      </div>
      <span className="text-3xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">{value}</span>
      <p className="text-[10px] uppercase tracking-[0.16em] mt-2" style={{ color: "rgba(100,116,139,0.60)" }}>{sub}</p>
    </motion.div>
  );
}
