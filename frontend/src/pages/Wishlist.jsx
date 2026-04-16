import { useState, useEffect } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import API from "../services/api";
import toast from "react-hot-toast";

const Wishlist = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/wishlist")
      .then(({ data }) => setBooks(data))
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <Heart size={22} className="text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Wishlist</h1>
            <p className="text-gray-400 text-sm mt-0.5">Books you've saved for later</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <Heart size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-400">Your wishlist is empty</h3>
            <p className="text-gray-300 mt-2">Tap the heart icon on any book to save it here</p>
            <Link
              to="/home"
              className="inline-block mt-6 px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">{books.length} book{books.length !== 1 ? "s" : ""} saved</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
