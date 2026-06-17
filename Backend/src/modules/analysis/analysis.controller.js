import { runProjectAnalysis } from "./analysis.service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   ANALYZE PROJECT CONTROLLER
========================= */
export const analyzeProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        message: "User does not belong to any organization",
      });
    }

    const analysisResult = await runProjectAnalysis(
      projectId,
      organizationId
    );

    return res.status(200).json(analysisResult);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const getProjectRuns = async (req, res) => {
  try {
    const { id } = req.params;

    const runs = await prisma.analysisRun.findMany({
      where: { projectId: id },
      include: { metrics: true },
      orderBy: { createdAt: "asc" }
    });

    res.json({
      totalRuns: runs.length,
      runs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};