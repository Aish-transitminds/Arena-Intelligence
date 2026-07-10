import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Globe, UserCheck } from "lucide-react";

type Persona = "staff" | "fan" | "volunteer";
type Language = "en" | "es" | "fr" | "pt";

const suggestions: Record<Persona, string[]> = {
  staff: [
    "Optimize transport lanes",
    "Concourse waste alert",
    "Gate E queue status",
    "Draft multilingual PA alert",
  ],
  fan: [
    "Find nearest restroom",
    "Where is Food Court?",
    "Transport to NYC",
    "How to get wheelchair help?",
  ],
  volunteer: [
    "Accessibility instructions",
    "Lost and Found protocol",
    "Gate B shift coordinator",
    "Sustainability guidelines",
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

// Used only if the live API call fails (network issue, rate limit, etc).
// Keeps the assistant usable during a demo even if the API has a hiccup.
const fallbackByPersona: Record<Persona, string> = {
  staff:
    "I couldn't reach the live AI service just now, but stadium operations are nominal. Please try your question again in a moment.",
  fan:
    "I'm having trouble connecting right now. For urgent help, please visit the nearest Guest Services booth or ask any staff member.",
  volunteer:
    "Connection issue on my end — please check with your shift coordinator for immediate guidance, and I'll be back online shortly.",
};

function buildSystemPrompt(persona: Persona, lang: Language) {
  const personaContext: Record<Persona, string> = {
    staff:
      "You are speaking to stadium OPERATIONS STAFF. Be concise, operational, and action-oriented. Include concrete numbers, gate/section references, and next steps when relevant (e.g. dispatch, reroute, alert).",
    fan:
      "You are speaking to a FAN attending the match. Be warm, brief, and practical — directions, wait times, amenities, and accessibility help.",
    volunteer:
      "You are speaking to a VOLUNTEER on shift. Be clear and procedural — give step-by-step protocol instructions (lost & found, accessibility escorts, shift logistics).",
  };

  return `You are Arena IQ, the intelligent operations assistant for Narendra Modi FIFA Stadium during the FIFA World Cup 2026.
${personaContext[persona]}

Respond ONLY in ${languageNames[lang]}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences, stadium-operations-appropriate, and specific (invent plausible concrete details like wait times, gate numbers, or section numbers where useful — this is a demo environment, not connected to live sensors).
Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.`;
}

import { askGeminiRAG } from "../actions/chat.server";

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<Persona>("fan");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "👋 Welcome to Arena IQ — your intelligent stadium assistant for FIFA World Cup 2026 at Narendra Modi FIFA Stadium. Select your persona below and ask me anything about operations, navigation, or match day logistics!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activeSuggestions = useMemo(() => suggestions[persona], [persona]);

  async function send(text: string) {
    if (!text.trim() || isTyping) return;

    const nextHistory = [...messages, { role: "user" as const, text }];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { answer, sources } = await askGeminiRAG({ data: { message: text, personaContext: buildSystemPrompt(persona, lang), lang } });
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
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full flex items-center justify-center text-white shadow-2xl border-none outline-none cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
          boxShadow: "0 0 24px rgba(14,159,110,0.40)",
        }}
        aria-label="Open Arena IQ"
      >
        {open ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-[calc(100vw-1.5rem)] h-[75vh] sm:h-[620px] max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden shadow-2xl font-sans text-left"
            style={{
              background: "#0B1A23",
              border: "2px solid rgba(14,159,110,0.25)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(14,159,110,0.15)",
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "2px solid rgba(14,159,110,0.15)", background: "#0D1E2A" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
                >
                  <Sparkles className="size-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight uppercase text-white">
                    Arena IQ
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    FIFA WORLD CUP 2026 · LIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Language Selector — BIG & VISIBLE */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0F2231" }}
            >
              <Globe className="size-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-300 mr-1">Language:</span>
              <div className="flex gap-1.5 flex-1">
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
                    <span className="hidden sm:inline">{languageLabels[l].name}</span>
                    <span className="sm:hidden">{l.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Persona switcher */}
            <div
              className="px-4 py-2.5 flex items-center gap-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0D1E2A" }}
            >
              <UserCheck className="size-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-400 mr-1">Persona:</span>
              {(["staff", "fan", "volunteer"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className="px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-wider transition cursor-pointer border"
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

            {/* Messages — SOLID BACKGROUNDS for visibility */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6"
                    style={
                      m.role === "user"
                        ? {
                            background: "linear-gradient(135deg, #0E9F6E, #3CB371)",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            background: "#1A2E3D",
                            color: "#E2E8F0",
                            border: "1px solid rgba(255,255,255,0.10)",
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-2"
                    style={{ background: "#1A2E3D", border: "1px solid rgba(255,255,255,0.10)", borderBottomLeftRadius: "4px" }}
                  >
                    <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions + input */}
            <div
              className="p-3 space-y-2.5"
              style={{ borderTop: "2px solid rgba(14,159,110,0.15)", background: "#0D1E2A" }}
            >
              <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {activeSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-2 rounded-full whitespace-nowrap transition cursor-pointer font-semibold border"
                    style={{
                      background: "rgba(14,159,110,0.08)",
                      borderColor: "rgba(14,159,110,0.25)",
                      color: "#94A3B8",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "#162736", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Arena IQ as ${persona}...`}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="size-9 rounded-lg flex items-center justify-center text-white transition hover:opacity-90 active:scale-95 disabled:opacity-40 border-none outline-none cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
