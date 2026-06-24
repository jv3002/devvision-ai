export const generateTeamAnalytics = ({
  developers = [],
  developerScores = [],
  commits = []
}) => {
  const totalDevelopers = developers.length;

  const totalCommits = commits.length;

  const topContributor =
    developerScores.length > 0
      ? developerScores.sort(
          (a, b) => (b.averageScore || 0) - (a.averageScore || 0)
        )[0]
      : null;

  const busFactor =
    totalDevelopers <= 1
      ? 1
      : Math.max(
          2,
          Math.floor(totalDevelopers * 0.3)
        );

  const knowledgeDistribution =
    totalDevelopers === 0
      ? 0
      : Math.min(
          100,
          Math.round((busFactor / totalDevelopers) * 100)
        );

  const collaborationScore =
    totalCommits === 0
      ? 50
      : Math.min(
          100,
          Math.round(
            (totalCommits / Math.max(totalDevelopers, 1)) * 10
          )
        );

  let teamRisk = "LOW";

  if (busFactor <= 1) {
    teamRisk = "HIGH";
  } else if (knowledgeDistribution < 50) {
    teamRisk = "MEDIUM";
  }

  return {
    totalDevelopers,
    totalCommits,
    busFactor,
    knowledgeDistribution,
    collaborationScore,
    teamRisk,
    topContributor: topContributor
      ? {
          name:
            topContributor.author ||
            topContributor.name ||
            "Unknown",
          score:
            topContributor.averageScore || 0
        }
      : null
  };
};