// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiMenu, BiX } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/LoginButton.css';

const BAR_H = 40;

/* nav schema (desktop + mobile) */
const NAV_LINKS = [
  ['Home', '/'],
  ['All Tools', '/#allAIs'],
  ['Trending Tools', '/#trendinAI'],
  ['About', '/about'],
  ['FAQ', '/#faq'],
  ['Contact', '/#contact'],
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > BAR_H);
    handle();
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  /* animation variants */
  const barV = {
    show: { y: 0, opacity: 1, transition: { duration: 0.45 } },
    hide: { y: '-100%', opacity: 0, transition: { duration: 0.45 } },
  };
  const navV = {
    show: { y: 0, transition: { duration: 0.45 } },
    shift: { y: -BAR_H, transition: { duration: 0.45 } },
  };
  const drawer = {
    hidden: { x: '100%', opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } },
  };

  return (
    <header className="sticky top-0 z-[997]">
      {/* ── top bar ── */}
      <motion.div
        variants={barV}
        animate={scrolled ? 'hide' : 'show'}
        className="flex h-10 items-center bg-[#1977cc] px-4 text-sm text-white"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-y-2 sm:justify-between">
          <span className="flex items-center gap-1">
            <i className="bi bi-envelope" />
            <Link to="#contact" className="whitespace-nowrap hover:underline">
              Need Help? Contact Support
            </Link>
          </span>

          <span className="flex items-center gap-4">
            <a href="#"><i className="bi bi-twitter-x" /></a>
            <a href="#"><i className="bi bi-facebook" /></a>
            <a href="#"><i className="bi bi-instagram" /></a>
            <a href="#"><i className="bi bi-linkedin" /></a>
          </span>
        </div>
      </motion.div>

      {/* ── branding + desktop nav ── */}
      <motion.div
        variants={navV}
        animate={scrolled ? 'shift' : 'show'}
        className="w-full bg-[#e4f1fc] shadow-sm backdrop-blur-sm"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* logo */}
          <Link to="/" className="ml-[10px] flex items-center gap-2">
            <img src="/logo.gif" alt="Saga AI" className="h-9 mix-blend-multiply" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--heading-color)' }}>
              Saga AI
            </h1>
          </Link>

          {/* desktop nav */}
          <nav className="hidden xl:flex items-center gap-6 font-[var(--nav-font)]">
            {NAV_LINKS.map(([label, path]) => (
              <Link
                key={label}
                to={path}
                className="relative pb-1 after:absolute after:bottom-0 after:left-0
                           after:h-[2px] after:w-0 after:bg-[var(--nav-hover-color)]
                           after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* login/profile & burger */}
          <div className="flex items-center gap-4">
            {/* Show profile dropdown only on desktop */}
            {isLoggedIn ? (
              <div className="relative hidden xl:block mr-4">
                <button
                  className="text-3xl text-sky-700"
                  onClick={() => setDropdown(!dropdown)}
                >
                  <FaUserCircle />
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-36 rounded-md bg-white py-2 shadow-md z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="button-89 hidden xl:block" role="button">
                Login
              </Link>
            )}

            {/* mobile menu button */}
            <button
              onClick={() => setOpen(true)}
              className="text-3xl xl:hidden"
              aria-label="Open menu"
            >
              <BiMenu />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            variants={drawer}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed right-0 top-0 z-[9998] h-full w-[85%] max-w-xs bg-[#e4f1fc] shadow-lg
                       backdrop-blur-xl xl:hidden"
          >
            {/* close btn */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-3xl text-[var(--nav-color)]"
              aria-label="Close menu"
            >
              <BiX />
            </button>

            <ul className="mt-20 flex flex-col gap-3 px-6">
              {NAV_LINKS.map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="block rounded-md px-4 py-3 font-medium text-[var(--nav-color)]
                               transition hover:bg-[var(--accent-color)] hover:text-[var(--contrast-color)]"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              {/* Login/Logout options at end in mobile */}
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="block rounded-md px-4 py-3 font-medium text-[var(--nav-color)]
                                 transition hover:bg-[var(--accent-color)] hover:text-[var(--contrast-color)]"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full text-left rounded-md px-4 py-3 font-medium text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="block rounded-md px-4 py-3 font-medium text-[var(--nav-color)]
                               transition hover:bg-[var(--accent-color)] hover:text-[var(--contrast-color)]"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}
