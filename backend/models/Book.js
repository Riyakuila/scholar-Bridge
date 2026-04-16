import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true },
    description: String,
    image: {
      type: String,
      default: "https://via.placeholder.com/300x400?text=No+Cover",
    },
    images: [String], 

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    college: String,
    branch: String,
    semester: Number,
    courseCode: String, // e.g. CS1001

    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Heavily Used"],
      default: "Good",
    },
    category: {
      type: String,
      enum: ["Textbook", "Notes", "Lab Kit", "Reference Book", "Bundle"],
      default: "Textbook",
    },
    status: {
      type: String,
      enum: ["available", "requested", "claimed", "sold"],
      default: "available",
    },
    urgency: {
      type: String,
      enum: ["Normal", "Graduating Soon", "Moving Next Week", "High"],
      default: "Normal",
    },

    city: String,
    pickupPoint: String,

    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,

    viewCount: { type: Number, default: 0 },
    isSold: { type: Boolean, default: false },
    soldAt: Date,

    // Bundle feature
    isBundle: { type: Boolean, default: false },
    bundleBooks: [String],

    // Report tracking
    reportCount: { type: Number, default: 0 },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", courseCode: "text" });

export default mongoose.model("Book", bookSchema);
