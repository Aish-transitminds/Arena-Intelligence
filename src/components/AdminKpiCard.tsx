import { motion } from "framer-motion";
import { Users, Target, ShieldCheck, TrendingUp } from "lucide-react";

export function AdminKpiCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full bg-[#0B1A23] rounded-2xl overflow-hidden shadow-2xl border border-[#0E9F6E]/30 my-3"
    >
      <div className="bg-[#0D1E2A] px-4 py-3 border-b border-[#0E9F6E]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#0E9F6E]" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Ops Console Snapshot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#0E9F6E] animate-pulse" />
          <span className="text-[9px] uppercase tracking-wider text-[#0E9F6E] font-bold">Live</span>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[#162736] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users className="size-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
          </div>
          <div className="text-xl font-extrabold text-white">52,840</div>
          <div className="text-[10px] text-[#0E9F6E] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="size-3" /> Peak Flow
          </div>
        </div>

        <div className="bg-[#162736] p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Target className="size-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Occupancy</span>
          </div>
          <div className="text-xl font-extrabold text-white">97.8%</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Optimal Range
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#0D1E2A] border-t border-white/5 text-[10px] text-slate-400 font-medium">
        <span className="font-bold text-white">Alert:</span> Elevated queue at Gate D. Recommended redirect to Gate A.
      </div>
    </motion.div>
  );
}
