export default function CommitsCard({ commits }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold">📦 Commits</h2>
      {commits.map((c, i) => (
        <p key={i}>{c.message} - {c.author}</p>
      ))}
    </div>
  );
}