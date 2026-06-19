export const generateRecommendations = ({
  score = 0,
  risk = {},
  prediction = {},
  hotspots = []
}) => {
  const recommendations = [];

  const riskLevel = risk?.riskLevel || "unknown";
  const trend = prediction?.trend || "stable";

  /* =========================
     SCORE-BASED RECOMMENDATIONS
  ========================= */

  if (score < 40) {
    recommendations.push({
      priority: "CRITICAL",
      type: "QUALITY_SCORE",
      title: "Atender deuda técnica crítica",
      description: "El score general del proyecto es muy bajo.",
      action: "Priorizar una revisión técnica completa antes de seguir agregando funcionalidades."
    });
  } else if (score < 60) {
    recommendations.push({
      priority: "HIGH",
      type: "QUALITY_SCORE",
      title: "Mejorar calidad estructural",
      description: "El proyecto presenta señales importantes de baja calidad técnica.",
      action: "Reducir complejidad, dividir módulos grandes y revisar arquitectura."
    });
  } else if (score < 80) {
    recommendations.push({
      priority: "MEDIUM",
      type: "QUALITY_SCORE",
      title: "Optimizar arquitectura",
      description: "El proyecto es funcional, pero tiene espacio claro de mejora.",
      action: "Revisar acoplamiento, imports y archivos con más responsabilidad."
    });
  }

  /* =========================
     RISK-BASED RECOMMENDATIONS
  ========================= */

  if (riskLevel === "critical") {
    recommendations.push({
      priority: "CRITICAL",
      type: "RISK",
      title: "Reducir riesgo técnico crítico",
      description: risk.reason || "El proyecto presenta riesgo técnico crítico.",
      action: "Resolver primero los módulos más complejos y con mayor impacto."
    });
  } else if (riskLevel === "high") {
    recommendations.push({
      priority: "HIGH",
      type: "RISK",
      title: "Reducir riesgo técnico",
      description: risk.reason || "El proyecto tiene señales de riesgo técnico.",
      action: "Priorizar hotspots y componentes de arquitectura débil."
    });
  }

  /* =========================
     TREND-BASED RECOMMENDATIONS
  ========================= */

  if (trend === "down" || prediction.prediction === "declining") {
    recommendations.push({
      priority: "HIGH",
      type: "TREND",
      title: "Investigar deterioro del proyecto",
      description: "La tendencia indica que el proyecto podría estar empeorando.",
      action: "Comparar los últimos análisis para identificar qué métricas bajaron."
    });
  }

  /* =========================
     HOTSPOT-BASED RECOMMENDATIONS
  ========================= */

  hotspots.slice(0, 3).forEach((hotspot) => {
    const suggestions = [];

    if (hotspot.lines > 300) {
      suggestions.push("dividir el archivo en módulos más pequeños");
    }

    if (hotspot.functions > 10) {
      suggestions.push("reducir la cantidad de funciones o separar responsabilidades");
    }

    if (hotspot.imports > 10) {
      suggestions.push("reducir dependencias e imports");
    }

    if (hotspot.complexity > 0.05) {
      suggestions.push("simplificar lógica y reducir complejidad");
    }

    recommendations.push({
      priority: hotspot.lines > 300 || hotspot.functions > 10 ? "HIGH" : "MEDIUM",
      type: "HOTSPOT",
      title: `Refactorizar ${hotspot.file}`,
      description: `${hotspot.file} tiene ${hotspot.lines} líneas, ${hotspot.functions} funciones y ${hotspot.imports} imports.`,
      action: suggestions.length
        ? `Se recomienda ${suggestions.join(", ")}.`
        : "Revisar este archivo para mejorar mantenibilidad."
    });
  });

  /* =========================
     POSITIVE CASE
  ========================= */

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "LOW",
      type: "MAINTENANCE",
      title: "Mantener buenas prácticas",
      description: "El proyecto se encuentra en buen estado técnico.",
      action: "Continuar monitoreando el score, riesgo y hotspots en próximos análisis."
    });
  }

  return recommendations;
};