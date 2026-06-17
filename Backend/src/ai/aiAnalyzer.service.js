import { LocalAnalyzer } from "./localAnalyzer.js";

export class AIAnalyzerService {

  static async analyzeCode(code) {

    console.log("🧠 MODO LOCAL ACTIVADO (sin IA)");

    // 🔥 SIEMPRE usa análisis local
    return LocalAnalyzer.analyze(code);
  }

}