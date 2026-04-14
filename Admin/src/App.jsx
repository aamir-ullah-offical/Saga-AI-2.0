import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

/* Pages */
import OverviewPage        from "./pages/OverviewPage";
import AllAIsPage          from "./pages/AllAIsPage";
import TrendingAIsPage     from "./pages/TrendingAIsPage";
import AdminUsersPage      from "./pages/AdminUsersPage";
import Testimonals         from "./pages/Testimonals";
import SettingsPage        from "./pages/SettingsPage";
import AddAIForm           from "./components/AI's/AddAIForm";
import AddTrendingAIForm   from "./components/AI's/AddTrendingAIForm";
import AddAdminForm        from "./components/users/AddAdminForm";
import Login               from "./pages/Login";
import NotFound            from "./pages/NotFound";

/* Layout */
import EditAIForm          from "./components/AI's/EditAIForm";
import Header              from "./components/common/Header";
import Footer              from "./components/common/Footer";

/* Redirect helper */
import UserRedirect        from "./components/common/UserRedirect";

function App() {
  const { pathname } = useLocation();

  /* 1️⃣  read token synchronously so first render is correct */
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  /* 2️⃣  keep state fresh when token changes in other tabs */
  useEffect(() => {
    const onStorage = () =>
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ── PUBLIC branch ───────────────────────────────────── */
  if (!isAuthenticated) {
    /* allow /user/*  to redirect even when not logged in */
    if (pathname.startsWith("/user")) return <UserRedirect />;

    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  /* ── AUTHENTICATED branch ────────────────────────────── */
  const hideLayout = pathname === "/not-found";

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb] text-gray-800">
      {!hideLayout && <Header />}

      <div className={hideLayout ? "flex-1" : "flex-1 overflow-y-auto pt-[80px] px-4 pb-4"}>
        <Routes>
          <Route path="/"                element={<OverviewPage />} />
          <Route path="/all-ais"         element={<AllAIsPage />} />
          <Route path="/trending-ais"    element={<TrendingAIsPage />} />
          <Route path="/admin-users"     element={<AdminUsersPage />} />
          <Route path="/add-ai"          element={<AddAIForm />} />
          <Route path="/add-trending-ai" element={<AddTrendingAIForm />} />
          <Route path="/testimonals"     element={<Testimonals />} />
          <Route path="/add-admin"       element={<AddAdminForm />} />
          <Route path="/profile"         element={<SettingsPage />} />
          <Route path="/edit-ai/:id"     element={<EditAIForm />} />

          {/* redirect /admin/user/* → public site */}
          <Route path="user/*"           element={<UserRedirect />} />

          {/* Login should never show when authenticated */}
          <Route path="/login"           element={<Navigate to="/" replace />} />

          {/* NotFound route */}
          <Route path="/not-found"       element={<NotFound />} />
          <Route path="*"                element={<Navigate to="/not-found" replace />} />
        </Routes>
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
