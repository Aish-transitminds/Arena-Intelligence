import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useMemo, memo } from "react";

const SeatGroup = memo(({ section }: { section: { id: string, x: number, y: number, w: number, h: number, rows: number, cols: number } }) => {
  return (
    <g className="opacity-40">
      {Array.from({ length: section.rows }).map((_, r) => (
        Array.from({ length: section.cols }).map((_, c) => {
          const occupied = (r + c) % 7 !== 0 && (r + c) % 11 !== 0;
          const intensity = Math.sin(r * 0.5 + c * 0.5) * 0.5 + 0.5;
          return (
            <rect
              key={`${r}-${c}`}
              x={section.x + (c * (section.w / section.cols))}
              y={section.y + (r * (section.h / section.rows))}
              width={Math.max(1, (section.w / section.cols) - 1.5)}
              height={Math.max(1, (section.h / section.rows) - 1.5)}
              rx={0.5}
              fill={occupied ? "var(--primary)" : "var(--obsidian)"}
              fillOpacity={occupied ? 0.3 + (intensity * 0.4) : 0.1}
            />
          );
        })
      ))}
    </g>
  );
});

SeatGroup.displayName = "SeatGroup";

export function TacticalBlueprint() {
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
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Blueprint Grid & Scan Line */}
      <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 w-80 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scan pointer-events-none" />

      {/* Coordinate System */}
      <div className="absolute top-10 left-6 bottom-10 flex flex-col justify-between text-[8px] text-slate-700 font-mono pointer-events-none select-none uppercase tracking-tighter">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i}>{900 - i * 100}</span>
        ))}
      </div>
      <div className="absolute bottom-6 left-10 right-10 flex justify-between text-[8px] text-slate-700 font-mono px-10 pointer-events-none select-none uppercase tracking-tighter">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i}>{i * 100}</span>
        ))}
      </div>

      {/* Stadium Layout */}
      <div className="relative w-[1100px] h-[700px] mr-[340px]">
        <svg viewBox="0 0 1100 700" className="w-full h-full transition-opacity duration-1000">
          <defs>
            <filter id="glow-teal-filter-v2">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stadium Architecture Lines */}
          <rect x="50" y="50" width="1000" height="600" rx="200" fill="none" stroke="var(--silver)" strokeWidth="0.5" strokeOpacity="0.4" />
          <rect x="150" y="150" width="800" height="400" rx="150" fill="none" stroke="var(--silver)" strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Arena Pitch */}
          <rect x="300" y="250" width="500" height="200" rx="4" fill="none" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.2" />
          <circle cx="550" cy="350" r="40" fill="none" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="550" y1="250" x2="550" y2="450" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.1" />

          {/* Granular Seat Grid Rendering */}
          {seatSections.map((section) => (
            <SeatGroup key={section.id} section={section} />
          ))}

          {/* Tactical Pathfinding Animation */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 120 580 Q 150 350 400 350 L 900 250"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeDasharray="12 10"
            className="animate-dash-flow"
            filter="url(#glow-teal-filter-v2)"
          />

          <circle cx="120" cy="580" r="8" fill="var(--primary)" filter="url(#glow-teal-filter-v2)" />
          <circle cx="900" cy="250" r="8" fill="var(--primary)" filter="url(#glow-teal-filter-v2)" />
          
          <text x="135" y="585" fill="var(--primary)" className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">GATE_4_INIT</text>
          <text x="820" y="255" fill="var(--primary)" className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60 text-right">DEST: SEAT_B14</text>
        </svg>

        {/* Tactical Interaction Layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-[120px] left-[380px] w-52 glass-tooltip p-4 rounded-xl border-primary/40 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono font-bold text-primary tracking-[0.2em] uppercase">STAND_B1_MONITOR</span>
            <span className="text-[9px] font-mono text-slate-500 font-bold tracking-widest">82% OCC</span>
          </div>
          <div className="grid grid-cols-12 gap-1.5 px-0.5">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-[1.5px] transition-all duration-700 ${
                  i % 9 === 0
                    ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    : i % 13 === 0
                      ? "bg-slate-900 border border-white/5"
                      : "bg-primary shadow-[0_0_8px_rgba(20,184,166,0.5)]"
                }`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute top-[320px] left-[680px] glass-tooltip p-6 rounded-[24px] w-72 border-primary/30 shadow-[-10px_20px_40px_rgba(0,0,0,0.6)]"
        >
          <div className="flex justify-between items-start mb-5">
            <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg text-[10px] text-primary font-mono font-black uppercase tracking-[0.15em]">
              SECTION_ALPHA_04
            </div>
            <div className="relative flex size-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-primary shadow-glow" />
            </div>
          </div>
          <div className="space-y-5">
            <h4 className="text-base font-black text-white uppercase tracking-tighter leading-none">Executive Terrace North</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                <span>Total Capacity</span>
                <span className="text-white tracking-normal">450 / 500</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                <span>Environmental</span>
                <span className="text-white tracking-normal">21.4°C</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-3 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "circOut" }}
                  className="h-full bg-primary shadow-glow"
                />
                <div className="absolute top-0 right-[10%] h-full w-px bg-white/20" />
              </div>
            </div>
            <div className="pt-4 flex items-center gap-3 border-t border-white/5">
              <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                 <ShieldCheck className="text-primary size-4" />
              </div>
              <span className="text-[10px] text-primary font-mono font-black uppercase tracking-[0.25em]">
                Status: Secure
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tactical Corner Brackets */}
      <div className="absolute top-10 left-10 size-10 border-t-2 border-l-2 border-primary/30 pointer-events-none" />
      <div className="absolute top-10 right-[390px] size-10 border-t-2 border-r-2 border-primary/30 pointer-events-none" />
      <div className="absolute bottom-10 left-10 size-10 border-b-2 border-l-2 border-primary/30 pointer-events-none" />
      <div className="absolute bottom-10 right-[390px] size-10 border-b-2 border-r-2 border-primary/30 pointer-events-none" />
    </div>
  );
}
