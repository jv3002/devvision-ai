export const generateInsights = (metricsHistory) => {
  if (!metricsHistory || metricsHistory.length < 2) {
    return ["Not enough data for insights"];
  }

  return ["✅ Project is stable"]; // puedes dejarlo simple por ahora
};

export const calculateHealthScore = (runs) => {

  if (!runs || runs.length < 2) {
    return {
      score: 50,
      status: "UNKNOWN",
    };
  }

  const latest = runs[runs.length - 1];
  const previous = runs[runs.length - 2];

  const getMetric = (run, name) =>
    run.metrics.find(m => m.name === name)?.value || 0;

  const locGrowth =
    getMetric(latest, "lines_of_code") -
    getMetric(previous, "lines_of_code");

  let score = 100;

  if (locGrowth > 10000) score -= 20;

  if (score < 0) score = 0;

  let status = "GOOD";
  if (score < 80) status = "WARNING";
  if (score < 50) status = "CRITICAL";

  return { score, status };
};