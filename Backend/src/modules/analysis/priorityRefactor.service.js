export const generatePriorityRefactors = ({
  technicalDebt = {},
  hotspots = []
}) => {
  const debtItems = technicalDebt.items || [];

  if (!debtItems.length) {
    return [];
  }

  const refactors = debtItems.map((debtItem) => {
    const hotspot = hotspots.find(
      (h) => h.file === debtItem.file
    );

    const lines = hotspot?.lines || 0;
    const functions = hotspot?.functions || 0;
    const imports = hotspot?.imports || 0;
    const complexity = hotspot?.complexity || 0;

    let estimatedScoreGain = 0;

    if (debtItem.debtPoints >= 70) {
      estimatedScoreGain += 12;
    } else if (debtItem.debtPoints >= 40) {
      estimatedScoreGain += 8;
    } else {
      estimatedScoreGain += 4;
    }

    if (lines > 300) {
      estimatedScoreGain += 3;
    }

    if (functions > 10) {
      estimatedScoreGain += 3;
    }

    if (imports > 10) {
      estimatedScoreGain += 2;
    }

    if (complexity > 0.05) {
      estimatedScoreGain += 2;
    }

    const impact =
      estimatedScoreGain >= 12
        ? "HIGH"
        : estimatedScoreGain >= 7
        ? "MEDIUM"
        : "LOW";

    return {
      file: debtItem.file,
      impact,
      estimatedScoreGain,
      debtPoints: debtItem.debtPoints,
      debtLevel: debtItem.level,
      reasons: debtItem.reasons || [],
      action: buildActionMessage(debtItem.reasons || [])
    };
  });

  return refactors
    .sort((a, b) => {
      if (b.estimatedScoreGain !== a.estimatedScoreGain) {
        return b.estimatedScoreGain - a.estimatedScoreGain;
      }

      return b.debtPoints - a.debtPoints;
    })
    .map((item, index) => ({
      rank: index + 1,
      ...item
    }));
};

const buildActionMessage = (reasons = []) => {
  if (reasons.includes("archivo demasiado grande")) {
    return "Dividir el archivo en módulos más pequeños y separar responsabilidades.";
  }

  if (reasons.includes("demasiadas funciones")) {
    return "Separar funciones por responsabilidad y mover lógica a servicios dedicados.";
  }

  if (reasons.includes("alto acoplamiento por imports")) {
    return "Reducir dependencias directas y reorganizar imports.";
  }

  if (reasons.includes("complejidad elevada")) {
    return "Simplificar la lógica interna y reducir ramas condicionales.";
  }

  return "Revisar el archivo para mejorar mantenibilidad.";
};