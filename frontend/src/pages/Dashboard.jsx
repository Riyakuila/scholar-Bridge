import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, ShoppingBag, MessageSquare,
  Edit3, Trash2, CheckCircle, Eye, TrendingUp,
  AlertCircle, IndianRupee, Clock, ChevronDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const TABS = [
  { id: "listings", label: "My Listings", icon: BookOpen, desc: "Books you're selling" },
  { id: "requests", label: "People Want My Books", icon: MessageSquare, desc: "Buyers requesting your listings" },
  { id: "purchased", label: "Books I'm Buying", icon: ShoppingBag, desc: "Your requests to buy books" },
  { id: "history", label: "Sales History", icon: TrendingUp, desc: "Completed transactions" },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "listings");
  const [myBooks, setMyBooks] = useState([]);
  const [soldBooks, setSoldBooks] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [booksRes, soldRes, inReqRes, myReqRes] = await Promise.all([
        API.get("/books/my"),
        API.get("/books/sold"),
        API.get("/requests/owner"),
        API.get("/requests/my"),
      ]);
      setMyBooks(booksRes.data);
      setSoldBooks(soldRes.data);
      setIncomingRequests(inReqRes.data);
      setMyRequests(myReqRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleMarkSold = async (bookId) => {
    if (!confirm("Mark this book as sold?")) return;
    try {
      await API.put(`/books/${bookId}/sold`);
      toast.success("Book marked as sold!");
      fetchAll();
    } catch {
      toast.error("Failed to mark as sold");
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Delete this listing permanently?")) return;
    try {
      await API.delete(`/books/${bookId}`);
      toast.success("Listing deleted");
      fetchAll();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleUpdatePrice = async (bookId) => {
    if (!editPrice || Number(editPrice) < 0) return toast.error("Enter a valid price");
    try {
      await API.put(`/books/${bookId}`, { price: Number(editPrice) });
      toast.success("Price updated!");
      setEditingBook(null);
      fetchAll();
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await API.put(`/requests/${requestId}`, { status });
      toast.success(status === "accepted" ? "Request accepted!" : "Request declined");
      fetchAll();
    } catch {
      toast.error("Failed to update request");
    }
  };

  const totalEarned = soldBooks.reduce((sum, b) => sum + b.price, 0);
  const totalViews = myBooks.reduce((sum, b) => sum + (b.viewCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-brand-600" size={28} />
            My Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage your listings, requests, and history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: myBooks.filter(b => !b.isSold).length, icon: BookOpen, color: "text-brand-600 bg-brand-50" },
            { label: "Books Sold", value: soldBooks.length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
            { label: "Total Earned", value: `₹${totalEarned}`, icon: IndianRupee, color: "text-amber-600 bg-amber-50" },
            { label: "Total Views", value: totalViews, icon: Eye, color: "text-purple-600 bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                  : "bg-white text-gray-500 border border-gray-100 hover:border-brand-300"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.id === "requests" && incomingRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {incomingRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                    <div className="h-6 bg-gray-200 rounded-full w-1/3 mt-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* MY LISTINGS */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                {myBooks.filter(b => !b.isSold).length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-400">No active listings</p>
                    <p className="text-sm text-gray-300 mt-1">Click "List Book" to sell your first book!</p>
                  </div>
                ) : (
                  myBooks.filter(b => !b.isSold).map((book) => (
                    <div key={book._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex gap-4">
                        <img
                          src={book.image || "https://via.placeholder.com/80"}
                          alt={book.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link to={`/book/${book._id}`} className="font-black text-gray-900 hover:text-brand-600 transition line-clamp-1">
                                {book.title}
                              </Link>
                              <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase flex-shrink-0 ${
                              book.status === "available" ? "bg-emerald-50 text-emerald-600" :
                              book.status === "requested" ? "bg-amber-50 text-amber-600" :
                              "bg-gray-50 text-gray-400"
                            }`}>
                              {book.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {editingBook === book._id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-bold text-sm">₹</span>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-24 px-2 py-1 border border-brand-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-500"
                                  autoFocus
                                  min="0"
                                />
                                <button onClick={() => handleUpdatePrice(book._id)}
                                  className="px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition">
                                  Save
                                </button>
                                <button onClick={() => setEditingBook(null)}
                                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="text-xl font-black text-gray-900">₹{book.price}</span>
                            )}

                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Eye size={12} /> {book.viewCount || 0} views
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <button
                              onClick={() => { setEditingBook(book._id); setEditPrice(book.price); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
                            >
                              <Edit3 size={12} /> Edit Price
                            </button>
                            <button
                              onClick={() => handleMarkSold(book._id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
                            >
                              <CheckCircle size={12} /> Mark Sold
                            </button>
                            <button
                              onClick={() => handleDelete(book._id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BUYER REQUESTS */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {incomingRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <MessageSquare size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-500">No one has requested your books yet</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
                      When someone clicks "Message Seller" on your book listing, their request will appear here. You can then accept or decline it.
                    </p>
                    <Link to="/home" className="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition">
                      Browse to share your books
                    </Link>
                  </div>
                ) : (
                  incomingRequests.map((req) => (
                    <div key={req._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start gap-4">
                        <img
                          src={req.book?.image || "https://via.placeholder.com/60"}
                          alt={req.book?.title}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                        />
                        <div className="flex-1">
                          <p className="font-black text-gray-900">{req.book?.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Requested by <span className="font-bold text-gray-700">{req.requester?.name}</span>
                            {req.requester?.email && ` (${req.requester.email})`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(req.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                        </div>
                        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                          req.status === "pending" ? "bg-amber-100 text-amber-700" :
                          req.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                          <button
                            onClick={() => handleRequestAction(req._id, "accepted")}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={16} /> Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(req._id, "rejected")}
                            className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {req.status === "accepted" && (
                        <Link
                          to={`/chat/${req.roomId}`}
                          className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-brand-600 font-bold text-sm hover:underline"
                        >
                          <MessageSquare size={14} /> Open Chat →
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SALES HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {soldBooks.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <TrendingUp size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-400">No sales yet</p>
                    <p className="text-sm text-gray-300 mt-1">Your sales history will appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
                      <p className="text-sm font-bold opacity-80">Total Earnings</p>
                      <p className="text-4xl font-black mt-1">₹{totalEarned}</p>
                      <p className="text-sm opacity-70 mt-1">{soldBooks.length} book{soldBooks.length !== 1 ? "s" : ""} sold</p>
                    </div>
                    {soldBooks.map((book) => (
                      <div key={book._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                        <img
                          src={book.image || "https://via.placeholder.com/60"}
                          alt={book.title}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                        />
                        <div className="flex-1">
                          <p className="font-black text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">by {book.author}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-lg font-black text-emerald-600">+₹{book.price}</span>
                            <span className="text-xs text-gray-400">
                              {book.soldAt ? new Date(book.soldAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : ""}
                            </span>
                          </div>
                        </div>
                        <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* MY REQUESTS (books I want to buy) */}
            {activeTab === "purchased" && (
              <div className="space-y-4">
                {myRequests.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-500">You haven't requested any books yet</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
                      Find a book you want, open it, and click "Message Seller". Your request will appear here and the seller can accept it to start a chat.
                    </p>
                    <Link to="/home" className="inline-block mt-5 px-5 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition">
                      Browse books
                    </Link>
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div key={req._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                      <img
                        src={req.book?.image || "https://via.placeholder.com/60"}
                        alt={req.book?.title}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                      />
                      <div className="flex-1">
                        <Link to={`/book/${req.book?._id}`} className="font-black text-gray-900 hover:text-brand-600 transition">
                          {req.book?.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">₹{req.book?.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                            req.status === "pending" ? "bg-amber-100 text-amber-700" :
                            req.status === "accepted" ? "bg-emerald-100 text-emerald-700" :
                            "bg-red-100 text-red-600"
                          }`}>
                            {req.status}
                          </span>
                          {req.status === "accepted" && (
                            <Link to={`/chat/${req.roomId}`}
                              className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                              <MessageSquare size={12} /> Open Chat
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
