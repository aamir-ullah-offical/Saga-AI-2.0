import { motion } from "framer-motion";
import { Cpu, ListChecks, Flame, ShieldCheck } from "lucide-react";

import StatCard from "../components/common/StatCard";
import Header from "../components/common/Header";
import AITable from "../components/AI's/AITable";

const aiStats = {
  totalAIs: 10765,
  verifiedAIs: 10450,
  trendingAIs: 45,
  safeAIs: 10390,
};

const AllAIsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="All AIs" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats */}
        <StatCard />

        {/* AI Table */}
        <AITable />
      </main>
    </div>
  );
};

export default AllAIsPage;
