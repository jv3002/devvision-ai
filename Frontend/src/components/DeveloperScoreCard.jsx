export default function DeveloperScoreCard({
  developers = []
}) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        🏆 Ranking de Desarrolladores
      </h2>

      {!developers.length ? (
        <p className="text-slate-400">
          No hay datos de desarrolladores todavía.
        </p>
      ) : (
        <div className="space-y-4">
          {developers.map((dev, index) => (
            <div
              key={dev.developer}
              className="border border-slate-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">
                  #{index + 1} {dev.developer}
                </span>

                <span className="text-green-400 font-bold">
                  {dev.averageScore}
                </span>
              </div>

              <div className="mt-2 text-sm text-slate-300">
                <p>
                  Commits: {dev.commits}
                </p>

                <p>
                  Score acumulado: {dev.totalScore}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}