import Review from "../models/Review.js";
import User from "../models/User.js";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { sellerId, bookId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    if (sellerId === req.user._id.toString())
      return res.status(400).json({ message: "You cannot review yourself" });

    const existing = await Review.findOne({
      reviewer: req.user._id,
      book: bookId,
    });
    if (existing) return res.status(400).json({ message: "You have already reviewed this transaction" });

    const review = await Review.create({
      reviewer: req.user._id,
      seller: sellerId,
      book: bookId,
      rating,
      comment,
    });

    const allReviews = await Review.find({ seller: sellerId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(sellerId, {
      rating: Math.round(avgRating * 10) / 10,
      ratingCount: allReviews.length,
    });

    const populated = await review.populate("reviewer", "name profilePic");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REVIEWS FOR A SELLER
export const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate("reviewer", "name profilePic college")
      .populate("book", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
