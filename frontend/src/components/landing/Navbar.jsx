import React, { useState, useEffect } from 'react';
import { Menu, X, CircleDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <nav
      className={clsx(
        'fixed w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/10 backdrop-blur-md border-b border-white/10 shadow-sm'
          : 'bg-white/10 backdrop-blur-sm'
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <CircleDashed className="h-8 w-8 text-[var(--color-primary)] animate-spin-slow" />
            <span className="ml-2 text-2xl text-white" style={{ fontFamily: '"Gravitas One", serif' }}>
              GrantFit AI
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white/80"
                  )}
                >
                  {link.name}
                </a>
              ))}
              <button onClick={() => window.location.href = '/login'} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(15,23,42,0.3)] hover:shadow-[0_0_25px_rgba(15,23,42,0.5)] cursor-pointer text-sm">
                SIGN IN / SIGN UP
              </button>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--color-surface)] border-b border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-[var(--color-primary)] block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button onClick={() => window.location.href = '/login'} className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded-full font-medium transition-all text-sm">
                SIGN IN / SIGN UP
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
