import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createProject,
  loadProject
} from "../controllers/projects/project.controller.js";

const router = express.Router();

router.get("/", authenticate, loadProject);
router.post("/create", authenticate, createProject);
export default router;
