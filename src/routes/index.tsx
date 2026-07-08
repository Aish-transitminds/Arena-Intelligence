import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Activity, Radio } from "lucide-react";
import { Logo } from "@/components/Logo";
import stadiumHero from "@/assets/stadium-hero.jpg";
import pitchTactical from "@/assets/pitch-tactical.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArenaIQ AI — Smart Stadium & Tournament Operations" },
      { name: "description", content: "The operations layer for modern stadiums. Predict crowds, cut queue times, run tournaments and coordinate emergencies in real time." },
      { property: "og:title", content: "ArenaIQ AI — Smart Stadium Intelligence" },
      { property: "og:description", content: "The operations layer for modern stadiums." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

const capabilities = [
  { code: "01", title: "Crowd Forecasting", spec: "94% accuracy · 6h horizon", body: "Ensemble models pull ticketing, transit, weather and historical density into a single occupancy signal per section." },
  { code: "02", title: "Queue Orchestration", spec: "sub-60s reroute", body: "Live gate telemetry surfaces choke points before they form and rebalances staff and lanes automatically." },
  { code: "03", title: "Tournament Ops", spec: "fixtures · brackets · live scores", body: "One console for the season — from registration through final whistle, with broadcast-ready score feeds." },
  { code: "04", title: "Emergency Response", spec: "3s dispatch fan-out", body: "SOS, medical, security and evac routing coordinated through one command surface, audited end-to-end." },
  { code: "05", title: "Revenue Signals", spec: "concessions · merch · upsell", body: "Per-zone sell-through and restock alerts so the last row buys as easily as the first." },
  { code: "06", title: "Fan Experience", spec: "ticket · wayfinding · nudges", body: "Digital passes, seat-level navigation and contextual notifications delivered without an install." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Top ticker */}
      <div className="border-b border-border/60 bg-black/40">
        <div className="max-w-[1400px] mx-auto flex items-center gap-6 px-6 py-2 text-[11px]" style={mono}>
          <span className="flex items-center gap-1.5 text-accent uppercase tracking-widest">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live
          </span>
          <span className="text-muted-foreground">38 venues · 2.4M fans served this season</span>
          <span className="ml-auto hidden md:flex items-center gap-4 text-muted-foreground">
            <span>UPTIME <span className="text-foreground">99.99%</span></span>
            <span>LAT <span className="text-foreground">42MS</span></span>
            <span>UTC <span className="text-foreground">19:42:07</span></span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-black/20">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground uppercase tracking-wider" style={{ fontSize: "12px" }}>
            <a href="#platform" className="hover:text-foreground transition">Platform</a>
            <a href="#ops" className="hover:text-foreground transition">Ops Center</a>
            <Link to="/tournament" className="hover:text-foreground transition">Tournaments</Link>
            <Link to="/emergency" className="hover:text-foreground transition">Safety</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-2 py-2">Sign in</Link>
            <Link to="/admin" className="text-sm font-medium px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition inline-flex items-center gap-1.5">
              Open console <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — full-bleed stadium with overlay chrome */}
      <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0">
          <img src={stadiumHero} alt="Stadium at dusk under floodlights" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, oklch(0.20 0.06 140 / 0.4) 0%, oklch(0.20 0.06 140 / 0.75) 50%, oklch(0.20 0.06 140) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 20% 40%, oklch(0.55 0.12 150 / 0.35), transparent 60%)"
          }} />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent" style={mono}>
            <Radio className="size-3" /> Match Day · Arena One · 19:42:07 UTC
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 text-[clamp(2.75rem,7vw,6.5rem)] font-bold tracking-[-0.03em] leading-[0.95] max-w-5xl"
          >
            Every seat filled.<br />
            Every gate flowing.<br />
            <span className="text-gradient">Every second measured.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 text-lg text-muted-foreground max-w-2xl"
          >
            ArenaIQ is the operations layer for modern stadiums — predictive crowd models, live queue orchestration, tournament management and emergency response, all in one command surface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3.5 rounded-md text-primary-foreground"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              Enter ops center <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/fan" className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3.5 rounded-md border border-border hover:bg-white/5 transition">
              See fan view
            </Link>
          </motion.div>

          {/* Live telemetry strip — scoreboard style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-b border-border/60 divide-x divide-border/60"
          >
            {[
              { k: "ATTEND", v: "24,812", d: "+8% vs fcst", tone: "text-accent" },
              { k: "GATE WAIT", v: "06:24", d: "gate E hot", tone: "text-warning" },
              { k: "ALERTS", v: "03", d: "1 critical", tone: "text-destructive" },
              { k: "REVENUE", v: "$284K", d: "+12% w/w", tone: "text-accent" },
            ].map((s) => (
              <div key={s.k} className="p-5 md:p-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>{s.k}</div>
                <div className="text-3xl md:text-4xl font-semibold mt-2 tracking-tight tabular-nums" style={mono}>{s.v}</div>
                <div className={`text-[11px] mt-2 ${s.tone}`} style={mono}>{s.d}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CAPABILITIES — numbered ops list */}
      <section id="platform" className="border-b border-border/60">
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.25em] text-accent flex items-center gap-2" style={mono}>
                <span className="size-1 rounded-full bg-accent" /> Platform
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
                Six systems.<br />One command surface.
              </h2>
            </div>
            <p className="md:col-span-7 md:col-start-6 text-lg text-muted-foreground leading-relaxed self-end">
              ArenaIQ replaces the tangle of ticketing, analytics, radios and spreadsheets that most venues still run on match day. Every signal in one place, every decision one click away.
            </p>
          </div>

          <div className="border-t border-border/60">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.04 }}
                className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-border/60 hover:bg-white/[0.02] transition px-2 -mx-2"
              >
                <div className="md:col-span-1 text-sm text-muted-foreground pt-1" style={mono}>{c.code}</div>
                <div className="md:col-span-4">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{c.title}</h3>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.15em] text-accent" style={mono}>{c.spec}</div>
                </div>
                <p className="md:col-span-6 text-muted-foreground leading-relaxed self-center">{c.body}</p>
                <div className="md:col-span-1 self-center justify-self-end">
                  <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPS CENTER — tactical pitch preview */}
      <section id="ops" className="border-b border-border/60 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-accent flex items-center gap-2" style={mono}>
                <Activity className="size-3" /> Ops Center
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
                Read the venue like a pitch.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Live density, movement and dwell rendered as tactical overlays. Zones you can zoom into. Signals you can act on. An AI copilot standing by for every decision.
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border/60 pt-8">
                {[
                  { k: "Sensors ingested", v: "3.1B / day" },
                  { k: "Median forecast error", v: "±1.4%" },
                  { k: "Dispatch fan-out", v: "< 3 sec" },
                  { k: "Cost per fan served", v: "$0.06" },
                ].map((m) => (
                  <div key={m.k}>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>{m.k}</dt>
                    <dd className="text-2xl font-semibold mt-1.5 tabular-nums" style={mono}>{m.v}</dd>
                  </div>
                ))}
              </dl>

              <Link to="/admin" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-md text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}>
                Explore live console <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img src={pitchTactical} alt="Tactical pitch overlay with player positions" className="w-full h-auto" width={1600} height={1000} loading="lazy" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: "linear-gradient(180deg, transparent 60%, oklch(0.20 0.06 140 / 0.9) 100%)"
                }} />
                {/* Corner HUD readouts */}
                <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px]" style={mono}>
                  <span className="px-2 py-1 rounded bg-destructive/90 text-destructive-foreground uppercase tracking-widest">Rec</span>
                  <span className="text-white/70">CAM 04 · 60FPS</span>
                </div>
                <div className="absolute top-4 right-4 text-right text-[10px] text-white/70" style={mono}>
                  <div>MATCH 07 · MIN 68'</div>
                  <div className="text-white text-lg font-semibold mt-0.5">2 – 1</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-white/70" style={mono}>
                  <span>DENSITY 82% · SECTION 204</span>
                  <span className="text-accent">ALL CLEAR</span>
                </div>
              </div>
              {/* Floating readout card */}
              <div className="hidden md:block absolute -bottom-6 -left-6 glass border border-border rounded-xl p-4 w-64 shadow-2xl">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={mono}>AI Recommendation</div>
                <div className="text-sm mt-2 leading-snug">Open overflow lane 3 at Gate E — projected wait exceeds SLA in <span className="text-warning">4 min</span>.</div>
                <div className="mt-3 flex gap-2">
                  <button className="text-[11px] px-2.5 py-1 rounded bg-foreground text-background font-medium">Apply</button>
                  <button className="text-[11px] px-2.5 py-1 rounded border border-border">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border/60">
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <h2 className="md:col-span-8 text-4xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.02]">
              Ready when the floodlights come on.
            </h2>
            <div className="md:col-span-4 flex md:justify-end">
              <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-4 rounded-md text-primary-foreground w-full md:w-auto justify-center"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
                Enter the ops center <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="sm" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">The operations layer for modern stadiums. Built for the moment the whistle blows.</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={mono}>Platform</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/admin" className="hover:text-foreground text-muted-foreground">Admin</Link></li>
              <li><Link to="/fan" className="hover:text-foreground text-muted-foreground">Fan</Link></li>
              <li><Link to="/tournament" className="hover:text-foreground text-muted-foreground">Tournaments</Link></li>
              <li><Link to="/emergency" className="hover:text-foreground text-muted-foreground">Emergency</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={mono}>Company</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-foreground text-muted-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground text-muted-foreground">Security</a></li>
              <li><a href="#" className="hover:text-foreground text-muted-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground" style={mono}>
            <span>© 2026 ARENAIQ AI · ALL SYSTEMS NOMINAL</span>
            <span>v2.4.1 · BUILD 2026.07.08</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
