import prisma from "../../config/prisma.js";
import analysisEngine from "./analysis.engine.js";
import { saveAnalysisResult } from "../../services/analysisPersistence.service.js";

export const runProjectAnalysis = async (projectId, organizationId = null) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const result = await analysisEngine.analyzeProject({
      projectId,
      projectPath: project.repoPath,
      language: "javascript",
    });

    const analysis = await saveAnalysisResult({
      organizationId,
      projectId,
      language: "javascript",
      result,
    });

    return analysis;

  } catch (error) {
    console.error("Error running analysis:", error);
    throw error;
  }
};