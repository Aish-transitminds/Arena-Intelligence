import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Send, Globe, UserCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";

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

const aiAnswers: Record<string, Record<Language, string>> = {
  "Optimize transport lanes": {
    en: "Arena IQ Analysis: Post-match load at MetLife Stadium requires 12 extra shuttles to Secaucus Junction. Opening transport overflow lane 4 will reduce departure congestion by 22%. Recommend dispatching now.",
    es: "Análisis Arena IQ: La carga posterior al partido en el MetLife Stadium requiere 12 autobuses adicionales a Secaucus Junction. Abrir el carril de transporte 4 reducirá la congestión de salida en un 22%. Se recomienda despachar ahora.",
    fr: "Analyse Arena IQ: La charge d'après-match au MetLife Stadium nécessite 12 navettes supplémentaires vers Secaucus Junction. L'ouverture de la voie de transport 4 réduira la congestion de départ de 22%. Recommandation d'envoi immédiat.",
    pt: "Análise Arena IQ: A carga pós-jogo no MetLife Stadium requer 12 ônibus extras para Secaucus Junction. A abertura da faixa de transporte 4 reduzirá o congestionamento de partida em 22%. Recomenda-se despacho imediato.",
  },
  "Concourse waste alert": {
    en: "Arena IQ Sensor Telemetry: Elevated waste level detected in Section 204 concourse bins. AI Dispatch: Alerting zone maintenance crew to empty bins and avoid overflow. Estimated time to clear: 4 minutes.",
    es: "Telemetría Arena IQ: Nivel elevado de residuos detectado en los contenedores del vestíbulo de la Sección 204. Despacho IA: Alertando al equipo de mantenimiento de la zona para vaciar contenedores. Tiempo estimado: 4 minutos.",
    fr: "Télémétrie Arena IQ: Niveau de déchets élevé détecté dans la Section 204. Expédition IA: Alerte de l'équipe de maintenance de zone pour vider les bacs. Temps d'intervention estimé: 4 minutes.",
    pt: "Telemetria Arena IQ: Nível de resíduos elevado detectado na Seção 204. Despacho IA: Alertando a equipe de manutenção para esvaziar as lixeiras. Tempo estimado: 4 minutos.",
  },
  "Gate E queue status": {
    en: "Arena IQ Queue Prediction: Gate E is currently experiencing a 15-minute wait time (98% capacity). Action Plan: Reroute incoming fans from North Concourse to Gate A (4-minute wait). Signage displays updated.",
    es: "Predicción de colas Arena IQ: La puerta E experimenta una espera de 15 minutos (98% de capacidad). Plan: Desviar a los aficionados del vestíbulo norte a la puerta A (espera de 4 min). Pantallas de señalización actualizadas.",
    fr: "Prédiction de file Arena IQ: La porte E a une attente de 15 minutes (capacité 98%). Plan d'action: Rediriger les supporters du hall nord vers la porte A (attente 4 min). Panneaux d'affichage mis à jour.",
    pt: "Previsão de fila Arena IQ: Portão E com espera de 15 minutos (98% de capacidade). Plano: Redirecionar torcedores do saguão norte para o Portão A (espera de 4 min). Painéis de sinalização atualizados.",
  },
  "Draft multilingual PA alert": {
    en: "Arena IQ PA Draft: 'Attention fans, for faster stadium egress, please utilize Gate A and Gate C exit pathways. Thank you.' (Available in EN, ES, FR). Click to push to PA console.",
    es: "Borrador de megafonía Arena IQ: 'Atención aficionados, para una salida más rápida, utilicen las vías de salida del Portão A y Portão C. Gracias.' (Disponible en EN, ES, FR). Clic para enviar a la cabina.",
    fr: "Brouillon PA Arena IQ: 'Attention supporters, pour une sortie plus rapide du stade, veuillez emprunter les voies de sortie Porte A et Porte C. Merci.' (Disponible en EN, ES, FR). Cliquez pour diffuser.",
    pt: "Rascunho PA Arena IQ: 'Atenção torcedores, para uma saída mais rápida, utilizem os caminhos de saída do Portão A e Portão C. Obrigado.' (Disponível em EN, ES, FR). Clique para enviar ao console.",
  },
  "Find nearest restroom": {
    en: "Arena IQ Assist: The nearest restroom is located behind Section 204 concourse (1-minute walk). Load is currently Low. Evacuation pathways are fully clear.",
    es: "Asistente Arena IQ: El baño más cercano está detrás del vestíbulo de la Sección 204 (1 min a pie). La ocupación actual es Baja. Las vías están despejadas.",
    fr: "Assistant Arena IQ: Les toilettes les plus proches sont situées derrière le hall de la Section 204 (1 min de marche). L'affluence est actuellement Faible. Les voies sont libres.",
    pt: "Assistente Arena IQ: O banheiro mais próximo fica atrás da Seção 204 (1 min a pé). A ocupação atual é Baixa. Os caminhos estão totalmente livres.",
  },
  "Where is Food Court?": {
    en: "Arena IQ Guide: MetLife Stadium Food Court is situated at the Plaza Level near Gate B. Active queues: 3-5 minutes wait. Generative recommendation: Try Local Concessions on Level 2 for zero queues.",
    es: "Guía Arena IQ: El patio de comidas del MetLife Stadium está en el nivel Plaza, cerca de la Puerta B. Espera: 3-5 minutos. Recomendación: Pruebe concesiones en Nivel 2 sin colas.",
    fr: "Guide Arena IQ: L'aire de restauration du MetLife Stadium est au niveau Plaza, près de la Porte B. File d'attente: 3-5 minutes. Recommandation: Essayez les stands du Niveau 2 sans file.",
    pt: "Guia Arena IQ: A praça de alimentação fica no nível Plaza, perto do Portão B. Espera: 3-5 minutos. Recomendação: Experimente as concessões do Nível 2 sem filas.",
  },
  "Transport to NYC": {
    en: "Arena IQ Travel Planner: NJ Transit trains depart from Secaucus Junction every 10 minutes post-match. Bus express lanes to Port Authority NYC are active at Gate B. Travel time: 25 minutes.",
    es: "Plan de viaje Arena IQ: Los trenes de NJ Transit salen de Secaucus Junction cada 10 minutos después del partido. Carriles de autobús express a NYC activos en Puerta B. Tiempo: 25 min.",
    fr: "Planificateur Arena IQ: Les trains NJ Transit partent de Secaucus Junction toutes les 10 minutes après le match. Navettes rapides pour NYC actives à la Porte B. Temps de trajet: 25 min.",
    pt: "Planejador Arena IQ: Os trens da NJ Transit partem de Secaucus Junction a cada 10 minutos após o jogo. Faixas de ônibus expressas para NYC ativas no Portão B. Tempo de viagem: 25 min.",
  },
  "How to get wheelchair help?": {
    en: "Arena IQ Assist: Wheelchair assistance is active at all gates. Click the 'Request Escort' button below, and a volunteer will be dispatched to your seat coordinates via the nearest elevator route.",
    es: "Asistencia Arena IQ: Ayuda para sillas de ruedas activa en todas las puertas. Haga clic en 'Solicitar Acompañante' y un voluntario irá a sus coordenadas de asiento.",
    fr: "Assistant Arena IQ: Assistance fauteuil roulant active à toutes les portes. Cliquez sur 'Demander un accompagnateur' et un bénévole sera envoyé à vos coordonnées de siège.",
    pt: "Assistente Arena IQ: Assistência para cadeirantes ativa em todos os portões. Clique em 'Solicitar Acompanhante' e um voluntário será enviado às coordenadas do seu assento.",
  },
  "Accessibility instructions": {
    en: "Arena IQ Volunteer Briefing: High priority wheelchair arrival at Gate B. Escort path: Elevator B-2 to Section 204 Row 12. Ensure all safety ramps are clear of bags.",
    es: "Instrucciones Arena IQ: Llegada de silla de ruedas de alta prioridad en Puerta B. Ruta: Ascensor B-2 a Sección 204 Fila 12. Asegúrese de que las rampas estén libres.",
    fr: "Briefing Arena IQ: Arrivée prioritaire de fauteuil roulant à la Porte B. Trajet: Ascenseur B-2 vers Section 204 Rang 12. Assurez-vous que les rampes d'accès sont libres.",
    pt: "Instruções Arena IQ: Chegada de cadeira de rodas de alta prioridade no Portão B. Rota: Elevador B-2 para Seção 204 Fileira 12. Certifique-se de que as rampas estejam desobstruídas.",
  },
  "Lost and Found protocol": {
    en: "Arena IQ Volunteer Protocol: Direct fans with lost items to the Guest Services Booth at Section 120. Log items in the Arena Intelligence inventory console for immediate AI matching.",
    es: "Protocolo Arena IQ: Dirija a los aficionados con objetos perdidos a Servicios al Huésped en Sección 120. Registre el objeto en la consola para emparejamiento inmediato.",
    fr: "Protocole Arena IQ: Dirigez les supporters vers le stand des services aux visiteurs à la Section 120. Enregistrez l'objet sur la console pour une mise en correspondance immédiate.",
    pt: "Protocolo Arena IQ: Direcione torcedores com itens perdidos para o balcão de atendimento na Seção 120. Registre o item no console para correspondência imediata por IA.",
  },
  "Gate B shift coordinator": {
    en: "Arena IQ Roster: Gate B volunteers report to Supervisor Sarah K. Shift rotation is every 2 hours. Rest area is active at Concourse Room 14.",
    es: "Organización Arena IQ: Los voluntarios de la Puerta B reportan a Sarah K. La rotación es cada 2 horas. El área de descanso está en la sala 14 del vestíbulo.",
    fr: "Planning Arena IQ: Les bénévoles Porte B sont sous la direction de Sarah K. Rotation toutes les 2 heures. L'espace de repos est situé dans la salle 14 du hall.",
    pt: "Escala Arena IQ: Voluntários do Portão B respondem à supervisora Sarah K. Rotação a cada 2 horas. A área de descanso fica na sala 14 do saguão.",
  },
  "Sustainability guidelines": {
    en: "Arena IQ Green Briefing: Ensure food waste is directed to organic compost bins located behind Food Court concessions. Reusable cup collection points must be monitored hourly.",
    es: "Guía Verde Arena IQ: Asegúrese de que los residuos de comida vayan a contenedores de compostaje orgánico. Monitoree los puntos de vasos reutilizables cada hora.",
    fr: "Briefing Vert Arena IQ: Veillez à ce que les déchets alimentaires soient dirigés vers les bacs de compostage. Surveillez les points de collecte de gobelets toutes les heures.",
    pt: "Instruções Sustentáveis Arena IQ: Garanta que resíduos orgânicos vão para lixeiras de compostagem. Monitore os pontos de copos reutilizáveis de hora em hora.",
  },
  default: {
    en: "Arena IQ Response: MetLife Stadium operations are nominal. Crowd density is stable. NJ Transit shuttles are on schedule. How else can I assist your World Cup 2026 operations?",
    es: "Respuesta Arena IQ: Las operaciones de MetLife Stadium son nominales. La densidad de la multitud es estable. NJ Transit a tiempo. ¿En qué más puedo ayudarle?",
    fr: "Réponse Arena IQ: Opérations nominales au MetLife Stadium. Densité de foule stable. NJ Transit à l'heure. Comment puis-je vous aider pour le Mondial 2026?",
    pt: "Resposta Arena IQ: As operações do MetLife Stadium estão normais. Densidade estável. NJ Transit no horário. Como posso ajudar nas operações da Copa 2026?",
  },
};

