export type EmergencyPlan = {
  severity: string;
  recommendedActions: string[];
  alertTeams: string[];
  alertGates: string[];
  rationale: string;
};

export type EmergencyPlanResult = {
  plan: EmergencyPlan;
  prompt: string;
  rawResponse: string;
};

export type AdminRecommendationResult = {
  recommendation: string;
  prompt: string;
  rawResponse: string;
};

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

function buildFallbackEmergencyPlan(incidentDescription: string, selectedArea: string): EmergencyPlan {
  return {
    severity: "Elevated",
    recommendedActions: [
      `Dispatch medical and security support to ${selectedArea}`,
      "Open alternate ingress routes and slow crowd flow near the affected zone",
      `Confirm the incident report: ${incidentDescription}`,
    ],
    alertTeams: ["Medical Unit", "Security Lead", "Operations Desk"],
    alertGates: [selectedArea.includes("Gate") ? selectedArea : "Gate B"],
    rationale: "The incident indicates a localized crowd or safety concern that should be contained quickly and monitored closely.",
  };
}

function buildFallbackRecommendation(gateQueues: Array<{ gate: string; wait: number; capacity: number }>, sectionOccupancy: Array<{ name: string; value: number }>): string {
  const busiestGate = [...gateQueues].sort((a, b) => b.wait - a.wait)[0];
  const busiestSection = [...sectionOccupancy].sort((a, b) => b.value - a.value)[0];
  return `Rebalance ingress toward ${busiestGate.gate} and reduce load around ${busiestSection.name} to keep flow stable.`;
}

async function askAnthropic(prompt: string, systemPrompt: string, signal?: AbortSignal): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("Missing Anthropic API key");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    signal,
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 500,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Empty response from Anthropic");
  }
  return text;
}

export async function generateEmergencyPlan(
  incidentDescription: string,
  selectedArea: string,
  crowdLoad: number,
  medicalAvailability: number,
  signal?: AbortSignal,
): Promise<EmergencyPlanResult> {
  const systemPrompt = `You are a calm operations copilot for a fictional mega-event stadium. Return strict JSON only with this shape: {"severity":"string","recommendedActions":["string"],"alertTeams":["string"],"alertGates":["string"],"rationale":"string"}. Keep it concise and operational.`;

  const prompt = `Incident description: ${incidentDescription}\nLocation: ${selectedArea}\nCrowd load: ${crowdLoad}%\nMedical availability: ${medicalAvailability}%\nRespond with JSON only.`;

  try {
    const raw = await askAnthropic(prompt, systemPrompt, signal);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<EmergencyPlan>;

    return {
      plan: {
        severity: parsed.severity ?? "Elevated",
        recommendedActions: parsed.recommendedActions ?? [],
        alertTeams: parsed.alertTeams ?? ["Medical Unit", "Security Lead"],
        alertGates: parsed.alertGates ?? [selectedArea.includes("Gate") ? selectedArea : "Gate B"],
        rationale: parsed.rationale ?? "The incident requires a rapid, localized response.",
      },
      prompt,
      rawResponse: raw,
    };
  } catch {
    const fallback = buildFallbackEmergencyPlan(incidentDescription, selectedArea);
    return {
      plan: fallback,
      prompt,
      rawResponse: JSON.stringify(fallback),
    };
  }
}

export async function generateAdminRecommendation(
  gateQueues: Array<{ gate: string; wait: number; capacity: number }>,
  sectionOccupancy: Array<{ name: string; value: number }>,
  signal?: AbortSignal,
): Promise<AdminRecommendationResult> {
  const systemPrompt = `You are an operations analyst for a fictional mega-event stadium. Return a single short recommendation sentence. Do not use markdown.`;
  const prompt = `Gate queue data: ${gateQueues.map((g) => `${g.gate}:${g.wait}m/${g.capacity}%`).join(", ")}\nSection occupancy: ${sectionOccupancy.map((s) => `${s.name}:${s.value}%`).join(", ")}\nWrite one concise recommendation for the control room.`;

  try {
    const raw = await askAnthropic(prompt, systemPrompt, signal);
    return {
      recommendation: raw.replace(/\n/g, " ").trim(),
      prompt,
      rawResponse: raw,
    };
  } catch {
    const fallback = buildFallbackRecommendation(gateQueues, sectionOccupancy);
    return {
      recommendation: fallback,
      prompt,
      rawResponse: fallback,
    };
  }
}
