import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Users,
  Globe,
  Activity,
  Ticket,
  MapPin,
  ShieldAlert,
  BarChart3,
  CalendarDays,
  Radio,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { AIAssistant } from "@/components/AIAssistant";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arena Intelligence — Concept Ops Platform" },
      {
        name: "description",
        content:
          "Arena Intelligence is a concept operations platform for crowd management, tournament coordination, emergency response, and stadium analytics for a mega-event venue.",
      },
    ],
  }),
  component: Landing,
});


const modules = [
  {
    icon: Ticket,
    title: "Fan Dashboard",
    desc: "Digital ticketing, live match status, crowd flow, and real-time queue intelligence.",
    to: "/fan",
    tag: "Live",
  },
  {
    icon: Activity,
    title: "Crowd Management",
    desc: "Live occupancy, flow analysis, capacity status, and operational recommendations.",
    to: "/admin",
    tag: "Live",
  },
  {
    icon: MapPin,
    title: "Seat Navigation",
    desc: "Premium stadium blueprint with gates, amenities, routes and medical wayfinding.",
    to: "/fan",
    tag: "Live",
  },
  {
    icon: BarChart3,
    title: "Admin Analytics",
    desc: "Revenue, attendance, security alerts, and full operations visibility.",
    to: "/admin",
    tag: "Live",
  },
  {
    icon: ShieldAlert,
    title: "Emergency Center",
    desc: "SOS dispatch, evacuation routes, medical triage, and live incident control.",
    to: "/emergency",
    tag: "Live",
  },
  {
    icon: CalendarDays,
    title: "Tournament Management",
    desc: "Fixtures, leaderboards, team registrations, and live score control.",
    to: "/tournament",
    tag: "Live",
  },
];

const kpis = [
  { label: "Live Attendance", value: "52,840", icon: Users },
  { label: "Gate Status", value: "All Clear", icon: ShieldCheck },
  { label: "Avg Queue Time", value: "4 min", icon: Clock },
  { label: "Ops Score", value: "97.4%", icon: TrendingUp },
];

