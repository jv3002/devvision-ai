import prisma from "../../config/prisma.js";
import { calculateProjectScore } from "../analysis/projectScore.service.js";

const normalizeRepoUrl = (url = "") => {
  return url.trim().toLowerCase();
};

const calculateCommitScore = (message = "") => {
  const lowerMessage = message.toLowerCase();

  let score = 10;

  if (lowerMessage.includes("fix")) score -= 1;
  if (lowerMessage.includes("bug")) score -= 2;
  if (lowerMessage.includes("hotfix")) score -= 2;
  if (lowerMessage.includes("error")) score -= 1;
  if (lowerMessage.includes("refactor")) score += 1;
  if (lowerMessage.includes("test")) score += 1;
  if (lowerMessage.includes("docs")) score += 0.5;

  return Math.max(0, Math.min(10, score));
};

export const githubWebhook = async (req, res) => {
  try {
    const payload = req.body;

    const repoUrl = normalizeRepoUrl(
      payload.repository?.clone_url || ""
    );

    if (!repoUrl) {
      return res.status(200).json({
        message: "No repository in payload"
      });
    }

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
        message: "Project not registered",
        repoUrl
      });
    }

    const commits = payload.commits || [];

    if (!commits.length) {
      return res.status(200).json({
        message: "Webhook received without commits",
        projectId: project.id,
        commitsProcessed: 0
      });
    }

    let createdCommits = 0;

    for (const commit of commits) {
      const message = commit.message || "No commit message";
      const author =
        commit.author?.name ||
        commit.author?.username ||
        "unknown";

      const date = commit.timestamp
        ? new Date(commit.timestamp)
        : new Date();

      const score = calculateCommitScore(message);

      await prisma.commit.create({
        data: {
          message,
          author,
          date,
          score,
          projectId: project.id
        }
      });

      createdCommits++;
    }

    const projectScore = await calculateProjectScore(prisma, project.id);

    return res.status(200).json({
      message: "Webhook processed successfully",
      projectId: project.id,
      repoUrl,
      commitsProcessed: createdCommits,
      score: projectScore
    });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);

    return res.status(500).json({
      message: "Webhook processing failed",
      detail: error.message
    });
  }
};