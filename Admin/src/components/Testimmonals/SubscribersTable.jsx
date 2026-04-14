/*  =====  SubscribersTable.jsx  =====  */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

const API = "http://localhost:5000/api/emails"; // base URL

export default function SubscribersTable() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");

  /* ───────── fetch all subscribers ───────── */
  const loadEmails = async () => {
    const tId = toast.loading("Loading subscribers…");
    try {
      const { data } = await axios.get(API);
      setList(data);
      toast.success("Loaded", { id: tId, duration: 1500 });
    } catch {
      toast.error("Failed to fetch emails", { id: tId });
    }
  };

  useEffect(() => { loadEmails(); }, []);

  /* ───────── delete flow ───────── */
  const deleteEmail = async (id) => {
    const spin = toast.loading("Deleting…");
    try {
      await axios.delete(`${API}/${id}`);
      setList((p) => p.filter((e) => e._id !== id));
      toast.success("Deleted", { id: spin, duration: 1500 });
    } catch {
      toast.error("Delete failed", { id: spin });
    }
  };

  const confirmDelete = (id) =>
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">Delete this e‑mail?</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteEmail(id);
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
      { id: `del-${id}`, duration: 60000, position: "top-center" }
    );

  /* ───────── filter list ───────── */
  const filtered = list.filter((e) =>
    e.email.toLowerCase().includes(search.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-[#2C4964]">Subscribers</h2>
        <input
          type="text"
          placeholder="Search email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm w-72"
        />
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F3F7FB]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#2C4964]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((e, idx) => (
              <tr key={e._id}>
                <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800 break-all">
                  {e.email}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => confirmDelete(e._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-400 py-6 text-sm"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
