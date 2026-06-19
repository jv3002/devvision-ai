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
import StatusBadge from "../components/StatusBadge";
import socket from "../socket";

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async (id) => {
    try {
      setLoading(true);
      const response = await getDashboard(id);
      setData(response);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;

    loadDashboard(projectId);

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
    <div className="p-10 space-y-6 bg-slate-950 min-h-screen text-white">
      <ProjectSelector onSelect={setProjectId} />

      {!projectId && (
        <p className="text-slate-400">Selecciona un proyecto para ver su auditoría técnica.</p>
      )}

      {loading && (
        <p className="text-blue-400">Cargando dashboard...</p>
      )}

      {data && (
        <>
          <div>
            <h1 className="text-3xl font-bold">
              🚀 {data.project.name}
            </h1>
            <p className="text-slate-400">
              {data.project.description}
            </p>
          </div>

          {data.executiveSummary && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-2">Resumen Ejecutivo</h2>
              <p className="text-lg">{data.executiveSummary.mainMessage}</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Estado</p>
                  <p className="font-bold">{data.executiveSummary.healthStatus}</p>
                </div>
                <div>
                  <p className="text-slate-400">Riesgo</p>
                  <p className="font-bold">{data.executiveSummary.riskLevel}</p>
                </div>
                <div>
                  <p className="text-slate-400">Tendencia</p>
                  <p className="font-bold">{data.executiveSummary.trend}</p>
                </div>
                <div>
                  <p className="text-slate-400">Hotspots</p>
                  <p className="font-bold">{data.executiveSummary.hotspotCount}</p>
                </div>
              </div>
              <p className="mt-4 text-blue-300">
                Acción principal: {data.executiveSummary.topAction}
              </p>
            </div>
          )}

          {data.analytics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">Análisis</p>
                <p className="text-2xl font-bold">{data.analytics.totalAnalyses}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">Último Score</p>
                <p className="text-2xl font-bold">{data.analytics.latestScore}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">Mejor Score</p>
                <p className="text-2xl font-bold">{data.analytics.bestScore}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">Peor Score</p>
                <p className="text-2xl font-bold">{data.analytics.worstScore}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">Mejora</p>
                <p className="text-2xl font-bold">{data.analytics.improvement}</p>
              </div>
            </div>
          )}

          <ScoreCard score={data.score} />
          <StatusBadge status={data.latestAnalysis?.status} />
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