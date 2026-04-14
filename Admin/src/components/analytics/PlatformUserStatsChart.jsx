import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";

const colors = [
  "#6366F1", "#10B981", "#F59E0B", "#8B5CF6",
  "#EF4444", "#3B82F6", "#EC4899", "#F43F5E",
];

const PlatformUserStatsChart = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ai/statistics");

        const categoryData = res.data.useCaseStats.map((item, idx) => ({
          name: item._id,
          count: item.count,
          fill: colors[idx % colors.length],
        }));

        setStats({
          totalAIs: res.data.totalAIs,
          trendingAIs: res.data.trendingAIs,
          categories: categoryData,
        });
      } catch (err) {
        setError("Failed to fetch stats.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      className="bg-white shadow-md rounded-xl p-4 border border-gray-200 mx-auto w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold text-[#2C4964] mb-4">
        Saga AI Platform Stats
      </h2>

      {loading && (
        <p className="text-gray-500 text-center py-10">Loading stats...</p>
      )}

      {error && (
        <p className="text-red-500 text-center py-10">Error: {error}</p>
      )}

      {!loading && !error && stats && (
        <>
          <div className="flex flex-wrap justify-around text-[#2C4964] mb-4">
            <div className="text-center m-2 min-w-[100px]">
              <p className="text-2xl font-bold">{stats.totalAIs}</p>
              <p className="text-xs">Total AIs</p>
            </div>
            <div className="text-center m-2 min-w-[100px]">
              <p className="text-2xl font-bold">{stats.trendingAIs}</p>
              <p className="text-xs">Trending AIs</p>
            </div>
          </div>

          <h3 className="text-base font-medium text-[#2C4964] mb-3">
            AIs by Use Case
          </h3>

          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.categories}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F9FAFB",
                    borderColor: "#E5E7EB",
                    color: "#111827",
                  }}
                />
                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                  {stats.categories.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PlatformUserStatsChart;
