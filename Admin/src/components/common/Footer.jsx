// AdminFooter.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Cpu, Users, MessageCircle, User, Settings } from "lucide-react";

const FooterLink = ({ to, icon: Icon, children }) => (
  <li className="flex items-center gap-2 hover:text-[#60a5fa] transition">
    <Icon size={16} className="shrink-0" />
    <Link to={to}>{children}</Link>
  </li>
);

const AdminFooter = () => {
  return (
    <motion.footer
      className="bg-gradient-to-br from-[#eef4ff] via-[#e4efff] to-[#dbe9ff] text-[#1e293b] pt-10 pb-6 px-6 lg:px-20 shadow-inner"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="/logo-02.gif"
              alt="Saga AI Logo"
              className="h-12 w-12 mr-3 rounded-full border border-[#1977cc] shadow-md"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[#0f3c65]">
              Saga AI <em className="not-italic text-[#1977cc]">Admin</em>
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            Internal dashboard for managing AI tools, users, testimonials, and
            more — built for speed and control.
          </p>
        </div>

        {/* Admin Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <LayoutDashboard size={18} /> Admin Links
          </h4>
          <ul className="space-y-2 text-sm font-medium">
            <FooterLink to="/" icon={LayoutDashboard}>Dashboard</FooterLink>
            <FooterLink to="/all-ais" icon={Cpu}>Manage AI Tools</FooterLink>
            <FooterLink to="/admin-users" icon={Users}>Manage Users</FooterLink>
            <FooterLink to="/testimonals" icon={MessageCircle}>Manage Testimonials</FooterLink>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Settings size={18} /> Resources
          </h4>
          <ul className="space-y-2 text-sm font-medium">
            <FooterLink to="/profile" icon={User}>My Profile</FooterLink>
            <FooterLink to="/profile" icon={Settings}>Settings</FooterLink>
            <FooterLink to="#" icon={MessageCircle}>Privacy Policy</FooterLink>
            <FooterLink to="#" icon={MessageCircle}>Terms of Service</FooterLink>
          </ul>
        </div>

        {/* Status / Build Info (optional fourth column) */}
        <div className="hidden lg:block">
          <h4 className="font-semibold text-lg mb-4">Build Info</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Version: 1.0.0</li>
            <li>Last deploy: June 2025</li>
            <li>Node 18 • React 18</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
        © {new Date().getFullYear()} Saga AI — Admin Panel. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default AdminFooter;
