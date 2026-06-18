import { generateAlerts } from "./alert.service.js";
import prisma from "../../config/prisma.js";
import { getDeveloperRanking } from "./developerInsights.service.js";
import { detectProjectRisk } from "./riskAnalysis.service.js";
import { predictProjectFuture } from "./prediction.service.js";
import { generateRecommendations } from "./recommendation.service.js";

/* =========================
   PROJECT DASHBOARD
========================= */
export const getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found"
      });
    }

    const latestAnalysis = await prisma.analysisRun.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });

    const analysisResult = latestAnalysis?.result || null;

    const score = analysisResult?.overallScore ?? 0;
    const dimensions = analysisResult?.dimensions ?? [];
    const hotspots = analysisResult?.hotspots ?? [];
    const analysisStatus = analysisResult?.analysisStatus ?? "NO_ANALYSIS";
    const analysisMessage =
      analysisResult?.message || "No analysis has been executed yet.";

    const historyRuns = await prisma.analysisRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" }
    });

    const history = historyRuns.map((run) => ({
      id: run.id,
      createdAt: run.createdAt,
      score: run.result?.overallScore ?? 0,
      status: run.result?.analysisStatus ?? "UNKNOWN"
    }));

    const risk = await detectProjectRisk(prisma, projectId);
    const developers = await getDeveloperRanking(prisma, projectId);

    const commits = await prisma.commit.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      take: 10
    });

    const alerts = generateAlerts(score, risk);
    const prediction = predictProjectFuture(history);

    const recommendations = generateRecommendations({
      score,
      risk,
      prediction
    });

    return res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        repoUrl: project.repoUrl,
        repoPath: project.repoPath,
        createdAt: project.createdAt
      },
      latestAnalysis: latestAnalysis
        ? {
            id: latestAnalysis.id,
            createdAt: latestAnalysis.createdAt,
            status: analysisStatus,
            message: analysisMessage
          }
        : null,
      score,
      dimensions,
      hotspots,
      risk,
      developers,
      alerts,
      prediction,
      recommendations,
      commits,
      history
    });

  } catch (error) {
    console.error("🔥 DASHBOARD ERROR:", error);

    return res.status(500).json({
      error: "Error getting dashboard",
      detail: error.message
    });
  }
};