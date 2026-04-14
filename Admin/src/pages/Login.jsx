/* ─────────  src/pages/Login.jsx  ───────── */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

/* Central API base */
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const { data } = await axios.post(
        `${API}/api/auth/login`,
        { email, password: pass },
        { withCredentials: true }
      );

      /* ⛔ block non‑admins */
      if (data.role !== "admin") {
        toast.error("Access denied. Admins only.");
        setBusy(false);
        return;
      }

      /* ✅ Save token, toast, redirect */
      localStorage.setItem("token", data.token);
      toast.success("Logged‑in successfully! 🎉");
      setTimeout(() => (window.location.href = "/"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      toast.error(msg);
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
        {/* brand */}
        <Link
          to="http://localhost:3000/"
          className="mb-3 flex items-center justify-center gap-2 text-sky-600"
        >
          <img src="/logo.gif" alt="Saga AI" className="h-10" />
          <span className="text-2xl font-extrabold">Saga AI</span>
        </Link>

        <h1 className="mb-3 text-center text-2xl font-bold text-slate-900">
          Admin Panel Login
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Authorized personnel only. Enter your admin credentials.
        </p>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            icon={<FaEnvelope />}
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            icon={<FaLock />}
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-to-r from-sky-600 to-teal-500
                       py-3 text-sm font-semibold text-white shadow-md transition-all duration-150
                       hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* back link */}
        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          <Link to="http://localhost:3000/" className="text-sky-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

/* tiny reusable field */
function Input({ icon, ...rest }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 text-base">
        {icon}
      </span>
      <input
        {...rest}
        className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 pl-12 text-sm
                   shadow-inner transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200
                   placeholder:text-slate-400"
      />
    </div>
  );
}
