import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../dashboard/Navbar';
import {
  Filter,
  Plus,
  BarChart3,
  TrendingUp,
  FileEdit,
  CheckCircle2,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';

const Tracking = () => {
  const [dynamicApps, setDynamicApps] = React.useState([]);

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('registeredGrants') || '[]');
    setDynamicApps(saved);
  }, []);

  const staticApplications = [
    {
      id: 'NSF-2023-AI-042-PRE',
      name: 'SBIR Phase I: AI Research',
      organizer: 'National Science Foundation',
      deadline: 'Oct 24, 2023',
      daysLeft: '12 days left',
      status: 'Applied',
      statusColor: 'blue',
      action: 'Edit Draft'
    },
    {
      id: 'BMGF-GH-9912-PRE',
      name: 'Global Health Innovation',
      organizer: 'Bill & Melinda Gates Foundation',
      deadline: 'Nov 15, 2023',
      daysLeft: '34 days left',
      status: 'Applied',
      statusColor: 'blue',
      action: 'more_vert'
    },
    {
      id: 'DOE-EERE-2024-PRE',
      name: 'Clean Energy Startup Grant',
      organizer: 'Department of Energy',
      deadline: 'Dec 01, 2023',
      daysLeft: '50 days left',
      status: 'Applied',
      statusColor: 'blue',
      action: 'picture_as_pdf'
    },
    {
      id: 'DARPA-QC-882-PRE',
      name: 'Quantum Computing Initiative',
      organizer: 'DARPA',
      deadline: 'Oct 30, 2023',
      daysLeft: '18 days left',
      status: 'Applied',
      statusColor: 'blue',
      action: 'Edit Draft'
    },
    {
      id: 'USDA-SA-2024-PRE',
      name: 'Sustainable Agriculture Fund',
      organizer: 'USDA',
      deadline: 'Jan 12, 2024',
      daysLeft: '92 days left',
      status: 'Applied',
      statusColor: 'blue',
      action: 'picture_as_pdf'
    }
  ];

  const applications = [...dynamicApps, ...staticApplications];

  const getStatusStyles = (status, color) => {
    const colors = {
      amber: 'bg-amber-50 text-amber-700',
      blue: 'bg-[#40484f]/10 text-[#40484f]',
      emerald: 'bg-emerald-50 text-emerald-700'
    };
    const dotColors = {
      amber: 'bg-amber-500',
      blue: 'bg-[#40484f]',
      emerald: 'bg-emerald-500'
    };
    return {
      container: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${colors[color]}`,
      dot: `size-1.5 rounded-full ${dotColors[color]}`
    };
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] font-['Public Sans',_sans-serif]">
      <Navbar />

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 pt-24 px-10 pb-10">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-[#0e121b]">Application Tracking</h1>

          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="size-5" />
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#1347ae] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1347ae]/20 hover:bg-[#1347ae]/90 transition-all">
              <Plus className="size-5" />
              New Application
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Total Active</span>
              <BarChart3 className="size-5 text-[#1347ae]" />
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <TrendingUp className="size-3.5" />
              <span>+12% from last month</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">In Progress</span>
              <FileEdit className="size-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.filter(a => a.status === 'In Progress').length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <TrendingUp className="size-3.5" />
              <span>+5% from last month</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Successfully Submitted</span>
              <CheckCircle2 className="size-5 text-[#07883b]" />
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.filter(a => a.status === 'Submitted' || a.status === 'Applied').length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <TrendingUp className="size-3.5" />
              <span>+8% from last month</span>
            </div>
          </div>
        </div>

        {/* Main Data Grid */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Grant Name & ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Organizer</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Deadline</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const styles = getStatusStyles(app.status, app.statusColor);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5">
                        <Link to={`/pitch/${app.id}`} className="flex flex-col group-hover:opacity-80 transition-opacity">
                          <span className="text-sm font-bold text-[#0e121b]">{app.name}</span>
                          <span className="text-xs text-slate-400">ID: {app.id}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 font-medium">{app.organizer}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">{app.deadline}</span>
                          <span className={`text-[11px] font-bold ${app.statusColor === 'amber' ? 'text-amber-600' : 'text-slate-400'}`}>
                            {app.daysLeft}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={styles.container}>
                          <span className={styles.dot}></span>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {app.action === 'more_vert' ? (
                          <button className="text-slate-400 hover:text-[#1347ae] transition-colors ml-auto flex justify-end">
                            <MoreVertical className="size-5" />
                          </button>
                        ) : app.action === 'picture_as_pdf' ? (
                          <button className="flex items-center gap-1 ml-auto text-sm font-bold text-slate-500 hover:text-slate-700">
                            <FileText className="size-4.5" />
                            View PDF
                          </button>
                        ) : (
                          <button className="text-sm font-bold text-[#1347ae] hover:underline">{app.action}</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <p className="text-sm text-slate-500 font-medium">Showing 1 to 5 of 24 applications</p>
            <div className="flex items-center gap-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                <ChevronLeft className="size-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#40484f] text-sm font-bold text-white shadow-md shadow-[#40484f]/20">1</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">2</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">5</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="flex items-center justify-between rounded-xl bg-[#40484f] px-8 py-6 text-white shadow-xl shadow-[#40484f]/30">
          <div className="flex items-center gap-6">
            <div className="rounded-full bg-white/20 p-3">
              <Brain className="size-8" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Find more matches with AI</h3>
              <p className="text-slate-300 opacity-80">Our engine discovered 3 new grant opportunities matching your recent activity.</p>
            </div>
          </div>
          <button className="rounded-lg bg-white px-6 py-3 text-sm font-black text-[#40484f] hover:bg-slate-100 transition-colors">
            View Recommendations
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-auto w-full max-w-[1280px] px-10 py-8 border-t border-slate-200">
        <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
          <p>© 2023 GranFit AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-[#40484f]" href="#">Privacy Policy</a>
            <a className="hover:text-[#40484f]" href="#">Terms of Service</a>
            <a className="hover:text-[#40484f]" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Tracking;
