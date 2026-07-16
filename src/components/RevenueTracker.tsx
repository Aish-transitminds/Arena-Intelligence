import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Crown,
  TrendingUp,
  Sparkles,
} from "lucide-react";

/**
 * RevenueTracker — real-time revenue intelligence card for the admin console.
 * Displays total revenue, category breakdown, per-head metric, and top sellers.
 */

type RevenueCategory = {
  label: string;
  icon: typeof UtensilsCrossed;
  amount: number;
  target: number;
  color: string;
};

const initialCategories: RevenueCategory[] = [
  { label: "F&B", icon: UtensilsCrossed, amount: 558000, target: 620000, color: "#0E9F6E" },
  { label: "Merchandise", icon: ShoppingBag, amount: 347200, target: 400000, color: "#3B82F6" },
  { label: "Parking", icon: Car, amount: 186000, target: 200000, color: "#F4B400" },
  { label: "Premium", icon: Crown, amount: 148800, target: 180000, color: "#8B5CF6" },
];

const topSellers = [
  { item: "Biryani Combo", qty: 2840, revenue: 85200 },
  { item: "Official Jersey", qty: 620, revenue: 74400 },
  { item: "Cold Drinks (L)", qty: 4120, revenue: 61800 },
  { item: "VIP Lounge Pass", qty: 180, revenue: 54000 },
  { item: "Match Program", qty: 3200, revenue: 48000 },
];

export function RevenueTracker({ attendance = 52840 }: { attendance?: number }) {
  const [categories, setCategories] = useState(initialCategories);
  const [animateSparkle, setAnimateSparkle] = useState(false);

  // Simulate revenue ticking up
  useEffect(() => {
    const timer = setInterval(() => {
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          amount: Math.min(
            cat.target * 1.1,
            cat.amount + Math.round(Math.random() * cat.target * 0.002)
          ),
        }))
      );
      setAnimateSparkle(true);
      setTimeout(() => setAnimateSparkle(false), 600);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const totalRevenue = categories.reduce((s, c) => s + c.amount, 0);
  const totalTarget = categories.reduce((s, c) => s + c.target, 0);
  const revenuePerHead = attendance > 0 ? totalRevenue / attendance : 0;
  const overallPct = (totalRevenue / totalTarget) * 100;

  const formatCurrency = (v: number) => {
    if (v >= 1000000) return `₹${(v / 1000000).toFixed(2)}M`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v.toFixed(0)}`;
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border">
      {/* Header */}
      <div className="px-7 py-5" style={{ borderBottom: "1px solid rgba(128,128,128,0.10)" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IndianRupee className="size-4" style={{ color: "var(--primary, #0E9F6E)" }} />
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">
              Revenue Intelligence
            </h2>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(14,159,110,0.10)",
              border: "1px solid rgba(14,159,110,0.20)",
              color: "#0E9F6E",
            }}
          >
            Live
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Match day revenue · All categories
        </p>
      </div>

      <div className="p-7">
        {/* Total Revenue Hero */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.18em] font-bold mb-1.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              Total Revenue
            </p>
            <div className="flex items-center gap-2">
              <motion.span
                key={Math.floor(totalRevenue / 1000)}
                initial={{ opacity: 0.7, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground"
              >
                {formatCurrency(totalRevenue)}
              </motion.span>
              {animateSparkle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Sparkles className="size-5" style={{ color: "#F4B400" }} />
                </motion.div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: "var(--muted-foreground)" }}>
              Per Head
            </p>
            <span className="text-xl font-extrabold tabular-nums text-foreground">
              ₹{revenuePerHead.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] mb-2">
            <span style={{ color: "var(--muted-foreground)" }}>vs Target</span>
            <span style={{ color: overallPct >= 100 ? "#0E9F6E" : "#F4B400" }}>
              {overallPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(128,128,128,0.10)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallPct, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background:
                  overallPct >= 100
                    ? "linear-gradient(90deg, #0E9F6E, #3CB371)"
                    : overallPct >= 80
                    ? "linear-gradient(90deg, #F4B400, #FFC72C)"
                    : "linear-gradient(90deg, #3B82F6, #60A5FA)",
              }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catPct = (cat.amount / cat.target) * 100;
            return (
              <div
                key={cat.label}
                className="rounded-xl p-4"
                style={{ background: "var(--surface, rgba(0,0,0,0.03))", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="size-6 rounded-md flex items-center justify-center"
                    style={{ background: `${cat.color}15`, color: cat.color }}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
                    {cat.label}
                  </span>
                </div>
                <div className="text-lg font-extrabold tabular-nums text-foreground mb-1.5">
                  {formatCurrency(cat.amount)}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(128,128,128,0.10)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(catPct, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                    Target: {formatCurrency(cat.target)}
                  </span>
                  <span className="text-[9px] font-bold" style={{ color: cat.color }}>
                    {catPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Sellers */}
        <div>
          <h3
            className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            Top Selling Items
          </h3>
          <div className="space-y-2">
            {topSellers.map((item, i) => (
              <div
                key={item.item}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{
                  background: i === 0 ? "rgba(14,159,110,0.06)" : "transparent",
                  border: i === 0 ? "1px solid rgba(14,159,110,0.12)" : "1px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-extrabold tabular-nums size-5 rounded flex items-center justify-center"
                    style={{
                      background: i === 0 ? "rgba(14,159,110,0.15)" : "rgba(128,128,128,0.08)",
                      color: i === 0 ? "#0E9F6E" : "var(--muted-foreground)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{item.item}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] tabular-nums" style={{ color: "var(--muted-foreground)" }}>
                    ×{item.qty.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold tabular-nums text-foreground">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
