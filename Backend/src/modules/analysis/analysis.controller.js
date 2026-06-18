import prisma from "../../config/prisma.js";
import { runProjectAnalysis } from "./analysis.service.js";

/* =========================
   ANALYZE PROJECT CONTROLLER
========================= */
export const analyzeProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const organizationId = req.user?.organizationId || null;

    const analysisResult = await runProjectAnalysis(
      projectId,
      organizationId
    );

    return res.status(200).json({
      message: "Analysis completed",
      projectId,
      analysis: analysisResult,
    });

  } catch (error) {
    console.error("ANALYSIS CONTROLLER ERROR:", error);

    return res.status(500).json({
      message: "Error running project analysis",
      detail: error.message,
    });
  }
};

/* =========================
   GET PROJECT RUNS
========================= */
export const getProjectRuns = async (req, res) => {
  try {
    const { id } = req.params;

    const runs = await prisma.analysisRun.findMany({
      where: { projectId: id },
      include: { metrics: true },
      orderBy: { createdAt: "asc" },
    });

    return res.json({
      projectId: id,
      totalRuns: runs.length,
      runs,
    });

  } catch (error) {
    console.error("GET PROJECT RUNS ERROR:", error);

    return res.status(500).json({
      message: "Error getting project runs",
      detail: error.message,
    });
  }
};