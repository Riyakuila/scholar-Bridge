import express from "express";
import {
  registerUser, loginUser,
  getMyProfile, updateProfile, getUserProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);
router.put("/profile", protect, updateProfile);
router.get("/user/:id", getUserProfile);

export default router;
