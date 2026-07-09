import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useMemo, memo } from "react";

const SeatGroup = memo(
  ({
    section,
    mode,
  }: {
    section: { id: string; x: number; y: number; w: number; h: number; rows: number; cols: number };
    mode: "standard" | "thermal" | "heatmap";
  }) => {
    return (
      <g className="opacity-50">
        {Array.from({ length: section.rows }).map((_, r) =>
          Array.from({ length: section.cols }).map((_, c) => {
            const occupied = (r + c) % 7 !== 0 && (r + c) % 11 !== 0;
            const intensity = Math.sin(r * 0.5 + c * 0.5) * 0.5 + 0.5;

            let fill = occupied ? "#0E9F6E" : "#07141C";
            let fillOpacity = occupied ? 0.3 + intensity * 0.5 : 0.1;

            if (mode === "thermal") {
              // Thermal scanning: occupied are hot (yellow/orange/red), empty are cold (deep blue/purple)
              if (occupied) {
                fill = intensity > 0.7 ? "#FF3B30" : intensity > 0.4 ? "#FF9500" : "#FFCC00";
                fillOpacity = 0.6 + intensity * 0.4;
              } else {
                fill = "#007AFF";
                fillOpacity = 0.15;
              }
            } else if (mode === "heatmap") {
              // Heatmap: high density red/amber focus
              if (occupied) {
                fill = intensity > 0.6 ? "#D92D20" : "#F4B400";
                fillOpacity = 0.5 + intensity * 0.4;
              } else {
                fill = "#142430";
                fillOpacity = 0.1;
              }
            }

            return (
              <rect
                key={`${r}-${c}`}
                x={section.x + c * (section.w / section.cols)}
                y={section.y + r * (section.h / section.rows)}
                width={Math.max(1, section.w / section.cols - 1.5)}
                height={Math.max(1, section.h / section.rows - 1.5)}
                rx={0.5}
                fill={fill}
                fillOpacity={fillOpacity}
              />
            );
          })
        )}
      </g>
    );
  }
);

SeatGroup.displayName = "SeatGroup";

