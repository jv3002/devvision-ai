const calculateMarketReadiness = ({
  releaseReadiness,
  engineeringMaturity,
  technicalDebt,
  strategyEngine
}) => {
  let readiness = 70;

  if (releaseReadiness?.ready) readiness += 15;
  if (engineeringMaturity?.score >= 80) readiness += 10;
  if (strategyEngine?.expectedScore >= 90) readiness += 10;

  if (technicalDebt?.level === "critical") readiness -= 20;
  if (releaseReadiness?.ready === false) readiness -= 10;

  return Math.max(0, Math.min(100, readiness));
};

const calculateAnnualSavings = ({ businessImpact, strategyEngine }) => {
  const baseCost = businessImpact?.estimatedCostUSD || 0;
  const multiplier =
    strategyEngine?.estimatedROI === "HIGH"
      ? 12
      : strategyEngine?.estimatedROI === "MEDIUM"
      ? 6
      : 3;

  return baseCost * multiplier;
};

export const generateCEOEngine = ({
  ctoEngine,
  strategyEngine,
  businessImpact,
  roadmapPlanner,
  releaseReadiness,
  engineeringMaturity,
  technicalDebt,
  prediction
}) => {
  const marketReadiness = calculateMarketReadiness({
    releaseReadiness,
    engineeringMaturity,
    technicalDebt,
    strategyEngine
  });

  const expectedROI =
    strategyEngine?.estimatedROI ||
    ctoEngine?.expectedBusinessGrowth ||
    "MEDIUM";

  const estimatedAnnualSavings = calculateAnnualSavings({
    businessImpact,
    strategyEngine
  });

  let businessStage = "STABILIZATION";
  let investmentDecision = "HOLD";
  let productScalability = "LIMITED";
  let competitiveRisk = "MEDIUM";
  let nextBusinessObjective =
    "Estabilizar el producto antes de ampliar inversión.";
  let executiveMessage =
    "El proyecto requiere mejorar su estabilidad técnica antes de acelerar crecimiento.";

  if (
    marketReadiness >= 85 &&
    releaseReadiness?.ready &&
    technicalDebt?.level !== "critical"
  ) {
    businessStage = "SCALE";
    investmentDecision = "INVEST";
    productScalability = "HIGH";
    competitiveRisk = "LOW";
    nextBusinessObjective =
      "Expandir la plataforma a clientes Enterprise.";
    executiveMessage =
      "El proyecto está preparado para crecer y soportar una estrategia comercial más agresiva.";
  } else if (
    marketReadiness >= 65 &&
    strategyEngine?.expectedScore >= 85
  ) {
    businessStage = "GROWTH";
    investmentDecision = "INVEST_WITH_CONTROL";
    productScalability = "GOOD";
    competitiveRisk =
      releaseReadiness?.ready === false ? "MEDIUM" : "LOW";
    nextBusinessObjective =
      "Invertir de forma controlada mientras se reduce deuda técnica prioritaria.";
    executiveMessage =
      "El proyecto tiene buen potencial de crecimiento, pero debe controlar riesgos técnicos antes de escalar fuerte.";
  } else {
    businessStage = "STABILIZATION";
    investmentDecision = "FIX_BEFORE_SCALE";
    productScalability = "LIMITED";
    competitiveRisk = "HIGH";
    nextBusinessObjective =
      "Reducir deuda técnica, estabilizar release y mejorar mantenibilidad.";
    executiveMessage =
      "El proyecto aún no debería escalar comercialmente sin resolver primero sus riesgos técnicos principales.";
  }

  const recommendedHiring = [
    ...(ctoEngine?.recommendedHiring || [])
  ];

  if (
    expectedROI === "HIGH" &&
    !recommendedHiring.includes("Product Manager")
  ) {
    recommendedHiring.push("Product Manager");
  }

  if (
    businessImpact?.businessRisk === "HIGH" &&
    !recommendedHiring.includes("QA Engineer")
  ) {
    recommendedHiring.push("QA Engineer");
  }

  return {
    businessStage,
    investmentDecision,
    expectedROI,
    marketReadiness,
    productScalability,
    competitiveRisk,
    estimatedAnnualSavings,
    recommendedHiring,
    nextBusinessObjective,
    executiveMessage,
    businessRisk: businessImpact?.businessRisk || "UNKNOWN",
    roadmapPhase: roadmapPlanner?.currentPhase || "UNKNOWN",
    expectedScore: strategyEngine?.expectedScore || 0,
    expectedEngineeringMaturity:
      strategyEngine?.expectedEngineeringMaturity || 0,
    forecast: {
      trend: prediction?.trend || "unknown",
      message:
        prediction?.message ||
        "No existe información suficiente para proyectar crecimiento."
    }
  };
};