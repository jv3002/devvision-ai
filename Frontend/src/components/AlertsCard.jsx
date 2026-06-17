export default function AlertsCard({ alerts }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold">🚨 Alerts</h2>

      {alerts && alerts.length > 0 ? (
        alerts.map((a, i) => <p key={i}>{a}</p>)
      ) : (
        <p>No alerts</p>
      )}

    </div>
  );
}