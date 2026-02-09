import React from 'react';
import { Link } from 'react-router-dom';
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
  ChevronDown
} from 'lucide-react';

const Credits = () => {
  const usageLogs = [
    {
      date: 'Oct 26, 2024',
      type: 'Deep AI Analysis',
      icon: <Brain className="text-slate-400 size-5" />,
      project: 'QuantumSensing PhII',
      impact: '-10 credits',
      impactColor: 'text-red-600'
    },
    {
      date: 'Oct 25, 2024',
      type: 'Grant Match Batch',
      icon: <SearchCheck className="text-slate-400 size-5" />,
      project: 'CleanEnergy Initiative',
      impact: '-5 credits',
      impactColor: 'text-red-600'
    },
    {
      date: 'Oct 24, 2024',
      type: 'Manual Credit Top-up',
      icon: <PlusCircle className="text-slate-400 size-5" />,
      project: 'Billing Reference #4412',
      impact: '+100 credits',
      impactColor: 'text-green-600'
    },
    {
      date: 'Oct 22, 2024',
      type: 'Pitch Deck Optimization',
      icon: <FileEdit className="text-slate-400 size-5" />,
      project: 'BioHealth Startup',
      impact: '-15 credits',
      impactColor: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-['Public Sans',_sans-serif]">
      <Navbar />

      <main className="px-10 flex flex-col items-center pt-24 pb-12 max-w-[1280px] mx-auto">
        <div className="w-full max-w-[1120px]">
          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 text-3xl font-bold tracking-tight">Credits & Usage</h1>
              <p className="text-slate-500 text-base">Detailed audit of your enterprise resource consumption and AI compute units.</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-slate-400">Last synced: 2 minutes ago</p>
              <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm gap-2">
                <RefreshCw className="size-4" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Alert Section (Low Balance) */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-amber-900 text-base font-bold leading-tight">Low Credit Balance</p>
                  <p className="text-amber-700 text-sm font-medium leading-normal">Your team has 12 credits remaining. Pitch analysis services may be interrupted once balance reaches zero.</p>
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl bg-[#1347ae] text-white text-sm font-bold shadow-lg shadow-[#1347ae]/20 hover:bg-[#1347ae]/90 hover:scale-[1.02] transition-all whitespace-nowrap">
                Manage Plan
              </button>
            </div>
          </div>

          {/* Top-Level Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Remaining Credits</p>
                <div className="p-2 bg-blue-50 text-[#1347ae] rounded-lg">
                  <Wallet size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-4xl font-black">12</p>
              <div className="flex items-center gap-1.5">
                <span className="text-red-500 text-xs font-black flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span>
                  -85%
                </span>
                <span className="text-slate-400 text-xs font-bold">from last month</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Monthly Usage</p>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <BarChart3 size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-4xl font-black">488</p>
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 text-xs font-black flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12%
                </span>
                <span className="text-slate-400 text-xs font-bold">vs baseline</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Billing Period Ends</p>
                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-slate-900 text-4xl font-black">Nov 1, 2024</p>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Automatic renewal active</span>
              </div>
            </div>
          </div>

          {/* Visual Usage Breakdown */}
          <div className="mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-slate-900 text-xl font-black mb-8">Resource Consumption Breakdown</h2>
              <div className="space-y-10">
                {/* AI Pitch Analysis */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-lg">AI Pitch Analysis</span>
                      <span className="text-[10px] px-2.5 py-1 bg-[#1347ae]/10 text-[#1347ae] rounded-full font-black uppercase tracking-wider">High Compute</span>
                    </div>
                    <span className="text-slate-600 font-bold">42 / 50 projects</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#1347ae] h-full rounded-full transition-all duration-1000" style={{ width: '84%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium italic">5 credits per deep analysis</p>
                </div>
                {/* Grant Matches */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-lg">Grant Matches Tracked</span>
                      <span className="text-[10px] px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-black uppercase tracking-wider">Data Sync</span>
                    </div>
                    <span className="text-slate-600 font-bold">185 / 500 grants</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-[#1347ae]/60 h-full rounded-full transition-all duration-1000" style={{ width: '37%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 font-medium italic">1 credit per match monitoring</p>
                </div>
                {/* Export Operations */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-lg">Enterprise Exports</span>
                    </div>
                    <span className="text-slate-600 font-bold uppercase tracking-tighter">Unlimited</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full w-full opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Logs Table */}
          <div className="pb-20">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-slate-900 text-xl font-black">Recent Activity Logs</h2>
                <button className="text-[#1347ae] text-sm font-bold hover:underline">Download CSV</button>
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
                <button className="text-slate-400 text-sm font-bold hover:text-[#1347ae] transition-colors flex items-center gap-2 group">
                  Load more history
                  <ChevronDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-10">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold tracking-tight">© 2024 GranFit AI Enterprise. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="text-slate-400 hover:text-[#1347ae] text-xs font-bold transition-colors" to="#">Terms of Service</Link>
            <Link className="text-slate-400 hover:text-[#1347ae] text-xs font-bold transition-colors" to="#">Privacy Policy</Link>
            <Link className="text-slate-400 hover:text-[#1347ae] text-xs font-bold transition-colors" to="#">Compliance Audit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Credits;
