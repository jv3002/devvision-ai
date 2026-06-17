export default function DevelopersCard({ devs }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold">👨‍💻 Developers</h2>

      {devs?.length > 0
        ? devs.map((d, i) => (
            <p key={i}>{d.developer} - {d.avgScore}</p>
          ))
        : <p>No developers data</p>}
    </div>
  );
}