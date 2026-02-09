import React from 'react';
import { Link } from 'react-router-dom';

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
      status: 'In Progress',
      statusColor: 'amber',
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
      status: 'Submitted',
      statusColor: 'emerald',
      action: 'picture_as_pdf'
    },
    {
      id: 'DARPA-QC-882-PRE',
      name: 'Quantum Computing Initiative',
      organizer: 'DARPA',
      deadline: 'Oct 30, 2023',
      daysLeft: '18 days left',
      status: 'In Progress',
      statusColor: 'amber',
      action: 'Edit Draft'
    },
    {
      id: 'USDA-SA-2024-PRE',
      name: 'Sustainable Agriculture Fund',
      organizer: 'USDA',
      deadline: 'Jan 12, 2024',
      daysLeft: '92 days left',
      status: 'Submitted',
      statusColor: 'emerald',
      action: 'picture_as_pdf'
    }
  ];

  const applications = [...dynamicApps, ...staticApplications];

  const getStatusStyles = (status, color) => {
    const colors = {
      amber: 'bg-amber-50 text-amber-700',
      blue: 'bg-blue-50 text-blue-700',
      emerald: 'bg-emerald-50 text-emerald-700'
    };
    const dotColors = {
      amber: 'bg-amber-500',
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500'
    };
    return {
      container: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${colors[color]}`,
      dot: `size-1.5 rounded-full ${dotColors[color]}`
    };
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] font-['Public Sans',_sans-serif]">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#1347ae]/10 bg-white px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 text-[#1347ae] hover:opacity-80 transition-opacity">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#0e121b] text-xl font-black leading-tight tracking-tight">GranFit AI</h2>
          </Link>
          <nav className="flex items-center gap-6">
            <Link className="text-sm font-semibold text-slate-500 hover:text-[#1347ae] transition-colors" to="/dashboard">Dashboard</Link>
            <Link className="text-sm font-semibold text-[#1347ae] border-b-2 border-[#1347ae] pb-1" to="/tracking">Tracking</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-[#1347ae] transition-colors" to="/credits">Credits</Link>
            <Link className="text-sm font-semibold text-slate-500 hover:text-[#1347ae] transition-colors" to="#">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <label className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-slate-400">search</span>
            <input className="h-10 w-64 rounded-lg border-none bg-slate-100 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#1347ae]/20" placeholder="Search grants..." type="text" />
          </label>
          <Link
            to="/profile"
            className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#1347ae]/20 transition-all"
          >
            <img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARIGSgVmMQC1AxPKwUxtBs4vsAu7w4FMjJPE6FiNHEvxBO-HmOWv9gGvAejQYMTShgxE49SS4dKdqzqQMfS8ZkLiW8RRsTveVYPxYUO4QzdaGyQ5cOi6z2S_J3HOSuztBiBNW7DeiWJ5M_1rxcjhTknu09nn92-9B4WacP7FBRdkBDouUQ5hD7am0Rp1kwSFHCTlsGh2PJHugAXGqnsbn3VCnzGdYHDqYfoKjJOcIXj7evfjCwxw5JK95t0pD8smoxs87Iyb3zhaI" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 p-10">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-[#0e121b]">Application Tracking</h1>
            <p className="text-slate-500 text-base">Monitor your active research proposals and funding milestones.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#1347ae] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1347ae]/20 hover:bg-[#1347ae]/90 transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              New Application
            </button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Total Active</span>
              <span className="material-symbols-outlined text-[#1347ae]">analytics</span>
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12% from last month</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">In Progress</span>
              <span className="material-symbols-outlined text-amber-500">edit_note</span>
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.filter(a => a.status === 'In Progress').length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+5% from last month</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">Successfully Submitted</span>
              <span className="material-symbols-outlined text-[#07883b]">check_circle</span>
            </div>
            <p className="text-3xl font-bold text-[#0e121b]">{applications.filter(a => a.status === 'Submitted' || a.status === 'Applied').length}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#07883b]">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
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
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
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
                          <button className="material-symbols-outlined text-slate-400 hover:text-[#1347ae] transition-colors">more_vert</button>
                        ) : app.action === 'picture_as_pdf' ? (
                          <button className="flex items-center gap-1 ml-auto text-sm font-bold text-slate-500 hover:text-slate-700">
                            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
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
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1347ae] text-sm font-bold text-white shadow-md shadow-[#1347ae]/20">1</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">2</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-slate-600 hover:bg-slate-100">5</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="flex items-center justify-between rounded-xl bg-[#1347ae] px-8 py-6 text-white shadow-xl shadow-[#1347ae]/30">
          <div className="flex items-center gap-6">
            <div className="rounded-full bg-white/20 p-3">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Find more matches with AI</h3>
              <p className="text-blue-100 opacity-80">Our engine discovered 3 new grant opportunities matching your recent activity.</p>
            </div>
          </div>
          <button className="rounded-lg bg-white px-6 py-3 text-sm font-black text-[#1347ae] hover:bg-slate-100 transition-colors">
            View Recommendations
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-auto w-full max-w-[1280px] px-10 py-8 border-t border-slate-200">
        <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
          <p>© 2023 GranFit AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-[#1347ae]" href="#">Privacy Policy</a>
            <a className="hover:text-[#1347ae]" href="#">Terms of Service</a>
            <a className="hover:text-[#1347ae]" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Tracking;
