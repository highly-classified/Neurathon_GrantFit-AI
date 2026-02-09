import React from 'react';

const FilterBar = () => {
  const filters = [
    { label: 'Funding Range', active: false },
    { label: 'Industry', active: false },
    { label: 'Deadline', active: false },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-6 bg-white border border-gray-100 rounded-2xl shadow-sm mb-8">
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            {filter.label}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ))}

      </div>

      <div className="flex items-center gap-8 pr-2">
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Volume</p>
          <p className="text-lg font-bold text-[#1e293b]">$12.4M</p>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
