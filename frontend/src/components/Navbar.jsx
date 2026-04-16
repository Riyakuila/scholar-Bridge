import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import API from "../services/api";
import {
  BookMarked, Search, MessageSquare, PlusCircle, LogOut,
  Bell, Heart, User, X, LayoutDashboard,
} from "lucide-react";
import logo from '../assets/ScholarBridgeLogo.jpeg';

const Navbar = ({ onListClick, onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, clearUnread, notifications } = useSocket();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [apiNotifs, setApiNotifs] = useState([]);
  const [dbUnread, setDbUnread] = useState(0);
  const notifsRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (onSearch) onSearch(searchVal);
    }, 350);
    return () => clearTimeout(t);
  }, [searchVal]);

  // Fetch notification count on mount
  useEffect(() => {
    if (!user) return;
    API.get("/notifications/unread")
      .then(({ data }) => setDbUnread(data.count))
      .catch(() => {});
  }, [user]);

  // Load notifications when bell opened
  const openNotifs = async () => {
    if (!user) return;
    setShowNotifs(true);
    clearUnread();
    try {
      const { data } = await API.get("/notifications");
      setApiNotifs(data);
      setDbUnread(0);
      API.put("/notifications/read-all").catch(() => {});
    } catch {}
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalUnread = dbUnread + unreadCount;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img
              src={logo}
              alt="ScholarBridge Logo"
              className="h-16 w-auto transition-transform group-hover:scale-105"
            />
          <span className="text-xl font-black text-gray-900 hidden sm:block">ScholarBridge</span>
        </Link>

        {/* Search */}
        <div className="grow max-w-2xl relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search by Title, Author, ISBN or Course Code..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 pl-12 pr-10 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
          />
          {searchVal && (
            <button
              onClick={() => setSearchVal("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {user && (
            <>
              <button
                onClick={onListClick}
                className="flex items-center gap-2 bg-brand-600 text-white px-3 py-2 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
              >
                <PlusCircle size={18} />
                <span className="hidden md:block">List Book</span>
              </button>

              <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
                title="My Dashboard"
              >
                <LayoutDashboard size={21} />
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
                title="Wishlist"
              >
                <Heart size={21} />
              </Link>

              {/* Chat */}
              <Link
                to="/dashboard?tab=requests"
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative transition"
                title="Messages"
              >
                <MessageSquare size={21} />
              </Link>

              {/* Notifications */}
              <div className="relative" ref={notifsRef}>
                <button
                  onClick={openNotifs}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative transition"
                  title="Notifications"
                >
                  <Bell size={21} />
                  {totalUnread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 border-2 border-white">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                      <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                      <button onClick={() => setShowNotifs(false)}>
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[...notifications, ...apiNotifs.filter(
                        (n) => !notifications.find((rn) => rn._id === n._id)
                      )].length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        [...notifications, ...apiNotifs.filter(
                          (n) => !notifications.find((rn) => rn._id === n._id)
                        )].map((n, i) => (
                          <div
                            key={n._id || i}
                            onClick={() => {
                              setShowNotifs(false);
                              if (n.link) navigate(n.link);
                            }}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${
                              !n.read ? "bg-brand-50" : ""
                            }`}
                          >
                            <p className="text-xs font-bold text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-50">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifs(false)}
                        className="block text-center text-xs font-bold text-brand-600 hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link to="/profile" className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition" title="Profile">
                <User size={21} />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg"
                title="Logout"
              >
                <LogOut size={21} />
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-brand-600 transition">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 transition"
              >
                Join Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
