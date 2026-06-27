const addInsight = ({
  insights,
  priority = "MEDIUM",
  type = "GENERAL",
  title,
  message,
  action
}) => {
  insights.push({
    priority,
    type,
    title,
    message,
    action
  });
};

export const generateAdvisor = ({
  score = 0,
  risk = {},
  technicalDebt = {},
  qualityGate = {},
  releaseReadiness = {},
  businessImpact = {},
  engineeringKpis = {},
  engineeringMaturity = {},
  teamAnalytics = {},
  sprintHealth = {},
  smartAlerts = [],
  hotspots = [],
  prediction = {}
}) => {
  const insights = [];
  const actionPlan = [];

  if (technicalDebt.level === "critical") {
    addInsight({
      insights,
      priority: "HIGH",
      type: "TECHNICAL_DEBT",
      title: "Deuda técnica crítica detectada",
      message:
        "El proyecto mantiene una deuda técnica crítica aunque el score general sea aceptable.",
      action:
        "Priorizar la refactorización de los archivos con mayor deuda técnica."
    });

    actionPlan.push({
      order: 1,
      title: "Reducir deuda técnica crítica",
      target:
        technicalDebt.items?.[0]?.file ||
        hotspots?.[0]?.file ||
        "Archivo principal con mayor deuda",
      expectedImpact:
        "Mejorar mantenibilidad y reducir riesgo futuro."
    });
  }

  if (qualityGate.status === "FAIL") {
    addInsight({
      insights,
      priority: "HIGH",
      type: "QUALITY_GATE",
      title: "Quality Gate fallido",
      message:
        "El proyecto no cumple todos los estándares mínimos definidos para producción.",
      action:
        "Resolver los checks fallidos antes de avanzar con releases importantes."
    });
  }

  if (releaseReadiness.status === "CAUTION") {
    addInsight({
      insights,
      priority: "MEDIUM",
      type: "RELEASE_READINESS",
      title: "Release con precaución",
      message:
        "El proyecto podría liberarse, pero existen bloqueadores que deben revisarse.",
      action:
        "Revisar bloqueadores de release antes del despliegue."
    });
  }

  if (businessImpact.businessRisk === "HIGH") {
    addInsight({
      insights,
      priority: "HIGH",
      type: "BUSINESS_IMPACT",
      title: "Impacto económico alto",
      message:
        `La deuda técnica podría generar un costo estimado de USD ${businessImpact.estimatedCostUSD || 0}.`,
      action:
        "Reducir la deuda técnica con mayor impacto económico."
    });
  }

  if (engineeringKpis.technicalRisk >= 80) {
    addInsight({
      insights,
      priority: "HIGH",
      type: "ENGINEERING_KPI",
      title: "Riesgo técnico elevado",
      message:
        "Los KPIs de ingeniería muestran un riesgo técnico alto.",
      action:
        "Revisar deuda técnica, alertas inteligentes y Quality Gate."
    });
  }

  if (engineeringMaturity.level === "LEVEL_3") {
    addInsight({
      insights,
      priority: "MEDIUM",
      type: "ENGINEERING_MATURITY",
      title: "Madurez de ingeniería gestionada",
      message:
        "El proyecto cuenta con controles activos, pero aún mantiene riesgos importantes.",
      action:
        engineeringMaturity.nextStep ||
        "Reducir deuda técnica y fortalecer controles de calidad."
    });
  }

  if (teamAnalytics.teamRisk === "HIGH") {
    addInsight({
      insights,
      priority: "MEDIUM",
      type: "TEAM_RISK",
      title: "Riesgo de equipo alto",
      message:
        "El proyecto no tiene suficientes datos de colaboración o el conocimiento está concentrado.",
      action:
        "Aumentar trazabilidad de commits y participación del equipo."
    });
  }

  if (sprintHealth.deliveryRisk === "HIGH") {
    addInsight({
      insights,
      priority: "MEDIUM",
      type: "SPRINT_HEALTH",
      title: "Riesgo de entrega alto",
      message:
        "La salud del sprint muestra señales de riesgo en la entrega.",
      action:
        "Revisar capacidad, velocidad y compromisos del sprint."
    });
  }

  if (prediction.trend === "up" && score >= 80) {
    addInsight({
      insights,
      priority: "LOW",
      type: "POSITIVE_TREND",
      title: "Tendencia positiva",
      message:
        "El proyecto mantiene una evolución positiva y un score saludable.",
      action:
        "Mantener monitoreo y evitar que la deuda técnica siga creciendo."
    });
  }

  if (smartAlerts.length > 0) {
    actionPlan.push({
      order: actionPlan.length + 1,
      title: "Resolver alertas inteligentes",
      target:
        smartAlerts[0]?.title ||
        "Alerta principal",
      expectedImpact:
        "Reducir riesgos detectados automáticamente por DevVision."
    });
  }

  if (hotspots.length > 0) {
    actionPlan.push({
      order: actionPlan.length + 1,
      title: "Atacar hotspot principal",
      target: hotspots[0].file,
      expectedImpact:
        "Reducir complejidad y mejorar mantenibilidad."
    });
  }

  const highPriorityCount = insights.filter(
    (item) => item.priority === "HIGH"
  ).length;

  let priority = "LOW";
  let status = "STABLE";
  let summary =
    "El proyecto se mantiene estable y no presenta señales críticas inmediatas.";

  if (highPriorityCount >= 2) {
    priority = "HIGH";
    status = "ATTENTION_REQUIRED";
    summary =
      "El proyecto mantiene buen score general, pero existen riesgos importantes que requieren atención prioritaria.";
  } else if (highPriorityCount === 1) {
    priority = "MEDIUM";
    status = "WATCH";
    summary =
      "El proyecto está operativo, pero existe al menos un riesgo relevante que debe gestionarse.";
  }

  const topRecommendation =
    actionPlan[0]?.title ||
    "Mantener monitoreo continuo del proyecto.";

  return {
    status,
    priority,
    summary,
    topRecommendation,
    insights,
    actionPlan,
    estimatedFocusHours:
      priority === "HIGH"
        ? 8
        : priority === "MEDIUM"
        ? 4
        : 2,
    expectedOutcome:
      priority === "HIGH"
        ? "Reducir riesgo técnico, mejorar mantenibilidad y preparar mejor el proyecto para producción."
        : "Mantener estabilidad y continuar mejorando gradualmente."
  };
};