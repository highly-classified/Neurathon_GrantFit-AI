import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => {
    const baseClass = "text-sm font-medium py-5 transition-colors";
    const activeClass = "text-[#0f172a] border-b-2 border-[#1e293b]";
    const inactiveClass = "text-gray-500 hover:text-[#0f172a]";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 group cursor-pointer">
          <img src="/logo-white.png" alt="GrantFit AI Logo" className="h-10 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(30%) saturate(3860%) hue-rotate(211deg) brightness(93%) contrast(93%)' }} />
          <span className="text-xl text-[#0f172a]" style={{ fontFamily: '"Gravitas One", serif' }}>GrantFit AI</span>
        </div>


      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link to="/tracking" className={getLinkClass('/tracking')}>Tracking</Link>
          <Link to="/credits" className={getLinkClass('/credits')}>Credits</Link>
        </div>

        <div className="flex items-center gap-4 border-l border-gray-100 pl-6 ml-2">




          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all"
          >
            JD
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
