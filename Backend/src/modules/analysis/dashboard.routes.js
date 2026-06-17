import express from "express";
import { getProjectDashboard } from "./dashboard.controller.js";

const router = express.Router();

// 📊 dashboard por proyecto
router.get("/:projectId", getProjectDashboard);

export default router;