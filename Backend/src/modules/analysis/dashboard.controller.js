import { calculateProjectScore } from "./projectScore.service.js";
import { generateAlerts } from "./alert.service.js";
import prisma from "../../config/prisma.js";
import { getDeveloperRanking } from "./developerInsights.service.js";
import { detectProjectRisk } from "./riskAnalysis.service.js";
import { predictProjectFuture } from "./prediction.service.js";
import { generateRecommendations } from "./recommendation.service.js";

// 📊 Obtener dashboard de proyecto
export const getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 🔍 buscar proyecto
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found"
      });
    }

    // 📊 score
    const score = await calculateProjectScore(prisma, projectId);

    // 📈 historial de score
    const history = await prisma.projectScoreHistory.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" }
    });

    // 🧠 riesgo
    const risk = await detectProjectRisk(prisma, projectId);

    // 🧑‍💻 desarrolladores
    const developers = await getDeveloperRanking(prisma, projectId);

    // 📦 commits recientes
    const commits = await prisma.commit.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      take: 10
    });

    // 🚨 alertas
    const alerts = generateAlerts(score, risk);

    // 🔮 predicción
    const prediction = predictProjectFuture(history);

    // 💡 recomendaciones
    const recommendations = generateRecommendations({
      score,
      risk,
      prediction
    });

    return res.json({
      project: {
        id: project.id,
        name: project.name
      },
      score,
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