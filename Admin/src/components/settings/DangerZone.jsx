import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";   // ✅ toast

const DangerZone = () => {
  const [loading, setLoading] = useState(false);

  /* ───────── delete flow ───────── */
  const confirmDelete = () =>
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">
            Permanently delete your account?
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDeleteAccount();
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-600 text-xs font-semibold px-3 py-1 rounded border"
          >
            Cancel
          </button>
        </div>
      ),
      { id: "confirm-delete", duration: 60000, position: "top-center" }
    );

  const handleDeleteAccount = async () => {
    const load = toast.loading("Deleting account…");
    setLoading(true);
    try {
      await axios.delete("http://localhost:5000/api/users/me/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Account deleted", { id: load, duration: 2500 });
      localStorage.removeItem("token");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err) {
      toast.error("Delete failed", { id: load });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ───────── UI ───────── */
  return (
    <motion.div
      className="bg-red-900/60 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <Trash2 className="text-red-300 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-red-100">Danger Zone</h2>
      </div>

      <p className="text-red-200 mb-4">
        Permanently delete your account and all of your content.
      </p>

      <button
        onClick={confirmDelete}
        disabled={loading}
        className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Deleting…" : "Delete Account"}
      </button>
    </motion.div>
  );
};

export default DangerZone;