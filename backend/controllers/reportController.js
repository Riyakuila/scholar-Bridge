import Report from "../models/Report.js";
import Book from "../models/Book.js";

// REPORT A LISTING
export const reportBook = async (req, res) => {
  try {
    const { bookId, reason, description } = req.body;

    if (!bookId || !reason)
      return res.status(400).json({ message: "Book ID and reason are required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot report your own listing" });

    const existing = await Report.findOne({
      reporter: req.user._id,
      book: bookId,
    });
    if (existing) return res.status(400).json({ message: "You have already reported this listing" });

    await Report.create({
      reporter: req.user._id,
      book: bookId,
      reason,
      description,
    });

    book.reportCount = (book.reportCount || 0) + 1;
    if (book.reportCount >= 5) book.isHidden = true;
    await book.save();

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
