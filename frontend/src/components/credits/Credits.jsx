import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../../firebase';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../dashboard/Navbar';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Wallet,
  BarChart3,
  Calendar,
  Brain,
  SearchCheck,
  PlusCircle,
  FileEdit,
  ChevronDown,
  X,
  Check,
  TrendingDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const Credits = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [credits, setCredits] = React.useState({ analyze_credits: 0, improve_credits: 0 });
  const [usageLogs, setUsageLogs] = React.useState([]);
  const [stats, setStats] = React.useState({
    monthlyUsage: 0,
    billingEnd: '...',
    lastSynced: 'Just now'
  });

  React.useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      // 1. Listen to Credits
      const creditsRef = doc(db, 'credits', user.uid);
      const unsubCredits = onSnapshot(creditsRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Ensure minimum 10 credits for display
          const displayCredits = {
            ...data,
            analyze_credits: data.analyze_credits || 10
          };
          setCredits(displayCredits);

          // Estimate billing end from last_updated or use fallback
          const updatedTS = data.last_updated?.toDate() || new Date();
          const nextBilling = new Date(updatedTS);
          nextBilling.setDate(nextBilling.getDate() + 30);

          setStats(prev => ({
            ...prev,
            billingEnd: nextBilling.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
        } else {
          // Fallback default for new users who haven't had credits record created yet
          setCredits({ analyze_credits: 10, improve_credits: 0 });
        }
      }, (error) => {
        console.error("Credits Listener Error:", error);
        setLoading(false); // Stop spinner even if error
      });

      // 2. Fetch recent activity (Activity Logs)
      const logsRef = collection(db, 'activity_logs');
      const q = query(
        logsRef,
        where('user_id', '==', user.uid),
        limit(50) // Fetch enough to sort locally
      );

      const unsubLogs = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(d => {
          const data = d.data();
          const date = data.timestamp?.toDate() || new Date();

          let icon = <Brain className="text-slate-400 size-5" />;
          if (data.type === 'Daily Check-in') icon = <Calendar className="text-slate-400 size-5" />;
          if (data.type === 'First Registration') icon = <PlusCircle className="text-slate-400 size-5" />;

          const impact = data.impact || "0";

          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            type: data.type || "Unknown Activity",
            icon: icon,
            project: data.project_name || '—',
            impact: impact,
            impactColor: impact.startsWith('+') ? 'text-green-600' : (impact.startsWith('-') ? 'text-red-600' : 'text-slate-600'),
            rawDate: date
          };
        });

        // Sort locally by date descending to avoid index requirement
        const sortedLogs = [...logs].sort((a, b) => b.rawDate - a.rawDate).slice(0, 10);
        setUsageLogs(sortedLogs);

        // Calculate Monthly Usage (this month - only deductions)
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthUsage = sortedLogs.filter(l => l.rawDate >= firstDay && l.impact.startsWith('-')).length;

        setStats(prev => ({
          ...prev,
          monthlyUsage: thisMonthUsage,
          lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        setLoading(false);
      }, (error) => {
        console.error("Logs Listener Error:", error);
        setLoading(false);
      });

      // 3. Trigger Daily Check-in
      const handleCheckIn = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
          await fetch(`${API_BASE_URL}/api/credits/check-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid })
          });
        } catch (e) {
          console.error("Check-in Trigger Error:", e);
        }
      };

      handleCheckIn();

      return () => {
        unsubCredits();
        unsubLogs();
      };
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const totalCredits = (credits.analyze_credits || 0) + (credits.improve_credits || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-['Public Sans',_sans-serif]">
      <Navbar />

      <main className="px-10 flex flex-col items-center pt-32 pb-12 max-w-[1280px] mx-auto">
        <div className="w-full max-w-[1120px]">
          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 text-3xl font-bold tracking-tight">Credits & Usage</h1>
              <p className="text-slate-500 text-base">Detailed audit of your enterprise resource consumption and AI compute units.</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-slate-400">Last synced: {stats.lastSynced}</p>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm gap-2"
              >
                <RefreshCw className="size-4" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Plan Management Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`p-3 ${totalCredits < 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'} rounded-xl transition-colors`}>
                  {totalCredits < 5 ? <AlertTriangle size={24} /> : <Check size={24} />}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-slate-900 text-base font-bold leading-tight">
                    {totalCredits < 5 ? 'Low Credit Balance' : 'Active Account Plan'}
                  </p>
                  <p className="text-slate-500 text-sm font-medium leading-normal">
                    {totalCredits < 5
                      ? `Your team has ${totalCredits} credits remaining. Pitch analysis services may be interrupted.`
                      : `You have ${totalCredits} credits available for deep AI analysis and pitch optimization.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#40484f] text-white text-sm font-bold shadow-lg shadow-[#40484f]/20 hover:bg-[#40484f]/90 hover:scale-[1.02] transition-all whitespace-nowrap"
              >
                Manage Plan
              </button>
            </div>
          </div>

          {/* Top-Level Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Remaining Credits</p>
                <div className="p-2 bg-[#40484f]/10 text-[#40484f] rounded-lg">
                  <Wallet size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-4xl font-black relative z-10">{totalCredits}</p>
              <div className="flex items-center gap-1.5 relative z-10">
                <span className={`${totalCredits < 5 ? 'text-red-500' : 'text-green-600'} text-xs font-black flex items-center`}>
                  {totalCredits < 5 ? <TrendingDown className="size-3.5" /> : <TrendingUp className="size-3.5" />}
                  {totalCredits < 5 ? 'Low' : 'Healthy'}
                </span>
                <span className="text-slate-400 text-xs font-bold">real-time sync</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Monthly Usage</p>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <BarChart3 size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-4xl font-black relative z-10">{stats.monthlyUsage}</p>
              <div className="flex items-center gap-1.5 relative z-10">
                <span className="text-[#40484f] text-xs font-black flex items-center">
                  <TrendingUp className="size-3.5" />
                  Active
                </span>
                <span className="text-slate-400 text-xs font-bold">this month</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start relative z-10">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Plan Type</p>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Sparkles size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-2xl font-black relative z-10">Freemium</p>
              <div className="flex items-center gap-1.5 relative z-10">
                <span className="text-green-600 text-xs font-black flex items-center">
                  <Check className="size-3.5" />
                  Active
                </span>
                <span className="text-slate-400 text-xs font-bold">Earn credits daily</span>
              </div>
            </div>
          </div>



          {/* Usage Logs Table */}
          <div className="pb-20">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-slate-900 text-xl font-black">Recent Activity Logs</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Activity Type</th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Project Name</th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Credit Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {usageLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5 text-sm text-slate-500 font-bold">{log.date}</td>
                        <td className="px-8 py-5 text-sm">
                          <div className="flex items-center gap-3">
                            {log.icon}
                            <span className="text-slate-700 font-bold">{log.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-900 font-black">{log.project}</td>
                        <td className={`px-8 py-5 text-sm text-right font-black ${log.impactColor}`}>{log.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-center">
                <button className="text-slate-400 text-sm font-bold hover:text-[#40484f] transition-colors flex items-center gap-2 group">
                  Load more history
                  <ChevronDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>


      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
              >
                <X size={20} />
              </button>

              {/* Plans Grid */}
              <div className="p-8 md:p-12 w-full">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black text-slate-900 mb-3">Upgrade Your Compute Power</h2>
                  <p className="text-slate-500">Choose a scale that matches your research ambitions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <div className="flex flex-col p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group">
                    <div className="mb-6">
                      <p className="text-sm font-black text-[#40484f]/60 uppercase tracking-widest mb-1">Entry Level</p>
                      <h3 className="text-2xl font-black text-slate-900">Free</h3>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">$0</span>
                        <span className="text-slate-400 font-bold">/mo</span>
                      </div>
                      <p className="mt-4 text-slate-600 font-medium">10 Compute Credits</p>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                      {['Basic Grant Match', 'Limited Pitch Analysis', 'Standard Support'].map(feat => (
                        <li key={feat} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <Check size={16} className="text-[#40484f]" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black hover:bg-slate-50 transition-all">Current Plan</button>
                  </div>

                  {/* Pro Plan */}
                  <div className="flex flex-col p-8 rounded-3xl bg-white border-2 border-[#40484f] shadow-xl relative scale-105 z-10">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#40484f] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">Recommended</div>
                    <div className="mb-6">
                      <p className="text-sm font-black text-[#40484f] uppercase tracking-widest mb-1">Most Popular</p>
                      <h3 className="text-2xl font-black text-slate-900">Pro</h3>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">$29</span>
                        <span className="text-slate-400 font-bold">/mo</span>
                      </div>
                      <p className="mt-4 text-slate-600 font-bold">100 Compute Credits</p>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                      {['Priority Match Engine', 'Deep Tech Analysis', '24/7 Priority Support', 'Export Analytics'].map(feat => (
                        <li key={feat} className="flex items-center gap-3 text-sm text-slate-600 font-black">
                          <Check size={16} className="text-[#40484f]" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl bg-[#40484f] text-white font-black hover:bg-[#333a41] shadow-lg shadow-[#40484f]/20 transition-all">Upgrade to Pro</button>
                  </div>

                  {/* Plus Plan */}
                  <div className="flex flex-col p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all group">
                    <div className="mb-6">
                      <p className="text-sm font-black text-[#40484f]/60 uppercase tracking-widest mb-1">Scale Up</p>
                      <h3 className="text-2xl font-black text-slate-900">Plus</h3>
                    </div>
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900">$99</span>
                        <span className="text-slate-400 font-bold">/mo</span>
                      </div>
                      <p className="mt-4 text-slate-600 font-medium">500 Compute Credits</p>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                      {['Unlimited Matching', 'Custom AI Training', 'Dedicated Account Mgr', 'API Access'].map(feat => (
                        <li key={feat} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <Check size={16} className="text-[#40484f]" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black hover:bg-slate-50 transition-all">Select Plus</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Credits;
