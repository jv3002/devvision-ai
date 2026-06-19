export const getDeveloperRanking = async (prisma, projectId) => {
  const commits = await prisma.commit.findMany({
    where: { projectId },
    orderBy: { date: "desc" }
  });

  if (!commits.length) {
    return [];
  }

  const devMap = {};

  for (const commit of commits) {
    const developer = commit.author || "unknown";
    const score = Number(commit.score || 0);
    const message = commit.message || "";

    if (!devMap[developer]) {
      devMap[developer] = {
        developer,
        totalCommits: 0,
        totalScore: 0,
        bugFixes: 0,
        riskyCommits: 0,
        lastActivity: commit.date
      };
    }

    devMap[developer].totalCommits++;
    devMap[developer].totalScore += score;

    if (
      message.toLowerCase().includes("fix") ||
      message.toLowerCase().includes("bug")
    ) {
      devMap[developer].bugFixes++;
    }

    if (score < 6) {
      devMap[developer].riskyCommits++;
    }

    if (commit.date > devMap[developer].lastActivity) {
      devMap[developer].lastActivity = commit.date;
    }
  }

  const ranking = Object.values(devMap).map((dev) => {
    const avgScore = Number(
      (dev.totalScore / dev.totalCommits).toFixed(2)
    );

    let qualityLevel = "high";

    if (avgScore < 6) {
      qualityLevel = "low";
    } else if (avgScore < 8) {
      qualityLevel = "medium";
    }

    return {
      developer: dev.developer,
      commits: dev.totalCommits,
      avgScore,
      qualityLevel,
      bugFixes: dev.bugFixes,
      riskyCommits: dev.riskyCommits,
      lastActivity: dev.lastActivity
    };
  });

  return ranking.sort((a, b) => {
    if (b.avgScore !== a.avgScore) {
      return b.avgScore - a.avgScore;
    }

    return b.commits - a.commits;
  });
};