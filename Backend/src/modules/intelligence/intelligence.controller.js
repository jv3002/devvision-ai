import prisma from "../../config/prisma.js";

export const getProjectInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const metrics = await prisma.metric.findMany({
      where: { projectId: id }
    });

    if (metrics.length === 0) {
      return res.json({
        projectId: id,
        healthScore: 50,
        status: "UNKNOWN",
        insights: ["Not enough data for insights"]
      });
    }

    // ejemplo básico
    const healthScore = 80;

    res.json({
      projectId: id,
      healthScore,
      status: "GOOD",
      insights: ["Project looks healthy"]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};