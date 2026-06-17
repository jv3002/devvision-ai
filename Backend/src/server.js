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

/* 🔥 CREAR SERVER HTTP */
const server = http.createServer(app);

/* 🔥 SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* 🔥 EXPORTAR IO */
export { io };

console.log("JWT SECRET:", process.env.JWT_SECRET);

/* MIDDLEWARES */
app.use(cors());
app.use(express.json());

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

/* SOCKET CONNECTION */
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});