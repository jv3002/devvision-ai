export const generateQualityGate = ({
  score = 0,
  risk = {},
  technicalDebt = {},
  prediction = {},
  releaseReadiness = {}
}) => {
  const checks = [];

  const scoreCheck = {
    key: "minimum_score",
    name: "Score mínimo",
    passed: score >= 75,
    expected: ">= 75",
    current: score
  };

  checks.push(scoreCheck);

  const riskCheck = {
    key: "acceptable_risk",
    name: "Riesgo aceptable",
    passed:
      risk.riskLevel === "low" ||
      risk.riskLevel === "medium",
    expected: "low o medium",
    current: risk.riskLevel || "unknown"
  };

  checks.push(riskCheck);

  const debtCheck = {
    key: "technical_debt",
    name: "Deuda técnica controlada",
    passed:
      technicalDebt.level !== "critical",
    expected: "no critical",
    current: technicalDebt.level || "unknown"
  };

  checks.push(debtCheck);

  const trendCheck = {
    key: "positive_trend",
    name: "Tendencia no negativa",
    passed:
      prediction.trend !== "down",
    expected: "stable o up",
    current: prediction.trend || "unknown"
  };

  checks.push(trendCheck);

  const releaseCheck = {
    key: "release_readiness",
    name: "Preparación de release",
    passed:
      releaseReadiness.status === "READY" ||
      releaseReadiness.status === "CAUTION",
    expected: "READY o CAUTION",
    current: releaseReadiness.status || "unknown"
  };

  checks.push(releaseCheck);

  const failedChecks = checks.filter(
    (check) => !check.passed
  );

  const status =
    failedChecks.length === 0
      ? "PASS"
      : "FAIL";

  const recommendation =
    status === "PASS"
      ? "El proyecto cumple los estándares mínimos de calidad."
      : "El proyecto no cumple todos los estándares. Revisar los checks fallidos antes de producción.";

  return {
    status,
    passed: status === "PASS",
    totalChecks: checks.length,
    passedChecks: checks.length - failedChecks.length,
    failedChecks: failedChecks.length,
    checks,
    recommendation
  };
};