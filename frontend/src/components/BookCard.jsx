import { Heart, Share2, Eye, AlertCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const urgencyColors = {
  "Graduating Soon": "bg-orange-500",
  "Moving Next Week": "bg-red-500",
  High: "bg-yellow-500",
  Normal: "",
};

const conditionColors = {
  New: "bg-emerald-500 text-white",
  "Like New": "bg-green-400 text-white",
  Good: "bg-blue-400 text-white",
  "Heavily Used": "bg-orange-400 text-white",
};

const BookCard = ({ book, onBuyNow }) => {
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();

  const isOwner = user && book.owner?._id === user._id;
  const wishlisted = isWishlisted(book._id);
  const savings = book.originalPrice && book.price < book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Login to save books"); return; }
    const added = await toggle(book._id);
    if (added === true) toast.success("Added to wishlist!");
    else if (added === false) toast("Removed from wishlist");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `Hey! I'm selling "${book.title}" by ${book.author} for ₹${book.price} on ScholarBridge. Check it out!`;
    const url = `${window.location.origin}/book/${book._id}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div
      onClick={() => navigate(`/book/${book._id}`)}
      className="group bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col border border-transparent hover:border-gray-100 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={book.image || "https://via.placeholder.com/300x400?text=No+Cover"}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Cover"; }}
        />

        {/* Condition badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${conditionColors[book.condition] || "bg-white/90 text-gray-800"}`}>
            {book.condition}
          </span>
        </div>

        {/* Urgency badge */}
        {book.urgency && book.urgency !== "Normal" && (
          <div className="absolute top-3 right-10">
            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white ${urgencyColors[book.urgency]}`}>
              <Zap size={8} className="inline mr-0.5" />
              {book.urgency}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {/* Views */}
        {book.viewCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
            <Eye size={10} />
            {book.viewCount}
          </div>
        )}

        {/* Share */}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
          title="Share on WhatsApp"
        >
          <Share2 size={12} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {book.branch && (
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                {book.branch}
              </span>
            )}
            {book.semester && (
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                Sem {book.semester}
              </span>
            )}
            {book.courseCode && (
              <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {book.courseCode}
              </span>
            )}
            {book.isBundle && (
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Bundle
              </span>
            )}
          </div>
          <h4 className="text-base font-black text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {book.title}
          </h4>
          <p className="text-xs font-medium text-gray-400 mt-0.5">by {book.author}</p>
          {book.owner?.name && (
            <p className="text-xs text-gray-400 mt-0.5">
              {book.owner.name}
              {book.owner.verified && (
                <span className="ml-1 text-blue-500 text-[10px]">✓</span>
              )}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900">₹{book.price || 0}</span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-xs text-gray-400 line-through">₹{book.originalPrice}</span>
              )}
            </div>
            {savings && (
              <span className="text-[10px] font-bold text-emerald-600">{savings}% OFF</span>
            )}
          </div>

          {isOwner ? (
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
              Your Listing
            </span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onBuyNow && onBuyNow(book); }}
              className="h-10 px-5 rounded-2xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-200 transition-all active:scale-95"
            >
              {book.status === "available" ? "Buy Now" : book.status === "sold" ? "Sold" : "Requested"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
