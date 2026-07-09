import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { fixtures, leaderboard } from "@/lib/mock-data";
import { Trophy, Plus, Radio } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/tournament")({
  head: () => ({
    meta: [
      { title: "Tournament — Arena Intelligence" },
      { name: "description", content: "Fixtures, leaderboard, live scores and team registration." },
    ],
  }),
  component: Tournament,
});

const tabs = ["fixtures", "leaderboard", "live", "register"] as const;

function Tournament() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("fixtures");

  return (
    <AppShell title="Mega-Event Tournament" subtitle="48 teams · Group Stage · Concept Operations Workspace">
      {/* Tab bar */}
      <div
        className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] transition-all"
            style={
              tab === t
                ? {
                    background: "linear-gradient(135deg, rgba(14,159,110,0.18), rgba(60,179,113,0.10))",
                    color: "#fff",
                    border: "1px solid rgba(14,159,110,0.25)",
                  }
                : { color: "#AAB8C2" }
            }
          >
            {t === "register" ? "Team Registration" : t === "live" ? "Live Scores" : t}
          </button>
        ))}
      </div>

      {/* Fixtures */}
      {tab === "fixtures" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(14,27,36,0.90)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="px-6 py-4 font-bold text-sm text-white"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            Upcoming Fixtures
          </div>
          <div>
            {fixtures.map((f, i) => (
              <div
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 px-6 py-4 transition-colors cursor-default"
                style={{ borderBottom: i < fixtures.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,159,110,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex sm:block justify-between items-center sm:w-16 sm:text-center shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#AAB8C2" }}>{f.date}</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{f.time}</div>
                </div>
                <div className="w-full sm:flex-1 grid grid-cols-3 items-center gap-2 sm:gap-3">
                  <div className="text-right font-semibold text-white">{f.home}</div>
                  <div className="text-center">
                    {f.homeScore !== undefined ? (
                      <div className="text-xl font-extrabold text-white tracking-tight">
                        {f.homeScore} <span style={{ color: "#AAB8C2" }}>—</span> {f.awayScore}
                      </div>
                    ) : (
                      <div className="text-xs uppercase tracking-[0.16em]" style={{ color: "#AAB8C2" }}>vs</div>
                    )}
                    <div className="text-[10px] mt-0.5" style={{ color: "#AAB8C2" }}>{f.venue}</div>
                  </div>
                  <div className="font-semibold text-white">{f.away}</div>
                </div>
                <div className="text-center sm:text-right mt-2 sm:mt-0">
                  <span
                    className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-[0.16em]"
                    style={
                      f.status === "Live"
                        ? { background: "rgba(217,45,32,0.15)", color: "#D92D20", border: "1px solid rgba(217,45,32,0.28)" }
                        : f.status === "Final"
                        ? { background: "rgba(255,255,255,0.06)", color: "#AAB8C2", border: "1px solid rgba(255,255,255,0.10)" }
                        : { background: "rgba(14,159,110,0.12)", color: "#0E9F6E", border: "1px solid rgba(14,159,110,0.22)" }
                    }
                  >
                    {f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {tab === "leaderboard" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(14,27,36,0.90)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                {["#", "Team", "P", "W", "D", "L", "Pts"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] ${h === "#" || h === "P" || h === "W" || h === "D" || h === "L" || h === "Pts" ? "text-center" : "text-left"}`}
                    style={{ color: "#AAB8C2" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r, i) => (
                <tr
                  key={r.rank}
                  className="transition-colors cursor-default"
                  style={{ borderBottom: i < leaderboard.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(14,159,110,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-4 text-center">
                    <div
                      className="size-7 rounded-lg flex items-center justify-center text-xs font-bold mx-auto"
                      style={
                        r.rank === 1
                          ? { background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.28)" }
                          : r.rank <= 3
                          ? { background: "rgba(14,159,110,0.12)", color: "#0E9F6E", border: "1px solid rgba(14,159,110,0.22)" }
                          : { background: "rgba(255,255,255,0.05)", color: "#AAB8C2", border: "1px solid rgba(255,255,255,0.08)" }
                      }
                    >
                      {r.rank}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      {r.rank === 1 && <Trophy className="size-3.5" style={{ color: "#D4AF37" }} />}
                      {r.team}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center" style={{ color: "#AAB8C2" }}>{r.played}</td>
                  <td className="px-5 py-4 text-center font-semibold" style={{ color: "#0E9F6E" }}>{r.won}</td>
                  <td className="px-5 py-4 text-center" style={{ color: "#AAB8C2" }}>{r.drawn}</td>
                  <td className="px-5 py-4 text-center" style={{ color: "#D92D20" }}>{r.lost}</td>
                  <td className="px-5 py-4 text-center font-extrabold text-white">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Live Scores */}
      {tab === "live" && (
        <div className="grid md:grid-cols-2 gap-5">
          {fixtures.filter((f) => f.status === "Live").map((f) => (
            <div
              key={f.id}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: "rgba(14,27,36,0.90)", border: "1px solid rgba(217,45,32,0.20)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top right, rgba(217,45,32,0.06), transparent 60%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <span className="size-2 rounded-full bg-destructive" style={{ boxShadow: "0 0 6px rgba(217,45,32,0.70)" }}>
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="block size-full rounded-full bg-destructive" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: "#D92D20" }}>
                    Live · 68'
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: "#AAB8C2" }}>Home</div>
                    <div className="text-lg font-bold text-white mt-1">{f.home}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                      {f.homeScore} <span style={{ color: "#AAB8C2" }}>—</span> {f.awayScore}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em]" style={{ color: "#AAB8C2" }}>Away</div>
                    <div className="text-lg font-bold text-white mt-1">{f.away}</div>
                  </div>
                </div>
                <div className="mt-5 text-xs text-center" style={{ color: "#AAB8C2" }}>
                  {f.venue} · Attendance 24,812
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register */}
      {tab === "register" && (
        <div
          className="rounded-2xl p-7 max-w-2xl"
          style={{ background: "rgba(14,27,36,0.90)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.20)" }}
            >
              <Plus className="size-5 text-primary" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Register Operations Squad</h3>
          </div>
          <p className="text-sm mb-7" style={{ color: "#AAB8C2" }}>Register your volunteer or staff squad for the Stadium Alpha matches.</p>
          <form className="space-y-4">
            {[
              { label: "Squad Name", placeholder: "Volunteer Crew Alpha" },
              { label: "Lead Coordinator", placeholder: "Alex Reyes" },
              { label: "Contact Email", placeholder: "squad@arena.dev" },
              { label: "Operation Zone", placeholder: "Gate B / Section 204" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "#AAB8C2" }}>
                  {f.label}
                </label>
                <input
                  placeholder={f.placeholder}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-sm text-white bg-transparent outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(14,159,110,0.40)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>
            ))}
            <button
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-[0.20em] text-white transition hover:opacity-90 active:scale-[0.99] mt-2"
              style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 0 24px rgba(14,159,110,0.20)" }}
            >
              Submit Registration
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
