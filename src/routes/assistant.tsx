import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Send, Globe, UserCheck } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { askGeminiRAG } from "../actions/chat.server";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Arena IQ Operations — Arena Intelligence" },
      { name: "description", content: "World Cup 2026 operations intelligence assistant at MetLife Stadium. Persona-driven real-time coordination." },
    ],
  }),
  component: Assistant,
});

type Persona = "staff" | "fan" | "volunteer";
type Language = "en" | "es" | "fr" | "pt";

const suggestions: Record<Persona, { title: string; desc: string }[]> = {
  staff: [
    { title: "Optimize transport lanes", desc: "NJ Transit & Bus lane rebalancing" },
    { title: "Concourse waste alert", desc: "Sensors & cleaning dispatch" },
    { title: "Gate E queue status", desc: "Redirect flow dynamics" },
    { title: "Draft multilingual PA alert", desc: "PA announcements in ES/FR" },
  ],
  fan: [
    { title: "Find nearest restroom", desc: "Check current queue times" },
    { title: "Where is Food Court?", desc: "Locate plaza concessions" },
    { title: "Transport to NYC", desc: "Shuttle and train schedules" },
    { title: "How to get wheelchair help?", desc: "Special assistance requests" },
  ],
  volunteer: [
    { title: "Accessibility instructions", desc: "Elevator routing procedures" },
    { title: "Lost and Found protocol", desc: "Immediate inventory logging" },
    { title: "Gate B shift coordinator", desc: "Volunteers shift roster" },
    { title: "Sustainability guidelines", desc: "Composting & recycling rules" },
  ],
};

const languageLabels: Record<Language, { flag: string; name: string }> = {
  en: { flag: "🇬🇧", name: "English" },
  es: { flag: "🇪🇸", name: "Español" },
  fr: { flag: "🇫🇷", name: "Français" },
  pt: { flag: "🇧🇷", name: "Português" },
};

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
};

const fallbackByPersona: Record<Persona, string> = {
  staff: "I couldn't reach the live AI service just now, but stadium operations are nominal. Please try your question again in a moment.",
  fan: "I'm having trouble connecting right now. For urgent help, please visit the nearest Guest Services booth or ask any staff member.",
  volunteer: "Connection issue on my end — please check with your shift coordinator for immediate guidance, and I'll be back online shortly.",
};

function buildSystemPrompt(persona: Persona, lang: Language) {
  const personaContext: Record<Persona, string> = {
    staff: "You are speaking to stadium OPERATIONS STAFF. Be concise, operational, and action-oriented. Include concrete numbers, gate/section references, and next steps when relevant (e.g. dispatch, reroute, alert).",
    fan: "You are speaking to a FAN attending the match. Be warm, brief, and practical — directions, wait times, amenities, and accessibility help.",
    volunteer: "You are speaking to a VOLUNTEER on shift. Be clear and procedural — give step-by-step protocol instructions (lost & found, accessibility escorts, shift logistics).",
  };

  return `You are Arena IQ, the intelligent operations assistant for MetLife Stadium during the FIFA World Cup 2026.
${personaContext[persona]}

Respond ONLY in ${languageNames[lang]}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences, stadium-operations-appropriate, and specific (invent plausible concrete details like wait times, gate numbers, or section numbers where useful).
Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.`;
}

function Assistant() {
  const [persona, setPersona] = useState<Persona>("staff");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Welcome to MetLife Stadium World Cup 2026 Arena IQ. Select your persona in the tabs and preferred language in the header to coordinate real-time crowd dynamics." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeSuggestions = useMemo(() => suggestions[persona], [persona]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send(t: string) {
    if (!t.trim() || isTyping) return;

    const nextHistory = [...messages, { role: "user" as const, text: t }];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { answer } = await askGeminiRAG({ 
        data: { 
          message: t, 
          personaContext: buildSystemPrompt(persona, lang), 
          lang 
        } 
      });
      setMessages((m) => [...m, { role: "ai", text: answer }]);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages((m) => [
        ...m,
        { role: "ai", text: fallbackByPersona[persona] },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <AppShell title="Arena IQ Workspace" subtitle="Multimodal neural model trained on MetLife Stadium events and telemetry data">
      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-10rem)]">
        
        {/* Main Chat Panel */}
        <div
          className="lg:col-span-3 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl"
          style={{ background: "#0B1A23", border: "1px solid rgba(14,159,110,0.25)" }}
        >
          {/* Header Panel */}
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between"
            style={{ borderBottom: "2px solid rgba(14,159,110,0.15)", background: "#0D1E2A" }}
          >
            {/* Persona Switcher */}
            <div className="px-5 py-4 flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
                <UserCheck className="size-4 text-emerald-400 shrink-0" /> Persona:
              </span>
              {(["staff", "fan", "volunteer"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className="px-4 py-2 rounded-lg text-[11px] font-mono uppercase font-bold tracking-wider transition border cursor-pointer"
                  style={{
                    background: persona === p ? "rgba(14,159,110,0.15)" : "transparent",
                    borderColor: persona === p ? "rgba(14,159,110,0.35)" : "transparent",
                    color: persona === p ? "#4ADE80" : "#64748B",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div
              className="px-5 py-4 flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10"
              style={{ background: "#0F2231" }}
            >
              <Globe className="size-4 text-emerald-400 shrink-0" />
              <div className="flex gap-1.5">
                {(["en", "es", "fr", "pt"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer border"
                    style={{
                      background: lang === l ? "rgba(14,159,110,0.20)" : "rgba(255,255,255,0.04)",
                      borderColor: lang === l ? "rgba(14,159,110,0.50)" : "rgba(255,255,255,0.08)",
                      color: lang === l ? "#66D9A0" : "#94A3B8",
                    }}
                  >
                    <span className="text-sm">{languageLabels[l].flag}</span>
                    <span className="hidden xl:inline">{languageLabels[l].name}</span>
                    <span className="xl:hidden">{l.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar" aria-live="polite">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}
              >
                {m.role === "ai" && (
                  <div
                    className="size-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
                  >
                    <Sparkles className="size-5 text-white" />
                  </div>
                )}
                <div
                  className="max-w-[85%] px-5 py-4 rounded-2xl text-[15px] leading-7"
                  style={
                    m.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                          color: "#FFFFFF",
                          fontWeight: 600,
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "#1A2E3D",
                          color: "#F8FAFC",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0 mt-1" style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}>
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="px-5 py-4 rounded-2xl flex items-center gap-2" style={{ background: "#1A2E3D", border: "1px solid rgba(255,255,255,0.15)", borderBottomLeftRadius: "6px" }}>
                  <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input text box */}
          <div className="p-5 border-t border-white/10" style={{ background: "#0D1E2A" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              style={{ background: "#162736" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Query Arena IQ about crowds, queues, transport or guidelines as ${persona}...`}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 font-medium"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="size-10 rounded-xl flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition disabled:opacity-50 border-none outline-none cursor-pointer"
                style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar suggestions list */}
        <div className="space-y-4 overflow-y-auto pr-1 hidden lg:block custom-scrollbar">
          <div className="text-[11px] uppercase tracking-[0.20em] text-slate-400 font-bold px-1 select-none flex items-center gap-2 mb-2">
            Suggested Prompts
          </div>
          {activeSuggestions.map((q, i) => (
            <motion.button
              key={q.title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => send(q.title)}
              className="w-full text-left rounded-xl p-4 transition group cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                backdropFilter: "blur(20px)"
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center transition-colors group-hover:bg-emerald-100">
                  <Sparkles className="size-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-slate-900 uppercase tracking-tight">{q.title}</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">{q.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
