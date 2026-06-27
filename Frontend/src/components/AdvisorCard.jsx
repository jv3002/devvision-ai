export default function AdvisorCard({ advisor }) {
  if (!advisor) return null;

  const priorityColor = {
    HIGH: "text-red-400",
    MEDIUM: "text-yellow-400",
    LOW: "text-green-400"
  };

  const statusColor = {
    ATTENTION_REQUIRED: "text-red-400",
    WATCH: "text-yellow-400",
    STABLE: "text-green-400"
  };

  return (
    <div className="bg-slate-900 border border-cyan-500 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">
          🧠 DevVision Advisor
        </h2>

        <span
          className={`font-bold ${
            statusColor[advisor.status] || "text-white"
          }`}
        >
          {advisor.status}
        </span>
      </div>

      <p className="text-lg mb-6">
        {advisor.summary}
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400">Prioridad</p>
          <p
            className={`text-xl font-bold ${
              priorityColor[advisor.priority] || "text-white"
            }`}
          >
            {advisor.priority}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400">Horas sugeridas</p>
          <p className="text-xl font-bold">
            {advisor.estimatedFocusHours} h
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-400">Acción principal</p>
          <p className="font-bold">
            {advisor.topRecommendation}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">
        Insights
      </h3>

      <div className="space-y-3">
        {advisor.insights.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex justify-between">
              <h4 className="font-bold">
                {item.title}
              </h4>

              <span
                className={
                  priorityColor[item.priority] || "text-white"
                }
              >
                {item.priority}
              </span>
            </div>

            <p className="text-slate-300 mt-2">
              {item.message}
            </p>

            <p className="text-cyan-400 mt-2">
              👉 {item.action}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3">
        Plan de acción
      </h3>

      <div className="space-y-3">
        {advisor.actionPlan.map((step) => (
          <div
            key={step.order}
            className="bg-slate-800 rounded-lg p-4"
          >
            <h4 className="font-bold">
              {step.order}. {step.title}
            </h4>

            <p className="text-slate-300">
              Archivo / Objetivo:
            </p>

            <p className="text-cyan-400">
              {step.target}
            </p>

            <p className="mt-2 text-green-400">
              {step.expectedImpact}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-700 pt-4">
        <h3 className="font-bold text-green-400">
          Resultado esperado
        </h3>

        <p className="mt-2">
          {advisor.expectedOutcome}
        </p>
      </div>
    </div>
  );
}