export const generateComparison = (history = []) => {

  if (history.length < 2) {
    return {
      hasComparison: false,
      message: "No hay suficientes análisis para comparar."
    };
  }

  const current = history[history.length - 1];
  const previous = history[history.length - 2];

  const difference = Number(
    (current.score - previous.score).toFixed(2)
  );

  let trend = "stable";

  if (difference > 0) {
    trend = "improving";
  } else if (difference < 0) {
    trend = "declining";
  }

  return {
    hasComparison: true,
    currentScore: current.score,
    previousScore: previous.score,
    difference,
    trend
  };
};