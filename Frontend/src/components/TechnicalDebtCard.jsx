export default function TechnicalDebtCard({ debt }) {
  if (!debt) {
    return null;
  }

  const getLevelLabel = (level) => {
    if (level === "critical") return "🔴 Crítica";
    if (level === "high") return "🟠 Alta";
    if (level === "medium") return "🟡 Moderada";
    return "🟢 Baja";
  };

  return (
    <div className="bg-white shadow p-4 rounded text-slate-900">
      <h2 className="font-bold text-xl mb-2">
        🧱 Deuda Técnica
      </h2>

      <p className="text-gray-700 mb-4">
        {debt.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-500">Nivel</p>
          <p className="text-2xl font-bold">
            {getLevelLabel(debt.level)}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Puntos</p>
          <p className="text-2xl font-bold">
            {debt.score}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Archivos afectados</p>
          <p className="text-2xl font-bold">
            {debt.totalItems}
          </p>
        </div>
      </div>

      {debt.items?.length > 0 && (
        <div className="space-y-3">
          {debt.items.map((item, index) => (
            <div
              key={`${item.file}-${index}`}
              className="border rounded p-3 bg-gray-50"
            >
              <div className="flex justify-between gap-4">
                <h3 className="font-bold break-all">
                  {item.file}
                </h3>

                <span className="font-semibold whitespace-nowrap">
                  {getLevelLabel(item.level)}
                </span>
              </div>

              <p className="mt-2 text-sm">
                Puntos de deuda: <strong>{item.debtPoints}</strong>
              </p>

              {item.reasons?.length > 0 && (
                <ul className="mt-2 text-sm list-disc list-inside text-gray-700">
                  {item.reasons.map((reason, reasonIndex) => (
                    <li key={reasonIndex}>
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}