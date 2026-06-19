export default function DevelopersCard({ devs = [] }) {
  const getBadge = (level) => {
    switch (level) {
      case "high":
        return "🟢 High";
      case "medium":
        return "🟡 Medium";
      case "low":
        return "🔴 Low";
      default:
        return "⚪ Unknown";
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-xl mb-4">
        👨‍💻 Developers
      </h2>

      {devs.length === 0 ? (
        <p>No developers data</p>
      ) : (
        <div className="space-y-4">
          {devs.map((dev, index) => (
            <div
              key={index}
              className="border rounded p-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">
                  #{index + 1} {dev.developer}
                </h3>

                <span>
                  {getBadge(dev.qualityLevel)}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <p>
                  📦 Commits: <strong>{dev.commits}</strong>
                </p>

                <p>
                  📊 Avg Score: <strong>{dev.avgScore}</strong>
                </p>

                <p>
                  🐞 Bug Fixes: <strong>{dev.bugFixes}</strong>
                </p>

                <p>
                  ⚠️ Risky Commits: <strong>{dev.riskyCommits}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}