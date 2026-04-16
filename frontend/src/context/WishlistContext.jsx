import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (!user) { setWishlistIds(new Set()); return; }
    API.get("/auth/me")
      .then(({ data }) => {
        const ids = (data.wishlist || []).map((b) => (typeof b === "object" ? b._id : b));
        setWishlistIds(new Set(ids));
      })
      .catch(() => {});
  }, [user]);

  const toggle = async (bookId) => {
    if (!user) return false;
    try {
      const { data } = await API.post(`/wishlist/${bookId}`);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (data.added) next.add(bookId);
        else next.delete(bookId);
        return next;
      });
      return data.added;
    } catch {
      return null;
    }
  };

  const isWishlisted = (bookId) => wishlistIds.has(bookId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
