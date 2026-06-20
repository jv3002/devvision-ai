export const generateDimensionTrends = (analysisRuns = []) => {
  if (!analysisRuns || analysisRuns.length < 2) {
    return [];
  }

  const currentRun = analysisRuns[analysisRuns.length - 1];
  const previousRun = analysisRuns[analysisRuns.length - 2];

  const currentDimensions = currentRun.result?.dimensions || [];
  const previousDimensions = previousRun.result?.dimensions || [];

  return currentDimensions.map((currentDimension) => {
    const previousDimension = previousDimensions.find(
      (dimension) => dimension.key === currentDimension.key
    );

    const currentScore = currentDimension.score || 0;
    const previousScore = previousDimension?.score || 0;

    const difference = Number(
      (currentScore - previousScore).toFixed(2)
    );

    let trend = "stable";

    if (difference > 0) {
      trend = "improving";
    } else if (difference < 0) {
      trend = "declining";
    }

    return {
      key: currentDimension.key,
      name: currentDimension.name,
      currentScore,
      previousScore,
      difference,
      trend
    };
  });
};