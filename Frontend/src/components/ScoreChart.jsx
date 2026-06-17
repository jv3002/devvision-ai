import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function ScoreChart({ history }) {

    if (!history || history.length == 0) {
      return <p>No hay datos para  grafico</p>;
    }

    const data = history.map(h => ({
        date: new Date(h.createdAt).toLocaleDateString(),
        score: h.score
    }));

    return (
        <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold mb-2">📈 Evolución del Score</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" strokeWidth={3} /> 
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}