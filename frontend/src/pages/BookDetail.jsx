import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart, Share2, MapPin, User, Star, Eye, ArrowLeft,
  MessageSquare, Flag, CheckCircle, Package, BookOpen,
  Zap, Tag, AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import ReportModal from "../components/ReportModal";
import ReviewModal from "../components/ReviewModal";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import API from "../services/api";
import toast from "react-hot-toast";

const conditionColors = {
  New: "bg-emerald-100 text-emerald-700",
  "Like New": "bg-green-100 text-green-700",
  Good: "bg-blue-100 text-blue-700",
  "Heavily Used": "bg-orange-100 text-orange-700",
};

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isWishlisted, toggle } = useWishlist();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [myRequest, setMyRequest] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
        // Fetch reviews for seller
        if (data.owner?._id) {
          const { data: revData } = await API.get(`/reviews/seller/${data.owner._id}`);
          setReviews(revData);
        }
      } catch {
        toast.error("Book not found");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();

    if (user) {
      API.get("/requests/my")
        .then(({ data }) => {
          const r = data.find((req) => req.book?._id === id);
          setMyRequest(r || null);
        })
        .catch(() => {});
    }
  }, [id]);

  const handleRequest = async () => {
    if (!user) { navigate("/login"); return; }
    setRequesting(true);
    try {
      await API.post("/requests", { bookId: id });
      toast.success("Request sent! Seller will contact you.");
      setMyRequest({ status: "pending" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate("/login"); return; }
    const added = await toggle(id);
    if (added === true) toast.success("Added to wishlist!");
    else if (added === false) toast("Removed from wishlist");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/book/${id}`;
    const text = `Hey! "${book.title}" by ${book.author} is selling for ₹${book.price} on ScholarBridge.\n${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-full w-3/4" />
              <div className="h-5 bg-gray-200 rounded-full w-1/2" />
              <div className="h-10 bg-gray-200 rounded-full w-1/3 mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  const allImages = [book.image, ...(book.images || [])].filter(Boolean);
  const isOwner = user && book.owner?._id === user._id;
  const savings = book.originalPrice && book.price < book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;
  const wishlisted = isWishlisted(id);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition mb-6 font-bold text-sm"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT: Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img
                src={allImages[selectedImg] || "https://via.placeholder.com/400"}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImg === i ? "border-brand-600" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${conditionColors[book.condition] || "bg-gray-100 text-gray-700"}`}>
                {book.condition}
              </span>
              {book.category && (
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-gray-100 text-gray-600">
                  {book.category}
                </span>
              )}
              {book.urgency && book.urgency !== "Normal" && (
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-red-100 text-red-600 flex items-center gap-1">
                  <Zap size={10} /> {book.urgency}
                </span>
              )}
              {book.isBundle && (
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-100 text-amber-700 flex items-center gap-1">
                  <Package size={10} /> Bundle
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{book.title}</h1>
              <p className="text-gray-500 mt-1 font-medium">by {book.author}</p>
              {book.isbn && <p className="text-xs text-gray-400 mt-0.5">ISBN: {book.isbn}</p>}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {book.branch && (
                <span className="flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  <BookOpen size={12} /> {book.branch}
                </span>
              )}
              {book.semester && (
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Semester {book.semester}
                </span>
              )}
              {book.courseCode && (
                <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  <Tag size={12} /> {book.courseCode}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">₹{book.price}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="text-lg text-gray-400 line-through">₹{book.originalPrice}</span>
                )}
                {savings && (
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-black px-3 py-1 rounded-xl">
                    {savings}% OFF
                  </span>
                )}
              </div>
              {book.viewCount > 0 && (
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Eye size={12} /> {book.viewCount} people viewed this
                </p>
              )}
            </div>

            {/* Pickup */}
            {(book.pickupPoint || book.city) && (
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <MapPin size={16} className="text-brand-600 flex-shrink-0" />
                <span>
                  {[book.pickupPoint, book.city].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            {/* Bundle books */}
            {book.isBundle && book.bundleBooks?.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <p className="text-xs font-black uppercase text-amber-700 mb-2">Books in this bundle</p>
                <ul className="space-y-1">
                  {book.bundleBooks.map((b, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-1">About this book</p>
                <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {!isOwner ? (
                <>
                  {myRequest ? (
                    <div className="flex-1 bg-gray-100 text-gray-500 py-3.5 rounded-2xl font-black text-center text-sm">
                      {myRequest.status === "pending" ? "Request Sent" :
                       myRequest.status === "accepted" ? "✓ Accepted!" : "Request Declined"}
                    </div>
                  ) : (
                    <button
                      onClick={handleRequest}
                      disabled={requesting || book.status !== "available"}
                      className="flex-1 bg-brand-600 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={18} />
                      {book.status === "available" ? (requesting ? "Sending..." : "Message Seller") : "Not Available"}
                    </button>
                  )}

                  {myRequest?.status === "accepted" && (
                    <Link
                      to={`/chat/${book._id}_${user._id}`}
                      className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-green-600 text-white font-black text-sm hover:bg-green-700 transition"
                    >
                      <MessageSquare size={16} /> Chat
                    </Link>
                  )}

                  <button
                    onClick={handleWishlist}
                    className={`px-4 py-3.5 rounded-2xl border-2 transition ${
                      wishlisted
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 text-gray-500 hover:border-red-300"
                    }`}
                  >
                    <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-4 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition"
                    title="Share on WhatsApp"
                  >
                    <Share2 size={20} />
                  </button>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex-1 bg-gray-900 text-white py-3.5 rounded-2xl font-black text-sm text-center hover:bg-brand-600 transition"
                >
                  Manage in Dashboard
                </Link>
              )}
            </div>

            {/* Report */}
            {!isOwner && user && (
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition"
              >
                <Flag size={12} /> Report this listing
              </button>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-10 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-lg text-gray-900 mb-5">About the Seller</h2>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              {book.owner?.profilePic ? (
                <img src={book.owner.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={28} className="text-brand-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-gray-900">{book.owner?.name}</h3>
                {book.owner?.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {[book.owner?.college, book.owner?.branch].filter(Boolean).join(" · ")}
              </p>
              {book.owner?.rating > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= Math.round(book.owner.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-600">{book.owner.rating}</span>
                  <span className="text-xs text-gray-400">({book.owner.ratingCount} reviews)</span>
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <Link
                  to={`/seller/${book.owner?._id}`}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition"
                >
                  View Profile
                </Link>
                {!isOwner && user && (
                  <button
                    onClick={() => setShowReview(true)}
                    className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs hover:bg-brand-100 transition flex items-center gap-1"
                  >
                    <Star size={12} /> Rate Seller
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-black text-lg text-gray-900 mb-5">Seller Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((r) => (
                <div key={r._id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{r.reviewer?.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12}
                            className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showReport && <ReportModal bookId={id} onClose={() => setShowReport(false)} />}
      {showReview && (
        <ReviewModal
          sellerId={book.owner?._id}
          bookId={id}
          sellerName={book.owner?.name}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
};

export default BookDetail;
