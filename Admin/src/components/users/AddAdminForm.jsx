import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";   // toast alert

const urlRegex = /^https?:\/\/.+/i;        // not used here, kept for consistency

export default function AddAdminForm() {
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "admin",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ─── handlers ───────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // add if endpoint is protected

      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Admin registered successfully!");
      setFormData(initialState);   // reset form
      navigate("/admin-users");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error registering admin."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ─── UI ─────────────────────────────── */
  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#1977cc] hover:text-[#155fa0] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#2C4964" }}>
        Add New Admin
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2C4964]"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2C4964]"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2C4964]"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2C4964]"
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 text-white font-semibold rounded transition"
          style={{ backgroundColor: "#2C4964", cursor: loading ? "not-allowed" : "pointer" }}
          onMouseOver={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#1f3547";
          }}
          onMouseOut={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#2C4964";
          }}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
