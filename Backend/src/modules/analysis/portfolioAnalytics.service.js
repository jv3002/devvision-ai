export const generatePortfolioAnalytics = ({
  projects = []
}) => {
  if (!projects.length) {
    return {
      totalProjects: 0,
      averageScore: 0,
      totalTechnicalDebt: 0,
      totalEstimatedCost: 0,
      riskyProjects: [],
      healthyProjects: [],
      companyHealth: "NO_DATA",
      bestProject: null,
      worstProject: null
    };
  }

  const normalizedProjects = projects.map((project) => {
    const score = project.score || 0;
    const technicalDebtScore =
      project.technicalDebt?.score || 0;
    const estimatedCost =
      project.businessImpact?.estimatedCostUSD || 0;

    return {
      id: project.id,
      name: project.name,
      score,
      technicalDebtScore,
      estimatedCost,
      riskLevel:
        project.risk?.riskLevel || "unknown",
      releaseStatus:
        project.releaseReadiness?.status || "unknown",
      qualityGateStatus:
        project.qualityGate?.status || "unknown"
    };
  });

  const totalProjects = normalizedProjects.length;

  const averageScore = Math.round(
    normalizedProjects.reduce(
      (sum, project) => sum + project.score,
      0
    ) / totalProjects
  );

  const totalTechnicalDebt =
    normalizedProjects.reduce(
      (sum, project) => sum + project.technicalDebtScore,
      0
    );

  const totalEstimatedCost =
    normalizedProjects.reduce(
      (sum, project) => sum + project.estimatedCost,
      0
    );

  const riskyProjects = normalizedProjects.filter((project) => {
    return (
      project.score < 70 ||
      project.riskLevel === "high" ||
      project.riskLevel === "critical" ||
      project.qualityGateStatus === "FAIL"
    );
  });

  const healthyProjects = normalizedProjects.filter((project) => {
    return (
      project.score >= 80 &&
      project.riskLevel === "low" &&
      project.qualityGateStatus === "PASS"
    );
  });

  const bestProject = [...normalizedProjects].sort(
    (a, b) => b.score - a.score
  )[0];

  const worstProject = [...normalizedProjects].sort(
    (a, b) => a.score - b.score
  )[0];

  let companyHealth = "HEALTHY";

  if (averageScore < 50 || riskyProjects.length > totalProjects / 2) {
    companyHealth = "CRITICAL";
  } else if (averageScore < 75 || riskyProjects.length > 0) {
    companyHealth = "WARNING";
  }

  return {
    totalProjects,
    averageScore,
    totalTechnicalDebt,
    totalEstimatedCost,
    riskyProjects,
    healthyProjects,
    companyHealth,
    bestProject,
    worstProject
  };
};