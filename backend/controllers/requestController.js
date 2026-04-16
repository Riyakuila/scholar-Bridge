import Request from "../models/Request.js";
import Book from "../models/Book.js";


// CREATE REQUEST
export const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status !== "available") {
      return res.status(400).json({ message: "Book not available" });
    }

    const existingRequest = await Request.findOne({
      book: bookId,
      requester: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Already requested" });
    }
    
    const roomId = `${bookId}_${req.user._id}`;

    const request = await Request.create({
      book: bookId,
      requester: req.user._id,
      roomId,
    });

    book.status = "requested";
    await book.save();

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ACCEPT / REJECT REQUEST
export const updateRequest = async (req, res) => {
  try {
    const { status } = req.body; 

    const request = await Request.findById(req.params.id).populate("book");

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.book.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const book = await Book.findById(request.book._id);
      book.status = "claimed";
      await book.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  console.log("updateRequest hit");
};


// GET MY REQUESTS
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate("book")
      .populate("requester", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REQUESTS FOR MY BOOKS
export const getRequestsForMyBooks = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate({
        path: "book",
        match: { owner: req.user._id },
      })
      .populate("requester", "name email");

    const filtered = requests.filter((r) => r.book !== null);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoom = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      request.requester.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Chat not available yet" });
    }

    res.json({ roomId: request.roomId });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};