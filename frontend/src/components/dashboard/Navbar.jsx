import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => {
    const baseClass = "text-lg font-bold py-5 transition-colors tracking-tight";
    const activeClass = "text-[#0f172a] border-b-2 border-[#1e293b]";
    const inactiveClass = "text-gray-400 hover:text-[#0f172a]";

    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-12 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
          <img src="/logo-white.png" alt="GrantFit AI Logo" className="h-10 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(30%) saturate(3860%) hue-rotate(211deg) brightness(93%) contrast(93%)' }} />
          <span className="text-xl text-[#0f172a] ml-3" style={{ fontFamily: '"Gravitas One", serif' }}>GrantFit AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link to="/tracking" className={getLinkClass('/tracking')}>Tracking</Link>
          <Link to="/credits" className={getLinkClass('/credits')}>Credits</Link>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-100 pl-6 ml-2">
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 border border-slate-200 shadow-sm cursor-pointer hover:ring-4 hover:ring-slate-50 transition-all"
          >
            JD
          </Link>
          <Link
            to="/"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
