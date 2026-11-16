import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  loadTasks,
  createTask,
  loadMyTasks,
  loadTasksByProject,
  updateTask
} from "../controllers/tasks/tasks.controller.js";
import { isManager } from "../middleware/manager.middleware.js";
const router = express.Router();
router.use(authenticate);
router.get("/", loadTasks);
router.get("/my-tasks", loadMyTasks);
router.get("/project/:projectId", loadTasksByProject);

// Manager-only operations
router.post("/project/:projectId", isManager, createTask);
router.delete("/:taskId", isManager, deleteTask);

// Update task (additional assignment/ownership checks in service)
router.patch("/:taskId", updateTask);

router.delete("/:taskId", authenticate, isManager, deleteTask);
t;
export default router;
