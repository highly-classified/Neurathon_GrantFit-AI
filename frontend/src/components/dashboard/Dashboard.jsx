import React from 'react';
import Navbar from './Navbar';
import GrantCard from './GrantCard';

const Dashboard = () => {
  const [eligibleSearch, setEligibleSearch] = React.useState('');
  const [maybeSearch, setMaybeSearch] = React.useState('');

  const [matches, setMatches] = React.useState({
    eligible: [
      {
        id: "DOE-EERE-2024",
        title: "Clean Energy Innovation Grant",
        org: "Department of Energy (DOE)",
        tags: ["Federal", "Energy"],
        funding: "$500,000",
        deadline: "In 5 Days",
        deadlineUrgent: true
      },
      {
        id: "NSF-2023-AI-042",
        title: "NSF SBIR Phase I: AI & Quantum Tech",
        org: "National Science Foundation",
        tags: ["Federal", "Technology", "Priority Application"],
        funding: "$275,000",
        deadline: "Oct 24, 2024"
      }
    ],
    partially_eligible: [
      {
        id: "UNI-RD-2024",
        title: "University R&D Commercialization",
        org: "Academic Innovation Hub",
        tags: ["Research", "Academic"],
        funding: "$50,000",
        deadline: "Dec 1, 2024",
        warning: "Possible match with your specialization in high-fidelity signaling.",
        type: "maybe"
      }
    ]
  });

  const filteredEligible = matches.eligible.filter(g =>
    g.title.toLowerCase().includes(eligibleSearch.toLowerCase()) ||
    g.org.toLowerCase().includes(eligibleSearch.toLowerCase())
  );

  const filteredMaybe = matches.partially_eligible.filter(g =>
    g.title.toLowerCase().includes(maybeSearch.toLowerCase()) ||
    g.org.toLowerCase().includes(maybeSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6f6f8] pb-20 font-['Public Sans',_sans-serif]">
      <Navbar />

      <main className="max-w-[1600px] mx-auto pt-32 pb-32 px-6">


        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">Grant Discovery</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              42 new matches identified for your startup profile
            </div>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </div>



        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Main Eligible Column */}
          <div className="col-span-1 rounded-3xl bg-gray-100 border border-gray-200 p-2">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">Eligible Grants</h2>
                    <span className="text-xs font-bold text-green-600 uppercase tracking-tight">{filteredEligible.length} Matches</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#1e293b] rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-100 cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none outline-none text-xs font-normal text-white placeholder-white/70 w-48 focus:w-64 transition-all"
                    value={eligibleSearch}
                    onChange={(e) => setEligibleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredEligible.map((grant, idx) => (
                  <GrantCard key={idx} {...grant} />
                ))}
              </div>
            </div>
          </div>

          {/* Side Potentially Eligible Column */}
          <div className="col-span-1 rounded-3xl bg-gray-100 border border-gray-200 p-2">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <span className="text-xl font-bold">?</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">May Be Eligible</h2>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-tight">{filteredMaybe.length} Potential</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#1e293b] rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-100 cursor-pointer">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent border-none outline-none text-xs font-normal text-white placeholder-white/70 w-48 focus:w-64 transition-all"
                    value={maybeSearch}
                    onChange={(e) => setMaybeSearch(e.target.value)}
                  />
                </div>

              </div>

              <div className="space-y-4">
                {filteredMaybe.map((grant, idx) => (
                  <GrantCard key={idx} {...grant} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
