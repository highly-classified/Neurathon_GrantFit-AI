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
} from 'lucide-react';
import { auth, db } from '../../firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

const Tracking = () => {
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'users', user.uid, 'registrations'),
          orderBy('submittedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          daysLeft: "Recently Applied", // You might want to calculate this based on deadline
          statusColor: doc.data().status === 'Applied' ? 'emerald' : 'blue'
        }));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state to ensure we have a user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchApplications();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusStyles = (status, color) => {
    const effectiveColor = status === 'Applied' ? 'emerald' : color;
    const colors = {
      amber: 'bg-amber-50 text-amber-700',
      blue: 'bg-[#40484f]/10 text-[#40484f]',
      emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
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
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] font-['Public Sans',_sans-serif]">
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
            <h1 className="text-4xl font-black tracking-tight text-[#0e121b]">Application Tracking</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-lg bg-[#40484f] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#40484f]/20 hover:bg-[#40484f]/90 transition-all">
              <Plus className="size-5" />
              Browse Grants
            </Link>
          </div>
        </motion.div>

        {/* Column Headers as a Block */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
          className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-8 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm"
        >
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Grant Name & ID</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Organizer</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Deadline</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">Status</div>
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</div>
        </motion.div>

        {/* Application Records as Separate Blocks */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading applications...</div>
          ) : applications.length > 0 ? (
            applications.map((app, index) => {
              const styles = getStatusStyles(app.status, app.statusColor);
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: (index + 2) * 0.04 }}
                  className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 items-center px-8 py-5 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all group"
                >
                  <div className="flex flex-col">
                    <Link to={`/pitch/${app.id}`} className="flex flex-col hover:opacity-75 transition-opacity">
                      <span className="text-base font-bold text-[#0e121b] leading-tight">{app.name}</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">ID: {app.grantId || app.id}</span>
                    </Link>
                  </div>

                  <div className="text-sm text-slate-600 font-bold">{app.organizer}</div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{app.deadline}</span>
                    <span className={`text-[11px] font-black uppercase tracking-tight mt-0.5 ${app.statusColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
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
                    {app.documentUrl ? (
                      <a
                        href={app.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-xl whitespace-nowrap"
                      >
                        <FileText className="size-4 text-red-500" />
                        View PDF
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300 uppercase font-bold tracking-wider">No PDF</span>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-10 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              No applications found. <Link to="/dashboard" className="text-blue-600 hover:underline">Browse grants</Link> to apply.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default Tracking;

