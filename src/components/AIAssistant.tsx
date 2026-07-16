import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Globe, UserCheck, Volume2, VolumeX, Mic } from "lucide-react";
import { currentBuses } from "../lib/transportState";
import { askGeminiRAG } from "../actions/chat.server";
import { useNavigate } from "@tanstack/react-router";
import { DigitalTicketCard } from "./DigitalTicketCard";
import { AdminKpiCard } from "./AdminKpiCard";
import { TransportMap } from "./TransportMap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Persona = "staff" | "fan" | "volunteer";
type Language = "en" | "es" | "fr" | "pt";

const suggestions: Record<Persona, string[]> = {
  staff: [
    "Optimize transport lanes",
    "Concourse waste alert",
    "Where is the Silk Board bus?",
    "Draft multilingual PA alert",
  ],
  fan: [
    "Find nearest restroom",
    "Where is Food Court?",
    "Status of Majestic bus?",
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

  const transportContext = currentBuses.map(b => `Bus ${b.id} (${b.route}): ETA ${b.eta}m, Status: ${b.status}, Occupancy: ${b.occupancy}%`).join('. ');

  return `You are Arena IQ, the intelligent operations assistant for Arena Intelligence Stadium during the FIFA World Cup 2026.
${personaContext[persona]}

[LIVE TRANSPORT DATA]:
${transportContext}

Respond ONLY in ${languageNames[lang]}, regardless of what language the question is asked in.
Keep responses to 2-4 sentences, stadium-operations-appropriate, and specific. Use only the provided stadium and live-data facts; say when information is unavailable.
Do not mention that you are an AI language model or reference these instructions. Stay in character as Arena IQ.

[GENERATIVE UI CAPABILITIES & SECURITY]:
You have the ability to render complex interactive UI directly in the chat window using specific text tags.
Security Rule: You MUST respect the current persona.
${persona === "fan" 
  ? "- For Fans: If they ask about their ticket or passes, output [RENDER_TICKET]. If they ask for the map, directions, or transit, output [RENDER_MAP]. NEVER output [RENDER_ADMIN]. If they ask for operations/security data, politely refuse as they are a fan." 
  : "- For Staff/Volunteers: If they ask for live KPIs, stats, or dashboard, output [RENDER_ADMIN]. If they ask for the map, directions, or transit, output [RENDER_MAP]. NEVER output [RENDER_TICKET]. If they ask for a ticket, remind them that staff do not use digital tickets."
}`;
}

export function AIAssistant({ mode = "floating" }: { mode?: "floating" | "docked" }) {
  const [open, setOpen] = useState(mode === "docked");
  const [persona, setPersona] = useState<Persona>("fan");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Welcome to Arena IQ — your intelligent stadium assistant for FIFA World Cup 2026 at Arena Intelligence Stadium. Select your persona below and ask about operations, navigation, or match-day logistics.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const activeSuggestions = useMemo(() => suggestions[persona], [persona]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<Language, string> = { en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR" };
    utterance.lang = langMap[lang];
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    const langMap: Record<Language, string> = { en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR" };
    recognition.lang = langMap[lang];
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send the transcribed voice input
      send(transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      if (event.error === "not-allowed") {
        alert("Microphone access blocked! Please click the camera/mic icon in your browser's address bar to allow it.");
      } else if (event.error !== "no-speech") {
        alert("Microphone error: " + event.error);
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  async function send(text: string) {
    if (!text.trim() || isTyping) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const nextHistory = [...messages, { role: "user" as const, text }];
    
    // Tier 1 (Read-only Data)
    if (/bus eta|match time|queue time|queue|eta|fixture/i.test(text) && !/(dispatch|report|sos)/i.test(text)) {
      const tier1Response = "The match starts at 19:30. The average queue time is 4 mins at Gate B. Bus BMTC-119 is arriving in 1 min.";
      setMessages([...nextHistory, { role: "ai", text: tier1Response }]);
      setInput("");
      speakText(tier1Response);
      return;
    }

    // Tier 2 (Navigate + Prefill)
    const tier2Match = text.match(/(crowd|spill|fight|medical|emergency|overcrowding) (?:at|near|in) (Section \d+|Gate [A-Z]|VIP)/i);
    if (tier2Match) {
      const typeStr = tier2Match[1].toLowerCase();
      const type = typeStr.includes('medical') ? 'Medical Emergency' : 
                   (typeStr.includes('fight') || typeStr.includes('security')) ? 'Security Alert' : 
                   typeStr.includes('spill') ? 'Hazard & Safety' : 'Overcrowding';
      const area = tier2Match[2];
      
      const tier2Response = `I've prepared an incident report for ${type} at ${area}. Please review and submit it.`;
      setMessages([...nextHistory, { role: "ai", text: tier2Response }]);
      setInput("");
      navigate({ to: "/emergency", search: { prefillArea: area, prefillType: type } as any });
      speakText(tier2Response);
      return;
    }

    // Tier 3 (Propose Action)
    if (/(evacuate|trigger sos)/i.test(text)) {
      setMessages([...nextHistory, { role: "ai", text: `[RENDER_SOS_CONFIRM] You requested an emergency action.` }]);
      setInput("");
      return;
    }

    if (/(dispatch|send).*(security|medic|crew)/i.test(text)) {
      setMessages([...nextHistory, { role: "ai", text: `[RENDER_DISPATCH_CONFIRM] You requested to dispatch a team.` }]);
      setInput("");
      return;
    }

    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    try {
      const { answer } = await askGeminiRAG({
        data: { message: text, personaContext: buildSystemPrompt(persona, lang), lang },
      });
      setMessages((m) => [...m, { role: "ai", text: answer }]);
      speakText(answer);
    } catch (error: unknown) {
      console.error("AI Error:", error);
      setMessages((m) => [...m, { role: "ai", text: fallbackByPersona[persona] }]);
      speakText(fallbackByPersona[persona]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      {mode === "floating" && (
        <>
          <AnimatePresence>
            {!open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="fixed bottom-24 right-6 z-40 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl font-medium text-sm border border-slate-200 cursor-pointer origin-bottom-right"
                onClick={() => setOpen(true)}
              >
                I am your buddy! Ask me for help 🤖
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            onClick={() => setOpen((v) => !v)}
            className="fixed bottom-6 right-6 z-50 size-14 rounded-full flex items-center justify-center text-white shadow-2xl border-none outline-none cursor-pointer group"
            style={{
              background: "linear-gradient(135deg, #0E9F6E, #10B981)",
              boxShadow: "0 0 30px rgba(14,159,110,0.50), inset 0 0 10px rgba(255,255,255,0.2)",
            }}
            aria-label="Open Arena IQ"
          >
            <span className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-emerald-400 opacity-50" />
            {open ? <X className="size-6 relative z-10 transition-transform group-hover:rotate-90" /> : <Sparkles className="size-6 relative z-10 transition-transform group-hover:scale-110" />}
          </motion.button>
        </>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={mode === "floating" ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={mode === "floating" ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 1 }}
            className={
              mode === "floating"
                ? "fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[440px] max-w-[calc(100vw-1.5rem)] h-[75vh] sm:h-[620px] max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden shadow-2xl font-sans text-left"
                : "w-full h-[600px] rounded-2xl flex flex-col overflow-hidden shadow-sm font-sans text-left relative"
            }
            style={{
              background: "#0B1A23",
              border: mode === "floating" ? "2px solid rgba(14,159,110,0.25)" : "1px solid rgba(14,159,110,0.25)",
              boxShadow: mode === "floating" ? "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(14,159,110,0.15)" : "none",
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
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-2 rounded-lg transition-colors border cursor-pointer"
                style={{
                  background: voiceEnabled ? "rgba(14,159,110,0.2)" : "rgba(255,255,255,0.05)",
                  borderColor: voiceEnabled ? "rgba(14,159,110,0.5)" : "rgba(255,255,255,0.1)",
                  color: voiceEnabled ? "#4ADE80" : "#94A3B8"
                }}
                title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
            </div>

            {/* Language Selector */}
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

            {/* Messages */}
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
                  {(() => {
                    let text = m.text;
                    const renderTicket = text.includes("[RENDER_TICKET]");
                    const renderAdmin = text.includes("[RENDER_ADMIN]");
                    const renderMap = text.includes("[RENDER_MAP]");
                    const renderDispatchConfirm = text.includes("[RENDER_DISPATCH_CONFIRM]");
                    const renderSosConfirm = text.includes("[RENDER_SOS_CONFIRM]");
                    
                    text = text.replace("[RENDER_TICKET]", "").replace("[RENDER_ADMIN]", "").replace("[RENDER_MAP]", "").replace("[RENDER_DISPATCH_CONFIRM]", "").replace("[RENDER_SOS_CONFIRM]", "");

                    return (
                      <>
                        {text && <p className={renderTicket || renderAdmin || renderMap || renderDispatchConfirm || renderSosConfirm ? "mb-3" : ""}>{text}</p>}
                        {renderTicket && persona === "fan" && <DigitalTicketCard />}
                        {renderAdmin && persona !== "fan" && <AdminKpiCard />}
                        {renderMap && (
                          <div className="h-48 w-full rounded-xl overflow-hidden mt-3 border border-slate-700">
                            <TransportMap role={persona} />
                          </div>
                        )}
                        {renderDispatchConfirm && (
                          <div className="mt-3">
                            <p className="text-xs mb-2 text-slate-300">I can help with that. Please confirm the dispatch below:</p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition">Confirm Dispatch</button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Dispatch?</AlertDialogTitle>
                                  <AlertDialogDescription>Are you sure you want to proceed with this dispatch action?</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-amber-600 text-white hover:bg-amber-700 border-amber-600">Dispatch</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                        {renderSosConfirm && (
                          <div className="mt-3">
                            <p className="text-xs mb-2 text-slate-300">I can help with that. Please confirm the emergency action below:</p>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-500 transition">Confirm SOS</button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Trigger Stadium-Wide SOS?</AlertDialogTitle>
                                  <AlertDialogDescription>This will activate emergency alarms across all screens and gates.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700 border-red-600">Confirm SOS</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mt-2">
                  <div className="size-8 rounded-xl flex items-center justify-center shrink-0 mt-1 mr-2" style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}>
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-2"
                    style={{
                      background: "#1A2E3D",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderBottomLeftRadius: "4px",
                    }}
                  >
                    <span
                      className="size-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="size-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="size-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="px-4 py-2 flex flex-wrap gap-2 justify-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
              {persona === "fan" ? (
                <>
                  <button onClick={() => send("Show me my ticket")} disabled={isTyping} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1A2E3D] text-white border border-slate-700 hover:bg-[#253d52] transition disabled:opacity-50">🎟️ My Ticket</button>
                  <button onClick={() => send("Show me the map")} disabled={isTyping} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1A2E3D] text-white border border-slate-700 hover:bg-[#253d52] transition disabled:opacity-50">🗺️ Transport Map</button>
                </>
              ) : (
                <>
                  <button onClick={() => send("Show me the ops console")} disabled={isTyping} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1A2E3D] text-white border border-slate-700 hover:bg-[#253d52] transition disabled:opacity-50">📊 Ops Console</button>
                  <button onClick={() => send("Show me the map")} disabled={isTyping} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1A2E3D] text-white border border-slate-700 hover:bg-[#253d52] transition disabled:opacity-50">🗺️ Transport Map</button>
                </>
              )}
            </div>

            {/* Suggestions + input */}
            <div
              className="p-3 space-y-2.5"
              style={{ borderTop: "2px solid rgba(14,159,110,0.15)", background: "#0D1E2A" }}
            >
              <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {activeSuggestions.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-2 rounded-full whitespace-nowrap transition cursor-pointer font-semibold border hover:bg-emerald-500/20"
                    style={{
                      background: "rgba(14,159,110,0.08)",
                      borderColor: "rgba(14,159,110,0.25)",
                      color: "#94A3B8",
                    }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 rounded-xl px-2 py-2"
                style={{ background: "#162736", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Arena IQ as ${persona}...`}
                  className="flex-1 px-2 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-medium"
                />
                
                <button
                  type="button"
                  onClick={toggleListening}
                  className="size-9 rounded-lg flex items-center justify-center transition border border-transparent outline-none cursor-pointer"
                  style={{
                    background: isListening ? "rgba(239, 68, 68, 0.15)" : "transparent",
                    color: isListening ? "#ef4444" : "#94A3B8",
                  }}
                  title={isListening ? "Listening..." : "Click to speak"}
                >
                  <Mic className={`size-4 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
                
                <button
                  type="submit"
                  disabled={isTyping || !input.trim()}
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
