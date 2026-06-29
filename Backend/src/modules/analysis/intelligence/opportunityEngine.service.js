const calculateOpportunityScore = ({
  estimatedScoreGain,
  estimatedHours,
  riskReduction
}) => {
  const gain = estimatedScoreGain * 4;
  const hours = Math.max(estimatedHours, 1);
  const risk = riskReduction * 2;

  return Math.round((gain + risk) / hours);
};

export const generateOpportunityEngine = ({
  priorityRefactors = [],
  businessImpact = {},
  decisionEngine = {},
  technicalDebt = {},
  roadmapPlanner = {}
}) => {

  const opportunities = priorityRefactors.map((refactor) => {

    const estimatedHours =
      refactor.impact === "HIGH"
        ? 8
        : refactor.impact === "MEDIUM"
        ? 6
        : 4;

    const estimatedScoreGain =
      refactor.estimatedScoreGain || 5;

    const riskReduction =
      Math.round((estimatedScoreGain / 20) * 100);

    const opportunityScore =
      calculateOpportunityScore({
        estimatedScoreGain,
        estimatedHours,
        riskReduction
      });

    return {
      file: refactor.file,
      priority: refactor.impact,
      estimatedHours,
      estimatedScoreGain,
      riskReduction,
      opportunityScore,
      roi:
        opportunityScore >= 12
          ? "VERY_HIGH"
          : opportunityScore >= 8
          ? "HIGH"
          : opportunityScore >= 5
          ? "MEDIUM"
          : "LOW",
      businessValue:
        estimatedScoreGain >= 10
          ? "HIGH"
          : "MEDIUM"
    };

  });

  opportunities.sort(
    (a, b) =>
      b.opportunityScore -
      a.opportunityScore
  );

  return {

    bestOpportunity:
      opportunities[0] || null,

    totalOpportunities:
      opportunities.length,

    estimatedTechnicalSavings:

      businessImpact.estimatedCostUSD || 0,

    roadmapAlignment:

      roadmapPlanner.currentPhase ||

      "UNKNOWN",

    executivePriority:

      decisionEngine.topDecision?.title ||

      "No decision",

    technicalDebt:

      technicalDebt.level ||

      "unknown",

    opportunities

  };

};