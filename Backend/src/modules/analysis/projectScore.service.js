export const calculateProjectScore = async (prisma, projectId) => {

  const commits = await prisma.commit.findMany({
    where: { projectId },
    orderBy: { date: "desc" },
    take: 20 // últimos 20 commits
  });

  if (commits.length === 0) {
    return {
      score: 0,
      trend: "no-data",
      risk: "unknown"
    };
  }

  // 📊 promedio
  const avgScore = commits.reduce((acc, c) => acc + c.score, 0) / commits.length;

  // 📉 tendencia (últimos 5 vs anteriores)
  const recent = commits.slice(0, 5);
  const older = commits.slice(5, 10);

  const recentAvg = recent.reduce((acc, c) => acc + c.score, 0) / (recent.length || 1);
  const olderAvg = older.reduce((acc, c) => acc + c.score, 0) / (older.length || 1);

  let trend = "stable";

  if (recentAvg > olderAvg) trend = "improving";
  if (recentAvg < olderAvg) trend = "declining";

  // ⚠️ riesgo
  let risk = "low";

  if (avgScore < 6) risk = "high";
  else if (avgScore < 8) risk = "medium";

  return {
    score: Number(avgScore.toFixed(2)),
    trend,
    risk,
    totalCommits: commits.length
  };

};