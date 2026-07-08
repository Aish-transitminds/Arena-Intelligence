import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Send, Zap, TrendingUp, Users, ShieldAlert } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — ArenaIQ AI" },
      { name: "description", content: "Ask the ArenaIQ copilot anything about your stadium operations." },
    ],
  }),
  component: Assistant,
});

const quickActions = [
  { icon: Users, title: "Predict tonight's peak", desc: "Attendance forecast + confidence" },
  { icon: TrendingUp, title: "Revenue insights", desc: "Which concessions to restock" },
  { icon: Zap, title: "Optimize queues", desc: "Rebalance gates in real time" },
  { icon: ShieldAlert, title: "Safety brief", desc: "Zones needing attention" },
];

function Assistant() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi Alex — I've synced with tonight's live telemetry. Ask about crowds, queues, revenue, or safety." },
  ]);
  const [input, setInput] = useState("");

  function send(t: string) {
    if (!t.trim()) return;
    setMessages((m) => [...m, { role: "user", text: t },
      { role: "ai", text: "Based on 3 seasons of match data and live sensor feeds, I'm projecting peak attendance of 25,412 at 20:00 (±120, 94% confidence). Gate E is trending 40% above forecast — recommend opening overflow lane 3." }]);
    setInput("");
  }

  return (
    <AppShell title="ArenaIQ Copilot" subtitle="Multimodal AI trained on 3 seasons of operations data">
      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-10rem)]">
        <div className="lg:col-span-3 glass-strong rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                {m.role === "ai" && (
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--gradient-primary)" }}>
                    <Sparkles className="size-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "glass rounded-bl-sm"
                }`}>{m.text}</div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 glass rounded-xl pl-4 pr-2 py-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about crowds, queues, revenue, safety…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
              <button type="submit" className="size-9 rounded-lg flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground px-1">Quick actions</div>
          {quickActions.map((q, i) => (
            <motion.button key={q.title}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => send(q.title)}
              className="w-full text-left glass rounded-xl p-4 hover:border-primary/40 transition group">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary-glow">
                  <q.icon className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{q.title}</div>
                  <div className="text-xs text-muted-foreground">{q.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
