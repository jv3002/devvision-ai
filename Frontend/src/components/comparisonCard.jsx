export default function ComparisonCard({ comparison }) {
  if (!comparison) {
    return null;
  }

  if (!comparison.hasComparison) {
    return (
      <div className="bg-white shadow p-4 rounded">
        <h2 className="font-bold text-xl mb-2">
          📈 Comparación
        </h2>
        <p className="text-gray-600">
          {comparison.message}
        </p>
      </div>
    );
  }

  const isImproving = comparison.trend === "improving";
  const isDeclining = comparison.trend === "declining";

  const trendLabel = isImproving
    ? "🟢 Mejorando"
    : isDeclining
    ? "🔴 Empeorando"
    : "🟡 Estable";

  const differenceLabel =
    comparison.difference > 0
      ? `+${comparison.difference}`
      : comparison.difference;

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-xl mb-4">
        📈 Comparación de Análisis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-gray-500">Score anterior</p>
          <p className="text-2xl font-bold">
            {comparison.previousScore}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Score actual</p>
          <p className="text-2xl font-bold">
            {comparison.currentScore}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Diferencia</p>
          <p className="text-2xl font-bold">
            {differenceLabel}
          </p>
        </div>
      </div>

      <p className="mt-4 font-semibold">
        Tendencia: {trendLabel}
      </p>
    </div>
  );
}