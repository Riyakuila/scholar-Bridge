import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const FilterPanel = ({ filters, onChange, onReset }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== "All" && v !== null && v !== undefined
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border transition-all ${
          activeCount > 0
            ? "bg-brand-600 text-white border-brand-600"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        <SlidersHorizontal size={14} />
        Filters
        {activeCount > 0 && (
          <span className="bg-white text-brand-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-12 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-black text-gray-900">Filters</h3>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button onClick={onReset} className="text-xs text-brand-600 font-bold hover:underline">
                  Reset
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Price Range */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
                  min="0"
                />
              </div>
              {/* Quick price buttons */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[100, 200, 500].map((max) => (
                  <button
                    key={max}
                    onClick={() => handleChange("maxPrice", max)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                      Number(filters.maxPrice) === max
                        ? "bg-brand-600 text-white border-brand-600"
                        : "text-gray-500 border-gray-200 hover:border-brand-400"
                    }`}
                  >
                    Under ₹{max}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">All Categories</option>
                <option>Textbook</option>
                <option>Notes</option>
                <option>Lab Kit</option>
                <option>Reference Book</option>
                <option>Bundle</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                Condition
              </label>
              <div className="flex gap-2 flex-wrap">
                {["New", "Like New", "Good", "Heavily Used"].map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      handleChange("condition", filters.condition === c ? "" : c)
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      filters.condition === c
                        ? "bg-brand-600 text-white border-brand-600"
                        : "text-gray-600 border-gray-200 hover:border-brand-400"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || ""}
                onChange={(e) => handleChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
