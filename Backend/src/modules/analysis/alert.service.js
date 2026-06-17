export const generateAlerts = (projectScore, riskData) => {

  const alerts = [];

  // ⚠️ score bajo
  if (projectScore.score < 6) {
    alerts.push("🚨 Score bajo: calidad del proyecto en riesgo");
  }

  // ⚠️ tendencia negativa
  if (projectScore.trend === "declining") {
    alerts.push("📉 Tendencia negativa detectada");
  }

  // ⚠️ riesgo alto
  if (riskData.riskLevel === "high") {
    alerts.push("🔥 Alto riesgo técnico detectado");
  }

  return alerts;
};