import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createProject,
  loadProject,
  deleteProject
} from "../controllers/projects/project.controller.js";

const router = express.Router();

router.get("/", authenticate, loadProject);
router.post("/create", authenticate, createProject);
router.delete("/delete/:projectId", authenticate, deleteProject);
export default router;
