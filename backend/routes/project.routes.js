import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/projects/project.controller.js";

const router = express.Router();

router.get("/", Project);
router.post("/create", createProject);
export default router;
