import { PrismaClient } from "@prisma/client";
import analysisEngine from "./analysis.engine.js";
import { saveAnalysisResult } from "../../services/analysisPersistence.service.js";
import { exec } from "child_process";

const prisma = new PrismaClient();

export const runProjectAnalysis = async (projectId, organizationId) => {

  try {

    // ✅ Verificar proyecto (SIN organizationId)
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // ✅ Ejecutar análisis
    const result = await analysisEngine.analyzeProject({
      projectId,
      projectPath: project.repoPath, // 🔥 corregido
      language: project.language || "javascript"
    });

    // ✅ Guardar resultado
    const analysis = await saveAnalysisResult({
      organizationId,
      projectId,
      language: project.language || "javascript",
      result
    });

    return analysis;

  } catch (error) {

    console.error("Error running analysis:", error);
    throw error;

  }
};