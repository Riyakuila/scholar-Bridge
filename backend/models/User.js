import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        college: String,
        branch: String,
        city: String,
        profilePic: String,
        verified: { type: Boolean, default: false },
        verificationBadge: {
            type: String,
            enum: ["none", "college_id", "university_email"],
            default: "none",
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
        totalEarned: { type: Number, default: 0 },
        totalSaved: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
