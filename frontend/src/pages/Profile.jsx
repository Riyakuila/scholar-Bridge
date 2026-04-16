import { useState, useContext } from "react";
import { User, Save, Camera } from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    branch: user?.branch || "",
    city: user?.city || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      const { data } = await API.put("/auth/profile", formData);
      updateUser(data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <User size={24} className="text-brand-600" /> Edit Profile
        </h1>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center">
                <User size={40} className="text-brand-600" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">University / College</label>
              <input
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. IIT Bombay"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Branch / Major</label>
              <input
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Mumbai"
              />
            </div>

            {/* Verification notice */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-700">
                {user?.verified ? "✓ Your account is verified!" : "Get a verified badge by sharing your college email during registration."}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-600 text-white py-4 rounded-2xl font-black text-base shadow-xl hover:bg-brand-700 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
