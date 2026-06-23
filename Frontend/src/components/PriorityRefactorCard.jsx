export default function PriorityRefactorCard({
  refactors = []
}) {
  if (!refactors.length) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Refactorización Prioritaria
        </h2>

        <p className="text-slate-400">
          No hay refactorizaciones recomendadas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        Refactorización Prioritaria
      </h2>

      <div className="space-y-4">
        {refactors.map((item) => (
          <div
            key={item.rank}
            className="border border-slate-700 rounded-lg p-4"
          >
            <div className="flex justify-between">
              <span className="font-bold">
                #{item.rank}
              </span>

              <span className="text-blue-400">
                +{item.estimatedScoreGain} pts
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-300">
              {item.file}
            </p>

            <p className="mt-2">
              Impacto: {item.impact}
            </p>

            <p>
              Deuda: {item.debtLevel}
            </p>

            <p className="mt-2 text-yellow-300">
              {item.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}