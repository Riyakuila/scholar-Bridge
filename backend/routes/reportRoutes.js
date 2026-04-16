import express from "express";
import { reportBook } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, reportBook);

export default router;
