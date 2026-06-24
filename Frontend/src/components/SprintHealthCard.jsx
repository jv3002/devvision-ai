export default function SprintHealthCard({
  sprintHealth
}) {
  if (!sprintHealth) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          Sprint Health
        </h2>

        <p className="text-slate-400">
          No hay datos del sprint.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        🚀 Sprint Health
      </h2>

      <div className="grid md:grid-cols-5 gap-4">

        <div>
          <p className="text-slate-400">
            Estado
          </p>

          <p className="font-bold text-green-400">
            {sprintHealth.health}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Velocity
          </p>

          <p className="font-bold">
            {sprintHealth.velocity}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Capacity
          </p>

          <p className="font-bold">
            {sprintHealth.capacity}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Delivery Risk
          </p>

          <p className="font-bold text-red-400">
            {sprintHealth.deliveryRisk}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Probabilidad
          </p>

          <p className="font-bold text-blue-400">
            {sprintHealth.deliveryProbability}%
          </p>
        </div>

      </div>

      <div className="mt-4 text-sm text-slate-400">
        Commits analizados:
        {" "}
        {sprintHealth.commitsAnalyzed}
      </div>
    </div>
  );
}