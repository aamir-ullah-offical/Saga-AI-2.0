import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Users, BadgeCheck, Search, ShieldAlert } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import AllAIsPage from "../pages/AllAIsPage";
import SagaAIInsights from "../components/analytics/SagaAIInsights";
import UserTypeDistributionChart from "../components/analytics/UserTypeDistributionChart";
import PlatformUserStatsChart from "../components/analytics/PlatformUserStatsChart";

const OverviewPage = () => {

  return (
    <div className="flex-1 overflow-auto bg-white text-gray-900 relative z-10">
      {/* Fixed Header */}
      <Header title="Local Talent Dashboard" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-3 px-4 lg:px-8">
        {/* Stat Cards */}
        <StatCard />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserTypeDistributionChart />
          <PlatformUserStatsChart />
        </div>
        <div className="flex flex-col gap-8 m-5">
          <div>
            <SagaAIInsights />
          </div>
        </div>
      </main>

    </div>
  );
};

export default OverviewPage;
