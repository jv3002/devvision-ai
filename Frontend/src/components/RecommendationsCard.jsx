export default function RecommendationsCard({ recs }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold">💡 Recommendations</h2>

      {recs?.length > 0
        ? recs.map((r, i) => <p key={i}>{r}</p>)
        : <p>No recommendations</p>}
    </div>
  );
}