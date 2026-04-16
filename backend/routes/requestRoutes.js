import express from "express";
import {
  createRequest,
  updateRequest,
  getMyRequests,
  getRequestsForMyBooks,
  getChatRoom,
} from "../controllers/requestController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.put("/:id", protect, updateRequest);
router.get("/my", protect, getMyRequests);
router.get("/owner", protect, getRequestsForMyBooks);
router.get("/:id/chat", protect, getChatRoom);

export default router;