import express from "express";
import { searchUserByEmail } from "../controllers/user/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/search", authenticate, searchUserByEmail);

export default router;
