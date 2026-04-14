import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Flame, UserCog, Users } from "lucide-react";
import axios from "axios";

const StatCard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAIs: 0,
    trendingAIs: 0,
    totalUseCases: 0,
  });

  const [userStats, setUserStats] = useState({ totalUsers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ai/statistics");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching AI stats:", err.message);
      }

      try {
        const res2 = await axios.get(
          "http://localhost:5000/api/users/stats/all"
        );
        setUserStats(res2.data);
      } catch (err) {
        console.error("Error fetching user stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "All AIs",
      value: stats.totalAIs,
      icon: Cpu,
      color: "#0aa6bd",
      to: "/all-ais",
    },
    {
      title: "Trending AIs",
      value: stats.trendingAIs,
      icon: Flame,
      color: "#f97316",
      to: "/trending-ais",
    },
    {
      title: "Total Users",
      value: userStats.totalUsers,
      icon: UserCog,
      color: "#6366f1",
      to: "/admin-users",
    },
    {
      title: "Testimonials & Subscribers",
      value: stats.totalUseCases,
      icon: Users, 
      color: "#4b5563",
      to: "/testimonals",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {cards.map(({ title, value, icon: Icon, color, to }) => (
        <motion.div
          key={title}
          onClick={() => navigate(to)}
          className="cursor-pointer bg-white overflow-hidden shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="p-10 flex flex-row justify-between h-full">
            <div className="flex items-center text-gray-600 text-sm font-medium mb-2">
              <Icon size={20} className="mr-2" style={{ color }} />
              {title}
            </div>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatCard;
