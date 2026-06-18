import fs from "fs";

import prisma from "../../config/prisma.js";
import analysisEngine from "./analysis.engine.js";
import { cloneRepository } from "./git.service.js";
import { saveAnalysisResult } from "../../services/analysisPersistence.service.js";

const repositoryPathExists = (repoPath) => {
  return repoPath && typeof repoPath === "string" && fs.existsSync(repoPath);
};

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

    let projectPath = project.repoPath;

    const hasValidRepoPath = repositoryPathExists(projectPath);

    if (!hasValidRepoPath && process.env.ENABLE_GIT_CLONE === "true") {
      console.log("📦 Repository path not available. Cloning from repoUrl...");

      projectPath = await cloneRepository(project.repoUrl, project.id);

      await prisma.project.update({
        where: { id: project.id },
        data: { repoPath: projectPath },
      });
    }

    const result = await analysisEngine.analyzeProject({
      projectId,
      projectPath,
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