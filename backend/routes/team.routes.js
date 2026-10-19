import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  addMember,
  createTeam,
  loadMyTeam,
  removeMember,
  updateMemberRole
} from "../controllers/team/team.controller.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();
router.get("/", authenticate, loadMyTeam);
router.post("/create", authenticate, createTeam);
router.post("/:teamId/members", authenticate, isAdmin, addMember);
router.delete(
  "/:teamId/members/:memberId",
  authenticate,
  isAdmin,
  removeMember
);
router.patch(
  "/:teamId/members/:memberId/role",
  authenticate,
  isAdmin,
  updateMemberRole
);
export default router;
