import React, { useState, useEffect, useContext, useCallback } from "react";
import Navbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import FilterPanel from "../components/FilterPanel";
import AddBookModal from "../components/AddBookModal";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Globe, School, CheckCircle, User, TrendingUp, BookOpen, Star } from "lucide-react";
import toast from "react-hot-toast";

const BRANCHES = [
  "All", "Computer Science", "Mechanical", "Electrical", "Civil", "Medical", "MBA", "Physics", "Chemistry",
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scope, setScope] = useState("global"); // "global" or "university"
  const [filters, setFilters] = useState({
    minPrice: "", maxPrice: "", category: "", condition: "", sortBy: "",
  });
  const [userStats, setUserStats] = useState({ shared: 0, claimed: 0 });

  const buildParams = useCallback(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (activeBranch !== "All") params.branch = activeBranch;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.category) params.category = filters.category;
    if (filters.condition) params.condition = filters.condition;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (scope === "university" && user?.college) params.college = user.college;
    return params;
  }, [searchQuery, activeBranch, filters, scope, user]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/books", { params: buildParams() });
      setBooks(data);
    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // User stats
  useEffect(() => {
    if (!user) return;
    API.get("/books/my")
      .then(({ data }) => setUserStats({ shared: data.length, claimed: 0 }))
      .catch(() => {});
  }, [user]);

  const handleResetFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", category: "", condition: "", sortBy: "" });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar onListClick={() => setShowModal(true)} onSearch={setSearchQuery} />

      <main className="max-w-screen-2xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-3 space-y-5 hidden lg:block">
          {user ? (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4 border-4 border-brand-50">
                <User size={38} />
              </div>
              <h3 className="text-xl font-black text-gray-900">{user?.name || "Scholar"}</h3>
              <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
                {user?.branch || "Student"}
              </p>
              {user?.college && (
                <p className="text-xs text-gray-400 mb-4">{user.college}</p>
              )}
              {user?.verified && (
                <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                  <CheckCircle size={10} /> Verified
                </span>
              )}
              <div className="w-full pt-4 border-t border-gray-50 flex justify-around">
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">{userStats.shared}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Books Listed</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-600">
                    ₹{books.filter(b => b.owner?._id === user?._id).reduce((s, b) => s + (Number(b.price) || 0), 0)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Total Value</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-6 rounded-[2rem] text-white text-center">
              <BookOpen size={32} className="mx-auto mb-3 opacity-80" />
              <h3 className="font-black text-lg">Join ScholarBridge</h3>
              <p className="text-sm opacity-80 mt-1 mb-4">Buy & sell textbooks with students near you</p>
              <a href="/register"
                className="block bg-white text-brand-600 font-black py-2 rounded-xl text-sm hover:bg-brand-50 transition">
                Join Free →
              </a>
            </div>
          )}

          {/* Discovery Scope */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 sticky top-20">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Discovery Scope</h4>
            <div className="space-y-2">
              <button
                onClick={() => setScope("university")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition ${
                  scope === "university"
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2"><School size={15} /> My University</span>
                {scope === "university" && <CheckCircle size={13} />}
              </button>
              <button
                onClick={() => setScope("global")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition ${
                  scope === "global"
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2"><Globe size={15} /> Global Feed</span>
                {scope === "global" && <CheckCircle size={13} />}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Live Feed</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{books.length} Books</p>
                  <p className="text-[10px] text-gray-400">Available now</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">
                    ₹{books.length > 0 ? Math.round(books.reduce((s, b) => s + (Number(b.price) || 0), 0) / books.length) : 0} avg
                  </p>
                  <p className="text-[10px] text-gray-400">Average price</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <section className="lg:col-span-9 space-y-5">
          {/* Branch + Filter bar */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0 scrollbar-hide">
              {BRANCHES.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setActiveBranch(branch)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-sm transition-all flex-shrink-0 ${
                    activeBranch === branch
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                      : "bg-white text-gray-500 border border-gray-100 hover:border-brand-300"
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
            <div className="flex-shrink-0 relative">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Results summary */}
          {!loading && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {books.length > 0
                  ? `Showing ${books.length} book${books.length !== 1 ? "s" : ""}${searchQuery ? ` for "${searchQuery}"` : ""}`
                  : searchQuery ? `No results for "${searchQuery}"` : "No books found"}
              </p>
            </div>
          )}

          {/* Books Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <BookOpen size={64} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-400">
                {searchQuery ? "No books found" : "No books available"}
              </h3>
              <p className="text-gray-300 mt-2">
                {searchQuery
                  ? "Try a different search term or clear your filters"
                  : "Be the first to list a book!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onBuyNow={(b) => {
                    if (!user) {
                      window.location.href = "/login";
                    } else {
                      window.location.href = `/book/${b._id}`;
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <AddBookModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
};

export default Home;
