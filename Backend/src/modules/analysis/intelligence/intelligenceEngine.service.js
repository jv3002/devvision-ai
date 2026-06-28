export const generateIntelligenceEngine = ({
  advisor,
  roadmapPlanner,
  architectureAdvisor,
  technicalDebt,
  qualityGate,
  releaseReadiness,
  businessImpact,
  engineeringMaturity,
  prediction
}) => {
  const signals = [];
  const priorities = [];

  if (advisor?.priority === "HIGH") {
    signals.push({
      type: "ADVISOR",
      severity: "HIGH",
      message: advisor.summary
    });

    priorities.push(advisor.topRecommendation);
  }

  if (technicalDebt?.level === "critical") {
    signals.push({
      type: "TECHNICAL_DEBT",
      severity: "HIGH",
      message: technicalDebt.summary
    });

    priorities.push("Reducir deuda técnica crítica");
  }

  if (qualityGate?.status === "FAIL") {
    signals.push({
      type: "QUALITY_GATE",
      severity: "HIGH",
      message: "El proyecto no cumple la puerta de calidad."
    });

    priorities.push("Resolver checks fallidos del Quality Gate");
  }

  if (releaseReadiness?.status === "CAUTION") {
    signals.push({
      type: "RELEASE_READINESS",
      severity: "MEDIUM",
      message: releaseReadiness.recommendation
    });
  }

  if (businessImpact?.businessRisk === "HIGH") {
    signals.push({
      type: "BUSINESS_IMPACT",
      severity: "HIGH",
      message: businessImpact.summary
    });

    priorities.push("Reducir impacto económico de la deuda técnica");
  }

  if (architectureAdvisor?.recommendations?.length > 0) {
    signals.push({
      type: "ARCHITECTURE",
      severity: "MEDIUM",
      message: architectureAdvisor.summary
    });

    priorities.push("Mejorar arquitectura del proyecto");
  }

  const uniquePriorities = [...new Set(priorities)].slice(0, 5);

  const highSignals = signals.filter(
    (signal) => signal.severity === "HIGH"
  ).length;

  const mediumSignals = signals.filter(
    (signal) => signal.severity === "MEDIUM"
  ).length;

  let intelligenceLevel = "STABLE";
  let executiveConclusion =
    "El proyecto se encuentra estable y no requiere acciones urgentes.";

  if (highSignals >= 3) {
    intelligenceLevel = "CRITICAL_ATTENTION";
    executiveConclusion =
      "El proyecto presenta múltiples señales críticas. Se recomienda actuar antes de avanzar con nuevos releases.";
  } else if (highSignals >= 1 || mediumSignals >= 2) {
    intelligenceLevel = "ACTION_REQUIRED";
    executiveConclusion =
      "El proyecto está operativo, pero requiere acciones concretas para reducir riesgos técnicos y de negocio.";
  }

  return {
    intelligenceLevel,
    executiveConclusion,
    strategicPriority:
      uniquePriorities[0] || "Mantener monitoreo continuo",
    priorities: uniquePriorities,
    signals,
    roadmapSummary: roadmapPlanner
      ? {
          phase: roadmapPlanner.currentPhase,
          estimatedDurationWeeks: roadmapPlanner.estimatedDurationWeeks,
          expectedScore: roadmapPlanner.expectedScore,
          releaseForecast: roadmapPlanner.releaseForecast
        }
      : null,
    maturitySummary: engineeringMaturity
      ? {
          level: engineeringMaturity.level,
          name: engineeringMaturity.name,
          score: engineeringMaturity.score,
          nextStep: engineeringMaturity.nextStep
        }
      : null,
    predictionSummary: prediction
      ? {
          trend: prediction.trend,
          message: prediction.message
        }
      : null
  };
};