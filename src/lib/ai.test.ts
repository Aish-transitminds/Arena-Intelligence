import { describe, expect, it } from "vitest";
import { generateAdminRecommendation, generateEmergencyPlan } from "./ai";

describe("operational recommendations", () => {
  it("returns an actionable local emergency plan", async () => {
    const result = await generateEmergencyPlan("Supporter needs help", "Gate 4", 75, 60);

    expect(result.plan.alertGates).toEqual(["Gate 4"]);
    expect(result.plan.recommendedActions).toContain(
      "Dispatch medical and security support to Gate 4",
    );
    expect(result.rawResponse).toContain("Elevated");
  });

  it("recommends the busiest gate and section", async () => {
    const result = await generateAdminRecommendation(
      [
        { gate: "Gate 1", wait: 5, capacity: 30 },
        { gate: "Gate 7", wait: 14, capacity: 80 },
      ],
      [
        { name: "North Stand", value: 55 },
        { name: "East Stand", value: 92 },
      ],
    );

    expect(result.recommendation).toContain("Gate 7");
    expect(result.recommendation).toContain("East Stand");
  });
});
