import express from "express";
import {
  addBook, getBooks, getBookById, getMyBooks,
  updateBook, deleteBook, markAsSold, getSoldBooks,
} from "../controllers/bookController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/my", protect, getMyBooks);
router.get("/sold", protect, getSoldBooks);
router.get("/:id", getBookById);

router.post("/", protect, addBook);
router.put("/:id", protect, updateBook);
router.put("/:id/sold", protect, markAsSold);
router.delete("/:id", protect, deleteBook);

export default router;
