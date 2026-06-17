export const getDeveloperRanking = async (prisma, projectId) => {

  const commits = await prisma.commit.findMany({
    where: { projectId }
  });

  const devMap = {};

  for (const commit of commits) {
    const dev = commit.author || "unknown";

    if (!devMap[dev]) {
      devMap[dev] = {
        totalCommits: 0,
        totalScore: 0
      };
    }

    devMap[dev].totalCommits++;
    devMap[dev].totalScore += commit.score;
  }

  const ranking = Object.entries(devMap).map(([dev, data]) => ({
    developer: dev,
    commits: data.totalCommits,
    avgScore: Number((data.totalScore / data.totalCommits).toFixed(2))
  }));

  return ranking.sort((a, b) => b.avgScore - a.avgScore);
};