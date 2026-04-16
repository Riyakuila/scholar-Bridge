import { useState, useEffect } from "react";
import { Bell, Check, MessageSquare, TrendingDown, BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

const iconMap = {
  message: MessageSquare,
  price_drop: TrendingDown,
  new_listing: BookOpen,
  request: Bell,
  review: Star,
  system: Bell,
};

const colorMap = {
  message: "bg-blue-100 text-blue-600",
  price_drop: "bg-emerald-100 text-emerald-600",
  new_listing: "bg-brand-100 text-brand-600",
  request: "bg-amber-100 text-amber-600",
  review: "bg-yellow-100 text-yellow-600",
  system: "bg-gray-100 text-gray-600",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/notifications")
      .then(({ data }) => setNotifications(data))
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));

    // Mark all as read
    API.put("/notifications/read-all").catch(() => {});
  }, []);

  const handleClick = (notif) => {
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Bell size={24} className="text-brand-600" /> Notifications
          </h1>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                API.put("/notifications/read-all").catch(() => {});
                setNotifications(n => n.map(x => ({ ...x, read: true })));
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
            >
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <Bell size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-400">No notifications yet</h3>
            <p className="text-gray-300 mt-2">We'll alert you when something happens</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = iconMap[notif.type] || Bell;
              const colorClass = colorMap[notif.type] || "bg-gray-100 text-gray-600";
              return (
                <div
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className={`bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer hover:shadow-md transition flex gap-4 ${
                    !notif.read ? "ring-1 ring-brand-200 bg-brand-50/30" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-black text-sm text-gray-900">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      {new Date(notif.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
