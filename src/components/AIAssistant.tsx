import { useState, useMemo } from "react";
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

const aiAnswers: Record<string, Record<Language, string>> = {
  "Optimize transport lanes": {
    en: "GenAI Analysis: Post-match load at MetLife Stadium requires 12 extra shuttles to Secaucus Junction. Opening transport overflow lane 4 will reduce departure congestion by 22%. Recommend dispatching now.",
    es: "Análisis GenAI: La carga posterior al partido en el MetLife Stadium requiere 12 autobuses adicionales a Secaucus Junction. Abrir el carril de transporte 4 reducirá la congestión de salida en un 22%. Se recomienda despachar ahora.",
    fr: "Analyse GenAI: La charge d'après-match au MetLife Stadium nécessite 12 navettes supplémentaires vers Secaucus Junction. L'ouverture de la voie de transport 4 réduira la congestion de départ de 22%. Recommandation d'envoi immédiat.",
    pt: "Análise GenAI: A carga pós-jogo no MetLife Stadium requer 12 ônibus extras para Secaucus Junction. A abertura da faixa de transporte 4 reduzirá o congestionamento de partida em 22%. Recomenda-se despacho imediato.",
  },
  "Concourse waste alert": {
    en: "GenAI Sensor Telemetry: Elevated waste level detected in Section 204 concourse bins. AI Dispatch: Alerting zone maintenance crew to empty bins and avoid overflow. Estimated time to clear: 4 minutes.",
    es: "Telemetría GenAI: Nivel elevado de residuos detectado en los contenedores del vestíbulo de la Sección 204. Despacho IA: Alertando al equipo de mantenimiento de la zona para vaciar contenedores. Tiempo estimado: 4 minutos.",
    fr: "Télémétrie GenAI: Niveau de déchets élevé détecté dans la Section 204. Expédition IA: Alerte de l'équipe de maintenance de zone pour vider les bacs. Temps d'intervention estimé: 4 minutes.",
    pt: "Telemetria GenAI: Nível de resíduos elevado detectado na Seção 204. Despacho IA: Alertando a equipe de manutenção para esvaziar as lixeiras. Tempo estimado: 4 minutos.",
  },
  "Gate E queue status": {
    en: "GenAI Queue Prediction: Gate E is currently experiencing a 15-minute wait time (98% capacity). Action Plan: Reroute incoming fans from North Concourse to Gate A (4-minute wait). Signage displays updated.",
    es: "Predicción de colas GenAI: La puerta E experimenta una espera de 15 minutos (98% de capacidad). Plan: Desviar a los aficionados del vestíbulo norte a la puerta A (espera de 4 min). Pantallas de señalización actualizadas.",
    fr: "Prédiction de file GenAI: La porte E a une attente de 15 minutes (capacité 98%). Plan d'action: Rediriger les supporters du hall nord vers la porte A (attente 4 min). Panneaux d'affichage mis à jour.",
    pt: "Previsão de fila GenAI: Portão E com espera de 15 minutos (98% de capacidade). Plano: Redirecionar torcedores do saguão norte para o Portão A (espera de 4 min). Painéis de sinalização atualizados.",
  },
  "Draft multilingual PA alert": {
    en: "GenAI PA Draft: 'Attention fans, for faster stadium egress, please utilize Gate A and Gate C exit pathways. Thank you.' (Available in EN, ES, FR). Click to push to PA console.",
    es: "Borrador de megafonía GenAI: 'Atención aficionados, para una salida más rápida, utilicen las vías de salida del Portão A y Portão C. Gracias.' (Disponible en EN, ES, FR). Clic para enviar a la cabina.",
    fr: "Brouillon PA GenAI: 'Attention supporters, pour une sortie plus rapide du stade, veuillez emprunter les voies de sortie Porte A et Porte C. Merci.' (Disponible en EN, ES, FR). Cliquez pour diffuser.",
    pt: "Rascunho PA GenAI: 'Atenção torcedores, para uma saída mais rápida, utilizem os caminhos de saída do Portão A e Portão C. Obrigado.' (Disponível em EN, ES, FR). Clique para enviar ao console.",
  },
  "Find nearest restroom": {
    en: "GenAI Assist: The nearest restroom is located behind Section 204 concourse (1-minute walk). Load is currently Low. Evacuation pathways are fully clear.",
    es: "Asistente GenAI: El baño más cercano está detrás del vestíbulo de la Sección 204 (1 min a pie). La ocupación actual es Baja. Las vías están despejadas.",
    fr: "Assistant GenAI: Les toilettes les plus proches sont situées derrière le hall de la Section 204 (1 min de marche). L'affluence est actuellement Faible. Les voies sont libres.",
    pt: "Assistente GenAI: O banheiro mais próximo fica atrás da Seção 204 (1 min a pé). A ocupação atual é Baixa. Os caminhos estão totalmente livres.",
  },
  "Where is Food Court?": {
    en: "GenAI Guide: MetLife Stadium Food Court is situated at the Plaza Level near Gate B. Active queues: 3-5 minutes wait. Generative recommendation: Try Local Concessions on Level 2 for zero queues.",
    es: "Guía GenAI: El patio de comidas del MetLife Stadium está en el nivel Plaza, cerca de la Puerta B. Espera: 3-5 minutos. Recomendación: Pruebe concesiones en Nivel 2 sin colas.",
    fr: "Guide GenAI: L'aire de restauration du MetLife Stadium est au niveau Plaza, près de la Porte B. File d'attente: 3-5 minutes. Recommandation: Essayez les stands du Niveau 2 sans file.",
    pt: "Guia GenAI: A praça de alimentação fica no nível Plaza, perto do Portão B. Espera: 3-5 minutos. Recomendação: Experimente as concessões do Nível 2 sem filas.",
  },
  "Transport to NYC": {
    en: "GenAI Travel Planner: NJ Transit trains depart from Secaucus Junction every 10 minutes post-match. Bus express lanes to Port Authority NYC are active at Gate B. Travel time: 25 minutes.",
    es: "Plan de viaje GenAI: Los trenes de NJ Transit salen de Secaucus Junction cada 10 minutos después del partido. Carriles de autobús express a NYC activos en Puerta B. Tiempo: 25 min.",
    fr: "Planificateur GenAI: Les trains NJ Transit partent de Secaucus Junction toutes les 10 minutes après le match. Navettes rapides pour NYC actives à la Porte B. Temps de trajet: 25 min.",
    pt: "Planejador GenAI: Os trens da NJ Transit partem de Secaucus Junction a cada 10 minutos após o jogo. Faixas de ônibus expressas para NYC ativas no Portão B. Tempo de viagem: 25 min.",
  },
  "How to get wheelchair help?": {
    en: "GenAI Assist: Wheelchair assistance is active at all gates. Click the 'Request Escort' button below, and a volunteer will be dispatched to your seat coordinates via the nearest elevator route.",
    es: "Asistencia GenAI: Ayuda para sillas de ruedas activa en todas las puertas. Haga clic en 'Solicitar Acompañante' y un voluntario irá a sus coordenadas de asiento.",
    fr: "Assistant GenAI: Assistance fauteuil roulant active à toutes les portes. Cliquez sur 'Demander un accompagnateur' et un bénévole sera envoyé à vos coordonnées de siège.",
    pt: "Assistente GenAI: Assistência para cadeirantes ativa em todos os portões. Clique em 'Solicitar Acompanhante' e um voluntário será enviado às coordenadas do seu assento.",
  },
  "Accessibility instructions": {
    en: "GenAI Volunteer Briefing: High priority wheelchair arrival at Gate B. Escort path: Elevator B-2 to Section 204 Row 12. Ensure all safety ramps are clear of bags.",
    es: "Instrucciones GenAI: Llegada de silla de ruedas de alta prioridad en Puerta B. Ruta: Ascensor B-2 a Sección 204 Fila 12. Asegúrese de que las rampas estén libres.",
    fr: "Briefing GenAI: Arrivée prioritaire de fauteuil roulant à la Porte B. Trajet: Ascenseur B-2 vers Section 204 Rang 12. Assurez-vous que les rampes d'accès sont libres.",
    pt: "Instruções GenAI: Chegada de cadeira de rodas de alta prioridade no Portão B. Rota: Elevador B-2 para Seção 204 Fileira 12. Certifique-se de que as rampas estejam desobstruídas.",
  },
  "Lost and Found protocol": {
    en: "GenAI Volunteer Protocol: Direct fans with lost items to the Guest Services Booth at Section 120. Log items in the Arena Intelligence inventory console for immediate AI matching.",
    es: "Protocolo GenAI: Dirija a los aficionados con objetos perdidos a Servicios al Huésped en Sección 120. Registre el objeto en la consola para emparejamiento inmediato.",
    fr: "Protocole GenAI: Dirigez les supporters vers le stand des services aux visiteurs à la Section 120. Enregistrez l'objet sur la console pour une mise en correspondance immédiate.",
    pt: "Protocolo GenAI: Direcione torcedores com itens perdidos para o balcão de atendimento na Seção 120. Registre o item no console para correspondência imediata por IA.",
  },
  "Gate B shift coordinator": {
    en: "GenAI Roster: Gate B volunteers report to Supervisor Sarah K. Shift rotation is every 2 hours. Rest area is active at Concourse Room 14.",
    es: "Organización GenAI: Los voluntarios de la Puerta B reportan a Sarah K. La rotación es cada 2 horas. El área de descanso está en la sala 14 del vestíbulo.",
    fr: "Planning GenAI: Les bénévoles Porte B sont sous la direction de Sarah K. Rotation toutes les 2 heures. L'espace de repos est situé dans la salle 14 du hall.",
    pt: "Escala GenAI: Voluntários do Portão B respondem à supervisora Sarah K. Rotação a cada 2 horas. A área de descanso fica na sala 14 do saguão.",
  },
  "Sustainability guidelines": {
    en: "GenAI Green Briefing: Ensure food waste is directed to organic compost bins located behind Food Court concessions. Reusable cup collection points must be monitored hourly.",
    es: "Guía Verde GenAI: Asegúrese de que los residuos de comida vayan a contenedores de compostaje orgánico. Monitoree los puntos de vasos reutilizables cada hora.",
    fr: "Briefing Vert GenAI: Veillez à ce que les déchets alimentaires soient dirigés vers les bacs de compostage. Surveillez les points de collecte de gobelets toutes les heures.",
    pt: "Instruções Sustentáveis GenAI: Garanta que resíduos orgânicos vão para lixeiras de compostagem. Monitore os pontos de copos reutilizáveis de hora em hora.",
  },
  default: {
    en: "GenAI Response: MetLife Stadium operations are nominal. Crowd density is stable. NJ Transit shuttles are on schedule. How else can I assist your World Cup 2026 operations?",
    es: "Respuesta GenAI: Las operaciones de MetLife Stadium son nominales. La densidad de la multitud es estable. NJ Transit a tiempo. ¿En qué más puedo ayudarle?",
    fr: "Réponse GenAI: Opérations nominales au MetLife Stadium. Densité de foule stable. NJ Transit à l'heure. Comment puis-je vous aider pour le Mondial 2026?",
    pt: "Resposta GenAI: As operações do MetLife Stadium estão normais. Densidade estável. NJ Transit no horário. Como posso ajudar nas operações da Copa 2026?",
  },
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<Persona>("staff");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Welcome to MetLife Stadium World Cup 2026 Assistant. Select your persona and language below to start GenAI operations." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeSuggestions = useMemo(() => suggestions[persona], [persona]);

  function send(text: string) {
    if (!text.trim()) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    // Simulate network delay and GenAI processing time
    setTimeout(() => {
      let aiResponse = aiAnswers.default[lang];
      const lower = text.toLowerCase().trim();
      
      // Smart fuzzy matching logic
      if (lower.includes("weather") || lower.includes("rain") || lower.includes("hot")) {
        aiResponse = "GenAI Weather Analysis: 72°F, clear skies. No precipitation expected for the duration of the match. Roof status: Open.";
      } else if (lower.includes("food") || lower.includes("eat") || lower.includes("hungry") || lower.includes("burger")) {
        aiResponse = aiAnswers["Where is Food Court?"][lang] || aiAnswers["Where is Food Court?"].en;
      } else if (lower.includes("bathroom") || lower.includes("restroom") || lower.includes("toilet")) {
        aiResponse = aiAnswers["Find nearest restroom"][lang] || aiAnswers["Find nearest restroom"].en;
      } else if (lower.includes("traffic") || lower.includes("transport") || lower.includes("train") || lower.includes("bus")) {
        aiResponse = aiAnswers["Transport to NYC"][lang] || aiAnswers["Transport to NYC"].en;
      } else if (lower.includes("wheelchair") || lower.includes("disabled") || lower.includes("accessibility")) {
        aiResponse = aiAnswers["How to get wheelchair help?"][lang] || aiAnswers["How to get wheelchair help?"].en;
      } else if (lower.includes("lost") || lower.includes("found") || lower.includes("missing")) {
        aiResponse = aiAnswers["Lost and Found protocol"][lang] || aiAnswers["Lost and Found protocol"].en;
      } else if (lower.includes("queue") || lower.includes("wait") || lower.includes("gate") || lower.includes("crowd")) {
        aiResponse = aiAnswers["Gate E queue status"][lang] || aiAnswers["Gate E queue status"].en;
      } else if (lower.includes("trash") || lower.includes("waste") || lower.includes("garbage") || lower.includes("clean")) {
        aiResponse = aiAnswers["Concourse waste alert"][lang] || aiAnswers["Concourse waste alert"].en;
      } else if (lower.includes("pa ") || lower.includes("announcement") || lower.includes("broadcast")) {
        aiResponse = aiAnswers["Draft multilingual PA alert"][lang] || aiAnswers["Draft multilingual PA alert"].en;
      } else {
        const matchingKey = Object.keys(aiAnswers).find((k) => k.toLowerCase() === lower);
        if (matchingKey) aiResponse = aiAnswers[matchingKey][lang] || aiAnswers[matchingKey].en;
      }

      setMessages((m) => [...m, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // 1.2s - 2.0s random typing delay
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full flex items-center justify-center text-primary-foreground shadow-2xl border-none outline-none cursor-pointer"
        style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 0 24px rgba(14,159,110,0.40)" }}
        aria-label="Open AI Assistant"
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
            style={{ background: "rgba(14,27,36,0.96)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight uppercase">GenAI Copilot</div>
                  <div className="text-[10px] text-primary font-mono tracking-widest flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" /> WORLD CUP 2026 ACTIVE
                  </div>
                </div>
              </div>

              {/* Language selection dropdown */}
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

            {/* Persona Switcher Tab bar */}
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
                <UserCheck className="size-3" /> Persona:
              </span>
              {(["staff", "fan", "volunteer"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase font-bold tracking-wider transition ${
                    persona === p
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "text-slate-400 hover:text-white"
                  } border border-transparent cursor-pointer`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-5 ${
                      m.role === "user"
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
                    <span className="size-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="size-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="size-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions & Input area */}
            <div className="p-3 border-t border-white/5 space-y-2.5" style={{ background: "rgba(7,20,28,0.40)" }}>
              {/* Suggestion buttons */}
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

              {/* Chat Input form */}
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
                  className="size-8 rounded-lg flex items-center justify-center text-black transition hover:opacity-90 active:scale-95 border-none outline-none cursor-pointer"
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
