export default function ScoreCard({ score }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold">📊 Score</h2>
      <p className="text-xl">{score?.score ?? 0}</p>
    </div>
  );
}