// src/components/AuthPromptModal.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaRobot } from "react-icons/fa";

/**
 * Guest‑only modal: pops after 3 s, showcases features, 80% viewport size.
 */
export default function AuthPromptModal() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (isLoggedIn) return;
    const id = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(id);
  }, [isLoggedIn]);

  if (isLoggedIn) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-gradient-to-br from-sky-900/80 to-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="relative w-[80vw] h-[80vh] max-w-4xl rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-white flex flex-col lg:flex-row">
              {/* Illustration / side pane */}
              <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-sky-600 to-teal-500 text-white">
                <FaRobot className="text-6xl animate-bounce" />
              </div>

              {/* Content */}
              <div className="flex-1 p-10 overflow-y-auto">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-6 top-6 text-2xl text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800">
                  Unlock the Full Power of <span className="text-sky-600">Saga AI</span>
                </h2>
                <p className="mt-4 text-center text-sm text-slate-600 max-w-md mx-auto">
                  Create a free account or log in to save tools, get personalized recommendations,
                  and access members‑only features.
                </p>

                <ul className="mt-8 space-y-3 text-sm text-slate-700 max-w-md mx-auto">
                  <li className="flex gap-2"><span>🤖</span> Save your favourite AI tools</li>
                  <li className="flex gap-2"><span>📈</span> Receive trend alerts weekly</li>
                  <li className="flex gap-2"><span>🚀</span> Access exclusive early‑beta apps</li>
                </ul>

                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/login"
                    className="flex-1 sm:flex-none sm:w-40 rounded-full bg-gradient-to-r from-sky-600 to-teal-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                    onClick={() => setOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 sm:flex-none sm:w-40 rounded-full border border-sky-600 px-6 py-3 text-center text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
