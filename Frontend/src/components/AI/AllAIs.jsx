// src/components/AllAIs.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { FaSearch, FaArrowRight, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AiModal from './AiModal';

const FIRST = 20;
const BATCH = 8;

/* filter definitions matching schema names */
const FILTER_FIELDS = [
  { label: 'By Name',                    key: 'name'      },
  { label: 'By Category',                key: 'useCases'  },
  { label: 'By Feature',                 key: 'features'  },
  { label: 'By Coverage',                key: 'coverage'  },
];

export default function AllAIs() {
  const [query, setQuery]       = useState('');
  const [count, setCount]       = useState(FIRST);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState(null);
  const [data, setData]         = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(new Set(['name', 'useCases'])); // default
  const dropdownRef             = useRef(null);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/ai');
        setData(
          data.map((d) => ({
            id:        d._id,
            name:      d.title,
            img:       d.aiImage,
            link:      d.link,
            useCases:  d.useCases.join(', '),          // string for search
            useCasesArr: d.useCases,                   // array for badges
            features:  (d.features || []).join(', '),
            coverage:  d.coverage || '',
            raw:       d,
          }))
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleFilter = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  /* filtering */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) => (
      (selected.has('name')     && d.name.toLowerCase().includes(q))      ||
      (selected.has('useCases') && d.useCases.toLowerCase().includes(q))  ||
      (selected.has('features') && d.features.toLowerCase().includes(q))  ||
      (selected.has('coverage') && d.coverage.toLowerCase().includes(q))
    ));
  }, [query, data, selected]);

  /* pagination */
  const slice        = filtered.slice(0, count);
  const canShowMore  = count < filtered.length;
  const canShowLess  = count > FIRST;

  /* motion vars */
  const parentVars = { show: { transition: { staggerChildren: 0.05 } } };
  const cardVars   = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  /* modal open */
  const openModal = (ai) => {
    setActive(ai.raw);
    setOpen(true);
  };

  return (
    <>
      <section className="bg-[#e4f1fc] py-16" id="allAIs">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl sm:text-5xl font-extrabold tracking-tight
                         bg-gradient-to-r from-[#002244] via-sky-500 to-sky-300
                         bg-clip-text text-transparent">
            Explore All AI Tools
          </h2>

          {/* Search + Filters */}
          <div className="mx-auto mb-12 max-w-xl relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCount(FIRST);
              }}
              placeholder="Search tools, features, coverage…"
              className="w-full rounded-lg bg-white/90 py-3 pl-12 pr-32 text-sm shadow-md ring-1
                         ring-black/5 placeholder-gray-400 focus:ring-2 focus:ring-accent
                         focus:outline-none"
            />

            {/* Filters dropdown */}
            <div ref={dropdownRef} className="absolute top-1/2 right-2 -translate-y-1/2">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1 rounded-md bg-sky-100 px-3 py-1.5
                           text-xs font-medium text-sky-700 hover:bg-sky-200"
              >
                <FaFilter /> Filters
              </button>

              {filterOpen && (
                <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg bg-white p-4
                                shadow-xl ring-1 ring-slate-200">
                  <p className="mb-2 text-sm font-semibold text-slate-700">Search in:</p>
                  <ul className="space-y-2">
                    {FILTER_FIELDS.map((f) => (
                      <li key={f.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                          checked={selected.has(f.key)}
                          onChange={() => toggleFilter(f.key)}
                          id={`check-${f.key}`}
                        />
                        <label htmlFor={`check-${f.key}`} className="text-sm text-slate-600">
                          {f.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={query + count + [...selected].join(',')}
              variants={parentVars}
              initial="hidden"
              animate="show"
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {slice.map((ai) => (
                <motion.div
                  key={ai.id}
                  variants={cardVars}
                  whileHover={{ scale: 1.03 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl
                             border border-slate-200 bg-white shadow-sm hover:shadow-lg
                             hover:ring-2 hover:ring-accent/60 cursor-pointer"
                  onClick={() => openModal(ai)}
                >
                  <img src={ai.img} alt={ai.name} className="h-56 w-full object-cover" />

                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-900">{ai.name}</h3>
                      <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Explore <FaArrowRight />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 sm:items-end">
                      {ai.useCasesArr.map((uc) => (
                        <span
                          key={uc}
                          className="whitespace-nowrap rounded-full bg-sky-100 px-3 py-[2px]
                                     text-[10px] font-semibold uppercase tracking-wider text-sky-700"
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination buttons */}
          <div className="mt-14 flex justify-center gap-6">
            {canShowMore && (
              <button
                onClick={() => setCount((c) => Math.min(c + BATCH, filtered.length))}
                className="rounded-full bg-gradient-to-r from-[#002244] via-sky-500 to-sky-300
                           px-8 py-3 text-sm font-semibold text-white shadow-lg transition
                           hover:-translate-y-0.5 hover:brightness-110"
              >
                Show&nbsp;More
              </button>
            )}
            {canShowLess && (
              <button
                onClick={() => setCount(FIRST)}
                className="rounded-full bg-gradient-to-r from-red-600 via-red-400 to-red-300
                           px-8 py-3 text-sm font-semibold text-white shadow-lg transition
                           hover:-translate-y-0.5 hover:brightness-110"
              >
                Show&nbsp;Less
              </button>
            )}
          </div>
        </div>
      </section>

      {/* modal */}
      {active && (
        <AiModal
          open={open}
          onClose={() => setOpen(false)}
          data={active}
        />
      )}
    </>
  );
}
