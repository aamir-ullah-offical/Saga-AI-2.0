// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope, FaUser } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  /* handle input */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* handle submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const tId = toast.loading("Creating account…");
    try {
      await axios.post(`${API}/api/auth/register`, form, {
        withCredentials: true,
      });
      toast.success("Account created! Please log in.", { id: tId });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed.",
        { id: tId }
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e0f2fe] to-[#d1fae5] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-sm p-10 shadow-2xl ring-1 ring-slate-200"
      >
        {/* Brand */}
        <Link to="/" className="mb-3 flex items-center justify-center gap-2 text-sky-600">
          <img src="/logo.gif" alt="Saga AI" className="h-10" />
          <span className="text-2xl font-extrabold">Saga AI</span>
        </Link>

        <h1 className="mb-3 text-center text-2xl font-bold text-slate-900">
          Create Account
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Sign up to explore hundreds of AI tools.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            icon={<FaUser />}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            icon={<FaEnvelope />}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            icon={<FaLock />}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-sky-600 to-teal-500 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create Account"}
          </button>
        </form>

        {/* Footer actions */}
        <div className="mt-6 flex flex-col items-center gap-3 text-sm text-slate-600">
          <span>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-sky-600 hover:underline">
              Sign in
            </Link>
          </span>
          <Link
            to="/"
            className="text-sky-600 hover:underline flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

/* reusable input */
function Input({ icon, ...rest }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 text-base">
        {icon}
      </span>
      <input
        {...rest}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 pl-12 text-sm shadow-inner transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 placeholder:text-slate-400"
      />
    </div>
  );
}
