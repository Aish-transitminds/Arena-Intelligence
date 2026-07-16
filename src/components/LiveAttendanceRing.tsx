import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, ArrowUp } from "lucide-react";
import { useMemo } from "react";

/**
 * LiveAttendanceRing — an animated donut ring showing live attendance
 * against max capacity with sparkline, gate breakdown, and ETA pill.
 */

type LiveAttendanceRingProps = {
  attendance: number;
  capacity: number;
  /** Last N data points for the sparkline */
  sparklineData?: number[];
  /** Per-gate ingress rates */
  gateIngress?: { gate: string; rate: number }[];
  /** Variant controls sizing */
  variant?: "hero" | "compact";
};

const defaultGateIngress = [
  { gate: "A", rate: 72 },
  { gate: "B", rate: 48 },
  { gate: "C", rate: 91 },
  { gate: "D", rate: 85 },
  { gate: "E", rate: 60 },
];

export function LiveAttendanceRing({
  attendance,
  capacity,
  sparklineData = [],
  gateIngress = defaultGateIngress,
  variant = "hero",
}: LiveAttendanceRingProps) {
  const pct = Math.min((attendance / capacity) * 100, 100);
  const isCompact = variant === "compact";

  // Color thresholds
  const ringColor = pct >= 95 ? "#D92D20" : pct >= 80 ? "#F4B400" : "#0E9F6E";
  const ringGlow = pct >= 95
    ? "drop-shadow(0 0 12px rgba(217,45,32,0.50))"
    : pct >= 80
    ? "drop-shadow(0 0 12px rgba(244,180,0,0.40))"
    : "drop-shadow(0 0 12px rgba(14,159,110,0.45))";

  const statusLabel = pct >= 95 ? "Critical" : pct >= 80 ? "Elevated" : "Nominal";
  const statusBg = pct >= 95
    ? "rgba(217,45,32,0.12)"
    : pct >= 80
    ? "rgba(244,180,0,0.12)"
    : "rgba(14,159,110,0.12)";
  const statusBorder = pct >= 95
    ? "rgba(217,45,32,0.25)"
    : pct >= 80
    ? "rgba(244,180,0,0.25)"
    : "rgba(14,159,110,0.25)";

  // SVG ring math
  const r = isCompact ? 40 : 52;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - pct / 100);

  // ETA to full capacity (rough estimate)
  const remainingSeats = capacity - attendance;
  const avgIngressPerMin = gateIngress.reduce((s, g) => s + g.rate, 0) / gateIngress.length;
  const etaMin = avgIngressPerMin > 0 ? Math.round(remainingSeats / (avgIngressPerMin * 2)) : 0;

  // Sparkline SVG path
  const sparklinePath = useMemo(() => {
    if (sparklineData.length < 2) return "";
    const minVal = Math.min(...sparklineData);
    const maxVal = Math.max(...sparklineData);
    const range = maxVal - minVal || 1;
    const w = isCompact ? 80 : 120;
    const h = isCompact ? 24 : 32;
    const step = w / (sparklineData.length - 1);
    return sparklineData
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - minVal) / range) * (h - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [sparklineData, isCompact]);

  const ringSize = isCompact ? 100 : 140;
  const viewBox = isCompact ? "0 0 100 100" : "0 0 140 140";
  const cx = isCompact ? 50 : 70;
  const cy = isCompact ? 50 : 70;

  return (
    <div
      className={`rounded-2xl overflow-hidden relative ${isCompact ? "p-4" : "p-6"}`}
      style={{
        background: "var(--card, rgba(255,255,255,0.90))",
        border: `1px solid ${statusBorder}`,
        boxShadow: `0 0 32px ${pct >= 95 ? "rgba(217,45,32,0.08)" : "rgba(14,159,110,0.06)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="size-8 rounded-lg flex items-center justify-center"
            style={{ background: statusBg, color: ringColor }}
          >
            <Users className="size-4" />
          </div>
          <div>
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "var(--foreground)" }}
            >
              Live Attendance
            </h3>
            <p className="text-[9px] uppercase tracking-[0.14em]" style={{ color: "var(--muted-foreground)" }}>
              Capacity: {capacity.toLocaleString()}
            </p>
          </div>
        </div>
        {/* Status badge */}
        <span
          className="text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
          style={{ background: statusBg, border: `1px solid ${statusBorder}`, color: ringColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Ring + Stats */}
      <div className={`flex ${isCompact ? "gap-4" : "gap-6"} items-center`}>
        {/* Donut Ring */}
        <div className="relative shrink-0" style={{ width: ringSize, height: ringSize }}>
          <svg className="-rotate-90" viewBox={viewBox} style={{ filter: ringGlow }}>
            {/* Background track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(128,128,128,0.08)"
              strokeWidth={isCompact ? 6 : 8}
            />
            {/* Animated progress */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth={isCompact ? 6 : 8}
              strokeDasharray={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={attendance}
              initial={{ opacity: 0.6, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`font-extrabold tracking-tight tabular-nums leading-none ${isCompact ? "text-xl" : "text-3xl"}`}
              style={{ color: "var(--foreground)" }}
            >
              {attendance.toLocaleString()}
            </motion.span>
            <span
              className={`font-bold mt-0.5 ${isCompact ? "text-[10px]" : "text-sm"}`}
              style={{ color: ringColor }}
            >
              {pct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Sparkline */}
          {sparklineData.length >= 2 && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                Trend (Last {sparklineData.length} ticks)
              </p>
              <svg
                viewBox={`0 0 ${isCompact ? 80 : 120} ${isCompact ? 24 : 32}`}
                className="w-full"
                style={{ height: isCompact ? 24 : 32 }}
                preserveAspectRatio="none"
              >
                <path
                  d={sparklinePath}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}

          {/* ETA pill */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}
          >
            <Clock className="size-3" style={{ color: "#3B82F6" }} />
            <span className="text-[10px] font-bold" style={{ color: "#3B82F6" }}>
              {etaMin > 0 ? `~${etaMin} min to full` : "At capacity"}
            </span>
          </div>

          {/* Rate */}
          <div className="flex items-center gap-1.5">
            <ArrowUp className="size-3" style={{ color: ringColor }} />
            <span className="text-[10px] font-bold" style={{ color: "var(--muted-foreground)" }}>
              +{Math.round(avgIngressPerMin * 2)}/min ingress rate
            </span>
          </div>
        </div>
      </div>

      {/* Gate Ingress Breakdown */}
      {!isCompact && (
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(128,128,128,0.10)" }}>
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "var(--muted-foreground)" }}>
            Gate Ingress Load
          </p>
          <div className="grid grid-cols-5 gap-2">
            {gateIngress.map((g) => {
              const gColor = g.rate >= 85 ? "#D92D20" : g.rate >= 60 ? "#F4B400" : "#0E9F6E";
              return (
                <div key={g.gate} className="text-center">
                  <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(128,128,128,0.10)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${g.rate}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: gColor }}
                    />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: "var(--muted-foreground)" }}>
                    {g.gate}
                  </span>
                  <span className="text-[8px] ml-0.5 font-bold" style={{ color: gColor }}>
                    {g.rate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
