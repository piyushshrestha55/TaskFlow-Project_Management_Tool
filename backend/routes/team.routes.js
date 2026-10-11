import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createTeam, loadMyTeam } from "../controllers/team/team.controller.js";

const router = express.Router();
router.get("/", authenticate, loadMyTeam);
router.post("/create", createTeam);
export default router;
