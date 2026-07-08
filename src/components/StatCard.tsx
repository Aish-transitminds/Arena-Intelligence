import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function StatCard({ label, value, delta, icon, index = 0 }: {
  label: string; value: string; delta?: string; icon?: ReactNode; index?: number;
}) {
  const positive = delta?.startsWith("+");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-3xl font-semibold mt-2 tracking-tight">{value}</div>
          {delta && (
            <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-destructive"}`}>
              {delta} vs last week
            </div>
          )}
        </div>
        {icon && (
          <div className="size-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary-glow">
            {icon}
          </div>
        )}
      </div>
      <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
    </motion.div>
  );
}
