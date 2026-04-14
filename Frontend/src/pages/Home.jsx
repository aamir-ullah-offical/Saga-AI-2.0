// src/pages/Home.jsx
import { motion } from "framer-motion";
import TrendingAI from "../components/AI/TrendingAI";
import AllAIs from "../components/AI/AllAIs";
import FAQ from "../components/faq/FAQ";
import Contact from "../components/common/Contact";
import Testimonials from "../components/Testimmonals/Testimonals";
import AddTestimonial from "../components/Testimmonals/AddTestimonial";

const parent = { show: { transition: { staggerChildren: 0.15 } } };
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/* header sizes */
const HEADER_H = 104; // 40-px topbar + 64-px nav
const TRENDING_GAP = 64; // customise only Trending section

/* sentinel helper */
const Anchor = ({ id, offset = HEADER_H }) => (
  <span
    id={id}
    className={`pointer-events-none block -mt-[${offset}px] h-0`}
    aria-hidden="true"
  />
);

export default function Home() {
  return (
    <motion.main
      className="main scroll-smooth"
      variants={parent}
      initial="hidden"
      animate="show"
    >
      {/* Trending Tools — uses its own smaller offset */}
      <motion.section variants={item}>
        <Anchor id="trendinAI" offset={TRENDING_GAP} />
        <TrendingAI />
      </motion.section>

      {/* All Tools */}
      <motion.section variants={item}>
        <Anchor id="allAIs" />
        <AllAIs />
      </motion.section>

      {/* FAQ */}
      <motion.section variants={item}>
        <Anchor id="faq" />
        <FAQ />
      </motion.section>

      {/* Contacet */}
      <motion.section variants={item}>
        <Anchor id="contact" />
        <Contact />
      </motion.section>

      {/* Testimonials */}
      <motion.section variants={item}>
        <Anchor id="testimonials" />
        <Testimonials />
      </motion.section>

      {/* Testimonals Review */}
      <motion.section variants={item}>
        <Anchor id="Review" />
        <AddTestimonial />
      </motion.section>
    </motion.main>
  );
}
