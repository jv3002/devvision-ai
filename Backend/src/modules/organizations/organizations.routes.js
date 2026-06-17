import express from "express";
import {
  createOrganization,
  getMyOrganizations,
  inviteMember
} from "./organizations.controller.js";

import protect from "../../middlewares/protect.middleware.js";
import authorizeRoles from "../../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

/* ===============================
   CREATE ORGANIZATION
================================= */
router.post("/", protect, createOrganization);

/* ===============================
   GET MY ORGANIZATIONS
================================= */
router.get("/", protect, getMyOrganizations);

/* ===============================
   INVITE MEMBER
================================= */
router.post(
  "/invite",
  protect,
  authorizeRoles("OWNER", "ADMIN"),
  inviteMember
);

export default router;