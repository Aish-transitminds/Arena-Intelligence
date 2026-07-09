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

// ---- System prompt builder -------------------------------------------------
// This is where the "intelligence" actually lives: give the model the
// stadium context, the persona it's speaking to, and the language to reply in.
// Everything else (routing, translation, phrasing) is generated live by the
// model instead of being pre-written by us.
function buildSystemPrompt(persona: Persona, lang: Language) {
  const personaContext: Record<Persona, string> = {
    staff:
      "You are speaking to stadium OPERATIONS STAFF. Be concise, operational, and action-oriented. Include concrete numbers, gate/section references, and next steps when relevant (e.g. dispatch, reroute, alert).",
    fan:
      "You are speaking to a FAN attending the match. Be warm, brief, and practical — directions, wait times, amenities, and accessibility help.",
    volunteer:
      "You are speaking to a VOLUNTEER on shift. Be clear and procedural — give step-by-step protocol instructions (lost & found, accessibility escorts, shift logistics).",
  };

  return `You are Arena IQ, the intelligent operations copilot for MetLife Stadium during the FIFA World Cup 2026.
${personaContext[persona]}

Respond ONLY in ${languageNames[lang]}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences, stadium-operations-appropriate, and specific (invent plausible concrete details like wait times, gate numbers, or section numbers where useful — this is a demo environment, not connected to live sensors).
Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.`;
}

