export const calculateTechnicalDebt = ({
  score = 0,
  hotspots = [],
  risk = {}
}) => {
  const items = [];

  hotspots.forEach((hotspot) => {
    let debtPoints = 0;
    const reasons = [];

    if (hotspot.lines > 300) {
      debtPoints += 30;
      reasons.push("archivo demasiado grande");
    }

    if (hotspot.functions > 10) {
      debtPoints += 25;
      reasons.push("demasiadas funciones");
    }

    if (hotspot.imports > 10) {
      debtPoints += 20;
      reasons.push("alto acoplamiento por imports");
    }

    if (hotspot.complexity > 0.05) {
      debtPoints += 25;
      reasons.push("complejidad elevada");
    }

    if (debtPoints > 0) {
      items.push({
        file: hotspot.file,
        debtPoints,
        level:
          debtPoints >= 70
            ? "high"
            : debtPoints >= 40
            ? "medium"
            : "low",
        reasons
      });
    }
  });

  const hotspotDebt = items.reduce(
    (sum, item) => sum + item.debtPoints,
    0
  );

  const scorePenalty =
    score < 40
      ? 40
      : score < 60
      ? 25
      : score < 80
      ? 10
      : 0;

  const riskPenalty =
    risk?.riskLevel === "critical"
      ? 30
      : risk?.riskLevel === "high"
      ? 20
      : risk?.riskLevel === "medium"
      ? 10
      : 0;

  const totalDebt = hotspotDebt + scorePenalty + riskPenalty;

  let level = "low";
  let summary = "El proyecto tiene baja deuda técnica.";

  if (totalDebt >= 120) {
    level = "critical";
    summary = "El proyecto presenta deuda técnica crítica.";
  } else if (totalDebt >= 80) {
    level = "high";
    summary = "El proyecto presenta deuda técnica alta.";
  } else if (totalDebt >= 40) {
    level = "medium";
    summary = "El proyecto tiene deuda técnica moderada.";
  }

  return {
    level,
    score: totalDebt,
    summary,
    totalItems: items.length,
    items: items.sort((a, b) => b.debtPoints - a.debtPoints)
  };
};