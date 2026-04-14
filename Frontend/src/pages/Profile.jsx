import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaTrashAlt,
  FaSave,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({ name: "", email: "" });
  const [original, setOriginal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ───────── fetch profile ───────── */
  useEffect(() => {
    if (!token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ name: data.name || "", email: data.email || "" });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  /* ───────── handlers ───────── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const startEdit = () => {
    setOriginal(form);
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(original);
    setEditing(false);
    setOriginal(null);
    toast.dismiss();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const tId = toast.loading("Saving changes…");
    try {
      await axios.put(
        `${API}/api/users/me/update`,
        { name: form.name, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated!", { id: tId, duration: 2500 });
      setEditing(false);
      setOriginal(null);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Update failed.",
        { id: tId }
      );
    } finally {
      setBusy(false);
    }
  };

  /* ───────── delete flow with toast confirm ───────── */
  const confirmDelete = () =>
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4">
          <span className="text-sm">
            Delete account permanently?
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete();
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
      { id: "confirm-del", duration: 60000, position: "top-center" }
    );

  const handleDelete = async () => {
    const load = toast.loading("Deleting account…");
    try {
      await axios.delete(`${API}/api/users/me/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted.", { id: load, duration: 2500 });
      localStorage.removeItem("token");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      toast.error("Delete failed.", { id: load });
    }
  };

  /* ───────── UI ───────── */
  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading profile…</p>;

  return (
    <main className="bg-gradient-to-br from-[#e0f2fe] to-[#d1fae5] min-h-screen w-full pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        className="mx-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-sky-600 px-6 py-5 text-white">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-3xl" />
            <div>
              <h2 className="text-xl font-bold">My Profile</h2>
              <p className="text-xs opacity-80">Manage your account details</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-2xl hover:text-red-200"
            aria-label="Close profile"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-white">
          {!editing ? (
            <div className="space-y-6">
              <Field label="Full Name" value={form.name} />
              <Field label="Email Address" value={form.email} />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <ActionBtn primary onClick={startEdit} Icon={FaEdit}>
                  Edit Profile
                </ActionBtn>
                <ActionBtn
                  danger
                  onClick={confirmDelete}
                  Icon={FaTrashAlt}
                >
                  Delete Account
                </ActionBtn>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <ActionBtn
                  primary
                  type="submit"
                  disabled={busy}
                  Icon={FaSave}
                >
                  {busy ? "Saving…" : "Save Changes"}
                </ActionBtn>
                <ActionBtn onClick={cancelEdit}>Cancel</ActionBtn>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}

/* --- Reusable sub‑components --- */
function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 break-all">
        {value}
      </p>
    </div>
  );
}

function InputField({ label, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...rest}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-sky-200"
      />
    </div>
  );
}

function ActionBtn({ children, Icon, primary, danger, ...rest }) {
  const base =
    "flex-1 inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition";
  const styles = primary
    ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-md hover:brightness-110"
    : danger
    ? "border border-red-600 text-red-600 hover:bg-red-50"
    : "border border-gray-400 text-gray-700 hover:bg-gray-50";
  return (
    <button className={`${base} ${styles}`} {...rest}>
      {Icon && <Icon />}
      {children}
    </button>
  );
}
