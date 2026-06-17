export const detectProjectRisk = async (prisma, projectId) => {

  const commits = await prisma.commit.findMany({
    where: { projectId },
    orderBy: { date: "desc" },
    take: 10
  });

  if (commits.length === 0) {
    return { riskLevel: "unknown" };
  }

  const avg = commits.reduce((acc, c) => acc + c.score, 0) / commits.length;

  const bugCommits = commits.filter(c =>
    c.message.toLowerCase().includes("fix") ||
    c.message.toLowerCase().includes("bug")
  ).length;

  let riskLevel = "low";

  if (avg < 6 || bugCommits > 5) {
    riskLevel = "high";
  } else if (avg < 8) {
    riskLevel = "medium";
  }

  return {
    riskLevel,
    avgScore: Number(avg.toFixed(2)),
    bugCommits
  };
};