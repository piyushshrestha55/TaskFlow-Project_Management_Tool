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
//populating
router.get("/", authenticate, loadProject);
//creating projects
router.post("/create", authenticate, createProject);
//deleting projects
router.delete("/delete/:projectId", authenticate, deleteProject);
//changing the members role
router.patch(
  "/:projectId/role/:memberId",
  authenticate,
  isManager,
  updateMemberRole
);
// updating the status of project
router.patch("/:projectId/status", authenticate, isManager, updateStatus);
// updating the start date of project
router.patch(
  "/:projectId/start-Date",
  authenticate,
  isManager,
  updateStartDate
);
// updating the due date of project
router.patch("/:projectId/due-Date", authenticate, isManager, updateDueDate);
export default router;
