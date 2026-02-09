import React, { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Rocket className="w-8 h-8 text-[#0a192f]" />
          <span className="text-xl font-bold text-[#0a192f]">GrantMatch AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-gray-600 hover:text-[#0a192f] font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-[#0a192f] font-medium transition-colors">How it Works</a>
          <a href="#pricing" className="text-gray-600 hover:text-[#0a192f] font-medium transition-colors">Pricing</a>
          <Link to="/login" className="bg-[#0a192f] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#112240] transition-colors">
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#0a192f]" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden overflow-hidden"
            >
              <nav className="flex flex-col p-4 space-y-4">
                <a href="#features" className="text-gray-600 hover:text-[#0a192f] font-medium" onClick={toggleMenu}>Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-[#0a192f] font-medium" onClick={toggleMenu}>How it Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-[#0a192f] font-medium" onClick={toggleMenu}>Pricing</a>
                <Link to="/login" className="bg-[#0a192f] text-white px-6 py-3 rounded-lg font-medium w-full text-center" onClick={toggleMenu}>
                  Get Started
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
