import { motion } from "framer-motion";
import {
  Cpu,
  Flame,
  Layers,
  CheckCircle,
  BarChart4,
  Sparkles,
} from "lucide-react";

const SAGA_INSIGHTS = [
  {
    icon: Cpu,
    color: "text-blue-400",
    insight:
      "Saga AI now hosts over 10,000+ AI tools across various domains, helping users discover the best AI for their needs.",
  },
  {
    icon: Flame,
    color: "text-red-400",
    insight:
      "Trending AIs like ChatGPT, Midjourney, and Claude are receiving 30% higher engagement this week compared to last.",
  },
  {
    icon: Layers,
    color: "text-violet-400",
    insight:
      "Most popular AI categories include Content Creation, Developer Tools, and Customer Support solutions.",
  },
  {
    icon: CheckCircle,
    color: "text-green-400",
    insight:
      "Verified AIs make up 95% of the listings, ensuring users get access to authentic and safe tools.",
  },
  {
    icon: Sparkles,
    color: "text-yellow-400",
    insight:
      "Newly added AIs with innovative use cases are highlighted every day in the 'Discover' section.",
  },
  {
    icon: BarChart4,
    color: "text-emerald-400",
    insight:
      "Evening hours (6 PM – 10 PM) see the highest user traffic—ideal for announcing new AI listings or updates.",
  },
];

const SagaAIInsights = () => {
  return (
    <motion.div
      className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 w-full max-w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-[#2C4964] mb-3 tracking-tight">
        Saga AI – Platform Insights
      </h2>

      <p className="text-sm text-gray-700 mb-6 leading-relaxed">
        <strong>Saga AI</strong> is a powerful platform that curates and organizes thousands of AI tools in one place — making it easy for users to discover, filter, and explore AI solutions across industries. With advanced category filters, real-time trending tracking, and verified AI listings, Saga AI empowers developers, marketers, businesses, and enthusiasts to find the right tools faster. Whether you're looking for content generators, productivity boosters, or developer-focused AIs, Saga AI has it covered — all under one seamless, searchable dashboard.
      </p>

      <div className="space-y-4">
        {SAGA_INSIGHTS.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-full bg-[#F3F7FB] shadow-inner ${item.color}`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-[#2C4964] text-sm leading-relaxed">
              {item.insight}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SagaAIInsights;
