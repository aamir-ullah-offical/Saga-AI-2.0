// src/components/AiModal.jsx
import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function AiModal({ open, onClose, data }) {
  if (!data) return null;

  const { img, title, desc, useCases, coverage, pricing, features, link } = data;

  /* ╭─ lock body scroll w/out jump ─╮ */
  useEffect(() => {
    if (!open) return;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  /* detect internal vs external */
  const isExternal = /^https?:\/\//i.test(link);

  /* shared button classes w/ richer hover */
  const btnCls =
    'inline-flex items-center gap-2 rounded-md bg-gradient-to-r ' +
    'from-[#002244] via-sky-500 to-sky-300 px-8 py-2 text-lg font-semibold ' +
    'text-white shadow transition-transform duration-150 ' +
    'hover:-translate-y-0.5 hover:brightness-110';

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-4"
        >
          <Dialog.Panel style={{ scrollbarGutter: 'stable' }} className="fixed inset-0 overflow-y-scroll">
            {/* close */}
            <button
              onClick={onClose}
              className="fixed right-6 top-6 z-[10001] flex h-12 w-12 items-center justify-center rounded-full
                         bg-gradient-to-br from-white/70 via-sky-300 to-[#003366] text-black
                         shadow-lg backdrop-blur-lg transition hover:scale-105"
            >
              <span className="sr-only">Close</span>✕
            </button>

            {/* hero */}
            <div className="relative h-screen w-full">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-28 text-center -translate-y-5">
                <h2 className="mb-3 bg-gradient-to-r from-white via-sky-300 to-blue-800 bg-clip-text text-5xl font-extrabold text-transparent">
                  {title}
                </h2>
                <p className="max-w-3xl text-lg text-gray-300">{desc}</p>
              </div>
            </div>

            {/* details */}
            <div className="py-10">
              <Section title="Best Use-Cases (Category)">
                <ul className="list-disc space-y-1 pl-8 text-gray-300">
                  {useCases.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </Section>

              <Section title="Industry Coverage">
                <p className="text-gray-300">{coverage}</p>
              </Section>

              <Section title="Pricing">
                <p className="text-gray-300">{pricing}</p>
              </Section>

              <Section title="Features">
                <ul className="list-disc space-y-1 pl-8 text-gray-300">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* footer w/ smart Visit button */}
            <div className="sticky bottom-0 z-50 flex justify-end bg-black/80 px-8 py-4 backdrop-blur">
              {isExternal ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className={btnCls}>
                  Visit <FaArrowRightLong />
                </a>
              ) : (
                <RouterLink to={link} onClick={onClose} className={btnCls}>
                  Visit <FaArrowRightLong />
                </RouterLink>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

/* helper */
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h5 className="mb-4 px-6 bg-gradient-to-r from-white via-sky-400 to-blue-800 bg-clip-text text-2xl font-bold text-transparent">
        {title}
      </h5>
      <div className="px-8">{children}</div>
    </div>
  );
}
