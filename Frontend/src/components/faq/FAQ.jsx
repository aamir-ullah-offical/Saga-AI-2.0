// src/components/FAQ.jsx
import { useState, useRef, useEffect } from 'react';
import { BiChevronRight } from 'react-icons/bi';

const FAQ_DATA = [
  {
    q: 'What is Saga AI?',
    a: 'Saga AI is a platform offering a variety of AI tools and services for multiple sectors. It simplifies AI adoption through an intuitive interface and diverse functionality.',
  },
  {
    q: 'How do I use the AI tools available on Saga AI?',
    a: 'Browse our AI gallery, apply filters, and choose the tools that fit your needs. Each tool comes with documentation and quick-start examples.',
  },
  {
    q: 'Can I integrate Saga AI tools into my project?',
    a: 'Yes. Most tools expose APIs for seamless integration into existing applications, platforms, and workflows.',
  },
  {
    q: 'What types of AI tools are available?',
    a: 'Natural-Language Processing, Computer Vision, Automation, and many more. Explore categories to find what you need.',
  },
  {
    q: 'Are Saga AI tools beginner-friendly?',
    a: 'Absolutely. Many solutions feature no-code or low-code interfaces plus step-by-step tutorials.',
  },
  {
    q: 'How can I stay updated on new tools and features?',
    a: 'Sign up for our newsletter or follow Saga AI on social media for the latest releases and updates.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section id="faq" className="py-16 bg-white">
      {/* ── Heading ── */}
      <div className="relative mb-14 text-center">
        {/* glow behind text */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-24 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full
                        bg-gradient-to-r from-[#002244]/30 via-sky-500/40 to-sky-300/30 blur-3xl" />
        <h2 className="inline-block bg-gradient-to-r from-[#002244] via-sky-500 to-sky-300 
                       bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Frequently&nbsp;Asked&nbsp;Questions
        </h2>
      </div>

      {/* ── Accordion ── */}
      <div className="container mx-auto max-w-3xl px-4">
        {FAQ_DATA.map(({ q, a }, idx) => {
          const open = openId === idx;
          return (
            <FAQItem
              key={idx}
              question={q}
              answer={a}
              open={open}
              onToggle={() => toggle(idx)}
            />
          );
        })}
      </div>
    </section>
  );
}

/* --------- sub-component with smooth transition --------- */
function FAQItem({ question, answer, open, onToggle }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  /* measure answer height once (on mount & when content changes) */
  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [answer]);

  return (
    <div className="mb-4 rounded-xl border border-sky-100 bg-white shadow transition-shadow hover:shadow-md">
      {/* question row */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-base font-semibold text-slate-800">{question}</span>
        <BiChevronRight
          className={`text-2xl transition-transform duration-300 ${
            open ? 'rotate-90 text-sky-500' : ''
          }`}
        />
      </button>

      {/* answer with smooth max-height */}
      <div
        className="overflow-hidden px-6 transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? height : 0 }}
      >
        <p ref={ref} className="pb-4 text-sm leading-relaxed text-slate-600">
          {answer}
        </p>
      </div>
    </div>
  );
}
