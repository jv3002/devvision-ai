import fs from "fs";
import path from "path";

import prisma from "../../config/prisma.js";
import analysisEngine from "../analysis/analysis.engine.js";
import { cloneRepository } from "../analysis/git.service.js";
import { generateRefactorSuggestions } from "../intelligence/refactorEngine.service.js";
import { generateAISuggestion } from "../intelligence/ai.service.js";

const repositoryPathExists = (repoPath) => {
  return repoPath && typeof repoPath === "string" && fs.existsSync(repoPath);
};

const formatFilePath = (filePath, projectRepoPath = "") => {
  if (!filePath || typeof filePath !== "string") {
    return "";
  }

  if (projectRepoPath && filePath.startsWith(projectRepoPath)) {
    return path.relative(projectRepoPath, filePath).replace(/\\/g, "/");
  }

  return filePath.replace(/\\/g, "/");
};

const normalizeHotspots = (hotspots = [], projectRepoPath = "") => {
  return hotspots.map((hotspot) => ({
    ...hotspot,
    file: formatFilePath(hotspot.file, projectRepoPath),
  }));
};

const ensureRepositoryAvailable = async (project) => {
  let projectPath = project.repoPath || "";
  let cloneStatus = "SKIPPED";
  let cloneMessage = "Repository path is already available.";

  if (repositoryPathExists(projectPath)) {
    return {
      projectPath,
      cloneStatus,
      cloneMessage,
    };
  }

  if (process.env.ENABLE_GIT_CLONE !== "true") {
    return {
      projectPath: "",
      cloneStatus: "DISABLED",
      cloneMessage: "Repository cloning is disabled in this environment.",
    };
  }

  if (!project.repoUrl) {
    return {
      projectPath: "",
      cloneStatus: "MISSING_REPO_URL",
      cloneMessage: "Repository URL is missing.",
    };
  }

  console.log("📦 Repository path not available. Cloning from repoUrl...");

  projectPath = await cloneRepository(project.repoUrl, project.id);

  await prisma.project.update({
    where: { id: project.id },
    data: { repoPath: projectPath },
  });

  return {
    projectPath,
    cloneStatus: "CLONED",
    cloneMessage: "Repository cloned successfully.",
  };
};

/* =========================
   CREATE PROJECT
========================= */
export const createProject = async (req, res) => {
  try {
    const { name, description, repoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    if (!repoUrl) {
      return res.status(400).json({ message: "repoUrl is required" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        repoUrl,
        repoPath: "",
      },
    });

    let repoPath = "";
    let cloneStatus = "DISABLED";
    let cloneMessage = "Repository cloning is disabled in this environment.";

    if (process.env.ENABLE_GIT_CLONE === "true") {
      try {
        repoPath = await cloneRepository(repoUrl, project.id);

        await prisma.project.update({
          where: { id: project.id },
          data: { repoPath },
        });

        cloneStatus = "CLONED";
        cloneMessage = "Repository cloned successfully.";

      } catch (err) {
        console.error("⚠️ Repository clone failed:", err.message);

        cloneStatus = "FAILED";
        cloneMessage = "Project created, but repository cloning failed.";
      }
    }

    return res.status(201).json({
      message: "Project created successfully",
      projectId: project.id,
      cloneStatus,
      cloneMessage,
      repoPath,
    });

  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return res.status(500).json({
      message: "Error creating project",
      detail: error.message,
    });
  }
};

/* =========================
   GET PROJECTS
========================= */
export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(projects || []);

  } catch (error) {
    console.error("🔥 GET PROJECTS ERROR:", error);

    return res.status(500).json({
      message: "Error getting projects",
      detail: error.message,
    });
  }
};

/* =========================
   GET PROJECT BY ID
========================= */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(project);

  } catch (error) {
    console.error("GET PROJECT BY ID ERROR:", error);

    return res.status(500).json({
      message: "Error getting project",
      detail: error.message,
    });
  }
};

/* =========================
   ANALYZE PROJECT
========================= */
export const analyzeProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let repositoryInfo;

    try {
      repositoryInfo = await ensureRepositoryAvailable(project);
    } catch (err) {
      console.error("⚠️ Repository preparation failed:", err.message);

      repositoryInfo = {
        projectPath: "",
        cloneStatus: "FAILED",
        cloneMessage: "Repository preparation failed.",
      };
    }

    const result = await analysisEngine.analyzeProject({
      projectId: id,
      projectPath: repositoryInfo.projectPath,
    });

    const cleanHotspots = normalizeHotspots(
      result.hotspots || [],
      repositoryInfo.projectPath
    );

    const cleanResult = {
      ...result,
      hotspots: cleanHotspots,
      repository: {
        cloneStatus: repositoryInfo.cloneStatus,
        cloneMessage: repositoryInfo.cloneMessage,
      },
    };

    const analysisRun = await prisma.analysisRun.create({
      data: {
        projectId: id,
        result: cleanResult,
      },
    });

    return res.json({
      message: "Analysis completed",
      analysisId: analysisRun.id,
      result: cleanResult,
    });

  } catch (error) {
    console.error("ANALYZE PROJECT ERROR:", error);

    return res.status(500).json({
      message: "Error analyzing project",
      detail: error.message,
    });
  }
};

/* =========================
   METRICS HISTORY
========================= */
export const getProjectMetricsHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const runs = await prisma.analysisRun.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "asc" },
    });

    return res.json(runs);

  } catch (error) {
    console.error("METRICS HISTORY ERROR:", error);

    return res.status(500).json({
      message: "Error getting metrics history",
      detail: error.message,
    });
  }
};

/* =========================
   PROJECT ACTIONS
========================= */
export const getProjectActions = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    const latestRun = await prisma.analysisRun.findFirst({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestRun || !latestRun.result) {
      return res.json({
        projectId: id,
        actions: ["Run analysis first"],
        refactors: [],
        aiSuggestions: [],
      });
    }

    const projectRepoPath = project?.repoPath || "";
    const hotspots = normalizeHotspots(
      latestRun.result.hotspots || [],
      projectRepoPath
    );

    const actions = hotspots.map((h) => ({
      priority: "HIGH",
      message: `Refactor ${h.file}`,
      impact: `High complexity (${h.lines} lines, ${h.functions} functions)`,
    }));

    if (actions.length === 0) {
      actions.push({
        priority: "LOW",
        message: "Project is in good shape or no analyzable files were found",
        impact: "Maintain current practices",
      });
    }

    const refactors = generateRefactorSuggestions(hotspots);

    const aiSuggestions = await Promise.all(
      hotspots.slice(0, 3).map(async (h) => {
        try {
          const suggestion = await generateAISuggestion(h.file);

          return {
            file: h.file,
            suggestion,
          };

        } catch (err) {
          return {
            file: h.file,
            suggestion: "AI suggestion not available",
          };
        }
      })
    );

    return res.json({
      projectId: id,
      actions,
      refactors,
      aiSuggestions,
    });

  } catch (error) {
    console.error("PROJECT ACTIONS ERROR:", error);

    return res.status(500).json({
      message: "Error getting project actions",
      detail: error.message,
    });
  }
};