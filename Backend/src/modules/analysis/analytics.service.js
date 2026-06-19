export const generateHistoricalAnalytics = (history = []) => {

  if (!history.length) {
    return {
      totalAnalyses: 0,
      completedAnalyses: 0,
      failedAnalyses: 0,
      firstScore: 0,
      latestScore: 0,
      bestScore: 0,
      worstScore: 0,
      improvement: 0
    };
  }

  const scores = history.map(h => h.score || 0);

  const completedAnalyses = history.filter(
    h => h.status === "COMPLETED"
  ).length;

  const failedAnalyses =
    history.length - completedAnalyses;

  const firstScore = scores[0];
  const latestScore = scores[scores.length - 1];

  return {
    totalAnalyses: history.length,
    completedAnalyses,
    failedAnalyses,
    firstScore,
    latestScore,
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    improvement: Number(
      (latestScore - firstScore).toFixed(2)
    )
  };
};