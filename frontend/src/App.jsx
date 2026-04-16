import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { WishlistProvider } from "./context/WishlistContext";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Wishlist from "./pages/Wishlist";
import SellerProfile from "./pages/SellerProfile";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// Auth guard
const Protected = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Guest only (redirect to home if already logged in)
const GuestOnly = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <SocketProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a1a1a",
                color: "#fff",
                borderRadius: "16px",
                fontSize: "14px",
                fontWeight: "600",
                padding: "12px 18px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/home" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/seller/:id" element={<SellerProfile />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/wishlist" element={<Protected><Wishlist /></Protected>} />
            <Route path="/chat/:roomId" element={<Protected><Chat /></Protected>} />
            <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WishlistProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
