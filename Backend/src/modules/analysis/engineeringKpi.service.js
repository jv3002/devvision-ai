export const generateEngineeringKpis = ({
  score = 0,
  technicalDebt = {},
  sprintHealth = {},
  qualityGate = {},
  releaseReadiness = {},
  smartAlerts = [],
  developerScores = []
}) => {
  const debtScore = technicalDebt?.score || 0;

  const codeHealth = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  const maintainability = Math.max(
    0,
    Math.min(100, 100 - Math.round(debtScore / 4))
  );

  const deliveryEfficiency = Math.max(
    0,
    Math.min(100, sprintHealth?.deliveryProbability || 0)
  );

  const technicalRisk = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (debtScore / 2) +
        (smartAlerts.length * 5) +
        (qualityGate?.passed ? 0 : 10)
      )
    )
  );

  const teamProductivity =
    developerScores.length > 0
      ? Math.round(
          developerScores.reduce(
            (acc, dev) => acc + (dev.averageScore || 0),
            0
          ) / developerScores.length
        )
      : 70;

  const releaseConfidence =
    releaseReadiness?.confidence || 0;

  const qualityGateScore =
    qualityGate?.totalChecks > 0
      ? Math.round(
          (qualityGate.passedChecks / qualityGate.totalChecks) * 100
        )
      : 0;

  const overallEngineeringMaturity = Math.round(
    (
      codeHealth +
      maintainability +
      deliveryEfficiency +
      teamProductivity +
      releaseConfidence +
      qualityGateScore
    ) / 6
  );

  return {
    codeHealth,
    maintainability,
    deliveryEfficiency,
    technicalRisk,
    teamProductivity,
    releaseConfidence,
    qualityGateScore,
    overallEngineeringMaturity
  };
};