import express from "express";
import { analyzeCodeAI } from "../ai/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeCodeAI);

export default router;