export function TacticalBlueprint({
  flowDynamics = true,
  thermalScan = false,
  heatmapOverlay = false,
}: {
  flowDynamics?: boolean;
  thermalScan?: boolean;
  heatmapOverlay?: boolean;
}) {
  const mode = thermalScan ? "thermal" : heatmapOverlay ? "heatmap" : "standard";

  // Define stadium stand layouts
  const seatSections = useMemo(() => {
    return [
      { id: "NORTH_A", x: 100, y: 50, w: 800, h: 80, rows: 10, cols: 100 },
      { id: "SOUTH_A", x: 100, y: 570, w: 800, h: 80, rows: 10, cols: 100 },
      { id: "WEST_A", x: 50, y: 150, w: 80, h: 400, rows: 50, cols: 10 },
      { id: "EAST_A", x: 970, y: 150, w: 80, h: 400, rows: 50, cols: 10 },
      // Corner sections
      { id: "NW", x: 50, y: 50, w: 50, h: 100, rows: 12, cols: 6 },
      { id: "NE", x: 900, y: 50, w: 100, h: 100, rows: 12, cols: 12 },
      { id: "SW", x: 50, y: 550, w: 50, h: 100, rows: 12, cols: 6 },
      { id: "SE", x: 900, y: 550, w: 100, h: 100, rows: 12, cols: 12 },
    ];
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" style={{ background: "#07141C" }}>
      {/* Blueprint Grid & Scan Line */}
      <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />
      <div className="absolute top-0 bottom-0 w-80 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-scan pointer-events-none" />

      {/* Coordinate System */}
      <div className="absolute top-10 left-6 bottom-10 flex flex-col justify-between text-[8px] text-[#AAB8C2]/40 font-mono pointer-events-none select-none uppercase tracking-tighter">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i}>{900 - i * 100}</span>
        ))}
      </div>
      <div className="absolute bottom-6 left-10 right-10 flex justify-between text-[8px] text-[#AAB8C2]/40 font-mono px-10 pointer-events-none select-none uppercase tracking-tighter">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i}>{i * 100}</span>
        ))}
      </div>

      {/* Stadium Layout */}
      <div className="relative w-[1100px] h-[700px] mr-[340px]">
        <svg viewBox="0 0 1100 700" className="w-full h-full transition-opacity duration-1000">
          <defs>
            <filter id="glow-green-filter-v2">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stadium Architecture Lines */}
          <rect x="50" y="50" width="1000" height="600" rx="200" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          <rect x="150" y="150" width="800" height="400" rx="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

          {/* Arena Pitch */}
          <rect x="300" y="250" width="500" height="200" rx="4" fill="none" stroke="#0E9F6E" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="550" cy="350" r="40" fill="none" stroke="#0E9F6E" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="550" y1="250" x2="550" y2="450" stroke="#0E9F6E" strokeWidth="1" strokeOpacity="0.1" />

          {/* Seat Grid Rendering */}
          {seatSections.map((section) => (
            <SeatGroup key={section.id} section={section} mode={mode} />
          ))}

          {/* Pathfinder Route */}
          {flowDynamics && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              d="M 120 580 Q 150 350 400 350 L 900 250"
              fill="none"
              stroke="#0E9F6E"
              strokeWidth="4"
              strokeDasharray="12 10"
              className="animate-dash-flow"
              filter="url(#glow-green-filter-v2)"
            />
          )}

          {/* Location pins */}
          <circle cx="120" cy="580" r="7" fill={flowDynamics ? "#0E9F6E" : "#AAB8C2"} filter="url(#glow-green-filter-v2)" />
          <circle cx="900" cy="250" r="7" fill={flowDynamics ? "#0E9F6E" : "#AAB8C2"} filter="url(#glow-green-filter-v2)" />

          <text x="135" y="584" fill="#0E9F6E" className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60">GATE_B_ENTRY</text>
          <text x="820" y="254" fill="#0E9F6E" className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60 text-right">SEAT_SEC_204</text>
        </svg>

        {/* Tactical Monitor Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-[110px] left-[390px] w-56 glass p-4 rounded-xl border-[#2E3238] shadow-2xl"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono font-bold text-primary tracking-[0.2em] uppercase">SECTION_204_FLOW</span>
            <span className="text-[9px] font-mono text-[#AAB8C2] font-bold tracking-widest">82% BUSY</span>
          </div>
          <div className="grid grid-cols-12 gap-1.5 px-0.5">
            {Array.from({ length: 48 }).map((_, i) => {
              let bg = "bg-[#0E9F6E]";
              if (mode === "thermal") {
                bg = i % 8 === 0 ? "bg-[#FF3B30]" : i % 5 === 0 ? "bg-[#FFCC00]" : "bg-[#007AFF]";
              } else if (mode === "heatmap") {
                bg = i % 6 === 0 ? "bg-[#D92D20]" : "bg-[#F4B400]";
              }
              return (
                <div
                  key={i}
                  className={`h-2.5 rounded-[1.5px] transition-all duration-700 ${bg}`}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-[310px] left-[690px] glass p-6 rounded-2xl w-72 shadow-[-10px_20px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="px-3 py-1 rounded-lg text-[9px] text-primary font-mono font-black uppercase tracking-[0.15em] border border-primary/20 bg-primary/5">
              SECTOR_204_STATUS
            </div>
            <div className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider leading-none">Stand Section 204</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-[#AAB8C2] font-mono font-bold uppercase tracking-widest">
                <span>Occupancy</span>
                <span className="text-white tracking-normal">452 / 500</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#AAB8C2] font-mono font-bold uppercase tracking-widest">
                <span>Concourse Temp</span>
                <span className="text-white tracking-normal">24.2°C</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mt-3 relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
            <div className="pt-3 flex items-center gap-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="size-5 rounded bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="size-3.5" />
              </div>
              <span className="text-[9px] text-primary font-mono font-black uppercase tracking-[0.20em]">
                Gate Marshall Secure
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 size-10 border-t border-l border-primary/20 pointer-events-none" />
      <div className="absolute top-10 right-[390px] size-10 border-t border-r border-primary/20 pointer-events-none" />
      <div className="absolute bottom-10 left-10 size-10 border-b border-l border-primary/20 pointer-events-none" />
      <div className="absolute bottom-10 right-[390px] size-10 border-b border-r border-primary/20 pointer-events-none" />
    </div>
  );
}
