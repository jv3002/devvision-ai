import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveAnalysisResult({
  organizationId,
  projectId,
  language,
  result
}) {
  const analysis = await prisma.analysis.create({
    data: {
      organizationId,
      projectId,
      language,
      overallScore: result.overallScore,

      dimensions: {
        create: result.dimensions.map((dimension) => ({
          key: dimension.key,
          name: dimension.name,
          score: dimension.score,

          metrics: {
            create: dimension.metrics.map((metric) => ({
              key: metric.key,
              name: metric.name,
              value: metric.value,
              score: metric.score
            }))
          }
        }))
      }
    }
  });

  return analysis;
}