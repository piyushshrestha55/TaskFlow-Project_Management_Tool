import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { loadTasks } from "../controllers/tasks/tasks.controller.js";
const router = express.Router();
router.get("/", authenticate, loadTasks);
export default router;
