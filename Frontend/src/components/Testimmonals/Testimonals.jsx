// src/components/Testimonials.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const timeout = useRef(null);

  /* fetch testimonials */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/testimonials');
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  /* autoplay every 5 s */
  useEffect(() => {
    if (!items.length) return;
    timeout.current = setTimeout(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearTimeout(timeout.current);
  }, [index, items.length]);

  const go = (dir) => {
    clearTimeout(timeout.current);
    setIndex((i) =>
      dir === 'prev' ? (i - 1 + items.length) % items.length : (i + 1) % items.length
    );
  };

  if (!items.length) return null;

  return (
    <section
      id="testimonials"
      className="relative flex min-h-[500px] items-center justify-center bg-cover bg-center bg-fixed py-14 text-white"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080?blur=3')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-2xl px-4">
        <h2 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-wide md:text-4xl">
          What&nbsp;Our&nbsp;Clients&nbsp;Say
        </h2>

        {/* slider */}
        <div className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {items.map(({ _id, name, profileImage, testimonialText, rating }) => (
              <div key={_id} className="min-w-full px-10 py-12 text-center">
                <img
                  src={profileImage}
                  alt={name}
                  className="mx-auto mb-6 h-40 w-40 rounded-full border-4 border-cyan-500 object-cover shadow-lg animate-fadeIn"
                />
                <span className="block text-xl font-semibold uppercase tracking-wide">{name}</span>
                <p className="relative mx-auto mt-4 max-w-lg text-sm italic leading-relaxed text-slate-200">
                  <span className="absolute -left-3 -top-3 text-4xl text-cyan-400">“</span>
                  {testimonialText}
                  <span className="absolute -bottom-6 -right-3 text-4xl text-cyan-400">”</span>
                </p>

                {/* rating */}
                <div className="mt-6 flex justify-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < rating ? 'opacity-100' : 'opacity-20'} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex justify-center gap-6">
          {['prev', 'next'].map((d) => (
            <button
              key={d}
              onClick={() => go(d)}
              className="relative flex h-12 w-12 items-center justify-center rounded-full
                         border-2 border-white bg-cyan-500 text-white shadow-lg transition
                         hover:scale-110 hover:bg-cyan-600 focus:outline-none"
            >
              {d === 'prev' ? <FaChevronLeft /> : <FaChevronRight />}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500/60" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
