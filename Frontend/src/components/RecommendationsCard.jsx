export default function RecommendationsCard({ recs = [] }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-xl mb-4">
        💡 Recommendations
      </h2>

      {recs.length === 0 ? (
        <p>No recommendations</p>
      ) : (
        <div className="space-y-4">
          {recs.map((rec, index) => {
            if (typeof rec === "string") {
              return <p key={index}>{rec}</p>;
            }

            return (
              <div
                key={index}
                className="border rounded p-3 bg-gray-50"
              >
                <div className="flex gap-2 items-center mb-2">
                  <span className="font-bold">
                    {rec.priority}
                  </span>

                  <span className="text-sm text-gray-500">
                    {rec.type}
                  </span>
                </div>

                <h3 className="font-semibold">
                  {rec.title}
                </h3>

                <p className="text-gray-700 mt-1">
                  {rec.description}
                </p>

                <p className="text-blue-700 mt-2">
                  👉 {rec.action}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}