import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Bell,
    HelpCircle,
    Mic,
    FileText,
    Users,
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
    AlertTriangle,
    X,
    Pause,
    Play,
    StopCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../dashboard/Navbar';

const PitchModule = () => {
    const { grantId } = useParams();
    const [pitchText, setPitchText] = useState("<div>Our innovative Bio-Tech solution targets the metabolic signaling pathways in specific rare diseases. By leveraging our proprietary CRISPR-based delivery mechanism, we can achieve high-fidelity cellular updates with minimal off-target effects. This NSF Phase I proposal focuses on the commercial feasibility of the platform within clinical trials over the next 18 months...</div>");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasEvaluated, setHasEvaluated] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const [evaluation, setEvaluation] = useState({
        score: 0,
        best_part: "Not evaluated yet.",
        improvement_needed: "Submit your pitch to get feedback.",
        worse_part: "Critical areas will appear here.",
    });

    // Voice-to-Text State
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const textareaRef = useRef(null);
    const isUpdatingFromInput = useRef(false);

    const applyFormatting = (type) => {
        document.execCommand(type === 'bold' ? 'bold' : 'insertUnorderedList', false, null);
        // Force state sync after formatting
        if (textareaRef.current) {
            isUpdatingFromInput.current = true;
            setPitchText(textareaRef.current.innerHTML);
        }
    };

    const handleInput = (e) => {
        isUpdatingFromInput.current = true;
        setPitchText(e.target.innerHTML);
    };

    // Synchronize editor content only when changed from outside (e.g. voice, reset, initial mount)
    useEffect(() => {
        if (!isUpdatingFromInput.current && textareaRef.current) {
            textareaRef.current.innerHTML = pitchText;
        }
        isUpdatingFromInput.current = false;
    }, [pitchText]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = true;
            recog.lang = 'en-US';

            recog.onresult = (event) => {
                let currentInterim = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setPitchText(prev => prev + ' ' + event.results[i][0].transcript);
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }
                setInterimTranscript(currentInterim);
            };

            recog.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recog.onend = () => {
                setIsRecording(false);
            };

            setRecognition(recog);
        }
    }, []);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = () => {
        if (recognition) {
            try {
                recognition.start();
                setIsRecording(true);
                setRecordingTime(300);
                setInterimTranscript('');
            } catch (e) {
                console.error("Recognition already started", e);
            }
        } else {
            alert("Speech recognition is not supported in this browser.");
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            if (interimTranscript) {
                setPitchText(prev => prev + ' ' + interimTranscript);
            }
            setInterimTranscript('');
            setIsVoiceModalOpen(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

        // Simulating that user manual edits improved the score
        const newScore = Math.min(prev.score + 5, 95);
        setIsAnalyzing(false);
        return {
            score: newScore,
            best_part: "Your manual additions to the technical section are excellent.",
            improvement_needed: "Now focus on the 'Methodology' section, specifically the second sentence.",
            worse_part: "The budget breakdown is still missing.",
        };
    };

    const handleEvaluate = async () => {
        const result = await simulateBackendAnalysis(pitchText);
        setEvaluation(result);
        setHasEvaluated(true);
    };

    const handleImprove = async () => {
        if (evaluation.score >= 95) return;
        // In the manual flow, we send the updated pitchText (manually edited by user)
        const result = await simulateBackendImprovement(pitchText, evaluation);
        // We do NOT call setPitchText(result.improved_pitch) here
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
                            <a className="flex items-center gap-3 px-3 py-2 bg-[#40484f] text-white rounded-lg transition-colors shadow-sm shadow-[#40484f]/20" href="#">
                                <Mic className="size-5" />
                                <span className="text-sm font-medium">Practice Pitch</span>
                            </a>
                            <button
                                onClick={() => setShowGuidelines(!showGuidelines)}
                                className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors ${showGuidelines ? 'bg-slate-200 text-[#40484f]' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <FileText className="size-5" />
                                <span className="text-sm font-medium">Guidelines</span>
                            </button>

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

                                <AnimatePresence>
                                    {showGuidelines && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 p-5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
                                                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                                    <Lightbulb className="size-4 text-amber-500" />
                                                    Pitch Guidelines
                                                </h3>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                    {[
                                                        "Align clearly with the grant’s objective",
                                                        "State the problem and its significance",
                                                        "Describe the proposed solution or approach",
                                                        "Demonstrate feasibility and team readiness",
                                                        "Justify the funding request",
                                                        "Emphasize expected impact and outcomes",
                                                        "Maintain clarity, conciseness, and consistency",
                                                        "If using audio-to-text, speak clearly near the mic and pause briefly at the end to ensure full capture"
                                                    ].map((item, idx) => (
                                                        <li key={idx} className="flex gap-2 text-xs leading-relaxed">
                                                            <div className="size-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleEvaluate}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#40484f] text-white rounded-lg font-bold text-sm hover:bg-[#40484f]/90 transition-colors shadow-lg shadow-[#40484f]/10"
                                >
                                    Calculate score
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
                                        <button
                                            onMouseDown={(e) => { e.preventDefault(); applyFormatting('bold'); }}
                                            className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600"
                                            title="Format Bold"
                                        >
                                            <Bold className="size-5" />
                                        </button>
                                        <button
                                            onMouseDown={(e) => { e.preventDefault(); applyFormatting('list'); }}
                                            className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-200 text-slate-600"
                                            title="Add List"
                                        >
                                            <List className="size-5" />
                                        </button>
                                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => setIsVoiceModalOpen(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#40484f]/10 text-[#40484f] font-bold text-xs hover:bg-[#40484f]/20 transition-colors"
                                        >
                                            <Mic className="size-4" /> Voice Input
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                    <div
                                        ref={textareaRef}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        className="w-full h-full focus:outline-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-300 min-h-[300px] drafting-zone"
                                        onInput={handleInput}
                                    ></div>
                                </div>
                                <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <span className="text-xs font-medium text-slate-400">Words: <span className="text-slate-700">{pitchText.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length}</span></span>
                                    <button
                                        onClick={() => { setPitchText('<div></div>'); textareaRef.current.innerHTML = ''; setHasEvaluated(false); setEvaluation({ score: 0, best_part: "Not evaluated yet.", improvement_needed: "Submit your pitch to get feedback.", worse_part: "Critical areas will appear here." }); }}
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
                                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Readiness Score</h3>
                                        <span className={`px-2 py-0.5 ${evaluation.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-[#40484f]/10 text-[#40484f]'} text-xs font-bold rounded`}>
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
                                    {/* Your Strengths */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-emerald-50 bg-emerald-50/30">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="size-6 text-emerald-500" />
                                                <h4 className="text-lg font-bold text-slate-900">Your Strengths</h4>
                                            </div>
                                            <span className="text-xs font-black text-emerald-500 uppercase">Strong</span>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-base text-slate-600 leading-relaxed font-medium">{evaluation.best_part}</p>
                                        </div>
                                    </div>

                                    {/* Needs Improvement */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="px-5 py-4 flex items-center justify-between border-b border-amber-50 bg-amber-50/30">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="size-6 text-amber-500" />
                                                <h4 className="text-lg font-bold text-amber-900">Needs improvement</h4>
                                            </div>
                                            <span className="text-xs font-black text-amber-500 uppercase">Opportunity</span>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                                                <p className="text-base text-slate-600 leading-relaxed italic">{evaluation.improvement_needed}</p>
                                            </div>
                                            {evaluation.worse_part && evaluation.worse_part !== "Critical areas will appear here." && (
                                                <div className="flex gap-3 px-1">
                                                    <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                                                    <p className="text-xs text-red-700 font-medium">{evaluation.worse_part}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {isVoiceModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="w-full flex justify-end mb-2">
                                    <button
                                        onClick={() => { stopRecording(); setIsVoiceModalOpen(false); }}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="relative mb-8">
                                    <AnimatePresence>
                                        {isRecording && (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-[#40484f] rounded-full"
                                            />
                                        )}
                                    </AnimatePresence>
                                    <div className={`relative z-10 size-24 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-[#40484f] text-white shadow-xl shadow-[#40484f]/30' : 'bg-slate-100 text-slate-400'}`}>
                                        <Mic size={40} className={isRecording ? 'animate-pulse' : ''} />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2">
                                    {isRecording ? "Listening..." : "Ready to Record"}
                                </h3>
                                <p className="text-slate-500 text-sm mb-6 max-w-[240px]">
                                    {isRecording
                                        ? "Your voice is being transcribed in real-time to the editor."
                                        : "Tap the button below to start dictating your pitch."}
                                </p>

                                <div className="text-4xl font-black text-slate-900 mb-8 tabular-nums">
                                    {formatTime(recordingTime)}
                                </div>

                                {interimTranscript && (
                                    <div className="w-full p-4 bg-slate-50 rounded-2xl mb-8 min-h-[60px] flex items-center justify-center">
                                        <p className="text-sm text-[#40484f] italic font-medium opacity-70">
                                            "{interimTranscript}..."
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 w-full">
                                    {!isRecording ? (
                                        <button
                                            onClick={startRecording}
                                            className="flex-1 py-4 bg-[#40484f] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#40484f]/90 transition-all shadow-lg shadow-[#40484f]/20"
                                        >
                                            <Play size={20} fill="currentColor" />
                                            Start Recording
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                                        >
                                            <StopCircle size={20} fill="currentColor" />
                                            Stop & Save
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { stopRecording(); setIsVoiceModalOpen(false); }}
                                        className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                .drafting-zone ul {
                    list-style-type: disc;
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .drafting-zone li {
                    margin-bottom: 0.25rem;
                }
                .drafting-zone b, .drafting-zone strong {
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default PitchModule;
