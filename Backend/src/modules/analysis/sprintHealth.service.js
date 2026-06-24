export const generateSprintHealth = ({
  score = 0,
  technicalDebt = {},
  prediction = {},
  commits = []
}) => {

  let velocity = 100;
  let capacity = 100;
  let deliveryRisk = "LOW";

  const debtScore = technicalDebt.score || 0;

  velocity -= Math.min(debtScore / 5, 40);

  if (prediction.trend === "down") {
    velocity -= 20;
  }

  if (prediction.trend === "up") {
    velocity += 5;
  }

  velocity = Math.max(0, Math.min(100, velocity));

  capacity = Math.round(
    (score * 0.6) + (velocity * 0.4)
  );

  if (
    debtScore > 150 ||
    prediction.trend === "down"
  ) {
    deliveryRisk = "HIGH";
  }
  else if (
    debtScore > 80
  ) {
    deliveryRisk = "MEDIUM";
  }

  let health = "HEALTHY";

  if (capacity < 40) {
    health = "CRITICAL";
  }
  else if (capacity < 70) {
    health = "WARNING";
  }

  const deliveryProbability = Math.max(
    10,
    Math.min(
      99,
      Math.round(
        (capacity + velocity) / 2
      )
    )
  );

  return {
    health,
    velocity,
    capacity,
    deliveryRisk,
    deliveryProbability,
    commitsAnalyzed: commits.length
  };
};