import prisma from "../../config/prisma.js";
import analysisEngine from "../analysis/analysis.engine.js";
import { cloneRepository } from "../analysis/git.service.js";
import { generateRefactorSuggestions } from "../intelligence/refactorEngine.service.js";
import { generateAISuggestion } from "../intelligence/ai.service.js";

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
        repoPath: ""
      }
    });

    let repoPath = "";

    //🔥 CLONE OPCIONAL
    if (process.env.ENABLE_GIT_CLONE === "true") {
      try {
        repoPath = await cloneRepository(repoUrl, project.id);

        await prisma.project.update({
          where: { id: project.id },
          data: { repoPath }
        });

      } catch (err) {
        console.log("⚠️ Clone falló, continuando sin repo...");
      }
    }

    res.status(201).json({
      message: "Project created and repository cloned",
      projectId: project.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET PROJECTS
========================= */
export const getProjects = async (req, res) => {
  try {

    const projects = await prisma.project.findMany();

    return res.json(projects || []);

  } catch (error) {

    console.error("🔥 GET PROJECTS ERROR:", error);

    return res.status(500).json({
      message: "Error getting projects",
      detail: error.message
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
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ANALYZE PROJECT
========================= */
export const analyzeProjectController = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const result = await analysisEngine.analyzeProject({
      projectId: id,
      projectPath: project.repoPath
    });

    const analysisRun = await prisma.analysisRun.create({
      data: {
        projectId: id,
        result
      }
    });

    res.json({
      message: "Analysis completed",
      analysisId: analysisRun.id,
      result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
      orderBy: { createdAt: "asc" }
    });

    res.json(runs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   PROJECT ACTIONS (🔥 IA REAL)
========================= */
export const getProjectActions = async (req, res) => {
  try {
    const { id } = req.params;

    const latestRun = await prisma.analysisRun.findFirst({
      where: { projectId: id },
      orderBy: { createdAt: "desc" }
    });

    if (!latestRun || !latestRun.result) {
      return res.json({
        projectId: id,
        actions: ["Run analysis first"]
      });
    }

    const { hotspots = [] } = latestRun.result;

    /* 🔥 ACTIONS */
    const actions = hotspots.map(h => ({
      priority: "HIGH",
      message: `Refactor ${h.file}`,
      impact: `High complexity (${h.lines} lines, ${h.functions} functions)`
    }));

    if (actions.length === 0) {
      actions.push({
        priority: "LOW",
        message: "Project is in good shape",
        impact: "Maintain current practices"
      });
    }
    const refactors = generateRefactorSuggestions(hotspots);


    const aiSuggestions = await Promise.all(

      hotspots.slice(0, 3).map(async (h) => {
        try {
          const suggestion = await generateAISuggestion(h.file);

          return {
            file: h.file,
            suggestion
          };

        } catch (err) {
          return {
            file: h.file,
            suggestion: "AI suggestion not available"
          };
        }
      })
    );

    res.json({
      projectId: id,
      actions,
      refactors,
      aiSuggestions // 🔥 NIVEL DIOS
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};