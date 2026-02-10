import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import GrantCard from './GrantCard';

const Dashboard = () => {
  const [eligibleSearch, setEligibleSearch] = useState('');
  const [maybeSearch, setMaybeSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [matches, setMatches] = useState({
    eligible: [],
    partially_eligible: []
  });

  // For demo/testing purposes, using a fixed userId
  // In a real app, this would come from an Auth context
  const userId = "user_postman_01";

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/api/grants/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error("Match fetching failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const formatCurrency = (amount) => {
    if (!amount) return "TBD";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const mapBackendToUI = (grant, type) => ({
    id: grant.id,
    title: grant.event_name || "Untitled Opportunity",
    org: grant.org_name || "Unknown Organization",
    tags: grant.tags || [],
    funding: formatCurrency(grant.funding_profile?.max_amt),
    deadline: grant.reg_end_date || "Rolling",
    warning: grant.confidence_tag, // Use confidence tag as the warning/badge
    type: type // 'eligible' or 'maybe'
  });

  const filteredEligible = matches.eligible
    .map(g => mapBackendToUI(g, 'eligible'))
    .filter(g =>
      g.title.toLowerCase().includes(eligibleSearch.toLowerCase()) ||
      g.org.toLowerCase().includes(eligibleSearch.toLowerCase())
    );

  const filteredMaybe = matches.partially_eligible
    .map(g => mapBackendToUI(g, 'maybe'))
    .filter(g =>
      g.title.toLowerCase().includes(maybeSearch.toLowerCase()) ||
      g.org.toLowerCase().includes(maybeSearch.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20 font-['Public Sans',_sans-serif] transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1600px] mx-auto pt-32 pb-32 px-6">

        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2 tracking-tight transition-colors">Grant Discovery</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <span className="relative flex h-2 w-2">
                <span className={`${isLoading ? 'animate-pulse bg-blue-400' : 'animate-ping bg-green-400'} absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-blue-500' : 'bg-green-500'}`}></span>
              </span>
              {isLoading ? 'AI is analyzing matches...' : `${matches.eligible.length + matches.partially_eligible.length} matches identified for your profile`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMatches}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-surface)] border border-gray-200 dark:border-slate-800 text-[var(--color-primary)] text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm transition-all focus:ring-2 focus:ring-gray-100 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Updating...' : 'Refresh AI Matches'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm">Error: {error}. Make sure the backend server (node server.js) is running.</span>
          </div>
        )}

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Main Eligible Column */}
          <div className="col-span-1 rounded-3xl bg-[var(--color-surface)] dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-2 transition-colors">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)] transition-colors">Eligible</h2>
                  <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 font-bold text-[10px] rounded-md uppercase tracking-tight transition-colors">{filteredEligible.length} Matches</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] dark:bg-slate-800 border border-[var(--color-primary)] dark:border-slate-700 rounded-lg shadow-md transition-all focus-within:ring-2 focus-within:ring-slate-100">
                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    disabled={isLoading}
                    className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-gray-400 w-20 focus:w-32 transition-all"
                    value={eligibleSearch}
                    onChange={(e) => setEligibleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 h-40 animate-pulse border border-gray-100"></div>
                  ))
                ) : filteredEligible.length > 0 ? (
                  filteredEligible.map((grant) => (
                    <GrantCard key={grant.id} {...grant} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
                    <p className="text-sm font-bold text-gray-400">No eligible grants found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Potentially Eligible Column */}
          <div className="col-span-1 rounded-3xl bg-[var(--color-surface)] dark:bg-slate-900/40 border border-gray-200 dark:border-slate-800 p-2 transition-colors">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <span className="text-xl font-bold">?</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--color-primary)] transition-colors">Partially Eligible</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredMaybe.length} Potential</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] dark:bg-slate-800 border border-[var(--color-primary)] dark:border-slate-700 rounded-lg shadow-md transition-all focus-within:ring-2 focus-within:ring-slate-100">
                  <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    disabled={isLoading}
                    className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-gray-400 w-20 focus:w-32 transition-all"
                    value={maybeSearch}
                    onChange={(e) => setMaybeSearch(e.target.value)}
                  />
                </div>

              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 h-32 animate-pulse border border-gray-100"></div>
                  ))
                ) : filteredMaybe.length > 0 ? (
                  filteredMaybe.map((grant) => (
                    <GrantCard key={grant.id} {...grant} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 opacity-60">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Analysis Complete: No potential fits identified.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
