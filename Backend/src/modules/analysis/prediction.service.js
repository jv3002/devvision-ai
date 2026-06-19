export const predictProjectFuture = (history = []) => {

  if (!history || history.length < 2) {
    return {
      prediction: "not-enough-data",
      trend: "stable",
      change: 0,
      message: "No hay suficientes datos para generar una predicción."
    };
  }

  const scores = history
    .map(item => {

      if (typeof item.score === "number") {
        return item.score;
      }

      if (item.result?.overallScore !== undefined) {
        return item.result.overallScore;
      }

      return null;

    })
    .filter(score => score !== null);

  if (scores.length < 2) {
    return {
      prediction: "not-enough-data",
      trend: "stable",
      change: 0,
      message: "No hay suficientes análisis válidos."
    };
  }

  const first = scores[0];
  const last = scores[scores.length - 1];

  const change = Number((last - first).toFixed(2));

  let prediction = "stable";
  let trend = "stable";
  let message = "El proyecto se mantiene estable.";

  if (change > 2) {
    prediction = "improving";
    trend = "up";
    message = "El proyecto muestra una tendencia positiva.";
  }

  if (change < -2) {
    prediction = "declining";
    trend = "down";
    message = "El proyecto muestra señales de deterioro.";
  }

  return {
    prediction,
    trend,
    change,
    firstScore: first,
    latestScore: last,
    message
  };
};