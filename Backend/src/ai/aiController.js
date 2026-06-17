import { AIAnalyzerService } from "./aiAnalyzer.service.js";

export const analyzeCodeAI = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        error: "Code is required"
      });
    }

    const result = await AIAnalyzerService.analyzeCode(code);

    return res.json({
      success: true,
      analysis: result
    });

  } catch (error) {
    console.error("🔥 CONTROLLER ERROR:", error);

    return res.status(500).json({
      error: "AI analysis failed",
      detail: error.message
    });
  }
};