// src/components/layout/Footer.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Footer = () => {
  /* ───────── newsletter state ───────── */
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    const tId = toast.loading("Subscribing…");

    try {
      await axios.post(`${API}/api/emails`, { email });
      toast.success("Subscribed successfully! 🎉", {
        id: tId,
        duration: 2500,
      });
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Subscription failed",
        { id: tId }
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.footer
      className="bg-[#F3F7FB] border-t border-gray-200 text-[#2C4964] pt-10 pb-6 px-6 lg:px-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="/logo-02.gif"
              alt="Saga AI Logo"
              className="h-10 w-10 mr-2 mix-blend-darken"
              style={{ filter: "brightness(1.1) contrast(1.2)" }}
            />
            <span className="text-2xl font-bold tracking-tight">
              Saga&nbsp;AI
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Discover and explore powerful AI tools across multiple domains —
            all in one organized, searchable, and verified platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#1977cc] transition">Home</Link></li>
            <li><Link to="#all-ais" className="hover:text-[#1977cc] transition">All AIs</Link></li>
            <li><Link to="#trending" className="hover:text-[#1977cc] transition">Trending</Link></li>
            <li><Link to="#categories" className="hover:text-[#1977cc] transition">Categories</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#faq" className="hover:text-[#1977cc] transition">FAQs</Link></li>
            <li><Link to="#contact" className="hover:text-[#1977cc] transition">Contact Us</Link></li>
            <li><Link to="#privacy" className="hover:text-[#1977cc] transition">Privacy Policy</Link></li>
            <li><Link to="#terms" className="hover:text-[#1977cc] transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Stay Updated</h4>
          <p className="text-sm text-gray-600 mb-2">
            Get updates on new AI tools and categories.
          </p>

          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1977cc] mb-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1977cc] text-white py-2 rounded hover:bg-[#125ea9] transition disabled:opacity-50"
            >
              {loading ? "…" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
        © {new Date().getFullYear()} Saga AI. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
