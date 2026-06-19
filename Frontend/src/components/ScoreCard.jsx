export default function ScoreCard({ score = 0 }) {

  const getStatus = () => {
    if (score >= 80) return "🟢 Excelente";
    if (score >= 60) return "🟡 Bueno";
    if (score >= 40) return "🟠 Mejorable";
    return "🔴 Crítico";
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-xl mb-2">
        📊 Score
      </h2>

      <p className="text-4xl font-bold">
        {score}
      </p>

      <p className="mt-2 text-gray-600">
        {getStatus()}
      </p>
    </div>
  );
}