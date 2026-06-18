export const calculateProjectScore = async (prisma, projectId) => {
  const analysisRuns = await prisma.analysisRun.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  if (analysisRuns.length === 0) {
    return {
      score: 0,
      trend: "no-data",
      risk: "unknown",
      totalAnalyses: 0
    };
  }

  const latest = analysisRuns[0];
  const previous = analysisRuns[1];

  const latestScore = latest.result?.overallScore ?? 0;
  const previousScore = previous?.result?.overallScore ?? null;

  let trend = "stable";

  if (previousScore !== null) {
    if (latestScore > previousScore) trend = "improving";
    if (latestScore < previousScore) trend = "declining";
  }

  let risk = "low";

  if (latestScore < 40) {
    risk = "critical";
  } else if (latestScore < 60) {
    risk = "high";
  } else if (latestScore < 80) {
    risk = "medium";
  }

  return {
    score: Number(latestScore.toFixed(2)),
    trend,
    risk,
    totalAnalyses: analysisRuns.length,
    latestAnalysisId: latest.id,
    latestAnalysisDate: latest.createdAt
  };
};