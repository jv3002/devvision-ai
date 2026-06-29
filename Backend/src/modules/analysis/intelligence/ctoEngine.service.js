const calculateCompanyStage = ({
  engineeringMaturity,
  technicalDebt,
  releaseReadiness
}) => {
  if (
    engineeringMaturity?.score >= 85 &&
    releaseReadiness?.ready &&
    technicalDebt?.level !== "critical"
  ) {
    return "SCALING";
  }

  if (
    engineeringMaturity?.score >= 70 &&
    technicalDebt?.level !== "critical"
  ) {
    return "GROWTH";
  }

  return "STABILIZATION";
};

export const generateCTOEngine = ({
  strategyEngine,
  engineeringMaturity,
  technicalDebt,
  releaseReadiness,
  roadmapPlanner,
  businessImpact,
  teamAnalytics
}) => {
  const companyStage = calculateCompanyStage({
    engineeringMaturity,
    technicalDebt,
    releaseReadiness
  });

  let ctoRecommendation =
    "Mantener monitoreo continuo.";

  let nextQuarterGoal =
    "Incrementar calidad del software.";

  let engineeringBudgetPriority =
    "DELIVERY";

  let expectedBusinessGrowth =
    "MEDIUM";

  const recommendedHiring = [];

  switch (companyStage) {
    case "STABILIZATION":
      ctoRecommendation =
        "No aumentar nuevas funcionalidades hasta estabilizar la arquitectura.";

      nextQuarterGoal =
        "Reducir deuda técnica crítica.";

      engineeringBudgetPriority =
        "BACKEND";

      expectedBusinessGrowth =
        "MEDIUM";
      break;

    case "GROWTH":
      ctoRecommendation =
        "Escalar el producto fortaleciendo arquitectura y automatización.";

      nextQuarterGoal =
        "Optimizar mantenibilidad y velocidad de entrega.";

      engineeringBudgetPriority =
        "ENGINEERING";

      expectedBusinessGrowth =
        "HIGH";
      break;

    case "SCALING":
      ctoRecommendation =
        "Preparar la plataforma para crecimiento masivo.";

      nextQuarterGoal =
        "Escalar infraestructura y equipos.";

      engineeringBudgetPriority =
        "PLATFORM";

      expectedBusinessGrowth =
        "VERY_HIGH";
      break;
  }

  if ((teamAnalytics?.totalDevelopers || 0) < 3) {
    recommendedHiring.push("Backend Engineer");
  }

  if (businessImpact?.businessRisk === "HIGH") {
    recommendedHiring.push("QA Engineer");
  }

  if (
    engineeringMaturity?.score >= 80 &&
    companyStage === "SCALING"
  ) {
    recommendedHiring.push("DevOps Engineer");
  }

  return {
    companyStage,
    ctoRecommendation,
    nextQuarterGoal,
    engineeringBudgetPriority,
    expectedBusinessGrowth,
    recommendedHiring,
    executivePriority:
      strategyEngine?.investmentPriority || "ENGINEERING",
    strategicRisk:
      strategyEngine?.strategicRisk || "MEDIUM",
    expectedScore:
      strategyEngine?.expectedScore || 0,
    expectedEngineeringMaturity:
      strategyEngine?.expectedEngineeringMaturity || 0
  };
};