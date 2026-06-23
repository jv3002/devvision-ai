export default function SmartAlertsCard({
  alerts = []
}) {
  if (!alerts.length) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          🚨 Smart Alerts
        </h2>

        <p className="text-slate-400">
          No hay alertas inteligentes por ahora.
        </p>
      </div>
    );
  }

  const getSeverityLabel = (severity) => {
    if (severity === "HIGH") return "🔴 Alta";
    if (severity === "MEDIUM") return "🟡 Media";
    return "🟢 Baja";
  };

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        🚨 Smart Alerts
      </h2>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.type}-${index}`}
            className="border border-slate-700 rounded-lg p-4"
          >
            <div className="flex justify-between gap-4">
              <h3 className="font-bold">
                {alert.title}
              </h3>

              <span className="font-semibold text-red-400 whitespace-nowrap">
                {getSeverityLabel(alert.severity)}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-300">
              {alert.description}
            </p>

            <p className="mt-3 text-sm text-yellow-300">
              👉 {alert.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}