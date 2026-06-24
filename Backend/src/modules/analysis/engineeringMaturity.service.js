export const generateEngineeringMaturity = ({
  engineeringKpis = {},
  qualityGate = {},
  releaseReadiness = {},
  technicalDebt = {},
  smartAlerts = []
}) => {
  const maturityScore =
    engineeringKpis.overallEngineeringMaturity || 0;

  const hasCriticalDebt =
    technicalDebt.level === "critical";

  const hasHighAlerts =
    smartAlerts.some((alert) => alert.severity === "HIGH");

  let level = "LEVEL_1";
  let name = "Chaotic Engineering";
  let description =
    "El proyecto presenta baja madurez técnica y requiere control básico de calidad.";
  let nextStep =
    "Implementar métricas base, reducir deuda crítica y estabilizar el flujo de trabajo.";

  if (maturityScore >= 85 && qualityGate.passed && releaseReadiness.ready) {
    level = "LEVEL_5";
    name = "Elite Engineering";
    description =
      "El proyecto presenta alta madurez técnica, bajo riesgo y preparación sólida para producción.";
    nextStep =
      "Mantener estándares, automatizar controles avanzados y escalar buenas prácticas.";
  } else if (maturityScore >= 75 && !hasCriticalDebt) {
    level = "LEVEL_4";
    name = "Advanced Engineering";
    description =
      "El proyecto tiene una base técnica avanzada, pero aún puede mejorar en automatización y consistencia.";
    nextStep =
      "Reducir riesgos restantes, fortalecer release readiness y mejorar métricas de equipo.";
  } else if (maturityScore >= 60) {
    level = "LEVEL_3";
    name = "Managed Engineering";
    description =
      "El proyecto tiene métricas y controles activos, pero mantiene riesgos técnicos importantes.";
    nextStep =
      "Reducir deuda técnica crítica y fortalecer los Quality Gates antes de producción.";
  } else if (maturityScore >= 40) {
    level = "LEVEL_2";
    name = "Emerging Engineering";
    description =
      "El proyecto empieza a tener señales de control técnico, pero todavía requiere más estabilidad.";
    nextStep =
      "Mejorar mantenibilidad, reducir hotspots y establecer criterios de release claros.";
  }

  if (hasCriticalDebt || hasHighAlerts) {
    nextStep =
      "Priorizar reducción de deuda técnica crítica y resolver alertas inteligentes de alta severidad.";
  }

  return {
    level,
    name,
    score: maturityScore,
    description,
    nextStep
  };
};