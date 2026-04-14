// src/components/TrendingAI.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFire, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AiModal from './AiModal';

const BATCH = 8;

export default function TrendingAI() {
  const [data, setData]     = useState([]);
  const [visible, setVis]   = useState(BATCH);
  const [active, setActive] = useState(null);
  const [open,   setOpen]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/ai');
        setData(
          data
            .filter((d) => d.trending)
            .map((d) => ({
              id: d._id,
              name: d.title,
              img: d.aiImage,
              link: d.link,
              category: d.useCases?.[0] || 'General',
              raw: d,
            })),
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const showMore = () => setVis((v) => Math.min(v + BATCH, data.length));
  const showLess = () => setVis(BATCH);

  const listVars = { show: { transition: { staggerChildren: 0.05 } } };
  const cardVars = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <>
      <section id="trendinAI" className="py-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="relative inline-block text-4xl sm:text-5xl font-extrabold">
              <span className="bg-gradient-to-r from-sky-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
                Trending&nbsp;AI&nbsp;Tools
              </span>
              <span className="absolute left-1/2 top-full mt-2 h-[6px] w-24 -translate-x-1/2 rounded-full bg-accent/90 blur-[1px]" />
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Hot picks the community can’t stop buzzing about.
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={visible}
              variants={listVars}
              initial="hidden"
              animate="show"
              layout
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {data.slice(0, visible).map((ai) => (
                <motion.article
                  key={ai.id}
                  variants={cardVars}
                  whileHover={{ scale: 1.03 }}
                  className="group relative rounded-3xl p-[2px] bg-gradient-to-br
                             from-sky-500 via-sky-300 to-white/0 hover:via-sky-400
                             overflow-hidden shadow-lg shadow-black/10 transition hover:shadow-xl cursor-pointer"
                  onClick={() => {
                    setActive(ai.raw);
                    setOpen(true);
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/60 backdrop-blur-md">
                    <span className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-red-600 px-2 py-[2px] text-[11px] font-bold uppercase text-white shadow-md">
                      <FaFire className="text-yellow-300" /> Hot
                    </span>

                    <img
                      src={ai.img}
                      alt={ai.name}
                      className="h-60 w-full rounded-t-3xl object-cover transition duration-500 grayscale group-hover:scale-105 group-hover:grayscale-0"
                    />

                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl
                                    bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300
                                    group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow">
                        Explore <FaArrowRight className="text-xs" />
                      </span>
                    </div>

                    <div className="rounded-b-3xl bg-white/85 px-6 py-4 text-center backdrop-blur">
                      <h3 className="text-lg font-semibold text-heading">{ai.name}</h3>
                      <span className="text-xs tracking-wider text-default/70">{ai.category}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-center gap-6">
            {visible < data.length && (
              <button
                onClick={showMore}
                className="rounded-full bg-gradient-to-r from-blue-800 via-sky-500 to-blue-400 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Show&nbsp;More
              </button>
            )}
            {visible > BATCH && (
              <button
                onClick={showLess}
                className="rounded-full bg-gradient-to-r from-red-600 via-red-400 to-red-300 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Show&nbsp;Less
              </button>
            )}
          </div>
        </div>
      </section>

      {active && <AiModal open={open} onClose={() => setOpen(false)} data={active} />}
    </>
  );
}
