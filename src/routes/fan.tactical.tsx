import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  User,
  TrendingUp,
  Info,
  Activity,
  SkipBack,
  Play,
  SkipForward,
  Maximize2,
  Thermometer,
  ChevronLeft,
  Flame,
  Radio,
} from "lucide-react";
import { TacticalBlueprint } from "@/components/TacticalBlueprint";
import { useState } from "react";

export const Route = createFileRoute("/fan/tactical")({
  head: () => ({
    meta: [
      { title: "Tactical Blueprint — Arena Intelligence" },
      { name: "description", content: "Interactive stadium blueprint with crowd flow overlay, seat navigation, and operations metrics." },
    ],
  }),
  component: TacticalPage,
});

function TacticalPage() {
  const [flowDynamics, setFlowDynamics] = useState(true);
  const [thermalScan, setThermalScan] = useState(false);
  const [heatmapOverlay, setHeatmapOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleToggle = (toggle: "flow" | "thermal" | "heatmap") => {
    if (toggle === "flow") {
      setFlowDynamics(!flowDynamics);
    } else if (toggle === "thermal") {
      setThermalScan(!thermalScan);
      if (!thermalScan) setHeatmapOverlay(false);
    } else if (toggle === "heatmap") {
      setHeatmapOverlay(!heatmapOverlay);
      if (!heatmapOverlay) setThermalScan(false);
    }
  };

  return (
    <div className="w-full h-dvh text-slate-900 font-sans relative overflow-hidden flex flex-col" style={{ background: "#07141C" }}>
      {/* Tactical Header */}
      <header
        className="h-18 flex items-center justify-between px-10 z-50 shrink-0"
        style={{ background: "rgba(255,255,255,0.95)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <Link to="/fan" className="p-2 hover:bg-white/5 rounded-lg transition-colors group mr-2">
            <ChevronLeft className="size-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
          </Link>
          <div className="size-11 rounded-lg flex items-center justify-center text-primary" style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)" }}>
            <ShieldCheck className="size-6" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-black tracking-tight leading-none text-slate-900 uppercase">
              ARENA<span className="text-primary">INTELLIGENCE</span>
            </h1>
            <p className="text-[9px] font-mono uppercase tracking-[0.25em] mt-1" style={{ color: "#64748B" }}>
              Tactical Blueprint v4.2 · Narendra Modi Stadium
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-lg px-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Query sector or gate coordinates..."
              className="w-full rounded-full py-2.5 pl-12 pr-6 text-xs text-slate-900 focus:outline-none focus:border-primary/50 transition-all font-mono placeholder:text-slate-600 uppercase tracking-widest"
              style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: "rgba(14,159,110,0.08)", border: "1px solid rgba(14,159,110,0.18)" }}>
            <Radio className="size-3 text-primary animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">Live stream active</span>
          </div>
          <div className="text-right hidden md:block select-none">
            <p className="text-[10px] font-mono font-bold uppercase tracking-tight" style={{ color: "#64748B" }}>T: 18:42:05:22</p>
             <p className="text-[9px] font-mono tracking-tighter" style={{ color: "rgba(170,184,194,0.40)" }}>COORDS: Narendra Modi Stadium, Gate B</p>
          </div>
          <div
            className="size-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(14,159,110,0.30)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")}
          >
            <User className="size-5" style={{ color: "#64748B" }} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Viewport */}
        <main className="flex-1 relative" style={{ background: "#07141C" }}>
          <TacticalBlueprint
            flowDynamics={flowDynamics}
            thermalScan={thermalScan}
            heatmapOverlay={heatmapOverlay}
          />

          {/* Timeline / Playback Overlay */}
          <motion.div
            initial={{ y: 100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            className="absolute bottom-10 left-1/2 w-full max-w-[640px] h-16 rounded-full flex items-center px-8 gap-6 z-40 shadow-2xl"
            style={{ background: "rgba(14,27,36,0.92)", border: "1px solid rgba(0,0,0,0.08)", backdropFilter: "blur(16px)" }}
          >
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer outline-none">
                <SkipBack className="size-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="size-10 bg-primary rounded-full flex items-center justify-center text-slate-900 transition-transform hover:scale-105 active:scale-95 cursor-pointer outline-none"
                style={{ boxShadow: "0 0 16px rgba(14,159,110,0.30)" }}
              >
                {isPlaying ? <span className="text-xs font-bold text-black uppercase tracking-wider">II</span> : <Play className="size-4 text-black fill-current ml-0.5" />}
              </button>
              <button className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer outline-none">
                <SkipForward className="size-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1 select-none">
              <div className="flex justify-between text-[8px] font-mono font-bold uppercase tracking-widest" style={{ color: "#64748B" }}>
                <span>-01:45:00</span>
                <span className="text-primary tracking-[0.2em]">{isPlaying ? "LIVE SIMULATION RUNNING" : "SIMULATION PAUSED"}</span>
              </div>
              <div className="relative h-1 rounded-full overflow-hidden cursor-pointer" style={{ background: "rgba(0,0,0,0.08)" }}>
                <div className="absolute left-0 top-0 h-full w-[82%]" style={{ background: "rgba(14,159,110,0.25)" }} />
                <div className="absolute left-[82%] top-0 h-full w-0.5 bg-primary z-10" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded text-[10px] font-mono font-bold" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#64748B" }}>
                1.0X
              </div>
              <Maximize2 className="size-4 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" />
            </div>
          </motion.div>
        </main>

        {/* Intelligence Sidebar */}
        <aside
          className="w-[380px] h-full p-8 flex flex-col z-40 shrink-0 overflow-y-auto custom-scrollbar shadow-2xl"
          style={{ background: "rgba(255,255,255,0.95)", borderLeft: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="mb-8 text-left">
            <div className="flex items-center gap-2.5 mb-3 text-slate-400">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-[10px] font-mono uppercase font-bold tracking-[0.25em]">Operational Overview</h2>
            </div>
            <h3 className="text-slate-900 text-3xl font-extrabold mb-1.5 tracking-tight uppercase">
              LEVEL_02 <span className="text-slate-600 text-xl font-semibold tracking-tighter">/ STAND 204</span>
            </h3>
            <p className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>
              Active Route Pathfinding: <span className="text-primary font-bold">00:03m Walk</span>
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl p-5 transition-all text-left" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(14,159,110,0.18)")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)")}>
              <p className="text-[9px] font-mono uppercase font-bold mb-1.5 tracking-wider" style={{ color: "#64748B" }}>
                FLOW RATE
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-slate-900 text-2xl font-black font-mono tracking-tighter">1.2</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: "#64748B" }}>m/s</span>
              </div>
              <div className="mt-3 text-[9px] text-primary font-mono flex items-center gap-1 font-bold">
                <TrendingUp className="size-3.5" /> +2.1% <span style={{ color: "rgba(170,184,194,0.40)" }}>vs average</span>
              </div>
            </div>
            <div className="rounded-2xl p-5 transition-all text-left" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(14,159,110,0.18)")} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)")}>
              <p className="text-[9px] font-mono uppercase font-bold mb-1.5 tracking-wider" style={{ color: "#64748B" }}>STAND DENSITY</p>
              <div className="flex items-baseline gap-1">
                <span className="text-primary text-2xl font-black font-mono tracking-tighter">0.32</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: "#64748B" }}>p/m²</span>
              </div>
              <div className="mt-3 text-[9px] font-mono flex items-center gap-1 font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>
                <Info className="size-3.5" /> Stable
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4 mb-8 border-y py-6" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <ToggleItem
              icon={<Activity className="size-4" />}
              label="Flow Dynamics"
              active={flowDynamics}
              onChange={() => handleToggle("flow")}
            />
            <ToggleItem
              icon={<Thermometer className="size-4" />}
              label="Thermal Scan"
              active={thermalScan}
              onChange={() => handleToggle("thermal")}
            />
            <ToggleItem
              icon={<Flame className="size-4" />}
              label="Heatmap Overlay"
              active={heatmapOverlay}
              onChange={() => handleToggle("heatmap")}
            />
          </div>

          {/* Live Video Feed */}
          <div className="mt-auto pt-4">
            <div className="bg-black border rounded-xl overflow-hidden relative group aspect-video shadow-2xl" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <div className="absolute top-3 left-3 z-10 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[8px] text-slate-900 font-mono flex items-center gap-1.5 border tracking-wider font-bold uppercase" style={{ borderColor: "rgba(0,0,0,0.10)" }}>
                <span className="size-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE: CAM_204_EAST
              </div>
              <video
                className="w-full h-full object-cover grayscale brightness-50 transition-all group-hover:grayscale-0 group-hover:brightness-90 duration-700"
                autoPlay
                muted
                loop
                playsInline
                src="https://videos.pexels.com/video-files/6233170/6233170-uhd_2560_1440_25fps.mp4"
                poster="https://images.pexels.com/videos/6233170/pexels-photo-6233170.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200"
              />
              <div className="absolute inset-0 bg-[#0E9F6E]/5 pointer-events-none mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
            </div>
            <div className="mt-3 flex justify-between items-center px-1">
              <span className="text-[9px] font-bold uppercase tracking-widest font-mono" style={{ color: "#64748B" }}>
                Signal Integrity
              </span>
              <span className="text-[9px] text-primary font-bold uppercase tracking-widest font-mono">99.84%</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToggleItem({
  icon,
  label,
  active,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`flex items-center justify-between group cursor-pointer transition-all duration-300 ${active ? "opacity-100" : "opacity-45 hover:opacity-85"}`}
    >
      <div className="flex items-center gap-4 text-slate-300">
        <div
          className={`size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? "bg-primary/10 text-primary border border-primary/30" : "bg-white/5 text-slate-500 border border-transparent"}`}
        >
          {icon}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div
        className={`w-12 h-6 rounded-full relative p-1 transition-all duration-300 ${active ? "bg-primary/20" : "bg-white/10"}`}
      >
        <motion.div
          animate={{ x: active ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`size-4 rounded-full transition-shadow duration-300 ${active ? "bg-primary" : "bg-white/30"}`}
        />
      </div>
    </div>
  );
}
