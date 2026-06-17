export default function StatusBadge({ risk }) {

  let color = "gray";
  let text = "Unknow";

  if (risk === "low") {
    color = "green";
    text = "Healthy";
  }

  if (risk === "medium") {
    color = "yellow";
    text = "warning";
  }

  if (risk === "high") {
    color = "red";
    text = "Critical";
  }

  return (
    <span className={`px-3 py-1 rounded bg-${color}-200 text-${color}-800`}>
        {text}
    </span>
  );
}