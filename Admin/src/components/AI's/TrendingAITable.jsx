/*  =====  TrendingAITable.jsx  =====  */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactDOM from "react-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TrendingAITable() {
  const [aiList, setAIList] = useState([]);
  const [selectedAI, setSelectedAI] = useState(null);
  const [searchTerm, setSearch] = useState("");

  const navigate = useNavigate();

  /* ───────── fetch only TRENDING AI ───────── */
  const fetchAI = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/ai");
      setAIList(data.filter((ai) => ai.trending)); // keep only trending
    } catch {
      toast.error("Failed to fetch AI list");
    }
  };
  useEffect(() => { fetchAI(); }, []);

  /* ───────── delete flow ───────── */
  const performDelete = async (id) => {
    const spin = toast.loading("Deleting…");
    try {
      await axios.delete(`http://localhost:5000/api/ai/${id}`);
      setAIList((p) => p.filter((ai) => ai._id !== id));
      toast.success("Deleted", { id: spin, duration: 2500 });
    } catch {
      toast.error("Delete failed", { id: spin });
    }
  };

  const confirmDelete = (id) =>
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">Delete this AI?</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performDelete(id);
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

  /* ───────── toggle trending ───────── */
  const toggleTrending = async (id) => {
    const load = toast.loading("Updating…");
    try {
      await axios.patch(`http://localhost:5000/api/ai/${id}/trending`, {
        trending: false, // remove from trending list
      });
      fetchAI();
      toast.success("Updated", { id: load, duration: 2500 });
    } catch {
      toast.error("Update failed", { id: load });
    }
  };

  /* ───────── search filter ───────── */
  const filtered = aiList.filter((ai) =>
    ai.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ai.coverage.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-[#2C4964]">
          Trending AI Tools
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or coverage…"
            className="border border-gray-300 rounded px-4 py-2 text-sm w-72"
          />
          <button
            onClick={() => navigate("/add-trending-ai")}
            className="bg-[#1977cc] text-white px-4 py-2 rounded-md text-sm hover:bg-[#155fa0]"
          >
            + Add AI
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F3F7FB]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Coverage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Trending</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((ai) => (
              <tr key={ai._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{ai.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{ai.coverage}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    Yes
                  </span>
                </td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedAI(ai)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-ai/${ai._id}`)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(ai._id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleTrending(ai._id)}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
                  >
                    Remove Trending
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-6">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* view modal (same as original) */}
      {selectedAI &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4 py-8 overflow-y-auto">
            <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl p-8 relative">
              <button
                onClick={() => setSelectedAI(null)}
                className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h3 className="text-2xl font-semibold mb-4 text-center text-[#2C4964]">
                {selectedAI.title}
              </h3>

              {selectedAI.aiImage && (
                <img
                  src={selectedAI.aiImage}
                  alt={selectedAI.title}
                  className="h-24 mb-4 object-contain mx-auto"
                />
              )}

              <p className="mb-3 text-gray-700 whitespace-pre-line">
                {selectedAI.shortDescription}
              </p>

              <div className="mb-2">
                <span className="font-medium">Coverage:</span> {selectedAI.coverage}
              </div>
              <div className="mb-2">
                <span className="font-medium">Pricing:</span> {selectedAI.pricing}
              </div>

              <div className="mb-2">
                <span className="font-medium">Use Cases:</span>
                <ul className="list-disc list-inside">
                  {selectedAI.useCases.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <span className="font-medium">Features:</span>
                <ul className="list-disc list-inside">
                  {selectedAI.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <a
                href={selectedAI.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sky-600 underline"
              >
                Visit Website
              </a>
            </div>
          </div>,
          document.body
        )}
    </motion.div>
  );
}
