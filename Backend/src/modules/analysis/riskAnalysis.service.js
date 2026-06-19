export const detectProjectRisk = async (prisma, projectId) => {

  const latestAnalysis = await prisma.analysisRun.findFirst({
    where: {
      projectId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!latestAnalysis || !latestAnalysis.result) {
    return {
      riskLevel: "unknown",
      reason: "No analysis available"
    };
  }

  const score = latestAnalysis.result.overallScore || 0;
  const hotspots = latestAnalysis.result.hotspots || [];

  let riskLevel = "low";
  let reason = "Project looks healthy";

  if (score < 40) {
    riskLevel = "critical";
    reason = "Very low quality score";
  }
  else if (score < 60) {
    riskLevel = "high";
    reason = "Low quality score";
  }
  else if (score < 80) {
    riskLevel = "medium";
    reason = "Average quality score";
  }

  if (hotspots.length >= 10) {
    riskLevel = "high";
    reason = "Too many hotspots detected";
  }

  return {
    riskLevel,
    score,
    hotspots: hotspots.length,
    reason
  };
};