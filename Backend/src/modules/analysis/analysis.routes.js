import express from "express";
import { analyzeProject } from "./analysis.controller.js";
import { protect, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { getProjectRuns } from "./analysis.controller.js";

const router = express.Router();

// Solo usuarios autenticados pueden analizar proyectos
router.post(
  "/projects/:projectId/analyze",
  protect,
  authorizeRoles("OWNER", "ADMIN"),
  analyzeProject
);
router.get(
  "/project/:id",
  protect,
  getProjectRuns
);

export default router;