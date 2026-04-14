import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";        // ✅ toast

const TestimonialTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testimonials, setTestimonials] = useState([]);

  const token = localStorage.getItem("adminToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  /* ───────── fetch ───────── */
  const fetchTestimonials = async () => {
    const load = toast.loading("Loading testimonials…");
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/testimonials",
        authHeader
      );
      setTestimonials(data || []);
      toast.success("Loaded", { id: load, duration: 1500 });
    } catch (err) {
      toast.error("Failed to fetch testimonials", { id: load });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── delete ───────── */
  const handleDelete = (id) =>
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">Delete this testimonial?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const load = toast.loading("Deleting…");
              try {
                await axios.delete(
                  `http://localhost:5000/api/testimonials/${id}`,
                  authHeader
                );
                toast.success("Deleted", { id: load, duration: 1500 });
                fetchTestimonials();
              } catch (err) {
                toast.error("Delete failed", { id: load });
                console.error(err);
              }
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
      { id: `confirm-${id}`, duration: 60000, position: "top-center" }
    );

  /* ───────── filter ───────── */
  const filtered = testimonials.filter((t) =>
    t?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ───────── UI ───────── */
  return (
    <motion.div
      className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-8 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-[#2C4964]">All Testimonials</h2>
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-4 py-2 text-sm w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="text-center col-span-full text-gray-400 py-6">
            No results found.
          </div>
        ) : (
          filtered.map((t) => (
            <motion.div
              key={t._id}
              className="bg-[#F3F7FB] border border-gray-200 rounded-xl shadow-md p-6 relative"
              whileHover={{ y: -4 }}
            >
              <img
                src={t.profileImage || "https://via.placeholder.com/64"}
                onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#1977cc] mb-3"
              />
              <h3 className="text-lg font-semibold text-[#2C4964]">
                {t.name || "Unnamed"}
              </h3>
              <p className="text-sm text-gray-500 mb-1">{t.position}</p>
              <p className="text-sm text-gray-700 mt-3 mb-4 line-clamp-3">
                {t.testimonialText}
              </p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-yellow-400 ${i < t.rating ? "" : "opacity-30"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialTable;
