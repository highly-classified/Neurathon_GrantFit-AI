import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    // Force emerald (green) for 'Applied' status
    const effectiveColor = status === 'Applied' ? 'emerald' : color;
    
    const colors = {
      amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50',
      blue: 'bg-[#40484f]/10 dark:bg-slate-800/50 text-[#40484f] dark:text-slate-300 border border-transparent dark:border-slate-700/50',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50'
    };
    const dotColors = {
      amber: 'bg-amber-500',
      blue: 'bg-[#40484f]',
      emerald: 'bg-emerald-500'
    };
    return {
      container: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${colors[effectiveColor]}`,
      dot: `size-1.5 rounded-full ${dotColors[effectiveColor]}`
    };
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] font-['Public Sans',_sans-serif] transition-colors duration-300">
      <Navbar />

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 pt-32 px-10 pb-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex items-end justify-between"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-[var(--color-primary)] transition-colors">Application Tracking</h1>
            <div className="hidden dark:block text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded w-fit">
              Device State: Dark Mode Active 🌓
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-lg bg-[#40484f] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#40484f]/20 hover:bg-[#40484f]/90 transition-all">
              <Plus className="size-5" />
              New Application
            </Link>
          </div>
        </motion.div>

        {/* Column Headers as a Block */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
          className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-8 py-4 bg-[var(--color-surface)] backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-300"
        >
          <div className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] transition-colors">Grant Name & ID</div>
          <div className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] transition-colors">Organizer</div>
          <div className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] transition-colors">Deadline</div>
          <div className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] transition-colors">Status</div>
          <div className="text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] text-right transition-colors">Actions</div>
        </motion.div>

        {/* Application Records as Separate Blocks */}
        <div className="space-y-4">
          {applications.map((app, index) => {
            const styles = getStatusStyles(app.status, app.statusColor);
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: (index + 2) * 0.04 }}
                className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 items-center px-8 py-5 bg-[var(--color-surface)] border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-700 transition-all group duration-300"
              >
                <div className="flex flex-col">
                  <Link to={`/pitch/${app.id}`} className="flex flex-col hover:opacity-75 transition-opacity">
                    <span className="text-base font-bold text-[var(--color-text-main)] leading-tight transition-colors">{app.name}</span>
                    <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-1 transition-colors">ID: {app.id}</span>
                  </Link>
                </div>
                
                <div className="text-sm text-[var(--color-text-main)] font-bold transition-colors dark:text-white">{app.organizer}</div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--color-text-main)] transition-colors dark:text-white">{app.deadline}</span>
                  <span className={`text-[11px] font-black uppercase tracking-tight mt-0.5 transition-colors dark:text-slate-200 ${app.statusColor === 'amber' ? 'text-amber-500' : 'text-[var(--color-text-muted)]'}`}>
                    {app.daysLeft}
                  </span>
                </div>
                
                <div>
                  <span className={styles.container}>
                    <span className={styles.dot}></span>
                    {app.status}
                  </span>
                </div>
                
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl whitespace-nowrap dark:text-white">
                    <FileText className="size-4 text-red-500" />
                    View PDF
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pagination Controls as a Block */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: (applications.length + 2) * 0.04 }}
          className="flex items-center justify-between px-8 py-5 bg-[var(--color-surface)] border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm transition-colors duration-300"
        >
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest transition-colors">Showing 1 to 5 of 24 applications</p>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="size-5" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] dark:bg-blue-600 text-sm font-bold text-white shadow-lg transition-all">1</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">2</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">3</button>
            <span className="px-2 text-slate-300 dark:text-slate-700">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">5</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>


      </main>


    </div>
  );
};

export default Tracking;
