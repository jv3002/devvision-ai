import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard.api";

import ProjectSelector from "../components/ProjectSelector";

import ScoreCard from "../components/ScoreCard";
import PredictionCard from "../components/PredictionCard";
import RecommendationsCard from "../components/RecommendationsCard";
import DevelopersCard from "../components/DevelopersCard";
import CommitsCard from "../components/CommitsCard";
import ScoreChart from "../components/ScoreChart";
import AlertsCard from "../components/AlertsCard";
import StatusBadge from "../components/StatusBadge"
import socket from "../socket";

export default function Dashboard() {

  const [projectId, setProjectId] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
  if (!projectId) return;

  socket.emit("join_project", projectId);

  socket.on("project_updated", () => {
    console.log("⚡ actualización en tiempo real");
    loadDashboard(projectId);
  });

  return () => {
    socket.off("project_updated");
  };
}, [projectId]);
  return (
    <div className="p-10 space-y-6">

      <ProjectSelector onSelect={setProjectId} />

      {!projectId && <p>Selecciona un proyecto</p>}

      {data && (
        <>
          <h1 className="text-3xl font-bold">
            🚀 {data.project.name}
          </h1>

          <ScoreCard score={data.score} />
          <AlertsCard alerts={data.alerts} />
          <PredictionCard prediction={data.prediction} />
          <RecommendationsCard recs={data.recommendations} />
          <DevelopersCard devs={data.developers} />
          <CommitsCard commits={data.commits} />
          <ScoreChart history={data.history || []} />
        </>
      )}

    </div>
  );
}