export const generateDeveloperTrends = (
  developers = []
) => {
  if (!developers.length) {
    return [];
  }

  return developers.map((dev) => {
    const commits = dev.commits || 0;
    const score = dev.score || 0;

    let trend = "stable";

    if (score >= 80) {
      trend = "up";
    } else if (score < 50) {
      trend = "down";
    }

    let riskLevel = "low";

    if (score < 40) {
      riskLevel = "high";
    } else if (score < 70) {
      riskLevel = "medium";
    }

    return {
      developer: dev.name,
      commits,
      score,
      trend,
      riskLevel
    };
  });
};