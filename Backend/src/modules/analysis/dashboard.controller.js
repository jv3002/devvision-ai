import { generateBusinessImpact } from "./businessImpact.service.js";
import { generateReleaseReadiness } from "./releaseReadiness.service.js";
import { generateSprintHealth } from "./sprintHealth.service.js";
import { generateSmartAlerts } from "./smartAlerts.service.js";
import { generateRefactorRoadmap } from "./refactorRoadmap.service.js";
import { generateRefactorPlan } from "./refactorPlanner.service.js";
import { generatePriorityRefactors } from "./priorityRefactor.service.js";
import { generateDeveloperScores } from "./developerScore.service.js";
import { generateDeveloperTrends } from "./developerTrend.service.js";
import { generateComparison } from "./comparison.service.js";
import { generateDimensionTrends } from "./dimensionTrend.service.js";
import { calculateTechnicalDebt } from "./technicalDebt.service.js";
import { generateAlerts } from "./alert.service.js";
import prisma from "../../config/prisma.js";
import { getDeveloperRanking } from "./developerInsights.service.js";
import { detectProjectRisk } from "./riskAnalysis.service.js";
import { predictProjectFuture } from "./prediction.service.js";
import { generateRecommendations } from "./recommendation.service.js";
import { generateHistoricalAnalytics } from "./analytics.service.js";

const generateExecutiveSummary = ({
  score,
  risk,
  prediction,
  hotspots,
  analysisStatus
}) => {
  if (analysisStatus !== "COMPLETED") {
    return {
      healthStatus: "no-analysis",
      mainMessage: "El proyecto aún no tiene un análisis técnico completo.",
      priority: "run-analysis",
      topAction: "Ejecutar análisis del repositorio."
    };
  }

  const riskLevel = risk?.riskLevel || "unknown";
  const trend = prediction?.trend || "stable";
  const hotspotCount = hotspots?.length || 0;

  let healthStatus = "healthy";
  let priority = "maintain";
  let mainMessage = "El proyecto se encuentra en buen estado técnico.";
  let topAction = "Mantener buenas prácticas y monitorear próximos análisis.";

  if (score < 40 || riskLevel === "critical") {
    healthStatus = "critical";
    priority = "urgent-refactor";
    mainMessage = "El proyecto presenta riesgo técnico crítico.";
    topAction = "Priorizar refactorización urgente de los módulos más problemáticos.";
  } else if (score < 60 || riskLevel === "high") {
    healthStatus = "at-risk";
    priority = "reduce-risk";
    mainMessage = "El proyecto tiene señales importantes de deuda técnica.";
    topAction = "Reducir complejidad y revisar los hotspots principales.";
  } else if (score < 80 || riskLevel === "medium") {
    healthStatus = "watch";
    priority = "improve";
    mainMessage = "El proyecto es funcional, pero tiene áreas técnicas que deben mejorar.";
    topAction = "Mejorar arquitectura, acoplamiento y archivos con mayor complejidad.";
  }

  if (trend === "up" && healthStatus === "healthy") {
    mainMessage = "El proyecto está saludable y muestra una tendencia positiva.";
  }

  if (trend === "down") {
    priority = "investigate-trend";
    mainMessage = "El proyecto muestra una tendencia negativa que debe investigarse.";
    topAction = "Comparar los últimos análisis y detectar qué métricas empeoraron.";
  }

  if (hotspotCount >= 10 && healthStatus !== "critical") {
    healthStatus = "at-risk";
    priority = "reduce-hotspots";
    mainMessage = "El proyecto tiene demasiados hotspots técnicos.";
    topAction = "Priorizar la refactorización de los archivos con mayor impacto.";
  }

  return {
    healthStatus,
    mainMessage,
    priority,
    topAction,
    score,
    riskLevel,
    trend,
    hotspotCount
  };
};

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

    const analytics = generateHistoricalAnalytics(history);
    const comparison = generateComparison(history);
    const dimensionTrends = generateDimensionTrends(historyRuns);

    const risk = await detectProjectRisk(prisma, projectId);

    const technicalDebt = calculateTechnicalDebt({
      score,
      hotspots,
      risk
    });

    const priorityRefactors = generatePriorityRefactors({
      technicalDebt,
      hotspots
    });

    const refactorPlan = generateRefactorPlan({
      priorityRefactors
    });

    const refactorRoadmap = generateRefactorRoadmap({
      priorityRefactors
    });

    const developers = await getDeveloperRanking(prisma, projectId);

    const commits = await prisma.commit.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      take: 10
    });

    const developerScores = generateDeveloperScores(commits);
    const developerTrends = generateDeveloperTrends(developerScores);

    const prediction = predictProjectFuture(history);

    const sprintHealth = generateSprintHealth({
      score,
      technicalDebt,
      prediction,
      commits
    });

    const alerts = generateAlerts(score, risk);

    const smartAlerts = generateSmartAlerts({
      history,
      technicalDebt,
      risk,
      prediction,
      developerScores
    });
    const businessImpact = generateBusinessImpact({
      technicalDebt,
      hotspots
    });

    const releaseReadiness = generateReleaseReadiness({
      score,
      risk,
      technicalDebt,
      smartAlerts,
      hotspots,
      prediction
    });

    const recommendations = generateRecommendations({
      score,
      risk,
      prediction,
      hotspots
    });

    const executiveSummary = generateExecutiveSummary({
      score,
      risk,
      prediction,
      hotspots,
      analysisStatus
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
      executiveSummary,
      analytics,
      comparison,
      dimensionTrends,
      technicalDebt,
      priorityRefactors,
      refactorPlan,
      refactorRoadmap,
      score,
      dimensions,
      hotspots,
      risk,
      developers,
      developerScores,
      developerTrends,
      sprintHealth,
      alerts,
      smartAlerts,
      businessImpact,
      releaseReadiness,
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