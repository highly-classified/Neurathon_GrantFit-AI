import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import Navbar from '../dashboard/Navbar';
import { db, auth } from '../../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Plus,
  FileText,
  Search,
  Filter,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download
} from 'lucide-react';

const Tracking = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const staticApplications = [
    {
      id: 'NSF-2026-AI-042-PRE',
      name: 'SBIR Phase I: AI Research',
      organizer: 'National Science Foundation',
      deadline: 'Oct 24, 2026',
      daysLeft: 'In 8 Months',
      status: 'Applied',
      statusColor: 'blue',
      applicantName: 'Postman Test User',
      applicantEmail: 'test@postman.com',
      domain: 'Artificial Intelligence'
    },
    {
      id: 'BMGF-GH-9912-PRE',
      name: 'Global Health Innovation',
      organizer: 'Bill & Melinda Gates Foundation',
      deadline: 'Nov 15, 2026',
      daysLeft: 'In 9 Months',
      status: 'Applied',
      statusColor: 'blue',
      applicantName: 'Postman Test User',
      applicantEmail: 'test@postman.com',
      domain: 'Healthcare'
    },
    {
      id: 'DOE-EERE-2026-PRE',
      name: 'Clean Energy Startup Grant',
      organizer: 'Department of Energy',
      deadline: 'Dec 01, 2026',
      daysLeft: 'In 10 Months',
      status: 'Applied',
      statusColor: 'blue',
      applicantName: 'Postman Test User',
      applicantEmail: 'test@postman.com',
      domain: 'Clean Energy'
    }
  ];

  useEffect(() => {
    const user = auth.currentUser || { uid: 'user_postman_01' }; // Fallback for dev

    // Real-time listener for registrations
    const q = query(
      collection(db, 'users', user.uid, 'registrations'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreApps = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        isDynamic: true
      }));

      setApps([...firestoreApps, ...staticApplications]);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setApps(staticApplications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generatePDF = (app) => {
    const doc = new jsPDF();

    // Add Header
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Application Summary', 20, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 25);

    // Applicant Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text('Applicant Information', 20, 55);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 58, 190, 58);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Name:', 20, 70);
    doc.setTextColor(15, 23, 42);
    doc.text(app.applicantName || 'Not Provided', 60, 70);

    doc.setTextColor(100, 116, 139);
    doc.text('Email:', 20, 80);
    doc.setTextColor(15, 23, 42);
    doc.text(app.applicantEmail || 'Not Provided', 60, 80);

    // Grant Section
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Grant Details', 20, 100);
    doc.line(20, 103, 190, 103);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Grant Name:', 20, 115);
    doc.setTextColor(15, 23, 42);
    doc.text(app.name || app.eventName || 'N/A', 60, 115);

    doc.setTextColor(100, 116, 139);
    doc.text('ID:', 20, 125);
    doc.setTextColor(15, 23, 42);
    doc.text(app.id || 'N/A', 60, 125);

    doc.setTextColor(100, 116, 139);
    doc.text('Organizer:', 20, 135);
    doc.setTextColor(15, 23, 42);
    doc.text(app.organizer || 'N/A', 60, 135);

    doc.setTextColor(100, 116, 139);
    doc.text('Domain:', 20, 145);
    doc.setTextColor(15, 23, 42);
    doc.text(app.domain || 'N/A', 60, 145);

    // Status Section
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 160, 170, 30, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text('Current Status:', 30, 175);
    doc.setTextColor(22, 163, 74); // Green-600
    doc.setFont('helvetica', 'bold');
    doc.text(app.status.toUpperCase(), 70, 175);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('Securely processed by GrantFit AI - Precision Funding Solutions', 105, 285, { align: 'center' });

    doc.save(`Application_${app.id}.pdf`);
  };

  const getStatusStyles = (status) => {
    return "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-600 border border-emerald-100";
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.organizer || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: apps.length,
    applied: apps.filter(a => a.status === 'Applied').length,
    underReview: apps.filter(a => a.status === 'Under Review').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading Applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] font-['Public Sans',_sans-serif]">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 pt-32 px-10 pb-20">

        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-[#0e121b]">Application Tracking</h1>
            <p className="text-slate-500 font-medium">Manage and track your funding proposal progress in real-time.</p>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all">
            <Plus className="size-5" />
            New Application
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Applications', value: stats.total, icon: FileText, color: 'slate' },
            { label: 'Successfully Applied', value: stats.applied, icon: CheckCircle2, color: 'emerald' },
            { label: 'Under Review', value: stats.underReview, icon: Clock, color: 'blue' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-slate-300 transition-all cursor-default group"
            >
              <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                }`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input
              type="text"
              placeholder="Search by grant or organizer..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['All', 'Applied', 'Under Review', 'Declined'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === filter
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Application List */}
        <div className="space-y-4">
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div>Grant Opportunity</div>
            <div>Organizer</div>
            <div>Deadline</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredApps.length > 0 ? (
              filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_0.5fr] gap-4 items-center px-8 py-5 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-slate-900 leading-tight group-hover:text-slate-700">{app.name || app.eventName}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                      ID: {app.id}
                      {app.isDynamic && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px]">Real-Time</span>}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 font-bold">{app.organizer}</div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{app.deadline || 'N/A'}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-0.5">
                      {app.daysLeft || 'Recently Applied'}
                    </span>
                  </div>

                  <div>
                    <span className={getStatusStyles(app.status)}>
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => generatePDF(app)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-red-500 transition-all p-2.5 hover:bg-red-50 rounded-xl"
                    >
                      <Download className="size-4" />
                      View PDF
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200"
              >
                <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No applications found</h3>
                <p className="text-sm text-slate-500 font-medium whitespace-pre-wrap">We couldn't find any records matching your search or filter.{"\n"}Try applying for more grants!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Tracking;
