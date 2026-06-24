export const generateBusinessImpact = ({
  technicalDebt,
  hotspots
}) => {
  const debtScore = technicalDebt?.score || 0;

  let riskCost = 0;

  if (debtScore >= 200) {
    riskCost = 10000;
  } else if (debtScore >= 150) {
    riskCost = 5000;
  } else if (debtScore >= 100) {
    riskCost = 2500;
  } else {
    riskCost = 1000;
  }

  return {
    debtScore,

    estimatedCostUSD: riskCost,

    businessRisk:
      debtScore >= 150
        ? "HIGH"
        : debtScore >= 100
        ? "MEDIUM"
        : "LOW",

    delayedDeliveryProbability:
      Math.min(
        90,
        Math.round((hotspots.length || 0) * 10)
      ),

    summary:
      `La deuda técnica actual podría generar un costo estimado de USD ${riskCost} en retrasos, errores y mantenimiento.`
  };
};