function Landing() {
  return (
    <div
      className="min-h-screen text-slate-900 selection:bg-primary/20 selection:text-slate-900 font-sans antialiased overflow-x-hidden"
      style={{ background: "#F8FAFC" }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.85)",
        }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <nav className="hidden xl:flex items-center gap-8" style={{ color: "#64748B" }}>
              {[
                { label: "Overview", href: "#overview" },
                { label: "Modules", href: "#modules" },
                { label: "Operations", href: "#operations" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-slate-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Live status pill */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(14,159,110,0.08)",
                border: "1px solid rgba(14,159,110,0.20)",
              }}
            >
              <Radio className="size-3 text-primary animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.20em] text-primary">
                Live — Match Day
              </span>
            </div>

            <Link
              to="/fan"
              className="hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.20em] transition-colors hover:text-slate-900 sm:inline-flex items-center"
              style={{ color: "#64748B" }}
            >
              Fan Portal
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.20em] text-white transition"
              style={{
                background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                boxShadow: "0 0 20px rgba(14,159,110,0.22)",
              }}
            >
              Launch Dashboard
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section
          id="overview"
          className="relative overflow-hidden"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          {/* Hero background — stadium at night (now with light frosted glass over it) */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 scale-[1.04]"
              style={{
                backgroundImage: 'url("/stadium-hero.png")',
                backgroundSize: "cover",
                backgroundPosition: "center 22%",
                opacity: 0.9,
                filter: "saturate(1.2) contrast(1.1) brightness(0.65)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(15,23,42,0.70) 0%, rgba(15,23,42,0.30) 40%, rgba(248,250,252,0.95) 80%, rgba(248,250,252,1) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 15% 5%, rgba(14,159,110,0.08) 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 85% 5%, rgba(14,159,110,0.08) 0%, transparent 58%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-28 pb-32 lg:pt-36 lg:pb-40 lg:px-10">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8"
              style={{
                background: "rgba(14,159,110,0.08)",
                border: "1px solid rgba(14,159,110,0.22)",
              }}
            >
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                Concept Ops Platform for Mega-Events
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[clamp(2.8rem,5.5vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-white max-w-4xl"
            >
              Arena Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 text-xl font-medium leading-relaxed max-w-2xl text-slate-200"
            >
              Smart Stadium Operations Platform
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-4 text-base leading-8 max-w-xl text-slate-300"
            >
              Unified operations platform for crowd management, tournament coordination,
              emergency response and stadium analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              <Link
                to="/admin"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.20em] text-white transition hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                  boxShadow: "0 0 32px rgba(14,159,110,0.25)",
                }}
              >
                Admin Console
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/fan"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-10 py-4.5 text-sm font-bold uppercase tracking-[0.20em] text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1E40AF, #7C3AED, #DB2777)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.25), 0 0 80px rgba(219,39,119,0.15)",
                  border: "2px solid rgba(255,255,255,0.50)",
                }}
              >
                <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: "2px solid rgba(124,58,237,0.40)" }} />
                ⚽ Fan Dashboard
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/assistant"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-10 py-4.5 text-sm font-bold uppercase tracking-[0.20em] text-white transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #0E9F6E, #059669, #10B981)",
                  boxShadow: "0 0 40px rgba(14,159,110,0.30), 0 0 60px rgba(5,150,105,0.15)",
                  border: "2px solid rgba(255,255,255,0.50)",
                }}
              >
                <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: "2px solid rgba(14,159,110,0.40)" }} />
                <span className="absolute inset-0 rounded-full overflow-hidden">
                  <span className="absolute inset-y-0 -inset-x-[100%] w-[100%] animate-glitter-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
                </span>
                Arena IQ AI
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            {/* Live KPI Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.label}
                    className="rounded-2xl p-5 card-lift"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="size-4" style={{ color: "#0E9F6E" }} />
                      <span className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#64748B" }}>
                        {kpi.label}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── MODULES ── */}
        <section
          id="modules"
          className="py-24 lg:py-32 bg-white"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <div className="max-w-2xl mb-14">
              <span
                className="inline-flex rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary mb-5"
                style={{ background: "rgba(14,159,110,0.08)", border: "1px solid rgba(14,159,110,0.18)" }}
              >
                Platform Modules
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Six modules. One command surface.
              </h2>
              <p className="mt-5 text-lg leading-8" style={{ color: "#64748B" }}>
                From ticketing to emergency control, every module is designed to be fast to understand and even faster to act on.
              </p>
            </div>

            {/* Modules table */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: "1px solid rgba(0,0,0,0.08)", background: "#F8FAFC" }}
            >
              {/* Table header */}
              <div
                className="hidden md:grid md:grid-cols-[1.4fr_1.6fr_0.5fr] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", color: "#64748B" }}
              >
                <span>Module</span>
                <span>Operational Scope</span>
                <span>Status</span>
              </div>
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <motion.div
                    key={mod.title}
                    whileHover={{ backgroundColor: "rgba(14,159,110,0.04)" }}
                    className="grid gap-4 px-6 py-5 transition-all last:border-b-0 md:grid-cols-[1.4fr_1.6fr_0.5fr] md:items-center cursor-default"
                    style={{ borderBottom: i < modules.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="inline-flex size-11 items-center justify-center rounded-xl shrink-0"
                        style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.18)" }}
                      >
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{mod.title}</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "#64748B" }}>
                          Core Module
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-7" style={{ color: "#64748B" }}>{mod.desc}</p>
                    <div>
                      <Link
                        to={mod.to as any}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:underline"
                      >
                        {mod.tag}
                        <ArrowUpRight className="size-3" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WHY SECTION ── */}
        <section id="operations" className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
              <div>
                <span
                  className="inline-flex rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] mb-6"
                  style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", color: "#64748B" }}
                >
                  Why Arena Intelligence
                </span>
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  Built for operators who need clarity under pressure.
                </h2>
                <p className="mt-6 text-lg leading-8" style={{ color: "#64748B" }}>
                  The platform turns crowd data, venue topology, and operational signals into one shared view so teams can respond faster with confidence during the biggest events.
                </p>
                <div className="mt-10">
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.20em] text-white transition"
                    style={{
                      background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                      boxShadow: "0 0 24px rgba(14,159,110,0.22)",
                    }}
                  >
                    Open Operations Console
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    icon: Users,
                    title: "Crowd Management",
                    desc: "Real-time occupancy tracking, flow analysis, and capacity recommendations.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Safety Operations",
                    desc: "Incident response, emergency routing and security coordination.",
                  },
                  {
                    icon: Globe,
                    title: "Tournament Scale",
                    desc: "Supports 100,000+ capacity venues across multiple concurrent events.",
                  },
                  {
                    icon: Activity,
                    title: "Live Analytics",
                    desc: "Operational dashboards updating every 30 seconds for decision support. (Simulated for demo)",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl p-6 card-lift bg-white"
                      style={{
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div
                        className="inline-flex size-11 items-center justify-center rounded-xl mb-4"
                        style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.18)" }}
                      >
                        <Icon className="size-5 text-primary" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm leading-7" style={{ color: "#64748B" }}>{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── CTA BANNER ── */}
      <section style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "#F1F5F9" }}>
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-10">
          <div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 rounded-2xl p-8 lg:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(14,159,110,0.05) 0%, rgba(255,255,255,0.90) 100%)",
              border: "1px solid rgba(14,159,110,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.03)",
            }}
          >
            <div className="max-w-2xl">
              <span
                className="inline-flex rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-primary mb-5"
                style={{ background: "rgba(14,159,110,0.08)", border: "1px solid rgba(14,159,110,0.18)" }}
              >
                Get Started
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Ready for match day operations?
              </h2>
              <p className="mt-4 text-lg leading-8" style={{ color: "#64748B" }}>
                Access the full operations console and experience arena-grade management for your next event.
              </p>
            </div>
            <Link
              to="/admin"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.20em] text-white transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                boxShadow: "0 0 32px rgba(14,159,110,0.25)",
              }}
            >
              Launch Dashboard
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "#FFFFFF" }}>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-7" style={{ color: "#64748B" }}>
              Arena Intelligence is a concept operations layer for fan experience, security, and event command.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: "#64748B" }}>
            <span>© 2026 Arena Intelligence</span>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}
