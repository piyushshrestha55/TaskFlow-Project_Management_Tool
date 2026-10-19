import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  addMember,
  createTeam,
  loadMyTeam
} from "../controllers/team/team.controller.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();
router.get("/", authenticate, loadMyTeam);
router.post("/create", authenticate, createTeam);
router.post("/:teamId/members", authenticate, isAdmin, addMember);
router.delete("/:teamId/members", authenticate, isAdmin, removeMember);
export default router;
