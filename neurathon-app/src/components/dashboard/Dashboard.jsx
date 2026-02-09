import React from 'react';
import Navbar from './Navbar';
import GrantCard from './GrantCard';
import BottomBar from './BottomBar';

const Dashboard = () => {
  const eligibleGrants = [
    {
      title: "Clean Energy Innovation Grant",
      org: "Department of Energy (DOE)",
      tags: ["Federal", "Energy"],
      funding: "$500,000",
      deadline: "In 5 Days",
      deadlineUrgent: true
    },
    {
      title: "NSF SBIR Phase I: AI & Quantum Tech",
      org: "National Science Foundation",
      tags: ["Federal", "Technology", "Priority Application"],
      funding: "$275,000",
      deadline: "Oct 24, 2024"
    },
    {
      title: "Future of Work Accelerator",
      org: "Gates Foundation x Tech",
      tags: ["Foundation", "Social Impact"],
      funding: "$1,200,000",
      deadline: "Nov 12, 2024"
    }
  ];

  const mayBeEligible = [
    {
      title: "University R&D Commercialization",
      org: "Academic Innovation Hub",
      tags: ["Research", "Academic"],
      funding: "$50,000",
      deadline: "Dec 1, 2024",
      warning: "Requires partnership with an accredited Tier 1 University research facility.",
      type: "maybe"
    },
    {
      title: "Global Health AI Challenge",
      org: "World Health Partners",
      tags: ["Healthcare", "AI"],
      funding: "$2,500,000",
      deadline: "Jan 15, 2025",
      warning: "Matching funds of 50% required. Organization must be registered as a non-profit.",
      type: "maybe"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Inter',_sans-serif]">
      <Navbar />

      <main className="max-w-[1400px] mx-auto pt-24 pb-32 px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-6">
          <span>Home</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-gray-500">Grant Discovery</span>
        </div>

        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">Grant Discovery Dashboard</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              42 new matches identified for your startup profile
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#0f172a] text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all focus:ring-2 focus:ring-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Matches
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] border border-[#1e293b] text-white text-sm font-bold rounded-xl hover:bg-[#0f172a] shadow-md shadow-slate-200 transition-all focus:ring-4 focus:ring-slate-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Custom Search
            </button>
          </div>
        </div>



        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Eligible Column */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0f172a]">Eligible Grants</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-md uppercase tracking-tight">18 Matches</span>
              </div>
            </div>

            <div className="space-y-4">
              {eligibleGrants.map((grant, idx) => (
                <GrantCard key={idx} {...grant} />
              ))}
            </div>
          </div>

          {/* Side Potentially Eligible Column */}
          <div className="lg:col-span-4 rounded-3xl bg-gray-50/50 border border-gray-100 p-2">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    <span className="text-xl font-bold">?</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0f172a]">May Be Eligible</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">24 Potential</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Show Ineligible</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer overflow-hidden">
                    <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mayBeEligible.map((grant, idx) => (
                  <GrantCard key={idx} {...grant} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default Dashboard;
