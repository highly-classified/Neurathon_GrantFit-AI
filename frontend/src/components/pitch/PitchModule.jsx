import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PitchModule = () => {
    const { grantId } = useParams();
    const [pitchText, setPitchText] = useState("Our innovative Bio-Tech solution targets the metabolic signaling pathways in specific rare diseases. By leveraging our proprietary CRISPR-based delivery mechanism, we can achieve high-fidelity cellular updates with minimal off-target effects. This NSF Phase I proposal focuses on the commercial feasibility of the platform within clinical trials over the next 18 months...");

    // In a real app, you'd fetch the grant details based on grantId
    const grantDetails = {
        name: "NSF Phase I",
        org: "Bio-Tech Solutions"
    };

    return (
        <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans">
            <div className="relative flex h-screen w-full flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3 z-10">
                    <Link to="/dashboard" className="flex items-center gap-4 text-[#1347ae]">
                        <div className="size-8">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                        <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">GranFit AI</h2>
                    </Link>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="flex items-center gap-9">
                            <Link className="text-slate-600 hover:text-[#1347ae] text-sm font-medium transition-colors" to="/dashboard">Dashboard</Link>
                            <a className="text-slate-600 hover:text-[#1347ae] text-sm font-medium transition-colors" href="#">Grant Search</a>
                            <Link className="text-slate-600 hover:text-[#1347ae] text-sm font-medium transition-colors" to="/tracking">My Proposals</Link>
                            <a className="text-slate-600 hover:text-[#1347ae] text-sm font-medium transition-colors" href="#">Resources</a>
                        </nav>
                        <div className="flex gap-2">
                            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                <span className="material-symbols-outlined">help</span>
                            </button>
                        </div>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARWEBSXE4d4NnCbHDsj329Dg6_L9A1ETnSMq-XolAmQ22OVRZGe-55iQcmkM2VwpcP4w0SZfBbgKKvjSnviKW1G7SrOi0uTP187O5kIVdEJdbZVnXQkR1KvFlaSgA-oFrrGSW0XTUfj47u6Flhlfmslm_CEr7oXg86Bp67VPMzuDkxV0s6sKLb7M4PI-76rvAE1rJ7_Gdk56HqJwBo4g79hH7ZuiC2MOZUK9M4SbshANRwBw8k-kRNIdHTQQIxC8H21mevqjjx4oo")' }}
                        ></div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Navigation (Contextual) */}
                    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Grant Context</h3>
                            <div className="p-3 bg-[#1347ae]/5 rounded-lg border border-[#1347ae]/10">
                                <h4 className="text-sm font-bold text-[#1347ae]">{grantId || "Grant Details"}</h4>
                                <p className="text-xs text-slate-500 mt-1">{grantDetails.org}</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">dashboard</span>
                                <span className="text-sm font-medium">Overview</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 bg-[#1347ae] text-white rounded-lg transition-colors shadow-sm shadow-[#1347ae]/20" href="#">
                                <span className="material-symbols-outlined text-xl">mic</span>
                                <span className="text-sm font-medium">Practice Pitch</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">description</span>
                                <span className="text-sm font-medium">Guidelines</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">group</span>
                                <span className="text-sm font-medium">Collaborators</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <span className="material-symbols-outlined text-xl">history</span>
                                <span className="text-sm font-medium">History</span>
                            </a>
                        </nav>
                        <div className="mt-auto border-t border-slate-100 pt-4">
                            <Link to="/tracking" className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Back to Details
                            </Link>
                        </div>
                    </aside>

                    {/* Working Area */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#f6f6f8]">
                        {/* Module Header */}
                        <div className="p-8 pb-4 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">In Progress</span>
                                    <span className="text-slate-400 text-sm">/ Practice Pitch Module</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Refine Your Pitch</h1>
                                <p className="text-slate-500 mt-1 max-w-xl">Use AI-driven insights to polish your narrative and increase your chances of securing the {grantId} grant.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined text-lg">save</span> Save Draft
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#1347ae] text-white rounded-lg font-bold text-sm hover:bg-[#1347ae]/90 transition-colors shadow-lg shadow-[#1347ae]/10">
                                    Finalize Pitch
                                </button>
                            </div>
                        </div>

                        {/* Two-Column Layout */}
                        <div className="flex flex-1 p-8 pt-4 gap-8 overflow-hidden">
                            {/* Column 1: Pitch Drafting (Input) */}
                            <div className="flex-[3] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-slate-900">Drafting Zone</span>
                                        <div className="h-4 w-px bg-slate-200"></div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                            <span className="text-xs text-slate-400 font-medium">Auto-saving...</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600" title="Format Bold">
                                            <span className="material-symbols-outlined text-xl">format_bold</span>
                                        </button>
                                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600" title="Add List">
                                            <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
                                        </button>
                                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1347ae]/10 text-[#1347ae] font-bold text-xs hover:bg-[#1347ae]/20 transition-colors">
                                            <span className="material-symbols-outlined text-lg">mic</span> Voice Input
                                        </button>
                                    </div>
                                </div>
                                {/* Editor */}
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                    <textarea
                                        className="w-full h-full border-none focus:ring-0 text-slate-800 text-lg leading-relaxed placeholder:text-slate-300 resize-none font-sans"
                                        placeholder="Start typing your pitch here or click the microphone to dictate..."
                                        value={pitchText}
                                        onChange={(e) => setPitchText(e.target.value)}
                                    ></textarea>
                                </div>
                                {/* Footer Info */}
                                <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <span className="text-xs font-medium text-slate-400">Words: <span className="text-slate-700">{pitchText.split(/\s+/).filter(w => w).length} / 500</span></span>
                                    <button
                                        onClick={() => setPitchText('')}
                                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-base">restart_alt</span> Reset Pitch
                                    </button>
                                </div>
                            </div>

                            {/* Column 2: AI Feedback & Readiness (Analysis) */}
                            <div className="flex-[2] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                                {/* Readiness Dashboard */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Readiness Score</h3>
                                        <span className="px-2 py-0.5 bg-[#1347ae]/10 text-[#1347ae] text-[10px] font-bold rounded">LEVEL 3</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative flex items-center justify-center size-32">
                                            <svg className="size-full transform -rotate-90">
                                                <circle className="text-slate-100" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                                                <circle className="text-[#1347ae]" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset="77.4" strokeLinecap="round" strokeWidth="8"></circle>
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-black text-slate-900">78%</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Strong</span>
                                            </div>
                                        </div>
                                        <p className="text-center text-sm text-slate-500 font-medium">Almost there! Your pitch is well-aligned but needs more technical methodology detail.</p>
                                    </div>
                                </div>

                                {/* Analysis Sections */}
                                <div className="space-y-4">
                                    {/* Clarity Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-500">visibility</span>
                                                <h4 className="text-sm font-bold text-slate-900">Clarity &amp; Jargon</h4>
                                            </div>
                                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex gap-3">
                                                <div className="size-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Language is accessible to generalist reviewers.</p>
                                            </div>
                                            <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                <span className="material-symbols-outlined text-amber-500 text-lg">lightbulb</span>
                                                <p className="text-xs text-amber-800 font-medium italic">"High-fidelity cellular updates" might be too technical; consider "accurate cell modification."</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Structure Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-purple-500">account_tree</span>
                                                <h4 className="text-sm font-bold text-slate-900">Structure</h4>
                                            </div>
                                            <span className="text-xs font-bold text-amber-500">80% COMPLETE</span>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                                <span className="text-sm text-slate-600">Clear Problem Statement</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                                <span className="text-sm text-slate-600">Target Market Identified</span>
                                            </div>
                                            <div className="flex items-center gap-3 opacity-50">
                                                <span className="material-symbols-outlined text-slate-300 text-lg">circle</span>
                                                <span className="text-sm text-slate-600">Explicit Impact Statement missing</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Alignment Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-500">target</span>
                                                <h4 className="text-sm font-bold text-slate-900">Grant Alignment</h4>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">KEYWORDS: 12/15</span>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Bio-Tech</span>
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">CRISPR</span>
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Commercialization</span>
                                                <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded uppercase border border-dashed border-slate-300">Phase I Merit</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-4 leading-relaxed">Great match with NSF focus areas. Increase emphasis on "Commercialization Potential" to hit 100%.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default PitchModule;
