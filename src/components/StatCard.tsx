import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  delta,
  icon,
  index = 0,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  index?: number;
}) {
  const positive = delta?.startsWith("+") || delta?.startsWith("-");
  const isPositive = delta?.startsWith("+");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="rounded-2xl p-5 relative overflow-hidden card-lift group"
      style={{
        background: "rgba(14,27,36,0.90)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.20em]" style={{ color: "#AAB8C2" }}>
          {label}
        </div>
        {icon && (
          <div
            className="size-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: "rgba(14,159,110,0.10)",
              border: "1px solid rgba(14,159,110,0.18)",
              color: "#0E9F6E",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-extrabold tracking-tight text-white">{value}</div>

      {delta && (
        <div
          className="text-xs mt-2 font-semibold"
          style={{ color: isPositive ? "#0E9F6E" : positive ? "#D92D20" : "#AAB8C2" }}
        >
          {delta} vs last week
        </div>
      )}

      {/* Subtle hover glow */}
      <div
        className="absolute -bottom-8 -right-8 size-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "rgba(14,159,110,0.12)" }}
      />
    </motion.div>
  );
}
