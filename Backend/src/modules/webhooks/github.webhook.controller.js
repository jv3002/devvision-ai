import prisma from "../../config/prisma.js";
import { analyzeProject } from "../analysis/codeAnalyzer.service.js";
import path from "path";
import { calculateProjectScore } from "../analysis/projectScore.service.js";
import fs from "fs";

export const githubWebhook = async (req, res) => {
  try {

    const payload = req.body;

    const repoUrl = payload.repository?.clone_url?.trim().toLowerCase();

    if (!repoUrl) {
      return res.status(200).json({ message: "No repository in payload" });
    }

    // 🔍 buscar proyecto
    const project = await prisma.project.findFirst({
      where: {
        repoUrl: {
          equals: repoUrl,
          mode: "insensitive"
        }
      }
    });

    if (!project) {
      return res.status(200).json({
        message: "Project not registered"
      });
    }

    // 🔥 PROCESAR COMMITS (CLAVE)
    const commits = payload.commits || [];

    for (const commit of commits) {

      const message = commit.message;
      const author = commit.author?.name || "unknown";
      const date = new Date(commit.timestamp);

      let score = 10;

      if (message.toLowerCase().includes("fix")) score -= 1;
      if (message.toLowerCase().includes("bug")) score -= 2;
      if (message.toLowerCase().includes("refactor")) score += 1;

      await prisma.commit.create({
        data: {
          message,
          author,
          date,
          score,
          projectId: project.id
        }
      });

    }

    // 📂 construir ruta correctamente
    const repoPath = project.repoPath
      ? (path.isAbsolute(project.repoPath)
          ? project.repoPath
          : path.join(process.cwd(), project.repoPath))
      : null;

    // ⚠️ validar existencia (SIN romper flujo)
    if (!repoPath || !fs.existsSync(repoPath)) {
      console.log("⚠️ Repo no existe, saltando análisis:", repoPath);

      const projectScore = await calculateProjectScore(prisma, project.id);

      return res.json({
        message: "Webhook processed (sin análisis de código)",
        commitsProcessed: commits.length,
        score: projectScore
      });
    }

    // 🔍 análisis de código
    const metrics = analyzeProject(repoPath);

    // 🧹 limpiar métricas anteriores
    await prisma.metric.deleteMany({
      where: { projectId: project.id }
    });

    // 💾 guardar métricas
    const savedMetrics = await Promise.all(
      Object.entries(metrics).map(([name, value]) => {
        return prisma.metric.create({
          data: {
            name,
            value,
            projectId: project.id
          }
        });
      })
    );

    // 📊 calcular score
    const projectScore = await calculateProjectScore(prisma, project.id);

    console.log("📊 PROJECT SCORE:", projectScore);

    return res.json({
      message: "Webhook processed",
      commitsProcessed: commits.length,
      metrics: savedMetrics,
      score: projectScore
    });

  } catch (error) {

    console.error("🔥 WEBHOOK ERROR:", error);

    return res.status(500).json({
      message: error.message
    });

  }
};
