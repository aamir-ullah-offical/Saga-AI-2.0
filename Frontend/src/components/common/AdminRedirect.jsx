// src/components/common/AdminRedirect.jsx
import { useEffect } from "react";

export default function AdminRedirect() {
  useEffect(() => {
    window.location.href = "http://localhost:3001/admin/";
  }, []);

  return null; // nothing to render
}
