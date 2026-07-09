import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Globe,
  Zap,
  Network,
  Bot,
  Activity,
  Ticket,
  MapPin,
  ShieldAlert,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arena Intelligence — Smart Stadium Command Platform" },
      {
        name: "description",
        content:
          "Arena Intelligence unifies stadium operations, fan experiences, predictive crowd analytics, and emergency control in a premium command workspace.",
      },
    ],
  }),
  component: Landing,
});

const mono = "font-mono text-[10px] uppercase tracking-[0.24em]";

const modules = [
  { icon: Ticket, title: "Fan Dashboard", desc: "Digital ticketing, live match status, crowd flow, and queue intelligence." },
  { icon: Activity, title: "AI Crowd Prediction", desc: "Predictive recommendations, load balancing, and risk signals." },
  { icon: MapPin, title: "Interactive Stadium Map", desc: "Seat navigation, gates, amenities, and medical wayfinding." },
  { icon: BarChart3, title: "Admin Analytics", desc: "Revenue, attendance, security alerts, and operations visibility." },
  { icon: ShieldAlert, title: "Emergency Center", desc: "SOS, evacuation routes, medical triage, and incident control." },
  { icon: CalendarDays, title: "Tournament Management", desc: "Fixtures, leaderboards, registrations, and live score control." },
];

const benefits = [
  {
    title: "Designed for operators",
    desc: "One interface for operational control, fan experience, and safety escalation.",
    icon: Cpu,
  },
  {
    title: "Built for stadium scale",
    desc: "Real-time telemetry, crowd intelligence, and rapid decision workflows.",
    icon: Network,
  },
  {
    title: "Delivers confidence",
    desc: "Clear alerts, predictive insights, and actionable emergency response.",
    icon: ShieldCheck,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#05050B] text-slate-100 selection:bg-primary/25 selection:text-white font-sans antialiased overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05050B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1536px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <nav className="hidden xl:flex items-center gap-8 text-slate-400">
              {[
                { label: "Overview", href: "#overview" },
                { label: "Modules", href: "#modules" },
                { label: "Why", href: "#why" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-white hover:tracking-[0.28em]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/fan"
              className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.32em] text-slate-200 transition hover:bg-white/10"
            >
              Fan Portal
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-black shadow-[0_0_20px_rgba(20,184,166,0.18)] transition hover:brightness-105"
            >
              Control Nexus
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="overview" className="relative overflow-hidden border-b border-white/10 pt-24 pb-28 lg:pt-32 lg:pb-36">
          <div className="absolute inset-x-0 top-8 h-72 bg-gradient-to-b from-primary/15 to-transparent blur-3xl opacity-70" />
          <div className="mx-auto grid max-w-[1536px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-[11px] uppercase tracking-[0.38em] text-primary">
                <span className="size-2 rounded-full bg-primary" />
                Product-first command platform
              </div>

              <h1 className="mt-10 text-[clamp(3rem,5vw,5.75rem)] font-black leading-[0.9] tracking-[-0.04em] text-white">
                Smart stadium operations for every fan, team, and event.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                Arena Intelligence unifies fan experience, crowd intelligence, security, and event operations in one premium command layer for modern stadiums.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_30px_rgba(20,184,166,0.18)] transition hover:brightness-105"
                >
                  Open control center
                </Link>
                <Link
                  to="/fan"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/10"
                >
                  View fan dashboard
                </Link>
              </div>

              <div className="mt-16 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Live crowd insights", value: "real-time" },
                  { label: "Predictive routing", value: "AI-driven" },
                  { label: "Event readiness", value: "actionable" },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-3xl border-white/10 px-6 py-5">
                    <div className="text-xs uppercase tracking-[0.32em] text-slate-500">{item.label}</div>
                    <div className="mt-4 text-2xl font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="motion-arena-bg relative rounded-[2.5rem] border border-white/10 bg-[#070A14]/80 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-3xl"
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.24),_transparent_35%)]" />
              <div className="glass absolute inset-0 rounded-[2rem] border border-primary/20" />
              <div className="relative z-10 grid gap-6">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-[#02050C]/90 px-5 py-4 text-slate-300">
                  <div>
                    <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Stadium status</div>
                    <div className="mt-2 text-2xl font-black text-white">Gate B green</div>
                  </div>
                  <div className="rounded-2xl bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-primary">
                    92% capacity
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Live tickets", value: "12,824" },
                    { label: "Alerts", value: "3 active" },
                    { label: "Queue time", value: "4 min" },
                    { label: "AI forecast", value: "stable" },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-3xl border-white/10 px-5 py-5">
                      <div className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{item.label}</div>
                      <div className="mt-3 text-3xl font-black text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-[2rem] border-white/10 p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Stadium map</div>
                      <div className="mt-2 text-sm text-slate-300">Gate access, concourse flow, amenities.</div>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-primary">Live</div>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08111F]/70 p-4">
                    <div className="absolute inset-x-0 top-0 h-px bg-primary/10" />
                    <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-500">
                      <div className="rounded-3xl bg-[#0D1320]/80 p-3">Gate A</div>
                      <div className="rounded-3xl bg-[#0D1320]/80 p-3">Concourse</div>
                      <div className="rounded-3xl bg-[#0D1320]/80 p-3">Medical</div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {['Sector 01', 'VIP Lounge', 'FOOD', 'MERCH', 'FIRST AID'].map((area) => (
                        <span key={area} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="modules" className="border-b border-white/10 bg-[#05050B] py-24 lg:py-32">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-10">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-primary">
                Product roadmap
              </span>
              <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Seven modules. One command surface.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                From ticketing to emergency control, every module is designed to be fast to understand and even faster to act on.
              </p>
            </div>

            <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
              <div className="hidden border-b border-white/10 px-6 py-4 text-[11px] uppercase tracking-[0.32em] text-slate-500 md:grid md:grid-cols-[1.2fr_1.4fr_0.4fr]">
                <span>Module</span>
                <span>Outcome</span>
                <span>Status</span>
              </div>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.title}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className="grid gap-4 border-b border-white/10 px-6 py-5 transition-all last:border-b-0 md:grid-cols-[1.2fr_1.4fr_0.4fr] md:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white">{module.title}</div>
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Core module</div>
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-slate-400">{module.desc}</p>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                      <span>Live</span>
                      <ArrowUpRight className="size-3" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="why" className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1536px] px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                  Why Arena Intelligence
                </span>
                <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Built for operators who need clarity under pressure.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                  The platform turns crowd data, venue topology, and operational signals into one shared view so teams can respond faster with confidence.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {benefits.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="glass rounded-[2rem] border border-white/10 p-7">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="border-t border-white/10 px-6 py-20 lg:px-10">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/10 via-white/[0.03] to-transparent p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)] lg:flex-row lg:items-end lg:justify-between lg:p-10">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-primary">
              Next step
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Start with the core platform and scale from there.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Send the link and we begin with Module 1, then expand the experience into a full operating system.
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-105"
          >
            Start with Module 1
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#05050B] py-16">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Arena Intelligence is the enterprise-grade stadium operations layer for fan experience, security, and event command.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <span>© 2026 Arena Intelligence</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
