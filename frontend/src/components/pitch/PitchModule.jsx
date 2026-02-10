import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Bell,
    HelpCircle,
    LayoutDashboard,
    Mic,
    FileText,
    Users,
    History,
    ArrowLeft,
    Save,
    Bold,
    List,
    RotateCcw,
    Eye,
    CheckCircle2,
    Lightbulb,
    Network,
    Circle,
    Target,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';
import Navbar from '../dashboard/Navbar';

const PitchModule = () => {
    const { grantId } = useParams();
    const [pitchText, setPitchText] = useState("Our innovative Bio-Tech solution targets the metabolic signaling pathways in specific rare diseases. By leveraging our proprietary CRISPR-based delivery mechanism, we can achieve high-fidelity cellular updates with minimal off-target effects. This NSF Phase I proposal focuses on the commercial feasibility of the platform within clinical trials over the next 18 months...");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasEvaluated, setHasEvaluated] = useState(false);
    const [evaluation, setEvaluation] = useState({
        score: 0,
        best_part: "Not evaluated yet.",
        improvement_needed: "Submit your pitch to get feedback.",
        worse_part: "Critical areas will appear here.",
    });

    // In a real app, this would be a fetch() call to the backend
    const simulateBackendAnalysis = async (text) => {
        setIsAnalyzing(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 2000));

        // This simulates the analyzePitchWithAI logic
        const score = 65 + Math.floor(Math.random() * 10);
        setIsAnalyzing(false);
        return {
            score,
            best_part: "The problem statement is clear and the technical approach is innovative.",
            improvement_needed: "Need more focus on market size and commercialization path.",
            worse_part: "The impact metrics are currently too vague for a Phase I proposal.",
        };
    };

    const simulateBackendImprovement = async (text, prev) => {
        setIsAnalyzing(true);
        await new Promise(r => setTimeout(r, 2000));

        const newScore = Math.min(prev.score + 10, 95);
        setIsAnalyzing(false);
        return {
            improved_pitch: text + "\n\n[AI UPDATED]: We have now quantified our target market as $2.4B and established a clear Phase II roadmap with 3 specific clinical partners.",
            score: newScore,
            best_part: "The commercialization potential is now much stronger.",
            improvement_needed: "Fine-tune the budget allocation.",
            worse_part: "Minor clarity issues in the methodology section.",
        };
    };

    const handleEvaluate = async () => {
        const result = await simulateBackendAnalysis(pitchText);
        setEvaluation(result);
        setHasEvaluated(true);
    };

    const handleImprove = async () => {
        if (evaluation.score >= 95) return;
        const result = await simulateBackendImprovement(pitchText, evaluation);
        setPitchText(result.improved_pitch);
        setEvaluation({
            score: result.score,
            best_part: result.best_part,
            improvement_needed: result.improvement_needed,
            worse_part: result.worse_part,
        });
    };

    const grantDetails = {
        name: "NSF Phase I",
        org: "Bio-Tech Solutions"
    };

    return (
        <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans">
            <Navbar />
            <div className="relative flex h-screen w-full flex-col overflow-hidden pt-16">
                {/* Main Content Area */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar Navigation */}
                    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Grant Context</h3>
                            <div className="p-3 bg-[#40484f]/5 rounded-lg border border-[#40484f]/10">
                                <h4 className="text-sm font-bold text-[#40484f]">{grantId || "NSF Phase I"}</h4>
                                <p className="text-xs text-slate-500 mt-1">{grantDetails.org}</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <LayoutDashboard className="size-5" />
                                <span className="text-sm font-medium">Overview</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 bg-[#40484f] text-white rounded-lg transition-colors shadow-sm shadow-[#40484f]/20" href="#">
                                <Mic className="size-5" />
                                <span className="text-sm font-medium">Practice Pitch</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <FileText className="size-5" />
                                <span className="text-sm font-medium">Guidelines</span>
                            </a>

                            <a className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" href="#">
                                <History className="size-5" />
                                <span className="text-sm font-medium">History</span>
                            </a>
                        </nav>
                        <div className="mt-auto border-t border-slate-100 pt-4">
                            <Link to="/tracking" className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                                <ArrowLeft className="size-4" />
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
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">{isAnalyzing ? "Analyzing..." : "In Progress"}</span>
                                    <span className="text-slate-400 text-sm">/ Practice Pitch Module</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Refine Your Pitch</h1>
                                <p className="text-slate-500 mt-1 max-w-xl">Use AI-driven insights to polish your narrative and increase your chances of success.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    <Save className="size-4" /> Save Draft
                                </button>
                                <button
                                    onClick={handleEvaluate}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#40484f] text-white rounded-lg font-bold text-sm hover:bg-[#40484f]/90 transition-colors shadow-lg shadow-[#40484f]/10"
                                >
                                    Finalize Pitch
                                </button>
                            </div>
                        </div>

                        {/* Two-Column Layout */}
                        <div className="flex flex-1 p-8 pt-4 gap-8 overflow-hidden">
                            {/* Column 1: Pitch Drafting */}
                            <div className="flex-[3] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-slate-900">Drafting Zone</span>
                                        {isAnalyzing && (
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-slate-500 animate-ping"></div>
                                                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">AI is thinking...</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600" title="Format Bold">
                                            <Bold className="size-5" />
                                        </button>
                                        <button className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600" title="Add List">
                                            <List className="size-5" />
                                        </button>
                                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#40484f]/10 text-[#40484f] font-bold text-xs hover:bg-[#40484f]/20 transition-colors">
                                            <Mic className="size-4" /> Voice Input
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                    <textarea
                                        className="w-full h-full border-none focus:ring-0 text-slate-800 text-lg leading-relaxed placeholder:text-slate-300 resize-none font-sans"
                                        placeholder="Start typing your pitch here..."
                                        value={pitchText}
                                        onChange={(e) => setPitchText(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <span className="text-xs font-medium text-slate-400">Words: <span className="text-slate-700">{pitchText.split(/\s+/).filter(w => w).length}</span></span>
                                    <button
                                        onClick={() => { setPitchText(''); setHasEvaluated(false); setEvaluation({ score: 0, best_part: "Not evaluated yet.", improvement_needed: "Submit your pitch to get feedback.", worse_part: "Critical areas will appear here." }); }}
                                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                    >
                                        <RotateCcw className="size-3.5" /> Reset Pitch
                                    </button>
                                </div>
                            </div>

                            {/* Column 2: AI Feedback & Readiness */}
                            <div className="flex-[2] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                                {/* Readiness Dashboard */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Readiness Score</h3>
                                        <span className={`px-2 py-0.5 ${evaluation.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-[#40484f]/10 text-[#40484f]'} text-[10px] font-bold rounded`}>
                                            {evaluation.score >= 90 ? 'ELITE' : evaluation.score >= 70 ? 'STRONG' : 'DRAFT'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative flex items-center justify-center size-32">
                                            <svg className="size-full transform -rotate-90">
                                                <circle className="text-slate-100" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                                                <circle
                                                    className="text-[#40484f] transition-all duration-1000"
                                                    cx="64" cy="64" fill="transparent" r="56"
                                                    stroke="currentColor"
                                                    strokeDasharray="351.8"
                                                    strokeDashoffset={351.8 - (351.8 * evaluation.score / 100)}
                                                    strokeLinecap="round" strokeWidth="8"
                                                ></circle>
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-black text-slate-900">{evaluation.score}%</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">Ready</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Analysis Sections */}
                                <div className="space-y-4">
                                    {/* Best Part */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-emerald-50 bg-emerald-50/30">
                                            <div className="flex items-center gap-2">
                                                <Eye className="size-5 text-slate-500" />
                                                <h4 className="text-sm font-bold text-slate-900">Clarity &amp; Jargon</h4>
                                            </div>
                                            <CheckCircle2 className="size-5 text-green-500" />
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex gap-3">
                                                <div className="size-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                                                <p className="text-sm text-slate-600 leading-relaxed">Language is accessible to generalist reviewers.</p>
                                            </div>
                                            <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                <Lightbulb className="size-4.5 text-amber-500 shrink-0 mt-0.5" />
                                                <p className="text-xs text-amber-800 font-medium italic">"High-fidelity cellular updates" might be too technical; consider "accurate cell modification."</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Structure Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Network className="size-5 text-purple-500" />
                                                <h4 className="text-sm font-bold text-slate-900">Structure</h4>
                                            </div>
                                            <span className="text-xs font-bold text-amber-500">80% COMPLETE</span>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="size-4.5 text-green-500" />
                                                <span className="text-sm text-slate-600">Clear Problem Statement</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="size-4.5 text-green-500" />
                                                <span className="text-sm text-slate-600">Target Market Identified</span>
                                            </div>
                                            <div className="flex items-center gap-3 opacity-50">
                                                <Circle className="size-4.5 text-slate-300" />
                                                <span className="text-sm text-slate-600">Explicit Impact Statement missing</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Alignment Section */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Target className="size-5 text-emerald-500" />
                                                <h4 className="text-sm font-bold text-slate-900">Grant Alignment</h4>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">KEYWORDS: 12/15</span>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{evaluation.best_part}</p>
                                        </div>
                                    </div>

                                    {/* Improvement Needed */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-amber-50 bg-amber-50/30">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="size-5 text-amber-500" />
                                                <h4 className="text-sm font-bold text-amber-900">Needs Improvement</h4>
                                            </div>
                                            <span className="text-[10px] font-black text-amber-500">OPPORTUNITY</span>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-sm text-slate-600 leading-relaxed italic">{evaluation.improvement_needed}</p>
                                        </div>
                                    </div>

                                    {/* Worse Part */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-red-50 bg-red-50/30">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="size-5 text-red-500" />
                                                <h4 className="text-sm font-bold text-red-900">Worse Part</h4>
                                            </div>
                                            <span className="text-[10px] font-black text-red-500 uppercase">Critical</span>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-sm text-red-700/80 leading-relaxed font-semibold">{evaluation.worse_part}</p>
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
