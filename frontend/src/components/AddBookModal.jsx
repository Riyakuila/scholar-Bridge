import { useState, useContext } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const PICKUP_SUGGESTIONS = [
  "Library Gate", "Main Canteen", "Admin Block", "Boys Hostel Gate",
  "Girls Hostel Gate", "Sports Complex", "Central Library", "Canteen 2",
  "Main Gate", "Department Building",
];

const AddBookModal = ({ onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("url"); // "url" or "upload"
  const [formData, setFormData] = useState({
    title: "", author: "", isbn: "", description: "",
    image: "", branch: user?.branch || "", college: user?.college || "",
    semester: "", courseCode: "", category: "Textbook", condition: "Good",
    urgency: "Normal", city: user?.city || "", pickupPoint: "",
    price: "", originalPrice: "",
    isBundle: false, bundleBooks: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await API.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, image: `http://localhost:5001${data.url}` }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed. Paste a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.author.trim()) return toast.error("Author is required");
    if (!formData.price || Number(formData.price) < 0)
      return toast.error("Enter a valid price");

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        semester: formData.semester ? Number(formData.semester) : undefined,
        bundleBooks: formData.isBundle
          ? formData.bundleBooks.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      };
      await API.post("/books", payload);
      toast.success("Book listed successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to list book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-2xl font-black text-gray-900">List a Resource</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Book Title *</label>
              <input name="title" required onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Data Structures & Algorithms" />
            </div>

            {/* Author & ISBN */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Author *</label>
              <input name="author" required onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. Cormen" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">ISBN (Optional)</label>
              <input name="isbn" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. 978-013..." />
            </div>

            {/* Branch & Semester */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Branch</label>
              <input name="branch" onChange={handleChange} value={formData.branch}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Semester</label>
              <input type="number" name="semester" min="1" max="8" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. 4" />
            </div>

            {/* Course Code */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Course Code (Optional)</label>
              <input name="courseCode" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. CS1001" />
            </div>

            {/* Condition & Category */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Condition</label>
              <select name="condition" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none">
                <option>Good</option>
                <option>New</option>
                <option>Like New</option>
                <option>Heavily Used</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Category</label>
              <select name="category" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none">
                <option>Textbook</option>
                <option>Notes</option>
                <option>Lab Kit</option>
                <option>Reference Book</option>
                <option>Bundle</option>
              </select>
            </div>

            {/* Price & Original Price */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Selling Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input type="number" name="price" required min="0" onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Original MRP (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input type="number" name="originalPrice" min="0" onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                  placeholder="0" />
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Urgency</label>
              <select name="urgency" onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none">
                <option value="Normal">Normal</option>
                <option value="Graduating Soon">Graduating Soon</option>
                <option value="Moving Next Week">Moving Next Week</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">City</label>
              <input name="city" onChange={handleChange} value={formData.city}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. Bhubaneswar" />
            </div>

            {/* Pickup Point */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Pickup Point</label>
              <input name="pickupPoint" onChange={handleChange} value={formData.pickupPoint}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                placeholder="e.g. Library Gate" />
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                {PICKUP_SUGGESTIONS.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, pickupPoint: s }))}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                      formData.pickupPoint === s
                        ? "bg-brand-600 text-white border-brand-600"
                        : "text-gray-500 border-gray-200 hover:border-brand-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Description (Optional)</label>
              <textarea name="description" onChange={handleChange} rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none resize-none"
                placeholder="Describe the book condition, highlights, notes inside, etc." />
            </div>

            {/* Bundle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isBundle" onChange={handleChange}
                  className="w-4 h-4 accent-brand-600 rounded" />
                <span className="text-sm font-bold text-gray-700">This is a Bundle (multiple books)</span>
              </label>
              {formData.isBundle && (
                <div className="mt-2 space-y-1">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Book titles in bundle (comma-separated)</label>
                  <input name="bundleBooks" onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                    placeholder="e.g. Maths 4, Physics, Lab Manual" />
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Book Cover Photo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    imageMode === "url" ? "bg-brand-600 text-white border-brand-600" : "text-gray-500 border-gray-200"
                  }`}
                >
                  <LinkIcon size={12} /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    imageMode === "upload" ? "bg-brand-600 text-white border-brand-600" : "text-gray-500 border-gray-200"
                  }`}
                >
                  <Upload size={12} /> Upload Photo
                </button>
              </div>

              {imageMode === "url" ? (
                <input name="image" onChange={handleChange} value={formData.image}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                  placeholder="https://..." />
              ) : (
                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-brand-400 transition">
                  <input type="file" accept="image/*" onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {uploading ? (
                    <p className="text-sm text-brand-600 font-bold animate-pulse">Uploading...</p>
                  ) : formData.image ? (
                    <div className="flex items-center gap-3">
                      <img src={formData.image} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
                      <p className="text-xs text-gray-500">Image uploaded! Click to change.</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Click or drag a photo here</p>
                      <p className="text-[10px] text-gray-300 mt-1">Max 5MB. Show front cover, back, and any damage.</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="md:col-span-2 bg-brand-600 text-white py-4 rounded-2xl font-black text-base shadow-xl hover:bg-brand-700 transition-all active:scale-[0.98] mt-2 disabled:opacity-60"
            >
              {submitting ? "Listing..." : "List Resource Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
