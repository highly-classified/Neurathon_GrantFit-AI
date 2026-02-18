import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import GrantCard from './GrantCard';
import { auth } from '../../firebase';
import { API_ENDPOINTS } from '../../config';

const Dashboard = () => {
  const [eligibleSearch, setEligibleSearch] = useState('');
  const [maybeSearch, setMaybeSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [matches, setMatches] = useState({
    eligible: [],
    partially_eligible: []
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [user, setUser] = useState(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const userId = user?.uid || "user_postman_01"; // Fallback for safety
  const CACHE_KEY = `grant_matches_${userId}`;

  const fetchMatches = async (forceSkeletons = false) => {
    // Only show loading spinner if we have NO data at all
    const hasCache = !!localStorage.getItem(CACHE_KEY);
    if (!hasCache || forceSkeletons === true) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.GRANTS(userId));
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();

      setMatches(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data)); // Persist to local storage
    } catch (err) {
      console.error("Match fetching failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authChecked) return;

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        setMatches(JSON.parse(cachedData));
        setIsLoading(false);
        fetchMatches(false);
      } catch (e) {
        fetchMatches(true);
      }
    } else {
      fetchMatches(true);
    }
  }, [authChecked, user]);

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

  const filteredEligible = (matches.eligible || []).filter(grant => {
    const search = eligibleSearch.toLowerCase();
    return (grant.event_name || "").toLowerCase().includes(search) ||
      (grant.org_name || "").toLowerCase().includes(search);
  }).map(g => mapBackendToUI(g, 'eligible'));

  const filteredMaybe = (matches.partially_eligible || []).filter(grant => {
    const search = maybeSearch.toLowerCase();
    return (grant.event_name || "").toLowerCase().includes(search) ||
      (grant.org_name || "").toLowerCase().includes(search);
  }).map(g => mapBackendToUI(g, 'maybe'));

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 font-['Public Sans',_sans-serif] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Discovery Failed</h2>
          <p className="text-slate-500 mb-8">{error}. Make sure the backend server (node server.js) is running.</p>
          <button
            onClick={() => fetchMatches(true)}
            className="w-full bg-[#1e293b] text-white py-3 rounded-2xl font-bold hover:bg-[#0f172a] transition-all shadow-lg shadow-slate-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                <span className={`${isLoading ? 'animate-pulse bg-blue-400' : 'animate-ping bg-green-400'} absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading || isRefreshing ? 'bg-blue-500' : 'bg-green-500'}`}></span>
              </span>
              {isLoading || isRefreshing ? 'AI is analyzing matches...' : `${(matches.eligible?.length || 0) + (matches.partially_eligible?.length || 0)} matches identified for your profile`}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMatches(true)}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#0f172a] text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all focus:ring-2 focus:ring-gray-100 disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading || isRefreshing ? 'Updating...' : 'Refresh AI Matches'}
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
          <div className="col-span-1 rounded-3xl bg-gray-100 border border-gray-200 p-2">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-[#0f172a]">Eligible</h2>
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 font-bold text-[10px] rounded-md uppercase tracking-tight">{filteredEligible.length} Matches</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-[#1e293b] rounded-lg shadow-md shadow-slate-200 transition-all focus-within:ring-2 focus-within:ring-slate-100">
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
          <div className="col-span-1 rounded-3xl bg-gray-100 border border-gray-200 p-2">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                    <span className="text-xl font-bold">?</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0f172a]">Partially Eligible</h2>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{filteredMaybe.length} Potential</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[#1e293b] border border-[#1e293b] rounded-lg shadow-md shadow-slate-200 transition-all focus-within:ring-2 focus-within:ring-slate-100">
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
