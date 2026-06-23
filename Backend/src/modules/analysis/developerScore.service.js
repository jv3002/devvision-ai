export const generateDeveloperScores = (commits = []) => {
  if (!commits.length) {
    return [];
  }

  const developers = {};

  commits.forEach((commit) => {
    const author = commit.author || "Unknown";

    if (!developers[author]) {
      developers[author] = {
        developer: author,
        commits: 0,
        totalScore: 0
      };
    }

    developers[author].commits += 1;
    developers[author].totalScore += commit.score || 0;
  });

  return Object.values(developers)
    .map((dev) => ({
      ...dev,
      averageScore:
        dev.commits === 0
          ? 0
          : Number(
              (dev.totalScore / dev.commits).toFixed(2)
            )
    }))
    .sort((a, b) => {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }

      return b.commits - a.commits;
    });
};