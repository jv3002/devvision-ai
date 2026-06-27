
export const generateArchitectureAdvisor = ({
  hotspots = [],
  dimensions = [],
  technicalDebt,
  qualityGate
}) => {
  const recommendations = [];

  const architectureDimension =
    dimensions.find(
      (dimension) => dimension.key === "architecture"
    ) || {};

  const architectureScore =
    architectureDimension.score || 0;

  if (architectureScore < 70) {
    recommendations.push({
      priority: "HIGH",
      title: "Mejorar arquitectura del proyecto",
      description:
        "La dimensión de arquitectura presenta una puntuación baja.",
      action:
        "Reducir acoplamiento entre módulos y mejorar separación de responsabilidades."
    });
  }

  hotspots
    .slice(0, 3)
    .forEach((hotspot) => {
      recommendations.push({
        priority: "MEDIUM",
        title: `Revisar ${hotspot.file}`,
        description:
          "Este archivo representa un hotspot importante.",
        action:
          "Evaluar división en módulos más pequeños y aplicar principios SOLID."
      });
    });

  if (technicalDebt?.level === "critical") {
    recommendations.push({
      priority: "HIGH",
      title: "Reducir deuda técnica",
      description:
        "La deuda técnica comienza a afectar la arquitectura.",
      action:
        "Resolver primero los hotspots con mayor impacto."
    });
  }

  return {
    architectureScore,
    qualityGate: qualityGate?.status,
    recommendations,
    summary:
      recommendations.length === 0
        ? "La arquitectura del proyecto es consistente."
        : "Se detectaron oportunidades importantes de mejora arquitectónica."
  };
};