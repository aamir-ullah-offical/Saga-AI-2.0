import { useEffect } from "react";

export default function UserRedirect() {
  useEffect(() => {
    // send the browser to the public (user‑facing) site
    window.location.href = "http://localhost:3000/";
  }, []);

  return null; // nothing to render inside admin
}
