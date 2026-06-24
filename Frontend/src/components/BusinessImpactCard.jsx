export default function BusinessImpactCard({
  impact
}) {
  if (!impact) {
    return (
      <div className="bg-slate-900 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-4">
          💰 Impacto de Negocio
        </h2>

        <p className="text-slate-400">
          No hay información disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        💰 Impacto de Negocio
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Riesgo de Negocio
          </p>

          <p className="text-xl font-bold">
            {impact.businessRisk}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Costo Estimado
          </p>

          <p className="text-xl font-bold text-red-400">
            USD {impact.estimatedCostUSD}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400">
            Probabilidad de Retraso
          </p>

          <p className="text-xl font-bold text-yellow-400">
            {impact.delayedDeliveryProbability}%
          </p>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <p className="text-slate-300">
          {impact.summary}
        </p>
      </div>
    </div>
  );
}