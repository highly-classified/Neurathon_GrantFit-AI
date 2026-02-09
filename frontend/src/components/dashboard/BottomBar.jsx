import React from 'react';

const BottomBar = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl flex items-center px-6 py-3 gap-8 min-w-[600px] border border-slate-700">
        <div className="flex items-center gap-3 pr-8 border-r border-slate-700">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">AI Match Intelligence active</span>
        </div>

        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Saved (4)</span>
          </button>

          <button className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Match Report</span>
          </button>

          <button className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
