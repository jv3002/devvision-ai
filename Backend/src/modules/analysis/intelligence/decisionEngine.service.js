const addDecision = ({
  decisions,
  priority = "MEDIUM",
  type = "GENERAL",
  title,
  reason,
  action,
  expectedImpact,
  estimatedEffortHours = 4,
  businessValue = "MEDIUM"
}) => {
  decisions.push({
    priority,
    type,
    title,
    reason,
    action,
    expectedImpact,
    estimatedEffortHours,
    businessValue
  });
};

export const generateDecisionEngine = ({
  advisor,
  roadmapPlanner,
  architectureAdvisor,
  technicalDebt,
  qualityGate,
  releaseReadiness,
  businessImpact,
  priorityRefactors = [],
  smartAlerts = []
}) => {
  const decisions = [];

  if (technicalDebt?.level === "critical") {
    addDecision({
      decisions,
      priority: "HIGH",
      type: "TECHNICAL_DEBT",
      title: "Priorizar reducción de deuda técnica crítica",
      reason:
        "La deuda técnica crítica puede afectar mantenibilidad, velocidad de desarrollo y estabilidad futura.",
      action:
        priorityRefactors?.[0]?.action ||
        "Refactorizar los módulos con mayor deuda técnica.",
      expectedImpact:
        "Reducir riesgo técnico, mejorar mantenibilidad y preparar el proyecto para escalar.",
      estimatedEffortHours: advisor?.estimatedFocusHours || 8,
      businessValue: "HIGH"
    });
  }

  if (qualityGate?.status === "FAIL") {
    addDecision({
      decisions,
      priority: "HIGH",
      type: "QUALITY_GATE",
      title: "No avanzar a producción sin revisar Quality Gate",
      reason:
        "El proyecto no cumple todos los criterios mínimos definidos para una entrega segura.",
      action:
        "Resolver primero los checks fallidos del Quality Gate.",
      expectedImpact:
        "Reducir riesgo de defectos, incidentes y retrabajo después del despliegue.",
      estimatedEffortHours: 6,
      businessValue: "HIGH"
    });
  }

  if (releaseReadiness?.status === "CAUTION") {
    addDecision({
      decisions,
      priority: "MEDIUM",
      type: "RELEASE",
      title: "Liberar solo con precaución",
      reason:
        "El proyecto puede liberarse, pero existen bloqueadores y riesgos técnicos que deben evaluarse.",
      action:
        releaseReadiness.recommendation ||
        "Revisar bloqueadores antes del despliegue.",
      expectedImpact:
        "Aumentar confianza del release y reducir probabilidad de incidentes.",
      estimatedEffortHours: 4,
      businessValue: "MEDIUM"
    });
  }

  if (businessImpact?.businessRisk === "HIGH") {
    addDecision({
      decisions,
      priority: "HIGH",
      type: "BUSINESS_IMPACT",
      title: "Reducir riesgo económico de la deuda técnica",
      reason:
        businessImpact.summary ||
        "El impacto económico estimado de la deuda técnica es alto.",
      action:
        "Atacar primero los refactors con mayor impacto técnico y económico.",
      expectedImpact:
        `Reducir el costo estimado actual de USD ${businessImpact.estimatedCostUSD || 0}.`,
      estimatedEffortHours: 8,
      businessValue: "HIGH"
    });
  }

  if (architectureAdvisor?.recommendations?.length > 0) {
    addDecision({
      decisions,
      priority: "MEDIUM",
      type: "ARCHITECTURE",
      title: "Ejecutar mejora arquitectónica prioritaria",
      reason:
        architectureAdvisor.summary ||
        "Se detectaron oportunidades de mejora arquitectónica.",
      action:
        architectureAdvisor.recommendations?.[0]?.action ||
        "Separar responsabilidades y reducir acoplamiento.",
      expectedImpact:
        "Mejorar escalabilidad, mantenibilidad y claridad estructural.",
      estimatedEffortHours: 6,
      businessValue: "MEDIUM"
    });
  }

  if (smartAlerts?.some((alert) => alert.severity === "HIGH")) {
    addDecision({
      decisions,
      priority: "HIGH",
      type: "SMART_ALERT",
      title: "Resolver alertas inteligentes de alta severidad",
      reason:
        "Existen alertas automáticas que indican riesgos técnicos relevantes.",
      action:
        smartAlerts.find((alert) => alert.severity === "HIGH")?.action ||
        "Resolver las alertas inteligentes principales.",
      expectedImpact:
        "Reducir riesgos detectados automáticamente por DevVision.",
      estimatedEffortHours: 4,
      businessValue: "HIGH"
    });
  }

  if (roadmapPlanner?.roadmap?.length > 0) {
    addDecision({
      decisions,
      priority: "MEDIUM",
      type: "ROADMAP",
      title: "Ejecutar roadmap técnico recomendado",
      reason:
        `El roadmap actual está en fase ${roadmapPlanner.currentPhase}.`,
      action:
        `Comenzar con ${roadmapPlanner.roadmap[0]?.sprint}: ${roadmapPlanner.roadmap[0]?.objective}.`,
      expectedImpact:
        `Al finalizar el plan, el score esperado podría llegar a ${roadmapPlanner.expectedScore}.`,
      estimatedEffortHours: roadmapPlanner.estimatedDurationWeeks * 8,
      businessValue: "HIGH"
    });
  }

  const priorityOrder = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
  };

  const sortedDecisions = decisions.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const topDecision = sortedDecisions[0] || null;

  return {
    decisionStatus:
      sortedDecisions.some((decision) => decision.priority === "HIGH")
        ? "ACTION_REQUIRED"
        : "STABLE",

    topDecision,

    totalDecisions: sortedDecisions.length,

    highPriorityDecisions: sortedDecisions.filter(
      (decision) => decision.priority === "HIGH"
    ).length,

    estimatedTotalEffortHours: sortedDecisions.reduce(
      (sum, decision) => sum + decision.estimatedEffortHours,
      0
    ),

    decisions: sortedDecisions
  };
};