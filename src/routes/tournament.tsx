import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { fixtures, leaderboard } from "@/lib/mock-data";
import { Trophy, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/tournament")({
  head: () => ({
    meta: [
      { title: "Tournament — ArenaIQ AI" },
      { name: "description", content: "Fixtures, leaderboard, live scores and team registration." },
    ],
  }),
  component: Tournament,
});

function Tournament() {
  const [tab, setTab] = useState<"fixtures" | "leaderboard" | "live" | "register">("fixtures");
  return (
    <AppShell title="Summer Cup 2026" subtitle="12 teams · Round 8 of 12">
      <div className="flex flex-wrap gap-2 mb-6">
        {(["fixtures", "leaderboard", "live", "register"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
              tab === t ? "text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
            }`}
            style={tab === t ? { background: "var(--gradient-primary)" } : undefined}>
            {t === "register" ? "Team Registration" : t === "live" ? "Live Scores" : t}
          </button>
        ))}
      </div>

      {tab === "fixtures" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border font-semibold text-sm">Upcoming Fixtures</div>
          <div className="divide-y divide-border">
            {fixtures.map((f) => (
              <div key={f.id} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition">
                <div className="w-16 text-center">
                  <div className="text-xs text-muted-foreground">{f.date}</div>
                  <div className="text-sm font-semibold">{f.time}</div>
                </div>
                <div className="flex-1 grid grid-cols-3 items-center gap-2">
                  <div className="text-right font-medium">{f.home}</div>
                  <div className="text-center">
                    {f.homeScore !== undefined ? (
                      <div className="text-lg font-bold">{f.homeScore} <span className="text-muted-foreground">–</span> {f.awayScore}</div>
                    ) : (
                      <div className="text-xs text-muted-foreground">vs</div>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-0.5">{f.venue}</div>
                  </div>
                  <div className="text-left font-medium">{f.away}</div>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full ${
                  f.status === "Live" ? "bg-destructive/20 text-destructive border border-destructive/30"
                  : f.status === "Final" ? "glass" : "bg-primary/15 text-primary-glow border border-primary/25"
                }`}>{f.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "leaderboard" && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left p-4">#</th>
                <th className="text-left p-4">Team</th>
                <th className="text-center p-4">P</th>
                <th className="text-center p-4">W</th>
                <th className="text-center p-4">D</th>
                <th className="text-center p-4">L</th>
                <th className="text-right p-4">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaderboard.map((r) => (
                <tr key={r.rank} className="hover:bg-secondary/30 transition">
                  <td className="p-4">
                    <div className={`size-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      r.rank === 1 ? "bg-warning/20 text-warning border border-warning/30"
                      : r.rank <= 3 ? "bg-accent/20 text-accent border border-accent/30"
                      : "glass"
                    }`}>{r.rank}</div>
                  </td>
                  <td className="p-4 font-medium flex items-center gap-2">
                    {r.rank === 1 && <Trophy className="size-4 text-warning" />}
                    {r.team}
                  </td>
                  <td className="p-4 text-center text-muted-foreground">{r.played}</td>
                  <td className="p-4 text-center text-accent">{r.won}</td>
                  <td className="p-4 text-center text-muted-foreground">{r.drawn}</td>
                  <td className="p-4 text-center text-destructive">{r.lost}</td>
                  <td className="p-4 text-right font-bold">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "live" && (
        <div className="grid md:grid-cols-2 gap-4">
          {fixtures.filter((f) => f.status === "Live").map((f) => (
            <div key={f.id} className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="size-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-destructive font-semibold uppercase tracking-wider">Live · 68'</span>
              </div>
              <div className="mt-4 grid grid-cols-3 items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Home</div>
                  <div className="text-lg font-bold mt-1">{f.home}</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold tracking-tight">{f.homeScore} <span className="text-muted-foreground">–</span> {f.awayScore}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Away</div>
                  <div className="text-lg font-bold mt-1">{f.away}</div>
                </div>
              </div>
              <div className="mt-6 text-xs text-muted-foreground text-center">{f.venue} · Attendance 24,812</div>
            </div>
          ))}
        </div>
      )}

      {tab === "register" && (
        <div className="glass rounded-2xl p-6 max-w-2xl">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Plus className="size-5 text-primary-glow" /> Register a Team</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your team to the Summer Cup 2026 roster.</p>
          <form className="mt-6 space-y-4">
            {[
              { label: "Team Name", placeholder: "Titans FC" },
              { label: "Captain", placeholder: "Alex Reyes" },
              { label: "Contact Email", placeholder: "captain@team.io" },
              { label: "Home City", placeholder: "San Jose, CA" },
            ].map((f) => (
              <div key={f.label}>
                <label className="text-xs text-muted-foreground">{f.label}</label>
                <input placeholder={f.placeholder} className="mt-1.5 w-full glass rounded-xl px-3.5 py-3 text-sm bg-transparent outline-none focus:border-primary/40" />
              </div>
            ))}
            <button className="w-full py-3 rounded-xl text-primary-foreground font-medium" style={{ background: "var(--gradient-primary)" }}>
              Submit Registration
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
