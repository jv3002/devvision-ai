export const generateProjectActions = (metrics) => {

  const issues = [];

  /* =========================
     DETECCIÓN DE PROBLEMAS
  ========================= */

  if (metrics.totalFiles > 100) {
    issues.push({
      type: "TOO_MANY_FILES",
      impact: "MEDIUM",
      message: "Project has too many files"
    });
  }

  if (metrics.avgLinesPerFile > 300) {
    issues.push({
      type: "LARGE_FILES",
      impact: "HIGH",
      message: "Files are too large"
    });
  }

  if (metrics.complexity > 50) {
    issues.push({
      type: "HIGH_COMPLEXITY",
      impact: "HIGH",
      message: "Code complexity is too high"
    });
  }

  if (metrics.testFiles === 0) {
    issues.push({
      type: "NO_TESTS",
      impact: "HIGH",
      message: "No tests found"
    });
  }

  /* =========================
     PRIORIZACIÓN
  ========================= */

  const priorityMap = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1
  };

  issues.sort((a, b) => priorityMap[b.impact] - priorityMap[a.impact]);

  /* =========================
     GENERAR ACCIONES
  ========================= */

  const actions = issues.map(issue => {

    switch (issue.type) {

      case "HIGH_COMPLEXITY":
        return {
          title: "Refactor complex code",
          description: "Split large functions into smaller ones",
          impact: issue.impact
        };

      case "LARGE_FILES":
        return {
          title: "Reduce file size",
          description: "Break large files into modules",
          impact: issue.impact
        };

      case "NO_TESTS":
        return {
          title: "Add tests",
          description: "Create unit tests for critical logic",
          impact: issue.impact
        };

      case "TOO_MANY_FILES":
        return {
          title: "Clean project structure",
          description: "Remove unused files or group modules",
          impact: issue.impact
        };

      default:
        return {
          title: "General improvement",
          description: issue.message,
          impact: issue.impact
        };

    }

  });

  return actions;

};