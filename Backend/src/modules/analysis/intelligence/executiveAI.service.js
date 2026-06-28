export const generateExecutiveAI = ({
  advisor,
  decisionEngine,
  roadmapPlanner,
  architectureAdvisor,
  engineeringMaturity,
  engineeringKpis,
  releaseReadiness,
  technicalDebt,
  prediction,
  businessImpact
}) => {
  const highPriority =
    decisionEngine?.highPriorityDecisions || 0;

  const executiveStatus =
    highPriority >= 3
      ? "EXECUTIVE_ATTENTION"
      : releaseReadiness?.ready
      ? "READY_TO_SCALE"
      : "MONITOR";

  const executiveSummary =
    highPriority >= 3
      ? "El proyecto presenta riesgos técnicos que requieren intervención antes de continuar escalando."
      : "El proyecto mantiene un comportamiento estable y puede continuar evolucionando.";

  const engineeringSummary =
    engineeringMaturity?.description ||
    "Sin información disponible.";

  const businessSummary =
    businessImpact?.summary ||
    "Sin impacto económico calculado.";

  const deliverySummary =
    releaseReadiness?.recommendation ||
    "Sin información de release.";

  const roadmapSummary = {
    phase: roadmapPlanner?.currentPhase || "UNKNOWN",
    expectedScore: roadmapPlanner?.expectedScore ?? null,
    estimatedWeeks: roadmapPlanner?.estimatedDurationWeeks ?? null
  };

  const architectureSummary =
    architectureAdvisor?.summary ||
    "Sin recomendaciones arquitectónicas.";

  const estimatedInvestmentHours =
    decisionEngine?.estimatedTotalEffortHours || 0;

  let estimatedROI = "LOW";

  if (estimatedInvestmentHours <= 20) {
    estimatedROI = "VERY_HIGH";
  } else if (estimatedInvestmentHours <= 50) {
    estimatedROI = "HIGH";
  } else if (estimatedInvestmentHours <= 80) {
    estimatedROI = "MEDIUM";
  }

  return {
    executiveStatus,
    executiveSummary,

    strategicObjective:
      advisor?.topRecommendation ||
      "Continuar monitoreo.",

    engineeringSummary,
    businessSummary,
    deliverySummary,
    architectureSummary,

    roadmapSummary,

    maturity: {
      level: engineeringMaturity?.level || "UNKNOWN",
      score: engineeringMaturity?.score ?? 0
    },

    engineeringKpis: {
      codeHealth: engineeringKpis?.codeHealth ?? 0,
      maintainability: engineeringKpis?.maintainability ?? 0,
      technicalRisk: engineeringKpis?.technicalRisk ?? 0,
      releaseConfidence: engineeringKpis?.releaseConfidence ?? 0
    },

    prediction: {
      trend: prediction?.trend || "unknown",
      message: prediction?.message || "Sin predicción disponible."
    },

    technicalDebt: {
      level: technicalDebt?.level || "unknown",
      score: technicalDebt?.score ?? 0
    },

    investment: {
      estimatedHours: estimatedInvestmentHours,
      estimatedROI
    },

    nextExecutiveAction:
      decisionEngine?.topDecision?.title ||
      "Continuar monitoreo."
  };
};