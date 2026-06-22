export const generateRefactorPlan = ({
  priorityRefactors = []
}) => {

  if (!priorityRefactors.length) {
    return [];
  }

  return priorityRefactors.map((refactor) => {

    const plan = buildPlan(refactor);

    return {
      file: refactor.file,
      impact: refactor.impact,
      estimatedScoreGain: refactor.estimatedScoreGain,
      currentDebt: refactor.debtLevel,
      suggestedModules: plan.modules,
      estimatedComplexityReduction:
        plan.estimatedComplexityReduction,
      explanation: plan.explanation
    };
  });
};

function buildPlan(refactor) {

  const file = refactor.file || "";

  if (file.includes("projects.controller")) {
    return {
      suggestedModules: [
        "projects.controller.js",
        "projects.analysis.controller.js",
        "projects.metrics.controller.js",
        "projects.actions.controller.js"
      ],
      estimatedComplexityReduction: 35,
      explanation:
        "Separar endpoints de análisis, métricas y acciones en controladores independientes."
    };
  }

  if (file.includes("server.js")) {
    return {
      suggestedModules: [
        "server.js",
        "routes/index.js",
        "config/socket.js",
        "config/middleware.js"
      ],
      estimatedComplexityReduction: 25,
      explanation:
        "Separar configuración del servidor, rutas y middlewares."
    };
  }

  if (file.includes("git.service")) {
    return {
      suggestedModules: [
        "git.service.js",
        "gitClone.service.js",
        "gitRepository.service.js"
      ],
      estimatedComplexityReduction: 20,
      explanation:
        "Separar operaciones Git por responsabilidad."
    };
  }

  return {
    suggestedModules: [
      file
    ],
    estimatedComplexityReduction: 10,
    explanation:
      "Archivo candidato a simplificación y división futura."
  };
}