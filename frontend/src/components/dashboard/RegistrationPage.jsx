import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload, FileText, User, Mail, Building, Globe } from 'lucide-react';

const RegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock grant data - in a real app, this would come from an API based on 'id'
  const grantData = {
    'NSF-2023-AI-042': {
      title: "NSF SBIR Phase I: AI & Quantum Tech",
      org: "National Science Foundation",
      funding: "$275,000",
      deadline: "Oct 24, 2024"
    },
    'DOE-EERE-2024': {
      title: "Clean Energy Innovation Grant",
      org: "Department of Energy (DOE)",
      funding: "$500,000",
      deadline: "In 5 Days"
    },
    // Default fallback
    'default': {
      title: "Grant Application Registration",
      org: "Selected Organization",
      funding: "Varies",
      deadline: "N/A"
    }
  };

  const grant = grantData[id] || grantData['default'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save to localStorage to simulate persistence
      const registeredGrants = JSON.parse(localStorage.getItem('registeredGrants') || '[]');
      const newApp = {
        id: id || `APP-${Math.floor(Math.random() * 10000)}`,
        name: grant.title,
        organizer: grant.org,
        deadline: grant.deadline,
        daysLeft: 'Recently Applied',
        status: 'Applied',
        statusColor: 'blue',
        action: 'picture_as_pdf',
        appliedAt: new Date().toISOString()
      };

      localStorage.setItem('registeredGrants', JSON.stringify([...registeredGrants, newApp]));

      setLoading(false);
      setSubmitted(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/tracking');
      }, 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-300 flex items-center justify-center p-6 font-['Public Sans',_sans-serif]">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full text-center">
          <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-[#0f172a] mb-3">Application Submitted!</h2>
          <p className="text-slate-500 mb-8 font-medium">Your registration for <strong>{grant.title}</strong> has been received successfully. Redirecting to tracking...</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full animate-[progress_2s_ease-in-out]"></div>
          </div>
          <style>{`
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-[#0e121b] font-['Public Sans',_sans-serif] pb-20">
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-[#1347ae] transition-colors font-bold text-sm">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
               <img src="/logo-white.png" alt="Logo" className="h-5 w-auto" />
            </div>
            <span className="text-lg text-[var(--color-text-main)]" style={{ fontFamily: '"Gravitas One", serif' }}>GrantFit AI</span>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tight text-[#0e121b] mb-4">Event Registration</h1>
              <p className="text-slate-500 font-medium">Please fill out the details below to register for the {grant.org} funding program.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <User size={20} className="text-[#1347ae]" />
                  Applicant Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300" placeholder="john@example.com" />
                  </div>
                </div>
              </section>

              {/* Organization Info */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Building size={20} className="text-[#1347ae]" />
                  Organization Details
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Organization Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300" placeholder="Your Startup Inc." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Website URL</label>
                      <input type="url" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300" placeholder="https://example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Funding Stage</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")` }}>
                        <option>Pre-seed</option>
                        <option>Seed</option>
                        <option>Series A</option>
                        <option>Series B+</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Proposal Upload */}
              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-[#1347ae]" />
                  Project Proposal
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Proposal Title</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300" placeholder="Summarize your project" />
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-[#1347ae] hover:bg-[#1347ae]/5 transition-all group cursor-pointer">
                    <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#1347ae] transition-colors mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1">Upload Proposal Document</p>
                    <p className="text-xs text-slate-400">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-4">
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700 shadow-slate-600/20 hover:scale-[1.01]'}`}
                >
                  {loading ? (
                    <>
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 font-medium px-10">
                  By clicking complete registration, you agree to our terms and conditions and privacy policy.
                  Your data will be securely processed by GrantFit AI.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selected Grant Card - Horizontal Grid */}
            <div className="bg-[#40484f] rounded-3xl p-8 text-white shadow-xl shadow-[#40484f]/20">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-black uppercase tracking-[0.2em] mb-4">
                <Globe size={14} />
                Selected Grant
              </div>
              <h2 className="text-2xl font-black leading-tight mb-6">{grant.title}</h2>

              <div className="grid grid-cols-1 gap-4">
                {/* Stats Row */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-blue-100/70 text-sm">Organizer</span>
                    <span className="font-bold text-sm text-white text-right">{grant.org}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 py-2">
                    <span className="text-blue-100/70 text-sm">Funding Amount</span>
                    <span className="font-bold text-sm text-white text-right">{grant.funding}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-blue-100/70 text-sm">Deadline</span>
                    <span className="font-bold text-sm text-white text-right tracking-tight">{grant.deadline}</span>
                  </div>
                </div>

                {/* AI Insight Row */}
                <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-8 bg-amber-400 rounded-lg flex items-center justify-center text-[#1347ae]">
                      <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-wider">AI Insight</h4>
                  </div>
                  <p className="text-xs leading-relaxed text-blue-50 font-medium">
                    This grant has a high alignment (94%) with your profile. Ensure your proposal emphasizes the "Quantum Scalability" section as prioritized by {grant.org}.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4 text-sm">Need Help?</h4>
              <div className="flex items-center gap-4 text-slate-500 hover:text-[#1347ae] cursor-pointer transition-colors">
                <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">Contact Support</p>
                  <p className="text-[11px] font-medium">Get help with your application</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