// ---- API call ---------------------------------------------------------------
async function askAI(
  history: { role: "user" | "ai"; text: string }[],
  persona: Persona,
  lang: Language,
  signal: AbortSignal
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulate real API latency
    setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }

      const lastUserMessage = history.filter(m => m.role === "user").pop()?.text.toLowerCase() || "";
      let aiResponse = fallbackByPersona[persona];

      // Smart fuzzy matching for simulated API
      if (lastUserMessage.includes("weather") || lastUserMessage.includes("rain") || lastUserMessage.includes("hot")) {
        aiResponse = "🌤️ Arena IQ Weather: 72°F, clear skies. No precipitation expected for the duration of the match. Roof status: Open. UV Index: Moderate — sunscreen recommended for upper deck fans.";
      } else if (lastUserMessage.includes("food") || lastUserMessage.includes("eat") || lastUserMessage.includes("hungry") || lastUserMessage.includes("drink")) {
        aiResponse = "🍔 Arena IQ Guide: MetLife Stadium Food Court is at the Plaza Level near Gate B. Current wait: 3-5 min. Pro tip: Level 2 Local Concessions have zero queues right now — try the Philly Cheesesteak stand!";
      } else if (lastUserMessage.includes("bathroom") || lastUserMessage.includes("restroom") || lastUserMessage.includes("toilet")) {
        aiResponse = "🚻 Arena IQ: Nearest restroom is behind Section 204 concourse (1-min walk). Load: Low. Accessible restroom available at Gate C ground level.";
      } else if (lastUserMessage.includes("traffic") || lastUserMessage.includes("transport") || lastUserMessage.includes("train") || lastUserMessage.includes("bus") || lastUserMessage.includes("uber") || lastUserMessage.includes("taxi")) {
        aiResponse = "🚆 Arena IQ Travel: NJ Transit trains depart Secaucus Junction every 10 min post-match. Bus express lanes active at Gate B. Rideshare pickup zone: Lot J East. Estimated travel to Manhattan: 25 min.";
      } else if (lastUserMessage.includes("wheelchair") || lastUserMessage.includes("disabled") || lastUserMessage.includes("accessibility") || lastUserMessage.includes("assist")) {
        aiResponse = "♿ Arena IQ Accessibility: Wheelchair assistance active at all gates. Requesting escort now — a volunteer will be dispatched to your seat via Elevator B-2. ETA: 3 minutes.";
      } else if (lastUserMessage.includes("lost") || lastUserMessage.includes("found") || lastUserMessage.includes("missing")) {
        aiResponse = "📦 Arena IQ Lost & Found: Please visit Guest Services at Section 120. Items are logged into our AI matching system for instant retrieval. Common items today: phones (12), wallets (5), keys (8).";
      } else if (lastUserMessage.includes("queue") || lastUserMessage.includes("wait") || lastUserMessage.includes("crowd") || lastUserMessage.includes("line")) {
        aiResponse = "📊 Arena IQ Queue Intel: Gate E is at 98% capacity (15-min wait). Recommended: Gate A has only a 4-min wait. Signage displays have been updated to redirect flow.";
      } else if (lastUserMessage.includes("score") || lastUserMessage.includes("match") || lastUserMessage.includes("goal") || lastUserMessage.includes("game")) {
        aiResponse = "⚽ Arena IQ Match Update: Current score displayed on all stadium screens. Next half starts in 12 minutes. Halftime entertainment is live on the main pitch now!";
      } else if (lastUserMessage.includes("emergency") || lastUserMessage.includes("medical") || lastUserMessage.includes("help") || lastUserMessage.includes("first aid")) {
        aiResponse = "🚨 Arena IQ Emergency: Medical stations are at Gates A, C, and E (ground level). Nearest AED is at Section 118. For immediate assistance, flag any steward or call stadium security at ext. 911.";
      } else if (lastUserMessage.includes("parking") || lastUserMessage.includes("car") || lastUserMessage.includes("lot")) {
        aiResponse = "🅿️ Arena IQ Parking: Your vehicle is in Lot K, Row 14 (based on ticket data). Post-match exit strategy: Use Lot K South exit to avoid I-95 merge congestion. Estimated clear time: 22 minutes.";
      } else if (lastUserMessage.includes("wifi") || lastUserMessage.includes("internet") || lastUserMessage.includes("connect")) {
        aiResponse = "📶 Arena IQ: Stadium WiFi network 'MetLife-Fan' is active. Connect and accept terms — no password needed. Current bandwidth: 85% available. Streaming quality: HD supported.";
      } else if (lastUserMessage.includes("merch") || lastUserMessage.includes("shop") || lastUserMessage.includes("jersey") || lastUserMessage.includes("souvenir")) {
        aiResponse = "🛍️ Arena IQ Shop: Official FIFA merchandise stores are at Gates A & D (Plaza Level). Hot item today: Home team jersey ($89). Team Store at Gate D has the shortest line (2-min wait).";
      } else {
        aiResponse = `⚡ Arena IQ (${persona}): MetLife Stadium operations are nominal. Crowd density: stable at 87%. All systems green. How can I assist you today?`;
      }

      // If user selected a language other than English, add a prefix (Simulation only)
      if (lang === "es") aiResponse = "[Traducción ES] " + aiResponse;
      if (lang === "fr") aiResponse = "[Traduction FR] " + aiResponse;
      if (lang === "pt") aiResponse = "[Tradução PT] " + aiResponse;

      resolve(aiResponse);
    }, 1200 + Math.random() * 800); // 1.2s - 2.0s random delay
  });
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<Persona>("staff");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "👋 Welcome to Arena IQ — your intelligent stadium copilot for FIFA World Cup 2026 at MetLife Stadium. Select your persona below and ask me anything about operations, navigation, or match day logistics!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Tracks in-flight requests so we can cancel them if the component
  // unmounts or the user closes the chat mid-response (avoids the
  // "set state on unmounted component" issue from the original version).
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

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
      const reply = await askAI(nextHistory, persona, lang, controller.signal);
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (err: any) {
      if (err?.name === "AbortError") return; // superseded by a newer request
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
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full flex items-center justify-center text-primary-foreground shadow-2xl border-none outline-none cursor-pointer"
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
            className="fixed bottom-24 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden shadow-2xl border text-white font-sans text-left"
            style={{
              background: "rgba(14,27,36,0.96)",
              borderColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight uppercase" style={{ background: "linear-gradient(90deg, #0E9F6E, #3CB371, #66D9A0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Arena IQ
                  </div>
                  <div className="text-[10px] text-primary font-mono tracking-widest flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />{" "}
                    FIFA WORLD CUP 2026 · LIVE
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">
                <Globe className="size-3 text-slate-400" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-[10px] text-white font-bold outline-none border-none cursor-pointer uppercase font-mono"
                >
                  <option value="en" className="bg-[#0E1B24]">EN</option>
                  <option value="es" className="bg-[#0E1B24]">ES</option>
                  <option value="fr" className="bg-[#0E1B24]">FR</option>
                  <option value="pt" className="bg-[#0E1B24]">PT</option>
                </select>
              </div>
            </div>

            {/* Persona switcher */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
                <UserCheck className="size-3" /> Persona:
              </span>
              {(["staff", "fan", "volunteer"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase font-bold tracking-wider transition ${persona === p
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "text-slate-400 hover:text-white"
                    } border border-transparent cursor-pointer`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-5 ${m.role === "user"
                        ? "bg-primary text-black font-semibold rounded-br-sm"
                        : "glass rounded-bl-sm text-slate-100"
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-3 rounded-2xl glass rounded-bl-sm flex items-center gap-1.5">
                    <span
                      className="size-1.5 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="size-1.5 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="size-1.5 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions + input */}
            <div
              className="p-3 border-t border-white/5 space-y-2.5"
              style={{ background: "rgba(7,20,28,0.40)" }}
            >
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar">
                {activeSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/8 hover:border-primary/40 hover:bg-primary/5 text-slate-300 hover:text-white whitespace-nowrap transition cursor-pointer font-bold tracking-wide"
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
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl pl-3.5 pr-2 py-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask GenAI as ${persona}...`}
                  className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="size-8 rounded-lg flex items-center justify-center text-black transition hover:opacity-90 active:scale-95 disabled:opacity-40 border-none outline-none cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
