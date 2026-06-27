export default function QualityGateCard({
  gate
}) {
  if (!gate) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          🛡️ Quality Gate
        </h2>

        <p className="text-slate-400">
          No hay datos de Quality Gate.
        </p>
      </div>
    );
  }

  const statusColor =
    gate.status === "PASS"
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        🛡️ Quality Gate
      </h2>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Estado</p>
          <p className={`text-2xl font-bold ${statusColor}`}>
            {gate.status}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Resultado</p>
          <p className="font-bold">
            {gate.passed ? "Aprobado" : "Rechazado"}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Checks aprobados</p>
          <p className="font-bold">
            {gate.passedChecks}/{gate.totalChecks}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">Checks fallidos</p>
          <p className="font-bold text-red-400">
            {gate.failedChecks}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {gate.checks?.map((check) => (
          <div
            key={check.key}
            className="bg-slate-800 p-4 rounded-lg"
          >
            <div className="flex justify-between gap-4">
              <p className="font-semibold">
                {check.passed ? "✅" : "❌"} {check.name}
              </p>

              <p className={check.passed ? "text-green-400" : "text-red-400"}>
                {check.passed ? "PASS" : "FAIL"}
              </p>
            </div>

            <p className="text-sm text-slate-400 mt-2">
              Esperado: {check.expected}
            </p>

            <p className="text-sm text-slate-400">
              Actual: {check.current}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-slate-800 p-4 rounded-lg">
        <p className="font-semibold mb-2">
          Recomendación
        </p>

        <p className="text-slate-300">
          {gate.recommendation}
        </p>
      </div>
    </div>
  );
}