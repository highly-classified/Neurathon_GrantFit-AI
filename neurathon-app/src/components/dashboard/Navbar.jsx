import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-[#0f172a] tracking-tight">GranFit AI</span>
        </div>

        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 w-80">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search grants, agencies, or ke..."
            className="ml-2 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium text-[#0f172a] border-b-2 border-[#1e293b] py-5">Dashboard</Link>
          <Link to="#" className="text-sm font-medium text-gray-500 hover:text-[#0f172a] transition-colors py-5">Grant Match</Link>
          <Link to="/tracking" className="text-sm font-medium text-gray-500 hover:text-[#0f172a] transition-colors py-5">Tracking</Link>
          <Link to="#" className="text-sm font-medium text-gray-500 hover:text-[#0f172a] transition-colors py-5">Analytics</Link>
          <Link to="#" className="text-sm font-medium text-gray-500 hover:text-[#0f172a] transition-colors py-5">Settings</Link>
        </div>

        <div className="flex items-center gap-4 border-l border-gray-100 pl-6 ml-2">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-100 shadow-sm cursor-pointer">
            JD
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
