export default function RefactorRoadmapCard({
  roadmap = []
}) {
  if (!roadmap.length) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Roadmap de Refactorización
        </h2>

        <p className="text-slate-400">
          No hay roadmap de refactorización disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        Roadmap de Refactorización
      </h2>

      <div className="space-y-4">
        {roadmap.map((phase) => (
          <div
            key={phase.phase}
            className="border border-slate-700 rounded-lg p-4"
          >
            <div className="flex justify-between">
              <span className="font-bold">
                {phase.phase}
              </span>

              <span className="text-green-400">
                +{phase.estimatedGain} pts estimados
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {phase.tasks?.map((task, index) => (
                <div
                  key={`${phase.phase}-${index}`}
                  className="text-sm text-slate-300"
                >
                  <p>
                    • {task.file}
                  </p>

                  <p className="text-blue-400">
                    Impacto: {task.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}