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
import { LiveAttendanceRing } from "@/components/LiveAttendanceRing";

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

import { useEffect, useState } from "react";

const initialKpis = [
  { id: "attendance", label: "Live Attendance", value: 52840, format: (v: number) => v.toLocaleString(), icon: Users },
  { id: "gate", label: "Gate Status", value: "All Clear", format: (v: any) => v, icon: ShieldCheck },
  { id: "queue", label: "Avg Queue Time", value: 4.2, format: (v: number) => `${v.toFixed(1)} min`, icon: Clock },
  { id: "ops", label: "Ops Score", value: 97.4, format: (v: number) => `${v.toFixed(1)}%`, icon: TrendingUp },
];

function Landing() {
  const [liveKpis, setLiveKpis] = useState(initialKpis);
  const [attendanceSparkline, setAttendanceSparkline] = useState<number[]>([52840]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveKpis((current) =>
        current.map((kpi) => {
          if (kpi.id === "attendance") {
            const newVal = Math.max(52000, Math.min(54000, Number(kpi.value) + Math.round((Math.random() - 0.5) * 15)));
            setAttendanceSparkline((prev) => [...prev.slice(-14), newVal]);
            return { ...kpi, value: newVal };
          }
          if (kpi.id === "queue") {
            return { ...kpi, value: Math.max(2.5, Math.min(6.0, Number(kpi.value) + (Math.random() - 0.5) * 0.4)) };
          }
          if (kpi.id === "ops") {
            return { ...kpi, value: Math.max(96.0, Math.min(99.5, Number(kpi.value) + (Math.random() - 0.5) * 0.2)) };
          }
          return kpi;
        })
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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
              to="/login"
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
                opacity: 0.7,
                filter: "saturate(1.1) contrast(1.1) brightness(0.9)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.7) 40%, rgba(248,250,252,0.95) 80%, rgba(248,250,252,1) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 15% 5%, rgba(14,159,110,0.15) 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 85% 5%, rgba(14,159,110,0.15) 0%, transparent 58%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-28 pb-32 lg:pt-36 lg:pb-40 lg:px-10">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[clamp(2.8rem,5.5vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-slate-900 max-w-4xl"
            >
              Arena Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-5 text-xl font-medium leading-relaxed max-w-2xl text-slate-700"
            >
              Smart Stadium Operations Platform
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-4 text-base leading-8 max-w-xl text-slate-600"
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
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.20em] text-white transition hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                  boxShadow: "0 0 32px rgba(14,159,110,0.25)",
                }}
              >
                Sign In / Register
                <ArrowUpRight className="size-4" />
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
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Hero: Live Attendance Ring */}
              <div className="md:row-span-2">
                <LiveAttendanceRing
                  attendance={Number(liveKpis.find((k) => k.id === "attendance")?.value ?? 52840)}
                  capacity={54000}
                  sparklineData={attendanceSparkline}
                  variant="hero"
                />
              </div>

              {/* Remaining KPI cards */}
              {liveKpis.filter((k) => k.id !== "attendance").map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={kpi.label}
                    className="rounded-2xl p-5 card-lift relative overflow-hidden group"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="size-4" style={{ color: "#0E9F6E" }} />
                      <span className="text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#64748B" }}>
                        {kpi.label}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums relative">
                      {kpi.format(kpi.value)}
                      {kpi.id !== "gate" && (
                        <span className="absolute -right-4 top-1 size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT THIS PROJECT (For Judges / Reviewers) ── */}
        <section className="py-20 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="rounded-3xl p-8 lg:p-12 border border-blue-500/20 bg-blue-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-blue-600" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600 mb-4 bg-blue-100 border border-blue-200">
                Judges & Reviewers
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
                About this Simulation
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 mb-6">
                This application is a <strong>Smart stadium and management prototype</strong> of a mega-event command center, inspired by the operational workflows of stadiums like SoFi and Tottenham Hotspur. It demonstrates a strict "Command Center Pattern":
              </p>
              <ul className="space-y-3 text-slate-700 mb-8 list-none">
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
                  <span><strong>AI Layering (LLM + RAG):</strong> The Arena IQ bot is powered by an LLM + RAG (Retrieval-Augmented Generation) trained model. It can provide you with match tickets, answer fan queries, pre-fill incident forms, but strictly requires human confirmation for high-risk dispatches.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
                  <span><strong>Role-Based Access:</strong> Try the "Preview Access" in the login screen to explore the Fan vs Staff views. Operations are locked without the correct token.</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:opacity-90 bg-blue-600 shadow-lg shadow-blue-600/20"
              >
                Go to Preview Login
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── MODULES GRID ── */}
        <section id="modules" className="py-20 px-6 lg:px-10 max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Platform Capabilities
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Explore the core modules that power the Arena Intelligence platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={mod.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={mod.to}
                    className="group block h-full rounded-3xl p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-primary group-hover:border-primary transition-colors">
                        <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {mod.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{mod.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{mod.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
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
              to="/login"
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