function Assistant() {
  const [persona, setPersona] = useState<Persona>("staff");
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Welcome to MetLife Stadium World Cup 2026 Arena IQ. Select your persona in the tabs and preferred language in the header dropdown to coordinate real-time crowd dynamics." },
  ]);
  const [input, setInput] = useState("");

  const activeSuggestions = useMemo(() => suggestions[persona], [persona]);

  function send(t: string) {
    if (!t.trim()) return;

    let aiResponse = aiAnswers.default[lang];
    const matchingKey = Object.keys(aiAnswers).find(
      (k) => k.toLowerCase() === t.toLowerCase().trim()
    );
    if (matchingKey) {
      aiResponse = aiAnswers[matchingKey][lang];
    }

    setMessages((m) => [
      ...m,
      { role: "user", text: t },
      { role: "ai", text: aiResponse },
    ]);
    setInput("");
  }

  return (
    <AppShell title="Arena IQ Workspace" subtitle="Multimodal neural model trained on MetLife Stadium events and telemetry data">
      <div className="grid lg:grid-cols-4 gap-5 h-[calc(100vh-10rem)]">
        
        {/* Main Chat Panel */}
        <div
          className="lg:col-span-3 rounded-2xl flex flex-col overflow-hidden relative"
          style={{ background: "rgba(14,27,36,0.90)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Header Panel */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(7,20,28,0.20)" }}
          >
            {/* Persona Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-primary" /> Core Persona:
              </span>
              {(["staff", "fan", "volunteer"] as Persona[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition ${
                    persona === p
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-slate-400 hover:text-white"
                  } border border-transparent cursor-pointer`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Language Dropdown */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
              <Globe className="size-3.5 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs text-white font-bold outline-none border-none cursor-pointer uppercase font-mono"
              >
                <option value="en" className="bg-[#0E1B24]">English (EN)</option>
                <option value="es" className="bg-[#0E1B24]">Español (ES)</option>
                <option value="fr" className="bg-[#0E1B24]">Français (FR)</option>
                <option value="pt" className="bg-[#0E1B24]">Português (PT)</option>
              </select>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}
              >
                {m.role === "ai" && (
                  <div
                    className="size-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(14,159,110,0.12)", border: "1px solid rgba(14,159,110,0.22)" }}
                  >
                    <Sparkles className="size-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-6 ${
                    m.role === "user"
                      ? "bg-primary text-black font-semibold rounded-br-sm"
                      : "glass rounded-bl-sm text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input text box */}
          <div className="p-4 border-t border-white/5" style={{ background: "rgba(7,20,28,0.30)" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl pl-4 pr-2 py-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Query Arena IQ about crowds, queues, transport or guidelines as ${persona}...`}
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder:text-slate-600 font-medium"
              />
              <button
                type="submit"
                className="size-9 rounded-lg flex items-center justify-center text-black hover:opacity-90 active:scale-95 transition border-none outline-none cursor-pointer"
                style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)" }}
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar suggestions list */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="text-[10px] uppercase tracking-[0.20em] text-slate-500 font-bold px-1 select-none">
            Suggested Arena IQ Prompts
          </div>
          {activeSuggestions.map((q, i) => (
            <motion.button
              key={q.title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => send(q.title)}
              className="w-full text-left bg-white/3 hover:bg-white/5 border border-white/6 hover:border-primary/45 rounded-xl p-4 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-colors group-hover:bg-primary/20">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{q.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{q.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
