import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => {
    const baseClass = "text-lg font-bold py-5 transition-colors tracking-tight";
    const activeClass = "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]";
    const inactiveClass = "text-gray-400 hover:text-[var(--color-primary)]";

    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--color-background)] border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-12 z-50 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
          <img 
            src="/logo-white.png" 
            alt="GrantFit AI Logo" 
            className="h-10 w-auto transition-all" 
            style={{ 
              filter: theme === 'dark' 
                ? 'brightness(0) invert(1)' 
                : 'brightness(0) saturate(100%) invert(13%) sepia(30%) saturate(3860%) hue-rotate(211deg) brightness(93%) contrast(93%)' 
            }} 
          />
          <span className="text-xl text-[var(--color-primary)] ml-3" style={{ fontFamily: '"Gravitas One", serif' }}>GrantFit AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link to="/tracking" className={getLinkClass('/tracking')}>Tracking</Link>
          <Link to="/credits" className={getLinkClass('/credits')}>Credits</Link>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-100 dark:border-slate-800 pl-6 ml-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all mr-2"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:ring-4 hover:ring-slate-50 dark:hover:ring-slate-900 transition-all font-sans"
          >
            JD
          </Link>
          <Link
            to="/"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
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
