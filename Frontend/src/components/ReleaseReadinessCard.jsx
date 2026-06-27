export default function ReleaseReadinessCard({
  readiness
}) {
  if (!readiness) {
    return null;
  }

  const getColor = () => {
    if (readiness.status === "READY") {
      return "text-green-400";
    }

    if (readiness.status === "CAUTION") {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  return (
    <div className="bg-slate-900 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4">
        🚀 Release Readiness
      </h2>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Estado
          </p>

          <p className={`font-bold ${getColor()}`}>
            {readiness.status}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Ready
          </p>

          <p className="font-bold">
            {readiness.ready ? "Sí" : "No"}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Confianza
          </p>

          <p className="font-bold">
            {readiness.confidence}%
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Bloqueadores
          </p>

          <p className="font-bold">
            {readiness.blockers?.length || 0}
          </p>
        </div>
      </div>

      {readiness.blockers?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">
            Bloqueadores
          </h3>

          <ul className="space-y-2">
            {readiness.blockers.map((blocker, index) => (
              <li
                key={index}
                className="bg-slate-800 p-3 rounded-lg"
              >
                ⚠️ {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="font-semibold mb-2">
          Recomendación
        </p>

        <p className="text-slate-300">
          {readiness.recommendation}
        </p>
      </div>
    </div>
  );
}