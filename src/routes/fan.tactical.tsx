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
} from "lucide-react";
import { TacticalBlueprint } from "@/components/TacticalBlueprint";

export const Route = createFileRoute("/fan/tactical")({
  component: TacticalPage,
});

function TacticalPage() {
  return (
    <div className="w-full h-dvh bg-obsidian text-slate-100 font-sans relative overflow-hidden flex flex-col">
      {/* Tactical Header */}
      <header className="h-18 glass-sidebar flex items-center justify-between px-10 z-50 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link to="/fan" className="p-2 hover:bg-white/5 rounded-lg transition-colors group mr-2">
            <ChevronLeft className="size-5 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
          <div className="size-11 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center text-primary glow-teal">
            <ShieldCheck className="size-6" />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-black tracking-tight leading-none uppercase">
              ARENA<span className="text-primary">INTEL</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.3em] mt-0.5">
              Tactical Command Center v4.1
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-lg px-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="QUERY COORDINATES OR SECTION_ID..."
              className="w-full bg-black/40 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-[11px] text-white focus:outline-none focus:border-primary/50 transition-all font-mono placeholder:text-slate-700 uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-full">
            <span className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#14B8A6]" />
            <span className="text-[10px] text-white font-mono font-bold tracking-wider">LIVE_STREAM: ACTIVE</span>
          </div>
          <div className="text-right hidden md:block select-none">
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tight">T: 18:42:05:22</p>
            <p className="text-[9px] text-slate-600 font-mono tracking-tighter">COORDS: 40.7128N 74.0060W</p>
          </div>
          <div className="size-10 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <User className="size-5 text-slate-300" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Viewport */}
        <main className="flex-1 relative bg-obsidian">
          <TacticalBlueprint />

          {/* Timeline / Playback Overlay */}
          <motion.div
            initial={{ y: 100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            className="absolute bottom-10 left-1/2 w-full max-w-[640px] h-16 glass-sidebar rounded-full flex items-center px-8 gap-6 z-40 border border-white/10 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                <SkipBack className="size-5" />
              </button>
              <button className="size-10 bg-primary rounded-full flex items-center justify-center text-black shadow-glow hover:scale-110 transition-transform cursor-pointer">
                <Play className="size-5 fill-current ml-0.5" />
              </button>
              <button className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                <SkipForward className="size-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1 select-none">
              <div className="flex justify-between text-[8px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                <span>-01:45:00</span>
                <span className="text-primary tracking-[0.2em]">LIVE_STATUS: NOMINAL</span>
              </div>
              <div className="relative h-1 bg-white/5 rounded-full overflow-hidden group cursor-pointer">
                <div className="absolute left-0 top-0 h-full bg-primary/20 w-[82%]" />
                <div className="absolute left-[82%] top-0 h-full w-0.5 bg-primary shadow-glow z-10" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-slate-300 font-mono font-bold">
                1.0X
              </div>
              <Maximize2 className="size-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </motion.div>
        </main>

        {/* Intelligence Sidebar */}
        <aside className="w-[380px] glass-sidebar h-full p-8 flex flex-col z-40 border-l border-white/5 shrink-0 overflow-y-auto custom-scrollbar shadow-[-20px_0_40px_rgba(0,0,0,0.4)]">
          <div className="mb-10 text-left">
            <div className="flex items-center gap-2.5 mb-3 text-slate-400">
              <div className="w-1 h-4 bg-primary rounded-full shadow-glow" />
              <h2 className="text-[10px] font-mono uppercase font-bold tracking-[0.25em]">Operational Overview</h2>
            </div>
            <h3 className="text-white text-4xl font-black mb-1.5 tracking-tight uppercase">
              LEVEL_02 <span className="text-primary/30 text-2xl font-semibold tracking-tighter">/ WING_B</span>
            </h3>
            <p className="text-slate-500 text-xs font-mono font-bold uppercase tracking-wider">
              Active Pathfinding: <span className="text-slate-300">00:04:12</span> Remaining
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-5 mb-10">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 transition-all hover:bg-white/10 hover:border-primary/20 group text-left">
              <p className="text-slate-500 text-[10px] font-mono uppercase font-bold mb-1.5 tracking-wider">
                TOTAL_FLOW
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-white text-3xl font-black font-mono tracking-tighter">12.4</span>
                <span className="text-xs text-slate-500 font-mono font-bold">m/s</span>
              </div>
              <div className="mt-3 text-[10px] text-primary font-mono flex items-center gap-1.5 font-bold">
                <TrendingUp className="size-3.5" /> +2.1% <span className="text-slate-600">H-1</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 transition-all hover:bg-white/10 hover:border-amber-500/20 group text-left">
              <p className="text-slate-500 text-[10px] font-mono uppercase font-bold mb-1.5 tracking-wider">ANOMALIES</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-amber-500 text-3xl font-black font-mono tracking-tighter">02</span>
                <span className="text-xs text-slate-500 font-mono font-bold">PNT</span>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Info className="size-3.5" /> Monitoring
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-5 mb-10 border-y border-white/5 py-8">
            <ToggleItem icon={<Activity className="size-4" />} label="Flow Dynamics" active={true} />
            <ToggleItem icon={<Thermometer className="size-4" />} label="Thermal Scan" active={false} />
            <ToggleItem icon={<Flame className="size-4" />} label="Heatmap Overlay" active={false} />
          </div>

          {/* Cinematic Inset (Security Feed) */}
          <div className="mt-auto pt-6">
            <div className="bg-black border border-white/10 rounded-2xl overflow-hidden relative group aspect-video shadow-2xl">
              <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] text-white font-mono flex items-center gap-2 border border-white/10 tracking-[0.1em] font-bold uppercase">
                <span className="size-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" /> REC:
                CAM_08_WEST
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
              <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[8px] text-white/50 font-mono uppercase tracking-[0.2em] font-bold">
                <span>LAT: 40.712N</span>
                <span>LNG: 74.006W</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center px-1">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                Signal Integrity
              </span>
              <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-widest">99.84%</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ToggleItem({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center justify-between group cursor-pointer transition-all duration-300 ${active ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
    >
      <div className="flex items-center gap-4 text-slate-300">
        <div
          className={`size-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? "bg-primary/10 text-primary border border-primary/30 shadow-glow" : "bg-white/5 text-slate-500 border border-transparent"}`}
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
          className={`size-4 rounded-full transition-shadow duration-300 ${active ? "bg-primary shadow-glow" : "bg-white/30"}`}
        />
      </div>
    </div>
  );
}
