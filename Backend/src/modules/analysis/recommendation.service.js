export const generateRecommendations = ({ score, risk, prediction }) => {

  const recommendations = [];

  // score bajo
  if (score.score < 6) {
    recommendations.push("Reducir deuda técnica y mejorar calidad del código");
  }

  // riesgo alto
  if (risk.riskLevel === "high") {
    recommendations.push("Revisar arquitectura y módulos críticos");
  }

  // predicción negativa
  if (prediction.prediction === "declining") {
    recommendations.push("El proyecto empeorará si no se actúa pronto");
  }

  // caso positivo
  if (recommendations.length === 0) {
    recommendations.push("El proyecto va bien, mantener buenas prácticas");
  }

  return recommendations;
};