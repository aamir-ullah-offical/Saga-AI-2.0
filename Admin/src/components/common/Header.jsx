import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Logo from "../../../public/logo-02.gif"; // Adjust path as needed

const Header = ({ title }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    // 1) Clear token
    localStorage.removeItem("token");

    // 2) Give the user feedback
    toast.success("Logged-out successfully");

    // 3) Redirect after the toast has had a moment to appear
    setTimeout(() => {
      window.location.href = "/login";
    }, 800); // ~0.8 s is enough for the toast to show
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full bg-[#E4F1FC] border-b border-gray-300 shadow-md py-5 px-4 lg:px-8 z-[999]"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo and Title (navigates to "/") */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={Logo}
            alt="Saga AI Logo"
            className="h-10 w-10 object-contain mix-blend-multiply"
            style={{ filter: "brightness(0.95) contrast(1.2)" }}
          />
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#2C4964" }}
          >
            Saga AI
          </span>
        </div>

        {/* Right: Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center text-blue-600 focus:outline-none"
          >
            <UserCircleIcon className="h-8 w-8 text-blue-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg z-[9999]">
              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
