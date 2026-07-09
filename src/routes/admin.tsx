import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Users, Activity, Clock, ShieldCheck, 
  ArrowUpRight, Bolt, Send, Terminal, Zap,
  Bell, ChevronDown, MoreHorizontal, LayoutGrid
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Arena Intelligence — Control Nexus v4.2" },
      { name: "description", content: "Advanced stadium orchestration console. Real-time telemetry and tactical coordination." },
    ],
  }),
  component: Admin,
});

const mono = "font-mono text-[10px] uppercase tracking-[0.25em]";

const crowdTrends = [
  { time: '18:00', current: 4200, projected: 4000 },
  { time: '18:15', current: 4800, projected: 4200 },
  { time: '18:30', current: 5200, projected: 4400 },
  { time: '18:45', current: 6800, projected: 4700 },
  { time: '19:00', current: 8500, projected: 5000 },
  { time: '19:15', current: 8200, projected: 5300 },
  { time: '19:30', current: 8900, projected: 5600 },
  { time: '19:45', current: 9200, projected: 5800 },
  { time: '20:00', current: 9500, projected: 6000 },
];

const systemLogs = [
  { time: '14:22:15', msg: 'LIDAR scan complete: Section 12-B verified. Accuracy: 99.8%.', type: 'nominal' },
  { time: '14:22:04', msg: 'Anomaly detected: Rapid density spike at Zone 42-A.', type: 'nominal' },
  { time: '14:21:58', msg: 'ALERT: BLOCK 14 CRITICAL DENSITY [95%]. ESCALATING TO CONTROL.', type: 'critical' },
  { time: '14:21:42', msg: 'Gate 12 automated entry status: NOMINAL.', type: 'nominal' },
  { time: '14:21:30', msg: 'Thermal mapping updated for Upper Tier.', type: 'nominal' },
  { time: '14:21:12', msg: 'Heartbeat signal received from 24 sensors.', type: 'nominal' },
  { time: '14:20:55', msg: 'System baseline check complete.', type: 'nominal' },
];

