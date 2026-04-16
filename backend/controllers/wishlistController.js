import User from "../models/User.js";

// TOGGLE WISHLIST (add or remove)
export const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(bookId);
    let added;

    if (index === -1) {
      user.wishlist.push(bookId);
      added = true;
    } else {
      user.wishlist.splice(index, 1);
      added = false;
    }

    await user.save();
    res.json({ added, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      match: { isHidden: { $ne: true } },
      populate: { path: "owner", select: "name college verified" },
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
