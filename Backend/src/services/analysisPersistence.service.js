import prisma from "../config/prisma.js";

export async function saveAnalysisResult({
  projectId,
  result
}) {
  const analysisRun = await prisma.analysisRun.create({
    data: {
      projectId,
      result
    }
  });

  return analysisRun;
}