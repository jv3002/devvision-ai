export const predictProjectFuture = (history) => {

  if (!history || history.length < 3) {
    return {
      prediction: "not-enough-data",
      message: "No hay suficientes datos para predicción"
    };
  }

  const scores = history.map(h => h.score);

  const first = scores[0];
  const last = scores[scores.length - 1];

  const trend = last - first;

  if (trend > 1) {
    return {
      prediction: "improving",
      message: "El proyecto está mejorando"
    };
  }

  if (trend < -1) {
    return {
      prediction: "declining",
      message: "El proyecto podría deteriorarse"
    };
  }

  return {
    prediction: "stable",
    message: "El proyecto se mantiene estable"
  };
};