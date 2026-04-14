import { useEffect, useState } from "react";
import { UsersIcon, UserCheck, UserPlus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SubscribersTable from "../components/Testimmonals/SubscribersTable";
import TestimonialTable from "../components/Testimmonals/TestimonialTable";

const Testimonals = () => {

  return (
        <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="All AIs" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats */}
        <StatCard />

      <SubscribersTable />
      <TestimonialTable />

      </main>
    </div>
  );
};

export default Testimonals;
