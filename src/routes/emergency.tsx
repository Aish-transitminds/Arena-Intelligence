import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Heart, Shield, PhoneCall, Route as RouteIcon, Siren, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Center — ArenaIQ AI" },
      { name: "description", content: "SOS, medical dispatch, security response, and evacuation routing." },
    ],
  }),
  component: Emergency,
});

function Emergency() {
  const [sos, setSos] = useState(false);
  return (
    <AppShell title="Emergency Center" subtitle="Coordinated response · Live dispatch">
      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div whileHover={{ scale: 1.01 }}
          className="glass-strong rounded-3xl p-8 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(circle at center, oklch(0.65 0.23 25 / 0.25), transparent 70%)"
          }} />
          <div className="relative flex flex-col items-center text-center">
            <div className="text-xs uppercase tracking-widest text-destructive">Emergency SOS</div>
            <h2 className="text-3xl font-bold mt-2">Tap to trigger stadium-wide response</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Dispatch medical, security, and evacuation teams simultaneously. All zone marshals will be notified in under 3 seconds.
            </p>
            <motion.button
              onClick={() => setSos((v) => !v)}
              whileTap={{ scale: 0.95 }}
              animate={sos ? { scale: [1, 1.05, 1] } : {}}
              transition={sos ? { repeat: Infinity, duration: 1.2 } : {}}
              className="mt-8 size-40 rounded-full flex flex-col items-center justify-center text-primary-foreground font-bold text-lg"
              style={{
                background: sos ? "oklch(0.65 0.23 25)" : "var(--gradient-primary)",
                boxShadow: sos ? "0 0 80px oklch(0.65 0.23 25 / 0.6)" : "var(--shadow-glow)"
              }}>
              <Siren className="size-10 mb-2" />
              {sos ? "ACTIVE" : "SOS"}
            </motion.button>
            {sos && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-6 glass rounded-xl px-4 py-3 text-sm">
                <span className="text-destructive font-semibold">Dispatched:</span> Medical team M-2 · Security squad S-4 · Zone marshals
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <ResponseCard icon={Heart} title="Medical" count={4} status="On standby" tone="accent" />
          <ResponseCard icon={Shield} title="Security" count={12} status="Patrolling" tone="primary" />
          <ResponseCard icon={PhoneCall} title="Hotline" count={1} status="Live 24/7" tone="warning" />
        </div>

        {/* Evacuation Route */}
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <RouteIcon className="size-4 text-primary-glow" />
            <div className="text-sm font-semibold">Evacuation Routes</div>
            <span className="ml-auto text-xs text-accent">All 6 routes clear</span>
          </div>
          <div className="relative h-72 rounded-xl overflow-hidden border border-border" style={{
            background: "radial-gradient(ellipse at center, oklch(0.55 0.12 150 / 0.28), oklch(0.20 0.06 140))"
          }}>
            <div className="absolute inset-8 rounded-full border-2 border-accent/40" />
            <div className="absolute inset-20 rounded-full border-2 border-accent/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-muted-foreground">FIELD</div>

            {[
              { pos: "top-4 left-8", label: "Exit A" },
              { pos: "top-4 right-8", label: "Exit B" },
              { pos: "bottom-4 left-8", label: "Exit C" },
              { pos: "bottom-4 right-8", label: "Exit D" },
              { pos: "top-1/2 left-2 -translate-y-1/2", label: "Exit E" },
              { pos: "top-1/2 right-2 -translate-y-1/2", label: "Exit F" },
            ].map((e) => (
              <div key={e.label} className={`absolute ${e.pos} glass rounded-lg px-2 py-1 text-[11px] flex items-center gap-1.5`}>
                <MapPin className="size-3 text-accent" />
                {e.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ResponseCard({ icon: Icon, title, count, status, tone }: {
  icon: React.ComponentType<{ className?: string; color?: string }>; title: string; count: number; status: string; tone: "accent" | "primary" | "warning";
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className={`size-11 rounded-xl flex items-center justify-center`}
             style={{ background: `oklch(from var(--${tone}) l c h / 0.15)`, border: `1px solid oklch(from var(--${tone}) l c h / 0.3)` }}>
          <Icon className={`size-5`} color={`var(--${tone})`} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{status}</div>
        </div>
        <div className="text-2xl font-bold">{count}</div>
      </div>
    </div>
  );
}
