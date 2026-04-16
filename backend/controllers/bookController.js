import Book from "../models/Book.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ADD BOOK
export const addBook = async (req, res) => {
  try {
    const {
      title, author, isbn, description, image, images,
      college, branch, semester, courseCode,
      category, condition, urgency,
      city, pickupPoint, price, originalPrice,
      isBundle, bundleBooks,
    } = req.body;

    if (!title || !author) return res.status(400).json({ message: "Title and Author are required" });
    if (price < 0) return res.status(400).json({ message: "Price cannot be negative" });

    const book = await Book.create({
      title, author, isbn, description, image, images,
      owner: req.user._id,
      college: college || req.user.college,
      branch: branch || req.user.branch,
      semester, courseCode,
      category, condition, urgency,
      city: city || req.user.city,
      pickupPoint, price, originalPrice,
      isBundle, bundleBooks,
    });

    notifyNewListing(book, req.user).catch(() => {});

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function notifyNewListing(book, owner) {
  try {
    const interestedUsers = await User.find({
      branch: book.branch,
      _id: { $ne: owner._id },
    }).select("_id").limit(50);

    if (interestedUsers.length > 0) {
      const notifications = interestedUsers.map((u) => ({
        user: u._id,
        type: "new_listing",
        title: "New book in your branch!",
        message: `"${book.title}" was just listed for ₹${book.price}`,
        link: `/book/${book._id}`,
        book: book._id,
      }));
      await Notification.insertMany(notifications);
    }
  } catch (e) {
  }
}

// GET ALL BOOKS 
export const getBooks = async (req, res) => {
  try {
    const {
      college, branch, semester, search, category,
      condition, minPrice, maxPrice, city, sortBy,
    } = req.query;

    let query = { isHidden: { $ne: true }, isSold: { $ne: true } };

    if (college) query.college = { $regex: college, $options: "i" };
    if (branch && branch !== "All") query.branch = { $regex: branch, $options: "i" };
    if (semester) query.semester = Number(semester);
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (city) query.city = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "price_asc") sortOption = { price: 1 };
    if (sortBy === "price_desc") sortOption = { price: -1 };
    if (sortBy === "popular") sortOption = { viewCount: -1 };

    const books = await Book.find(query)
      .populate("owner", "name email college branch verified rating ratingCount profilePic")
      .sort(sortOption);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE BOOK 
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate("owner", "name email college branch city verified rating ratingCount profilePic createdAt");

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY BOOKS 
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE BOOK 
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const oldPrice = book.price;
    const { price, title, description, condition, pickupPoint, urgency, images, image, courseCode } = req.body;

    if (price !== undefined && price < 0)
      return res.status(400).json({ message: "Price cannot be negative" });

    Object.assign(book, {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(condition && { condition }),
      ...(pickupPoint !== undefined && { pickupPoint }),
      ...(urgency && { urgency }),
      ...(images && { images }),
      ...(image !== undefined && { image }),
      ...(courseCode !== undefined && { courseCode }),
      ...(price !== undefined && { price: Number(price) }),
    });

    await book.save();

    if (price !== undefined && Number(price) < oldPrice) {
      notifyPriceDrop(book).catch(() => {});
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function notifyPriceDrop(book) {
  try {
    const usersWithWishlist = await User.find({ wishlist: book._id }).select("_id");
    if (usersWithWishlist.length > 0) {
      const notifications = usersWithWishlist.map((u) => ({
        user: u._id,
        type: "price_drop",
        title: "Price Drop Alert!",
        message: `"${book.title}" is now ₹${book.price}`,
        link: `/book/${book._id}`,
        book: book._id,
      }));
      await Notification.insertMany(notifications);
    }
  } catch (e) {
  }
}

// DELETE BOOK 
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await User.updateMany({ wishlist: book._id }, { $pull: { wishlist: book._id } });

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK AS SOLD 
export const markAsSold = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    book.status = "sold";
    book.isSold = true;
    book.soldAt = new Date();
    await book.save();

    // Update seller's total earned
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalEarned: book.price },
    });

    // Remove from all wishlists
    await User.updateMany({ wishlist: book._id }, { $pull: { wishlist: book._id } });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SOLD BOOKS 
export const getSoldBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id, isSold: true }).sort({ soldAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
