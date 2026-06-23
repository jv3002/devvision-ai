export default function DimensionTrendsCard({ trends = [] }) {
  if (!trends.length) {
    return null;
  }

  const getTrendLabel = (trend) => {
    if (trend === "improving") return "🟢 Mejorando";
    if (trend === "declining") return "🔴 Empeorando";
    return "🟡 Estable";
  };

  const formatDifference = (difference) => {
    if (difference > 0) return `+${difference}`;
    return difference;
  };

  return (
    <div className="bg-white shadow p-4 rounded text-slate-900">
      <h2 className="font-bold text-xl mb-4">
        📊 Evolución por Dimensión
      </h2>

      <div className="space-y-4">
        {trends.map((dimension) => (
          <div
            key={dimension.key}
            className="border rounded p-3 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold">
                {dimension.name}
              </h3>

              <span className="text-sm font-semibold">
                {getTrendLabel(dimension.trend)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
              <div>
                <p className="text-gray-500">Anterior</p>
                <p className="text-xl font-bold">
                  {dimension.previousScore}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Actual</p>
                <p className="text-xl font-bold">
                  {dimension.currentScore}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Cambio</p>
                <p className="text-xl font-bold">
                  {formatDifference(dimension.difference)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}