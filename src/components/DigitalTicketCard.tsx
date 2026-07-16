import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

export function DigitalTicketCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 my-3"
    >
      <div className="bg-primary px-5 py-4 text-white">
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">FIFA World Cup 26™</div>
          <div className="px-2 py-1 bg-white/20 rounded-md text-[10px] font-bold tracking-widest backdrop-blur-md">SEC 14</div>
        </div>
        <h3 className="text-xl font-extrabold mt-2 leading-tight">Brazil vs. France</h3>
        <p className="text-xs opacity-90 font-medium mt-1">Final Match · Arena Intelligence</p>
      </div>
      
      <div className="p-5 flex gap-4 items-center bg-slate-50 border-b border-slate-100">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <QrCode className="size-16 text-slate-900" />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Gate</div>
            <div className="text-sm font-extrabold text-slate-900">Gate D</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Row</div>
            <div className="text-sm font-extrabold text-slate-900">42</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Seat</div>
            <div className="text-sm font-extrabold text-slate-900">12A</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Type</div>
            <div className="text-sm font-extrabold text-slate-900">VIP</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-3 text-center text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em]">
        Scan at Turnstile 4
      </div>
    </motion.div>
  );
}