function Admin() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans p-6 lg:p-8 selection:bg-primary/30 antialiased overflow-x-hidden">
      {/* Tactical Navigation Bar */}
      <header className="max-w-[1720px] mx-auto mb-8">
        <div className="glass flex items-center justify-between rounded-2xl px-10 py-5 border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 group/logo">
              <Target className="text-primary size-7 group-hover/logo:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary shadow-glow animate-pulse" />
            </div>
            <div className="leading-tight">
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Arena<span className="text-primary">Intelligence</span></h1>
              <span className={`${mono} text-slate-500 mt-1.5 block font-bold`}>Control Nexus v4.2.0</span>
            </div>
          </div>

          <nav className="hidden xl:flex items-center gap-2 rounded-2xl bg-black/60 p-1.5 border border-white/5 relative z-10">
            {['Overview', 'Analytics', 'Security', 'Logistics'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all relative ${activeTab === tab ? 'bg-[#2E3238] text-white shadow-2xl' : 'text-slate-500 hover:text-primary hover:bg-white/5'}`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-glow" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-8 relative z-10">
            <div className="hidden 2xl:flex items-center gap-10 font-mono text-[10px] font-black tracking-[0.3em] text-slate-600">
               <div className="flex items-center gap-3">
                 <div className="size-1.5 rounded-full bg-primary shadow-glow" />
                 CORE: <span className="text-primary">NOMINAL</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="size-1.5 rounded-full bg-primary shadow-glow" />
                 LIDAR: <span className="text-primary">ACTIVE</span>
               </div>
            </div>
            
            <div className="flex items-center gap-6 border-l border-white/10 pl-10">
              <div className="flex items-center gap-3 relative group/alerts cursor-pointer">
                 <Bell className="size-5 text-slate-500 group-hover/alerts:text-white transition-colors" />
                 <div className="absolute -top-1 -right-1 size-3.5 bg-[#EF4444] border-2 border-[#050505] rounded-full flex items-center justify-center text-[8px] font-black text-white">3</div>
              </div>
              
              <div className="flex items-center gap-4 group/user cursor-pointer">
                <div className="text-right hidden sm:block text-left">
                  <p className="text-xs font-black uppercase tracking-tight group-hover/user:text-primary transition-colors">A. Voight</p>
                  <p className="text-[10px] text-slate-500 font-mono font-bold tracking-widest mt-0.5 text-right">SUPERVISOR</p>
                </div>
                <div className="size-11 rounded-2xl glass border-primary/20 p-0.5 overflow-hidden transition-all group-hover/user:border-primary/50 group-hover/user:scale-105 shadow-glow">
                   <img src="https://pravatar.cc/100?u=supervisor" className="size-full rounded-[14px] object-cover grayscale brightness-75 group-hover/user:grayscale-0 group-hover/user:brightness-100 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1720px] mx-auto grid grid-cols-12 gap-6 text-left">
        
        {/* KPI Grid */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          <KPICard label="Live Attendance" value="52,840" delta="+4.2%" sub="Projected: 54,000" icon={<Users className="size-5" />} trend="up" highlight />
          <KPICard label="Density Index" value="78%" delta="Optimal" sub="Normal Flow" icon={<Activity className="size-5" />} />
          <KPICard label="Queue Wait" value="04m 12s" delta="Stable" sub="Avg 12 Gates" icon={<Clock className="size-5" />} />
          <KPICard label="Predictive Safety" value="99.8%" delta="Active" sub="Nexus_Core V4" icon={<ShieldCheck className="size-5" />} />
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
           {/* Infrastructure Map */}
           <div className="glass rounded-3xl p-10 border-white/5 flex flex-col min-h-[720px] relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-20 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-12 relative z-10 text-left">
                 <div className="flex items-center gap-6">
                   <h2 className="text-[15px] font-black uppercase tracking-[0.4em] text-slate-400">Infrastructure Mapping: Global_Nexus</h2>
                   <div className="flex items-center gap-3 px-5 py-2 rounded-xl border border-primary/30 bg-primary/5">
                     <span className="size-2.5 rounded-full bg-primary animate-pulse shadow-glow" />
                     <span className={`${mono} text-primary font-black tracking-[0.3em]`}>Live_Scan</span>
                   </div>
                 </div>
                 <div className="flex gap-10">
                    <LegendItem color="bg-slate-800" label="Vacant" />
                    <LegendItem color="bg-primary" label="Occupied" glow />
                    <LegendItem color="bg-[#EF4444]" label="Alert" animate />
                 </div>
              </div>

              <div className="flex-1 rounded-[32px] border border-white/10 bg-[#020202] relative overflow-hidden flex items-center justify-center p-16 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
                 <div className="absolute inset-0 blueprint-grid opacity-10" />
                 <div className="scan-line" />
                 
                 {/* Granular Seat visualization (Programmatic) */}
                 <div className="relative w-full h-full max-w-5xl mx-auto grid grid-cols-2 grid-rows-2 gap-12 opacity-60">
                    {Array.from({ length: 4 }).map((_, sector) => (
                      <div key={sector} className="grid grid-cols-16 grid-rows-10 gap-1.5 p-4 border border-white/5 rounded-2xl bg-white/[0.02]">
                         {Array.from({ length: 160 }).map((_, i) => {
                           const status = (sector === 1 && i > 120 && i < 135) ? 'alert' : (i % 7 === 0 || i % 11 === 0) ? 'empty' : 'occupied';
                           return (
                             <div 
                               key={i} 
                               className={`size-1.5 rounded-[1px] transition-all duration-700 ${
                                 status === 'alert' ? 'bg-[#EF4444] shadow-[0_0_10px_#ef4444]' : 
                                 status === 'empty' ? 'bg-slate-900 border border-white/5' : 'bg-primary/50'
                               }`} 
                             />
                           );
                         })}
                      </div>
                    ))}
                 </div>

                 {/* Focus HUD Overlay */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-12 left-12 p-6 glass rounded-2xl border-primary/30 bg-black/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 border-l-4 border-l-primary"
                 >
                    <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-left">
                      <LayoutGrid className="text-primary size-6" />
                    </div>
                    <div>
                      <p className={`${mono} text-slate-500 mb-1 tracking-[0.3em] font-black`}>Active_Focus: Sector 4A</p>
                      <p className="text-lg font-mono font-black text-white tracking-widest uppercase">Telemetry_ID: 8842-X</p>
                    </div>
                    <div className="h-10 w-px bg-white/10 mx-2" />
                    <div className="text-right">
                       <p className={`${mono} text-slate-500 mb-1`}>Status</p>
                       <p className="text-primary font-black font-mono tracking-widest uppercase">Nominal</p>
                    </div>
                 </motion.div>
                 
                 {/* Decorative Corner Elements */}
                 <div className="absolute top-10 left-10 size-12 border-t-2 border-l-2 border-primary/20 pointer-events-none" />
                 <div className="absolute top-10 right-10 size-12 border-t-2 border-r-2 border-primary/20 pointer-events-none" />
                 <div className="absolute bottom-10 left-10 size-12 border-b-2 border-l-2 border-primary/20 pointer-events-none" />
                 <div className="absolute bottom-10 right-10 size-12 border-b-2 border-r-2 border-primary/20 pointer-events-none" />
              </div>
           </div>

           {/* Trend Analytics */}
           <div className="glass rounded-3xl p-10 border-white/5 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-30 pointer-events-none" />
              <div className="flex items-center justify-between mb-12 relative z-10 text-left">
                 <div>
                   <h3 className="text-[15px] font-black uppercase tracking-[0.4em] text-slate-400">Tactical Load Analytics</h3>
                   <p className={`${mono} text-slate-500 mt-2 font-bold`}>24 Hour Intelligence Histogram</p>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:bg-white/10 transition-colors">
                       <ChevronDown className="size-3" /> Filters
                    </div>
                    <button className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                       <MoreHorizontal className="size-5" />
                    </button>
                 </div>
              </div>
              <div className="h-72 w-full relative z-10">
                 <ResponsiveContainer>
                   <AreaChart data={crowdTrends}>
                     <defs>
                       <linearGradient id="primaryGradientV4" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                         <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                     <XAxis dataKey="time" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold' }} />
                     <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tick={{ fontWeight: 'bold' }} />
                     <Tooltip 
                        contentStyle={{ background: 'rgba(5, 5, 5, 0.9)', border: '1px solid rgba(20, 184, 166, 0.3)', borderRadius: '16px', backdropFilter: 'blur(20px)', padding: '12px' }} 
                        itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                        labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}
                     />
                     <Area type="monotone" dataKey="current" stroke="var(--primary)" fill="url(#primaryGradientV4)" strokeWidth={4} animationDuration={2000} />
                     <Area type="monotone" dataKey="projected" stroke="#2E3238" fill="transparent" strokeWidth={2} strokeDasharray="8 8" />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Sidebar Space */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
           {/* Directives Section */}
           <div className="glass rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-10 text-left">
                 <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow">
                    <Bolt className="size-6" />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">Tactical Directives</h2>
              </div>
              
              <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-8 border border-primary/20 relative overflow-hidden group/directive text-left">
                 <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/directive:opacity-100 transition-opacity duration-700" />
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-5">
                      <span className="px-2.5 py-1 rounded bg-[#EF4444]/20 border border-[#EF4444]/40 text-[9px] font-black text-[#EF4444] uppercase tracking-widest uppercase">Immediate_Action</span>
                   </div>
                   <p className="text-base font-bold leading-relaxed text-slate-200 mb-10 uppercase tracking-tight">
                     Critical mass detected at <span className="text-[#EF4444] font-black [text-shadow:0_0_12px_rgba(239,68,68,0.4)]">Sector 14</span> ingress point. Recommend immediate fan redistribution to <span className="text-primary font-black">Portal 04</span>.
                   </p>
                   <button className="w-full bg-primary hover:scale-[1.02] active:scale-95 text-black font-black py-4 rounded-xl text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(20,184,166,0.2)] cursor-pointer">
                     <Send className="size-4" />
                     Deploy Countermeasures
                   </button>
                 </div>
              </div>
           </div>

           {/* System Stream */}
           <div className="glass rounded-3xl flex flex-col border-white/5 min-h-[500px] shadow-2xl relative overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 relative z-10 text-left">
                 <div className="flex items-center gap-4">
                   <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-left">
                      <Terminal className="size-5" />
                   </div>
                   <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400">System_Stream</h2>
                 </div>
                 <span className="text-[10px] font-black text-primary uppercase px-4 py-1.5 rounded-xl border border-primary/30 bg-primary/10 tracking-[0.2em] shadow-glow">Active_Nexus</span>
              </div>
              
              <div className="p-8 flex-1 overflow-y-auto terminal-scroll font-mono text-[12px] space-y-7 bg-[#020202]/80 relative z-10 text-left">
                 <AnimatePresence mode="popLayout">
                   {systemLogs.map((log, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-8 group ${log.type === 'critical' ? 'text-[#EF4444] bg-[#EF4444]/5 -mx-8 px-8 py-5 border-y border-[#EF4444]/20 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]' : 'text-slate-500 hover:text-slate-300 transition-colors'}`}
                     >
                        <span className="font-black shrink-0 tracking-tighter tabular-nums opacity-60 group-hover:opacity-100 uppercase">{log.time}</span>
                        <span className={`leading-relaxed ${log.type === 'critical' ? 'font-black tracking-tight uppercase' : 'font-medium uppercase'}`}>{log.msg}</span>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
              
              <div className="p-6 border-t border-white/5 bg-black/20 relative z-10 text-left">
                 <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-glow" />
                    <span className={`${mono} text-slate-600 font-black`}>Awaiting_New_Telemetry...</span>
                 </div>
              </div>
           </div>

           {/* Reliability Index */}
           <div className="glass rounded-3xl p-10 border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-left">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
              <div>
                <h3 className="text-[15px] font-black uppercase tracking-[0.4em] text-slate-400">Neural Intelligence</h3>
                <p className={`${mono} text-slate-500 mt-2 font-bold uppercase`}>Global Confidence Index</p>
              </div>

              <div className="flex-1 flex items-center justify-center py-14">
                 <div className="relative size-52 group/gauge cursor-pointer">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                       <motion.circle 
                          initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 28.9 }}
                          transition={{ duration: 2, ease: "circOut" }}
                          cx="50" cy="50" r="46" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="289" strokeLinecap="round" 
                          className="drop-shadow-[0_0_12px_rgba(20,184,166,0.6)] shadow-glow" 
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center group-hover/gauge:scale-110 transition-transform duration-500">
                       <span className="text-6xl font-black text-white tracking-tighter leading-none">92<span className="text-2xl text-primary font-bold ml-1">%</span></span>
                       <span className={`${mono} text-primary font-black mt-3 tracking-[0.4em]`}>Nominal</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-5 pt-10 border-t border-white/5">
                 <div className="glass-strong border-white/10 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                    <p className={`${mono} text-slate-500 mb-2 font-black uppercase`}>Latency</p>
                    <p className="text-lg font-mono font-black text-primary tracking-tighter uppercase">0.42<span className="text-xs ml-1 opacity-60 uppercase">MS</span></p>
                 </div>
                 <div className="glass-strong border-white/10 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors">
                    <p className={`${mono} text-slate-500 mb-2 font-black uppercase`}>Accuracy</p>
                    <p className="text-lg font-mono font-black text-primary tracking-tighter uppercase">99.8<span className="text-xs ml-1 opacity-60 uppercase">%</span></p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Global Status Footer */}
      <footer className="max-w-[1720px] mx-auto mt-12 pb-10 border-t border-white/5 pt-10 px-4">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3.5">
              <div className="size-2.5 rounded-full bg-primary shadow-glow animate-pulse" />
              <span className={`${mono} text-slate-400 font-black`}>Strategic_Systems_Active</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden xl:block" />
            <div className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest hidden xl:block">
              Uptime: <span className="text-slate-300">421d 14h 22m 04s</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Privacy_Protocols</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Nexus_Terminal</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:tracking-[0.4em]">Emergency_Overrides</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-black border border-white/10 rounded-xl uppercase">
               <span className="text-[10px] font-mono text-slate-600 font-black uppercase tracking-widest">Region:</span>
               <span className="text-[10px] font-mono text-primary font-black uppercase tracking-[0.3em]">US-EAST-ALPHA</span>
            </div>
            <div className="px-5 py-2.5 glass rounded-xl border-white/10 text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest uppercase">
               v4.2.1-RELEASE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function KPICard({ label, value, delta, sub, icon, highlight = false, trend = 'stable' }: any) {
  return (
    <motion.div 
       whileHover={{ y: -4 }}
       className={`glass p-8 rounded-[32px] border-white/5 transition-all duration-500 hover:border-primary/40 group shadow-2xl relative overflow-hidden text-left ${highlight ? 'border-l-4 border-l-primary/40 shadow-[0_0_40px_rgba(20,184,166,0.05)]' : ''}`}
    >
       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[50px] -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-700" />
       
       <div className="flex justify-between items-start mb-10 relative z-10 text-left">
          <span className={`${mono} text-slate-500 tracking-[0.35em] font-black`}>{label}</span>
          <div className="size-11 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(20,184,166,0.1)] group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
             {icon}
          </div>
       </div>
       
       <div className="flex items-baseline gap-4 mb-6 relative z-10 text-left">
          <span className="text-5xl font-black tracking-tighter text-white group-hover:text-primary transition-colors duration-500 leading-none">{value}</span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-mono font-black uppercase tracking-widest ${trend === 'up' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-slate-500 bg-white/5 border border-white/10'}`}>
             {trend === 'up' && <ArrowUpRight className="size-3" />}
             {delta}
          </div>
       </div>
       
       <p className={`${mono} text-slate-600 font-black tracking-[0.2em] relative z-10 opacity-70 group-hover:opacity-100 transition-opacity uppercase`}>{sub}</p>
    </motion.div>
  );
}

function LegendItem({ color, label, glow = false, animate = false }: any) {
  return (
    <div className="flex items-center gap-3.5 group cursor-default text-left">
       <div className={`size-2.5 rounded-full transition-all duration-500 ${color} ${glow ? 'shadow-glow' : ''} ${animate ? 'animate-pulse' : ''} group-hover:scale-150`} />
       <span className={`${mono} text-slate-500 font-bold group-hover:text-slate-300 transition-colors uppercase`}>{label}</span>
    </div>
  );
}
