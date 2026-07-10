import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Heart, Shield, PhoneCall, Route as RouteIcon, MapPin, Radio, Clock, AlertCircle, CheckCircle2, ChevronRight, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { checkRateLimit, recordAuditEvent } from "@/lib/security";
import { generateEmergencyPlan } from "@/lib/ai";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Center — Arena Intelligence" },
      { name: "description", content: "SOS dispatch, medical response, security coordination, and evacuation routing." },
    ],
  }),
  component: Emergency,
});

const recentIncidents = [
  { time: "19:58", type: "resolved", msg: "Medical unit M-2 cleared Section 12 incident. Zone back to normal." },
  { time: "19:44", msg: "Security patrol S-4 completed sweep of concourse East.", type: "info" },
  { time: "19:31", type: "alert", msg: "Elevated crowd density in Block 22 West. Security dispatched." },
  { time: "19:20", type: "info", msg: "Gate B medical station restocked. All units operational." },
];

function Emergency() {
  const [sos, setSos] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const cooldown = useMemo(() => 20, []);

  const [selectedArea, setSelectedArea] = useState("Section 204");
  const [incidentType, setIncidentType] = useState("Overcrowding");
  const [description, setDescription] = useState("");
  const [incList, setIncList] = useState(recentIncidents);
  const [activeSosArea, setActiveSosArea] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiPlan, setAiPlan] = useState<Awaited<ReturnType<typeof generateEmergencyPlan>> | null>(null);
  const [showAiReasoning, setShowAiReasoning] = useState(false);

  const handleSos = () => {
    const limit = checkRateLimit("emergency-sos", 1, 20000);
    if (!limit.allowed) {
      setStatus(`Cooldown active · ${Math.ceil((limit.resetAt - Date.now()) / 1000)}s remaining`);
      recordAuditEvent("emergency-rate-limit", "SOS trigger blocked");
      return;
    }
    setSos(true);
    setStatus("Stadium-Wide Alarm — Medical M-2 · Security S-4 · Zone Marshals notified");
    setIncList([
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: "alert", msg: "[SYSTEM SOS] Stadium-wide emergency alarm activated. Evacuation routing operational." },
      ...incList
    ]);
    recordAuditEvent("emergency-sos", "Stadium-wide emergency response triggered");
  };

  const handleAreaSos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) return;

    const limit = checkRateLimit("area-sos", 3, 20000);
    if (!limit.allowed) {
      setStatus(`Rate limit active. Please wait before submitting more reports.`);
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const typeLabel = incidentType.toUpperCase();
    const detail = description.trim() ? `: "${description.trim()}"` : "";

    setIncList([
      {
        time: timeStr,
        type: "alert",
        msg: `[SOS REPORT] ${typeLabel} at ${selectedArea}${detail}. Emergency responders dispatched.`,
      },
      ...incList,
    ]);

    setActiveSosArea(selectedArea);
    setSos(true);
    setStatus(`SOS Dispatched to ${selectedArea} · Responders deployed.`);
    setDescription("");
    setAiBusy(true);

    try {
      const result = await generateEmergencyPlan(
        description.trim() || `Localized ${incidentType.toLowerCase()} report at ${selectedArea}`,
        selectedArea,
        76 + Math.round(Math.random() * 16),
        72 + Math.round(Math.random() * 12),
      );
      setAiPlan(result);
      setShowAiReasoning(true);
    } catch {
      setAiPlan(null);
    } finally {
      setAiBusy(false);
    }

    recordAuditEvent("area-sos", `SOS report submitted for ${selectedArea} - ${incidentType}`);
  };

  // Dynamically update medical posts based on selected area
  const dynamicMedicalPosts = useMemo(() => {
    if (selectedArea.includes("102") || selectedArea.includes("Gate A")) {
      return [
        { name: "Gate A Medical Post", dist: "45m · 1 min walk", available: true },
        { name: "Section 100 First Aid", dist: "95m · 1 min walk", available: true },
        { name: "Mobile Unit M-1", dist: "180m · 2 min walk", available: true },
      ];
    }
    return [
      { name: "Gate B Medical Post", dist: "82m · 1 min walk", available: true },
      { name: "Section 200 First Aid", dist: "140m · 2 min walk", available: true },
      { name: "Mobile Unit M-4", dist: "210m · 3 min walk", available: false },
    ];
  }, [selectedArea]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatus((current) => current ? current : null);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AppShell themeVariant="public-safety" title="Emergency Center" subtitle="Coordinated response · Live dispatch · All zones monitored">
      <div className="grid lg:grid-cols-3 gap-5">

        {/* ── SOS CONTROL PANEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,0.90)",
            border: sos ? "1px solid rgba(217,45,32,0.30)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* Header band */}
          <div
            className="px-7 py-5 flex items-center justify-between"
            style={{
              background: sos ? "rgba(217,45,32,0.10)" : "rgba(0,0,0,0.03)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.24em]"
                style={{ color: sos ? "#D92D20" : "#64748B" }}
              >
                Emergency Dispatch &amp; Fan SOS
              </p>
              <h2 className="text-xl font-extrabold text-foreground mt-1">
                {sos ? "Emergency Response Active" : "Stadium Emergency Hub"}
              </h2>
            </div>
            {sos && (
              <div className="flex items-center gap-2 rounded-full px-4 py-2" style={{ background: "rgba(217,45,32,0.12)", border: "1px solid rgba(217,45,32,0.28)" }}>
                <Radio className="size-3.5 animate-pulse" style={{ color: "#D92D20" }} />
                <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "#D92D20" }}>Active</span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Split layout: Global SOS vs localized Area report */}
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Column: Global SOS button */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(0,0,0,0.04)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>Stadium-Wide Alarm</p>
                
                <motion.button
                  onClick={handleSos}
                  whileTap={{ scale: 0.95 }}
                  animate={sos ? { scale: [1, 1.04, 1] } : {}}
                  transition={sos ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : {}}
                  disabled={sos}
                  className="size-36 rounded-full flex flex-col items-center justify-center font-extrabold text-foreground cursor-pointer disabled:cursor-not-allowed relative"
                  style={{
                    background: sos
                      ? "linear-gradient(145deg, #9B1E18, #D92D20)"
                      : "linear-gradient(145deg, #D92D20, #FF4A3A)",
                    boxShadow: sos
                      ? "0 0 40px rgba(217,45,32,0.40)"
                      : "0 0 20px rgba(217,45,32,0.25)",
                  }}
                >
                  {sos && (
                    <motion.div
                      animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: "rgba(217,45,32,0.20)" }}
                    />
                  )}
                  <ShieldAlert className="size-10 mb-1.5" />
                  <span className="text-lg font-black tracking-wider">{sos ? "ACTIVE" : "SOS"}</span>
                </motion.button>
                <p className="text-[10px] mt-4 text-center max-w-[200px]" style={{ color: "var(--muted-foreground)" }}>
                  Triggers immediate warning signal across all screens and gates.
                </p>
              </div>

              {/* Right Column: Localized SOS Reporting */}
              <form onSubmit={handleAreaSos} className="flex flex-col text-left p-6 rounded-2xl border" style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(0,0,0,0.04)" }}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Report Localized Incident</h3>
                
                <div className="space-y-3.5 flex-1">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Select Location / Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="mt-1.5 w-full rounded-xl px-3 py-2 text-xs text-foreground outline-none select-none"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <option value="Section 204" className="bg-[#0E1B24]">Section 204 (East Stand)</option>
                      <option value="Section 102" className="bg-[#0E1B24]">Section 102 (West Stand)</option>
                      <option value="Gate B Concourse" className="bg-[#0E1B24]">Gate B Concourse Loop</option>
                      <option value="Gate A Concourse" className="bg-[#0E1B24]">Gate A Concourse Loop</option>
                      <option value="VIP Suite North" className="bg-[#0E1B24]">VIP Suite North</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Incident Type</label>
                    <select
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value)}
                      className="mt-1.5 w-full rounded-xl px-3 py-2 text-xs text-foreground outline-none"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <option value="Overcrowding" className="bg-[#0E1B24]">Overcrowding &amp; Flow Anomaly</option>
                      <option value="Medical Emergency" className="bg-[#0E1B24]">Medical Emergency / First Aid</option>
                      <option value="Security Alert" className="bg-[#0E1B24]">Security / Behavioral Alert</option>
                      <option value="Hazard &amp; Safety" className="bg-[#0E1B24]">Hazard &amp; Safety Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Details / Description</label>
                    <textarea
                      placeholder="e.g. Sudden crowding spike at exits, stairs congested..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-xs text-foreground outline-none h-16 resize-none transition"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(14,159,110,0.35)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.08)")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-5 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground hover:opacity-90 active:scale-95 transition cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #D92D20, #9B1E18)" }}
                >
                  Send SOS Report
                </button>
              </form>

            </div>

            {/* Status message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl px-5 py-3.5 text-sm font-medium text-center max-w-xl mx-auto"
                  style={{
                    background: "rgba(217,45,32,0.08)",
                    border: "1px solid rgba(217,45,32,0.20)",
                    color: "#FF6B5B",
                  }}
                >
                  {status}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 rounded-2xl border p-5" style={{ background: "rgba(0,0,0,0.02)", borderColor: "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted-foreground)" }}>AI-Generated Response Plan</p>
                  <h3 className="text-sm font-bold text-foreground">Live incident analysis</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiReasoning((v) => !v)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground"
                  style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.22)" }}
                >
                  {showAiReasoning ? "Hide AI reasoning" : "Show AI reasoning"}
                </button>
              </div>

              {aiBusy ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Generating live response plan…</p>
              ) : aiPlan ? (
                <div className="space-y-3">
                  <div className="rounded-xl p-3" style={{ background: "rgba(14,159,110,0.08)", border: "1px solid rgba(14,159,110,0.16)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground">Severity</span>
                      <span className="text-xs font-semibold" style={{ color: "#0E9F6E" }}>{aiPlan.plan.severity}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                      {aiPlan.plan.recommendedActions.map((action) => <li key={action}>• {action}</li>)}
                    </ul>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--muted-foreground)" }}>Alert Teams</p>
                      <p className="text-foreground">{aiPlan.plan.alertTeams.join(", ")}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--muted-foreground)" }}>Alert Gates</p>
                      <p className="text-foreground">{aiPlan.plan.alertGates.join(", ")}</p>
                    </div>
                  </div>
                  {showAiReasoning && (
                    <div className="rounded-xl p-3 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--muted-foreground)" }}>Prompt / Response</p>
                      <p className="text-foreground font-semibold">Prompt</p>
                      <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-5" style={{ color: "var(--muted-foreground)" }}>{aiPlan.prompt}</pre>
                      <p className="mt-3 text-foreground font-semibold">Raw Response</p>
                      <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-5" style={{ color: "var(--muted-foreground)" }}>{aiPlan.rawResponse}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Submit an incident to generate a live AI plan.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── RESPONSE TEAMS ── */}
        <div className="space-y-4">
          <ResponseCard icon={Heart} title="Medical" count={4} status="On standby — Gate A &amp; B" tone="danger" />
          <ResponseCard icon={Shield} title="Security" count={12} status="Active patrol" tone="primary" />
          <ResponseCard icon={PhoneCall} title="Hotline" count={1} status="Live 24/7" tone="warning" />

          {/* Nearest medical */}
          <div
            className="rounded-2xl p-5"
            className="bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="size-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-[0.20em] text-foreground">Nearest Medical Station</h3>
            </div>
            <div className="space-y-2">
              {dynamicMedicalPosts.map((loc) => (
                <div
                  key={loc.name}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{loc.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{loc.dist}</p>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.16em] px-2 py-1 rounded-full"
                    style={{
                      background: loc.available ? "rgba(14,159,110,0.12)" : "rgba(170,184,194,0.08)",
                      border: loc.available ? "1px solid rgba(14,159,110,0.22)" : "1px solid rgba(170,184,194,0.15)",
                      color: loc.available ? "#0E9F6E" : "#64748B",
                    }}
                  >
                    {loc.available ? "Available" : "Deployed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EVACUATION ROUTES ── */}
        <div
          className="rounded-2xl overflow-hidden lg:col-span-2"
          className="bg-card border border-border"
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <RouteIcon className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Evacuation Routes</h2>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
              style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
            >
              All Exit Routes Operational
            </span>
          </div>

          {/* Stadium blueprint */}
          <div
            className="relative h-72"
            style={{ background: "radial-gradient(ellipse at center, rgba(14,159,110,0.10) 0%, rgba(7,20,28,0.97) 70%)" }}
          >
            {/* Rings */}
            <div className="absolute inset-8 rounded-[42%] border-2" style={{ borderColor: "rgba(14,159,110,0.15)" }} />
            <div className="absolute inset-20 rounded-[42%] border" style={{ borderColor: "rgba(14,159,110,0.10)" }} />

            {/* Field */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]"
              style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.18)", color: "#0E9F6E" }}
            >
              FIELD
            </div>

            {/* Exits */}
            {[
              { pos: "top-3 left-8", label: "Exit A", key: "A" },
              { pos: "top-3 right-8", label: "Exit B", key: "B" },
              { pos: "bottom-3 left-8", label: "Exit C", key: "C" },
              { pos: "bottom-3 right-8", label: "Exit D", key: "D" },
              { pos: "top-1/2 left-2 -translate-y-1/2", label: "Exit E", key: "E" },
              { pos: "top-1/2 right-2 -translate-y-1/2", label: "Exit F", key: "F" },
            ].map((e) => {
              // Highlight routes matching targeted area selection
              const isTargeted = (selectedArea.includes("102") || selectedArea.includes("Gate A"))
                ? (e.key === "A" || e.key === "E")
                : (e.key === "B" || e.key === "D");

              return (
                <div
                  key={e.label}
                  className={`absolute ${e.pos} rounded-lg px-2.5 py-1.5 text-[10px] flex items-center gap-1.5 font-bold transition-all duration-500`}
                  style={{
                    background: isTargeted ? "rgba(217,45,32,0.18)" : "rgba(14,159,110,0.12)",
                    border: isTargeted ? "1px solid rgba(217,45,32,0.40)" : "1px solid rgba(14,159,110,0.25)",
                    color: isTargeted ? "#FF6B5B" : "#0E9F6E",
                    boxShadow: isTargeted ? "0 0 14px rgba(217,45,32,0.30)" : "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <MapPin className="size-2.5" />
                  {e.label}
                  {isTargeted && <span className="size-1.5 rounded-full bg-red-500 animate-ping" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── INCIDENT FEED ── */}
        <div
          className="rounded-2xl overflow-hidden"
          className="bg-card border border-border"
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">Incident Log</h3>
            <div className="flex items-center gap-2">
              <Radio className="size-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Live</span>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
            {incList.map((inc, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl transition-all"
                style={{
                  background:
                    inc.type === "alert"
                      ? "rgba(217,45,32,0.06)"
                      : inc.type === "resolved"
                      ? "rgba(14,159,110,0.05)"
                      : "rgba(0,0,0,0.02)",
                  border:
                    inc.type === "alert"
                      ? "1px solid rgba(217,45,32,0.12)"
                      : inc.type === "resolved"
                      ? "1px solid rgba(14,159,110,0.12)"
                      : "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="size-1.5 rounded-full mt-1.5 shrink-0"
                  style={{
                    background:
                      inc.type === "alert" ? "#D92D20" : inc.type === "resolved" ? "#0E9F6E" : "#64748B",
                  }}
                />
                <div>
                  <p className="text-xs leading-5" style={{ color: inc.type === "alert" ? "#FF6B5B" : "#64748B" }}>
                    {inc.msg}
                  </p>
                  <p className="text-[10px] mt-0.5 font-mono" style={{ color: "rgba(170,184,194,0.45)" }}>{inc.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ResponseCard({
  icon: Icon,
  title,
  count,
  status,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  status: string;
  tone: "danger" | "primary" | "warning";
}) {
  const colors = {
    danger: { bg: "rgba(217,45,32,0.06)", border: "rgba(217,45,32,0.12)", text: "#D92D20" },
    primary: { bg: "rgba(14,159,110,0.06)", border: "rgba(14,159,110,0.12)", text: "#0E9F6E" },
    warning: { bg: "rgba(244,180,0,0.06)", border: "rgba(244,180,0,0.12)", text: "#F4B400" },
  }[tone];

  return (
    <div
      className="p-5 rounded-2xl flex items-center justify-between"
      className="bg-card border border-border"
    >
      <div className="flex items-center gap-4">
        <div
          className="size-11 rounded-xl flex items-center justify-center"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{status}</p>
        </div>
      </div>
      <div className="text-3xl font-extrabold text-foreground tracking-tight tabular-nums">{count}</div>
    </div>
  );
}
