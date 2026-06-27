export const generateRoadmapPlanner = ({
  score = 0,
  priorityRefactors = [],
  advisor,
  qualityGate,
  releaseReadiness,
  businessImpact,
  sprintHealth
}) => {
  const roadmap = [];

  const sprint1 = priorityRefactors
    .filter((item) => item.rank <= 2)
    .map((item) => ({
      file: item.file,
      action: item.action,
      impact: item.impact,
      estimatedGain: item.estimatedScoreGain || 0
    }));

  const sprint2 = priorityRefactors
    .filter((item) => item.rank > 2 && item.rank <= 4)
    .map((item) => ({
      file: item.file,
      action: item.action,
      impact: item.impact,
      estimatedGain: item.estimatedScoreGain || 0
    }));

  const sprint3 = priorityRefactors
    .filter((item) => item.rank > 4)
    .map((item) => ({
      file: item.file,
      action: item.action,
      impact: item.impact,
      estimatedGain: item.estimatedScoreGain || 0
    }));

  roadmap.push({
    sprint: "Sprint 1",
    objective: "Eliminar deuda técnica crítica",
    estimatedGain: sprint1.reduce(
      (sum, item) => sum + item.estimatedGain,
      0
    ),
    tasks: sprint1
  });

  roadmap.push({
    sprint: "Sprint 2",
    objective: "Optimizar arquitectura",
    estimatedGain: sprint2.reduce(
      (sum, item) => sum + item.estimatedGain,
      0
    ),
    tasks: sprint2
  });

  roadmap.push({
    sprint: "Sprint 3",
    objective: "Preparar siguiente Release",
    estimatedGain: sprint3.reduce(
      (sum, item) => sum + item.estimatedGain,
      0
    ),
    tasks: sprint3
  });

  const totalEstimatedGain = roadmap.reduce(
    (sum, sprint) => sum + sprint.estimatedGain,
    0
  );

  return {
    currentPhase:
      qualityGate?.passed === false
        ? "STABILIZATION"
        : "OPTIMIZATION",

    overallPriority: advisor?.priority || "MEDIUM",

    estimatedDurationWeeks: roadmap.length * 2,

    expectedScore: Math.min(
      100,
      Math.round(score + totalEstimatedGain)
    ),

    releaseForecast:
      releaseReadiness?.status || "UNKNOWN",

    businessRisk:
      businessImpact?.businessRisk || "UNKNOWN",

    sprintHealth:
      sprintHealth?.health || "UNKNOWN",

    roadmap
  };
};