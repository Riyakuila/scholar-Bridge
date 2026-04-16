import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const REASONS = [
  { value: "fake_listing", label: "Fake / Misleading Listing" },
  { value: "wrong_price", label: "Wrong Price Information" },
  { value: "offensive_content", label: "Offensive Content" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
];

const ReportModal = ({ bookId, onClose }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error("Select a reason");
    setSubmitting(true);
    try {
      await API.post("/reports", { bookId, reason, description });
      toast.success("Report submitted. Our team will review it.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-black text-gray-900">Report Listing</h3>
            <p className="text-xs text-gray-400">Help us keep ScholarBridge safe</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {REASONS.map((r) => (
              <label key={r.value} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-brand-300 transition">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-brand-600"
                />
                <span className="text-sm font-medium text-gray-700">{r.label}</span>
              </label>
            ))}
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Additional details (optional)..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none resize-none"
          />

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
