export const generateSmartAlerts = ({
  history = [],
  technicalDebt = {},
  risk = {},
  prediction = {},
  developerScores = []
}) => {
  const alerts = [];

  const latestScore =
    history[history.length - 1]?.score ?? 0;

  const previousScore =
    history[history.length - 2]?.score ?? latestScore;

  const scoreDifference =
    latestScore - previousScore;

  // Score bajando

  if (scoreDifference <= -10) {
    alerts.push({
      severity: "HIGH",
      type: "SCORE_DROP",
      title: "Caída importante de score",
      description:
        `El score disminuyó ${Math.abs(scoreDifference)} puntos.`,
      action:
        "Revisar los cambios recientes que afectaron la calidad técnica."
    });
  }

  // Deuda técnica crítica

  if (
    technicalDebt.level === "critical"
  ) {
    alerts.push({
      severity: "HIGH",
      type: "TECHNICAL_DEBT",
      title: "Deuda técnica crítica",
      description:
        `La deuda técnica acumulada es ${technicalDebt.score}.`,
      action:
        "Priorizar refactorizaciones críticas."
    });
  }

  // Riesgo alto

  if (
    risk.riskLevel === "high" ||
    risk.riskLevel === "critical"
  ) {
    alerts.push({
      severity: "HIGH",
      type: "PROJECT_RISK",
      title: "Riesgo elevado",
      description:
        "El proyecto presenta señales de riesgo técnico.",
      action:
        "Revisar hotspots, deuda técnica y arquitectura."
    });
  }

  // Predicción negativa

  if (
    prediction.trend === "down"
  ) {
    alerts.push({
      severity: "MEDIUM",
      type: "NEGATIVE_TREND",
      title: "Tendencia negativa",
      description:
        "La evolución histórica indica deterioro del proyecto.",
      action:
        "Analizar los últimos análisis ejecutados."
    });
  }

  // Developers problemáticos

  developerScores.forEach((developer) => {
    if (developer.averageScore < 50) {
      alerts.push({
        severity: "MEDIUM",
        type: "DEVELOPER_RISK",
        title: `Developer Risk: ${developer.developer}`,
        description:
          `Score promedio ${developer.averageScore}.`,
        action:
          "Revisar calidad de commits y acompañamiento técnico."
      });
    }
  });

  return alerts;
};