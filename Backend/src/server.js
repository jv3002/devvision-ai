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

/*
====================================================
VALIDACIÓN DE VARIABLES DE ENTORNO
====================================================
*/

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET"
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

export { io };

/*
====================================================
MIDDLEWARES
====================================================
*/

app.use(cors());
app.use(express.json());

/*
====================================================
HEALTH CHECKS
====================================================
*/

app.get("/", (req, res) => {
  res.json({
    app: "DevVision AI",
    status: "online",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({
    api: "running",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

/*
====================================================
WEBHOOKS
====================================================
*/

app.use("/api/webhooks", githubWebhookRoutes);

/*
====================================================
API ROUTES
====================================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api", analysisRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

/*
====================================================
SOCKET.IO
====================================================
*/

io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on("join_project", (projectId) => {
    socket.join(projectId);
    console.log(`📡 Joined project: ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

/*
====================================================
ERROR HANDLER
====================================================
*/

app.use(errorHandler);

/*
====================================================
START SERVER
====================================================
*/

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 DevVision AI running on port ${PORT}`);
});