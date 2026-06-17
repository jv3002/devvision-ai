export default function PredictionCard({ prediction }) {
    return (
        <div className="bg-white shadow p-4 rounded">
            <h2 className="font-bold">🔮 Prediction</h2>
            <p>{prediction.message}</p>
        </div>
    );
}