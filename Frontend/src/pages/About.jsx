import { useRef } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const text = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6 },
  }),
};

const CARDS = [
  {
    title: "Our Mission",
    desc: "Saga AI offers instant, organized access to top AI tools—empowering individuals, creators, and teams to innovate and accelerate productivity.",
  },
  {
    title: "Our Vision",
    desc: "To become the ultimate AI search dashboard where discovering powerful tools is seamless, intuitive, and for everyone.",
  },
  {
    title: "Our Values",
    desc: "Clarity. Speed. Empowerment. We curate ethically, design thoughtfully, and always put user value first.",
  },
];

const FEATURES = [
  {
    icon: "🔍",
    title: "Smart AI Search",
    desc: "Advanced filters let users explore AI by category, pricing, use case, and more.",
  },
  {
    icon: "⚡",
    title: "Lightning‑Fast Access",
    desc: "Instant access to the most in‑demand AI platforms—without the clutter.",
  },
  {
    icon: "🧠",
    title: "Curated Intelligence",
    desc: "Only the most reliable, high‑performance AI tools make it to our listings.",
  },
  {
    icon: "🎯",
    title: "All‑in‑One Dashboard",
    desc: "No more tab‑switching — Saga AI puts every powerful tool on one clean interface.",
  },
];

export default function About() {
  const infoRef = useRef(null);

  const scrollToInfo = () => {
    if (!infoRef.current) return;
    const y =
      infoRef.current.getBoundingClientRect().top + window.pageYOffset - 88;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* ───── Hero Section ───── */}
      <section className="relative flex h-[83vh] items-center justify-center overflow-hidden">
        <img
          src="/public/bg-4.avif"
          alt="Saga AI Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/30" />

        <motion.div
          className="relative z-10 px-6 text-center text-white"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="mb-6 text-5xl font-extrabold text-transparent bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text sm:text-6xl md:text-7xl"
            variants={text}
            custom={0.2}
            initial="hidden"
            animate="visible"
          >
            About&nbsp;Saga&nbsp;AI
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
            variants={text}
            custom={0.4}
            initial="hidden"
            animate="visible"
          >
            Your unified dashboard to search, discover, and launch the world’s
            most advanced AI tools — all in one place.
          </motion.p>

          {/* simplified button motion → subtle scale on hover only */}
          <motion.button
            onClick={scrollToInfo}
            whileHover={{ scale: 1.05 }}
            className="rounded-full bg-gradient-to-r from-sky-500 to-teal-400 px-10 py-4 text-base font-semibold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40"
            variants={text}
            custom={0.6}
            initial="hidden"
            animate="visible"
          >
            Learn&nbsp;More
          </motion.button>
        </motion.div>
      </section>

      {/* ───── Info Cards Section ───── */}
      <section ref={infoRef} className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {CARDS.map(({ title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="rounded-2xl bg-[#f3f8fd] p-8 shadow-lg ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="mb-3 text-2xl font-bold text-sky-700">
                  {title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Features Section ───── */}
      <section className="bg-[#e4f1fc] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-sky-700">
              What Makes Saga AI Different?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Built for speed, clarity and intelligent discovery. Saga AI is
              more than a collection — it’s a smart gateway.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{icon}</div>
                <h4 className="mb-2 text-xl font-semibold text-indigo-600">
                  {title}
                </h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="bg-[#ffffff] py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-sky-700 sm:text-5xl">
            Ready to Explore AI Like Never Before?
          </h2>
          <p className="mb-8 text-gray-600 text-base sm:text-lg">
            Dive into hundreds of AI tools with smart filtering and direct
            access.
            <br className="hidden sm:inline" />
            No clutter. No confusion. Just innovation.
          </p>
          <a
            href="/#trendinAI"
            className="inline-block rounded-full bg-gradient-to-r from-sky-600 to-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Browse All AI Tools
          </a>
        </div>
      </section>
    </>
  );
}
