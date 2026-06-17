export class LocalAnalyzer {

  static analyze(code) {
    let score = 10;
    let issues = [];
    let improvements = [];
    let risks = [];

    // ❌ console.log (mala práctica en producción)
    if (code.includes("console.log")) {
      score -= 1;
      issues.push("Uso de console.log en código productivo");
      improvements.push("Eliminar console.log o usar logger");
    }

    // ❌ funciones sin try/catch
    if (code.includes("async") && !code.includes("try")) {
      score -= 2;
      issues.push("Funciones async sin manejo de errores");
      improvements.push("Agregar try/catch");
      risks.push("Posibles fallos sin control");
    }

    // ❌ funciones largas (muy básico)
    if (code.length > 500) {
      score -= 1;
      issues.push("Código demasiado largo");
      improvements.push("Dividir en funciones más pequeñas");
    }

    // ❌ sin validaciones
    if (!code.includes("if")) {
      score -= 1;
      issues.push("Falta de validaciones");
      improvements.push("Agregar validaciones de entrada");
    }

    return {
      qualityScore: score < 1 ? 1 : score,
      issues,
      improvements,
      risks
    };
  }

}