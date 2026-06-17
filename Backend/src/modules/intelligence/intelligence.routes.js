import express from "express";
import { getProjectInsights } from "./intelligence.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/projects/:id/insights",
  protect,
  getProjectInsights
);

export default router;