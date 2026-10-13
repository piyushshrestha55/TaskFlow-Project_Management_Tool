import express from "express";
import { loadDashboard } from "../controllers/dashboard/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", authenticate, loadDashboard);

export default router;
