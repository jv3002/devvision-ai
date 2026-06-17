import prisma from "../../config/prisma.js";
import { analyzeProject } from "../analysis/codeAnalyzer.service.js";
import { io } from "../../server.js";
import path from "path";

export const githubWebhook = async (req, res) => {

  try {

    const payload = req.body;

    if (!payload.repository) {
      return res.status(200).json({ message: "No repository data" });
    }

    const repoUrl = payload.repository.clone_url;

    const project = await prisma.project.findFirst({
      where: {
        repoUrl: repoUrl
      }
    });

    if (!project) {
      return res.status(200).json({
        message: "Project not registered"
      });
    }

    const repoPath = path.join(process.cwd(), project.repoPath);

    const metrics = analyzeProject(repoPath);

    const run = await prisma.analysisRun.create({
      data: {
        projectId: project.id
      }
    });
    io.to(project.id).emit("project_updated", {
      projectId: project.id,
      message: "Proyecto actualizado en tiempo real"
    });

    await Promise.all(

      Object.entries(metrics).map(([name, value]) => {

        return prisma.metric.create({
          data: {
            name,
            value,
            projectId: project.id,
            analysisId: run.id
          }
        });

      })

    );

    res.json({
      message: "Webhook processed and analysis executed"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};