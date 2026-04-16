import express from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/:bookId", protect, toggleWishlist);

export default router;
