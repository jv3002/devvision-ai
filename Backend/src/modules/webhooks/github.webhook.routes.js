import express from "express";
import { githubWebhook } from "./github.webhook.js";

const router = express.Router();

router.post("/github", githubWebhook);

export default router;
