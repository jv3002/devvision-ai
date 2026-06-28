const calculateExpectedMaturity = ({
  engineeringMaturity,
  decisionEngine,
  roadmapPlanner
}) => {
  const currentScore = engineeringMaturity?.score || 0;
  const highPriorityDecisions =
    decisionEngine?.highPriorityDecisions || 0;

  const roadmapGain =
    roadmapPlanner?.roadmap?.reduce(
      (sum, sprint) => sum + (sprint.estimatedGain || 0),
      0
    ) || 0;

  const maturityGain =
    highPriorityDecisions >= 3 ? 8 : highPriorityDecisions >= 1 ? 5 : 3;

  return Math.min(
    100,
    Math.round(currentScore + maturityGain + roadmapGain * 0.15)
  );
};

const calculateExpectedScore = ({ roadmapPlanner, score }) => {
  if (roadmapPlanner?.expectedScore) {
    return roadmapPlanner.expectedScore;
  }

  return Math.min(100, Math.round((score || 0) + 10));
};

export const generateStrategyEngine = ({
  score = 0,
  executiveAI,
  decisionEngine,
  intelligenceEngine,
  roadmapPlanner,
  architectureAdvisor,
  engineeringMaturity,
  engineeringKpis,
  releaseReadiness,
  technicalDebt,
  businessImpact
}) => {
  const technicalDebtLevel = technicalDebt?.level || "unknown";
  const businessRisk = businessImpact?.businessRisk || "UNKNOWN";
  const qualityRisk = releaseReadiness?.ready === false;

  const highPriorityDecisions =
    decisionEngine?.highPriorityDecisions || 0;

  let companyStage = "STABLE";
  let engineeringStrategy = "MAINTAIN_AND_MONITOR";
  let recommendedQuarterGoal = "Mantener monitoreo técnico continuo.";
  let investmentPriority = "MONITORING";
  let strategicRisk = "LOW";

  if (
    technicalDebtLevel === "critical" ||
    highPriorityDecisions >= 3 ||
    executiveAI?.executiveStatus === "EXECUTIVE_ATTENTION"
  ) {
    companyStage = "STABILIZATION";
    engineeringStrategy = "REDUCE_TECHNICAL_DEBT";
    recommendedQuarterGoal =
      "Reducir deuda técnica crítica y estabilizar arquitectura antes de escalar nuevas funcionalidades.";
    investmentPriority = "TECHNICAL_DEBT";
    strategicRisk = "HIGH";
  } else if (
    architectureAdvisor?.recommendations?.length > 0 ||
    engineeringKpis?.maintainability < 70
  ) {
    companyStage = "GROWTH";
    engineeringStrategy = "IMPROVE_ARCHITECTURE";
    recommendedQuarterGoal =
      "Mejorar arquitectura, mantenibilidad y separación de responsabilidades.";
    investmentPriority = "ARCHITECTURE";
    strategicRisk = "MEDIUM";
  } else if (releaseReadiness?.ready) {
    companyStage = "SCALE";
    engineeringStrategy = "ACCELERATE_DELIVERY";
    recommendedQuarterGoal =
      "Aumentar velocidad de entrega manteniendo controles de calidad activos.";
    investmentPriority = "DELIVERY";
    strategicRisk = "LOW";
  }

  const estimatedROI =
    businessRisk === "HIGH" || investmentPriority === "TECHNICAL_DEBT"
      ? "HIGH"
      : businessRisk === "MEDIUM" || investmentPriority === "ARCHITECTURE"
      ? "MEDIUM"
      : "LOW";

  const expectedEngineeringMaturity = calculateExpectedMaturity({
    engineeringMaturity,
    decisionEngine,
    roadmapPlanner
  });

  const expectedScore = calculateExpectedScore({
    roadmapPlanner,
    score
  });

  const quarterAllocation = {
    technicalDebt:
      investmentPriority === "TECHNICAL_DEBT" ? 60 : 30,
    architecture:
      investmentPriority === "ARCHITECTURE" ? 45 : 25,
    delivery:
      investmentPriority === "DELIVERY" ? 40 : 15,
    monitoring: 10
  };

  const strategicActions = [];

  if (decisionEngine?.topDecision) {
    strategicActions.push({
      priority: "HIGH",
      title: decisionEngine.topDecision.title,
      reason: decisionEngine.topDecision.reason,
      expectedImpact: decisionEngine.topDecision.expectedImpact
    });
  }

  if (roadmapPlanner?.roadmap?.[0]) {
    strategicActions.push({
      priority: "MEDIUM",
      title: `Ejecutar ${roadmapPlanner.roadmap[0].sprint}`,
      reason: roadmapPlanner.roadmap[0].objective,
      expectedImpact:
        `Aumentar score esperado hasta ${roadmapPlanner.expectedScore}.`
    });
  }

  if (architectureAdvisor?.recommendations?.[0]) {
    strategicActions.push({
      priority: "MEDIUM",
      title: architectureAdvisor.recommendations[0].title,
      reason: architectureAdvisor.summary,
      expectedImpact:
        "Mejorar mantenibilidad, claridad estructural y escalabilidad."
    });
  }

  return {
    companyStage,
    engineeringStrategy,
    recommendedQuarterGoal,
    investmentPriority,
    estimatedROI,
    strategicRisk,
    expectedEngineeringMaturity,
    expectedScore,
    quarterAllocation,
    strategicActions,
    executiveAlignment: {
      status: executiveAI?.executiveStatus || "UNKNOWN",
      objective:
        executiveAI?.strategicObjective ||
        intelligenceEngine?.strategicPriority ||
        "Mantener monitoreo continuo.",
      nextAction:
        executiveAI?.nextExecutiveAction ||
        decisionEngine?.topDecision?.title ||
        "Continuar monitoreo."
    },
    releaseStrategy: {
      canScaleNow: releaseReadiness?.ready || false,
      recommendation:
        releaseReadiness?.recommendation ||
        "Sin recomendación de release disponible.",
      qualityRisk
    }
  };
};