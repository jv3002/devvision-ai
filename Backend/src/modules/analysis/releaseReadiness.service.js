export const generateReleaseReadiness = ({
  score = 0,
  risk = {},
  technicalDebt = {},
  smartAlerts = [],
  hotspots = [],
  prediction = {}
}) => {
  const blockers = [];

  let confidence = 100;

  if (score < 70) {
    blockers.push("Score técnico menor a 70.");
    confidence -= 25;
  }

  if (
    risk.riskLevel === "high" ||
    risk.riskLevel === "critical"
  ) {
    blockers.push("Riesgo técnico elevado.");
    confidence -= 25;
  }

  if (technicalDebt.level === "critical") {
    blockers.push("Deuda técnica crítica.");
    confidence -= 20;
  }

  if (hotspots.length >= 10) {
    blockers.push("Demasiados hotspots técnicos.");
    confidence -= 15;
  }

  if (prediction.trend === "down") {
    blockers.push("Tendencia negativa del proyecto.");
    confidence -= 15;
  }

  const highSmartAlerts = smartAlerts.filter(
    (alert) => alert.severity === "HIGH"
  );

  if (highSmartAlerts.length > 0) {
    blockers.push("Existen alertas inteligentes de severidad alta.");
    confidence -= highSmartAlerts.length * 10;
  }

  confidence = Math.max(0, Math.min(100, confidence));

  let status = "READY";
  let ready = true;
  let recommendation =
    "El proyecto se encuentra en condiciones aceptables para liberar.";

  if (confidence < 50) {
    status = "NOT_READY";
    ready = false;
    recommendation =
      "No se recomienda liberar. Resolver primero los bloqueadores críticos.";
  } else if (confidence < 75) {
    status = "CAUTION";
    ready = false;
    recommendation =
      "Liberar con precaución. Se recomienda resolver los principales riesgos antes del despliegue.";
  }

  return {
    ready,
    status,
    confidence,
    blockers,
    recommendation
  };
};