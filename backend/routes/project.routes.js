import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createProject,
  loadProject,
  deleteProject,
  updateMemberRole,
  updateStatus,
  updateStartDate,
  updateDueDate
} from "../controllers/projects/project.controller.js";
import { isManager } from "../middleware/manager.middleware.js";

const router = express.Router();

router.get("/", authenticate, loadProject);
router.post("/create", authenticate, createProject);
router.delete("/delete/:projectId", authenticate, deleteProject);
router.patch(
  "/:projectId/role/:memberId",
  authenticate,
  isManager,
  updateMemberRole
);
router.patch("/:projectId/status", authenticate, isManager, updateStatus);
router.patch("/:projectId/startDate", authenticate, isManager, updateStartDate);
router.patch("/:projectId/dueDate", authenticate, isManager, updateDueDate);
export default router;
