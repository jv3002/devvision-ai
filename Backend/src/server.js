import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/projects.routes.js";
import organizationRoutes from "./modules/organizations/organizations.routes.js";
import analysisRoutes from "./modules/analysis/analysis.routes.js";
import githubWebhookRoutes from "./modules/webhooks/github.webhook.routes.js";
import intelligenceRoutes from "./modules/intelligence/intelligence.routes.js";
import aiRoutes from "./ai/ai.routes.js";
import dashboardRoutes from "./modules/analysis/dashboard.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

export { io };

/* VALIDACIÓN DE VARIABLES DE ENTORNO */
const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`❌ Falta variable de entorno: ${envVar}`);
    process.exit(1);
  }
}

/* MIDDLEWARES */
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173"
    ],
    credentials: true
  })
);

app.use(express.json());

/* HEALTH CHECKS */
app.get("/", (req, res) => {
  res.json({
    app: "DevVision AI",
    status: "online",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/healthz", (req, res) => {
  res.json({
    api: "en ejecución",
    "base de datos": "conectada",
    "marca de tiempo": new Date().toISOString()
  });
});

/* WEBHOOKS */
app.use("/api/webhooks", githubWebhookRoutes);

/* RUTAS */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api", analysisRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* SOCKETS */
io.on("connection", (socket) => {
  console.log("⚡ Cliente conectado:", socket.id);

  socket.on("join_project", (projectId) => {
    socket.join(projectId);
    console.log(`📡 Cliente unido al proyecto ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado");
  });
});

/* ERROR HANDLER */
app.use(errorHandler);

/* START SERVER */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 DevVision AI running on port ${PORT}`);
});