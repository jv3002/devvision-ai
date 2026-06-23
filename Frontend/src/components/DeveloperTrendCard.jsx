export default function DeveloperTrendCard({
  trends = []
}) {
  if (!trends.length) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Developer Intelligence
        </h2>

        <p className="text-slate-400">
          No hay datos de desarrolladores.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        Developer Intelligence
      </h2>

      <div className="space-y-4">
        {trends.map((dev, index) => (
          <div
            key={index}
            className="border border-slate-700 rounded-lg p-4"
          >
            <h3 className="font-bold text-lg">
              👨‍💻 {dev.developer}
            </h3>

            <p>
              Score: {dev.averageScore}
            </p>

            <p>
              Commits: {dev.commits}
            </p>

            <p>
              Tendencia: {
                dev.trend === "up"
                  ? "📈 Mejorando"
                  : dev.trend === "down"
                  ? "📉 Empeorando"
                  : "➡ Estable"
              }
            </p>

            <p>
              Riesgo: {
                dev.riskLevel === "low"
                  ? "🟢 Bajo"
                  : dev.riskLevel === "medium"
                  ? "🟡 Medio"
                  : "🔴 Alto"
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}