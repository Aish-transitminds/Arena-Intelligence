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

function buildFallbackEmergencyPlan(
  incidentDescription: string,
  selectedArea: string,
): EmergencyPlan {
  return {
    severity: "Elevated",
    recommendedActions: [
      `Dispatch medical and security support to ${selectedArea}`,
      "Open alternate ingress routes and slow crowd flow near the affected zone",
      `Confirm the incident report: ${incidentDescription}`,
    ],
    alertTeams: ["Medical Unit", "Security Lead", "Operations Desk"],
    alertGates: [selectedArea.includes("Gate") ? selectedArea : "Gate B"],
    rationale:
      "The incident indicates a localized crowd or safety concern that should be contained quickly and monitored closely.",
  };
}

function buildFallbackRecommendation(
  gateQueues: Array<{ gate: string; wait: number; capacity: number }>,
  sectionOccupancy: Array<{ name: string; value: number }>,
): string {
  const busiestGate = [...gateQueues].sort((a, b) => b.wait - a.wait)[0];
  const busiestSection = [...sectionOccupancy].sort((a, b) => b.value - a.value)[0];
  return `Rebalance ingress toward ${busiestGate.gate} and reduce load around ${busiestSection.name} to keep flow stable.`;
}

export async function generateEmergencyPlan(
  incidentDescription: string,
  selectedArea: string,
  crowdLoad: number,
  medicalAvailability: number,
): Promise<EmergencyPlanResult> {
  const prompt = `Incident description: ${incidentDescription}\nLocation: ${selectedArea}\nCrowd load: ${crowdLoad}%\nMedical availability: ${medicalAvailability}%\nRespond with JSON only.`;
  const fallback = buildFallbackEmergencyPlan(incidentDescription, selectedArea);
  return { plan: fallback, prompt, rawResponse: JSON.stringify(fallback) };
}

export async function generateAdminRecommendation(
  gateQueues: Array<{ gate: string; wait: number; capacity: number }>,
  sectionOccupancy: Array<{ name: string; value: number }>,
): Promise<AdminRecommendationResult> {
  const prompt = `Gate queue data: ${gateQueues.map((g) => `${g.gate}:${g.wait}m/${g.capacity}%`).join(", ")}\nSection occupancy: ${sectionOccupancy.map((s) => `${s.name}:${s.value}%`).join(", ")}\nWrite one concise recommendation for the control room.`;
  const fallback = buildFallbackRecommendation(gateQueues, sectionOccupancy);
  return { recommendation: fallback, prompt, rawResponse: fallback };
}
