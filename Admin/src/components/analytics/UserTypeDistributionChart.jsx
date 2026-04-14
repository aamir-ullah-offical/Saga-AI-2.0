import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#6366F1"];

const AITypeDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ai/statistics");

        const dynamicChartData = [
          { name: "All AIs", value: res.data.totalAIs },
          { name: "Trending AIs", value: res.data.trendingAIs },
          { name: "Use Cases", value: res.data.useCaseStats.length },
        ];

        setData(dynamicChartData);
      } catch (err) {
        setError("Failed to fetch chart data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-[#2C4964] mb-4">
        AI Overview Distribution
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading chart...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-10">{error}</p>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E5E7EB",
                  color: "#111827",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AITypeDistributionChart;
