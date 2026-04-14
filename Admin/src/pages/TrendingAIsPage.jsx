import { motion } from "framer-motion";
import { Flame } from "lucide-react";

import Header from "../components/common/Header";
import TrendingAITable from "../components/AI's/TrendingAITable"; // Replace with correct path
import StatCard from "../components/common/StatCard"; // Optional if reused elsewhere

const trendingStats = {
  title: "🔥 Trending AIs",
  totalAIs: 45, // You can dynamically replace this
};

const TrendingAIsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#f9fafb]">
      {/* Header */}
      <Header
        title={trendingStats.title}
        icon={<Flame className="text-orange-500" />}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats */}
        <StatCard />

        {/* Trending AI Table */}
        <TrendingAITable />
      </main>
    </div>
  );
};

export default TrendingAIsPage;
