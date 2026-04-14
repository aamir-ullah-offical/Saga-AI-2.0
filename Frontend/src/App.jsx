import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import PageLoader      from "./components/common/PageLoader";
import Header          from "./components/common/Header";
import Footer          from "./components/common/Footer";
import AuthPromptModal from "./components/common/AuthPromptModal";
import AdminRedirect   from "./components/common/AdminRedirect";   // ← NEW

/* Lazy‑loaded pages */
const Home     = lazy(() => import("./pages/Home"));
const About    = lazy(() => import("./pages/About"));
const Profile  = lazy(() => import("./pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const Login    = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Hide header/footer on these */
const BARE_ROUTES = ["/login", "/register", "/admin"];

/* Smooth‑scroll helper (unchanged) */
function ScrollHandler({ ignore }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (ignore) return;
    const extra = hash?.toLowerCase() === "#trendinai" ? 104 : 0;
    const run = () => {
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          const y =
            target.getBoundingClientRect().top + window.pageYOffset - extra;
          window.scrollTo({ top: y, behavior: "smooth" });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const id = setTimeout(run, 0);
    return () => clearTimeout(id);
  }, [pathname, hash, ignore]);
  return null;
}

/* Layout wrapper */
function Layout() {
  const { pathname } = useLocation();
  const hideLayout = BARE_ROUTES.some((p) => pathname.startsWith(p));
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <>
      {!hideLayout && <Header />}
      {!hideLayout && !isLoggedIn && <AuthPromptModal />}
      <ScrollHandler ignore={hideLayout} />

      <main className={hideLayout ? "flex-1" : "flex-1 scroll-smooth pb-4"}>
        <Outlet />
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb] text-gray-800">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"         element={<Home />} />
            <Route path="/about"    element={<About />} />
            <Route path="/profile"  element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login"    element={<Login />} />
            {/* NEW: redirect to external admin dev server */}
            <Route path="/admin/*"  element={<AdminRedirect />} />
          </Route>

          {/* 404 without layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-center"
        toastOptions={{ style: { fontSize: "14px" } }}
      />
    </div>
  );
}
