import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Star, BookOpen, CheckCircle, MapPin, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import API from "../services/api";
import toast from "react-hot-toast";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/auth/user/${id}`),
      API.get(`/books?ownerId=${id}`), // We'll get all books and filter, or adjust API
      API.get(`/reviews/seller/${id}`),
    ])
      .then(async ([sellerRes, , reviewsRes]) => {
        setSeller(sellerRes.data);
        setReviews(reviewsRes.data);
        // Fetch books by this seller
        const booksRes = await API.get(`/books`);
        setBooks(booksRes.data.filter(b => b.owner?._id === id));
      })
      .catch(() => toast.error("Failed to load seller profile"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
          <div className="bg-white rounded-3xl p-8 flex gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-7 bg-gray-200 rounded-full w-1/3" />
              <div className="h-4 bg-gray-200 rounded-full w-1/2" />
              <div className="h-4 bg-gray-200 rounded-full w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) return null;

  const avgRating = seller.rating || 0;
  const memberSince = new Date(seller.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Seller Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              {seller.profilePic ? (
                <img src={seller.profilePic} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={40} className="text-brand-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-gray-900">{seller.name}</h1>
                {seller.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>

              <p className="text-gray-500 mt-1">
                {[seller.college, seller.branch].filter(Boolean).join(" · ")}
              </p>

              {seller.city && (
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                  <MapPin size={13} /> {seller.city}
                </p>
              )}

              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18}
                    className={s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                ))}
                <span className="text-sm font-bold text-gray-700 ml-1">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({seller.ratingCount || 0} reviews)</span>
              </div>

              <div className="flex gap-6 mt-5 pt-5 border-t border-gray-50">
                <div>
                  <p className="text-xl font-black text-gray-900">{books.length}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Listings</p>
                </div>
                <div>
                  <p className="text-xl font-black text-emerald-600">₹{seller.totalEarned || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Earned</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 self-end pb-1">
                  <Calendar size={12} /> Member since {memberSince}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <BookOpen size={20} className="text-brand-600" />
            Active Listings ({books.filter(b => !b.isSold).length})
          </h2>
          {books.filter(b => !b.isSold).length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-400">
              No active listings
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {books.filter(b => !b.isSold).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
              <Star size={20} className="text-yellow-400" /> Reviews ({reviews.length})
            </h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{r.reviewer?.name}</span>
                      {r.reviewer?.college && (
                        <span className="text-[10px] text-gray-400">{r.reviewer.college}</span>
                      )}
                    </div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13}
                          className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                    {r.book?.title && (
                      <p className="text-[10px] text-gray-400 mt-1">re: {r.book.title}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
