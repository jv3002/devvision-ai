import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  analyzeProjectController,
  getProjectMetricsHistory,
  getProjectActions 
} from "./projects.controller.js";

const router = Router();

/* PROJECTS */

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

/* METRICS */

router.get("/:id/metrics-history", getProjectMetricsHistory);

/* ANALYSIS */

router.post("/:id/analyze", analyzeProjectController);

/* ACTIONS */

router.get("/:id/actions", getProjectActions);

export default router;