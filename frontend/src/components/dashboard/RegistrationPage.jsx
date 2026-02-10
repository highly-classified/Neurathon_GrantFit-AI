import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Upload, FileText, User, Mail, Building, Globe, Lightbulb, File, Trash2, Check } from 'lucide-react';
import { auth } from '../../firebase';
import { createRegistration } from '../../services/trackingService';

const RegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = React.useRef(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orgName: location.state?.org || '',
    eventName: location.state?.title || '',
    domainName: '',
    proposalTitle: ''
  });

  useEffect(() => {
    // Autofill from profile
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setFormData(prev => ({
        ...prev,
        domainName: profile.domain || '',
        fullName: prev.fullName || profile.displayName || '',
        email: prev.email || profile.email || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Mock grant data - in a real app, this would come from an API based on 'id'
  const grantData = {
    'NSF-2023-AI-042': {
      title: "NSF SBIR Phase I: AI & Quantum Tech",
      org: "National Science Foundation",
      funding: "$275,000",
      deadline: "Oct 24, 2026"
    },
    'DOE-EERE-2024': {
      title: "Clean Energy Innovation Grant",
      org: "Department of Energy (DOE)",
      funding: "$500,000",
      deadline: "Dec 01, 2026"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to submit an application.");
        setLoading(false);
        return;
      }

      const registrationData = {
        grantId: id || `APP-${Math.floor(Math.random() * 10000)}`,
        name: formData.proposalTitle || grant.title,
        organizer: formData.orgName || grant.org,
        deadline: grant.deadline,
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        eventName: formData.eventName,
        domain: formData.domainName,
      };

      // Call the service to create registration and upload file
      await createRegistration(user.uid, registrationData, selectedFile);

      setLoading(false);
      setSubmitted(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/tracking');
      }, 2000);

    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit application. Please try again.");
      setLoading(false);
    }
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
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                      placeholder="john@example.com"
                    />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Organization Name</label>
                      <input
                        required
                        type="text"
                        name="orgName"
                        value={formData.orgName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                        placeholder="Your Startup Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-400">Event Name</label>
                      <input
                        required
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                        placeholder="Target Funding Event"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Domain Name</label>
                    <input
                      required
                      type="text"
                      name="domainName"
                      value={formData.domainName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                      placeholder="e.g. AI & ML"
                    />
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
                    <input
                      required
                      type="text"
                      name="proposalTitle"
                      value={formData.proposalTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1347ae]/20 focus:border-[#1347ae] outline-none transition-all placeholder:text-slate-300"
                      placeholder="Summarize your project"
                    />
                  </div>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all group cursor-pointer ${selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-[#40484f] hover:bg-slate-50'}`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx"
                    />

                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="size-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                          <Check size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-1">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500 mb-4">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                          onClick={removeFile}
                          className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#40484f] transition-colors mb-4">
                          <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">Upload Proposal Document</p>
                        <p className="text-xs text-slate-400">PDF, DOCX up to 10MB</p>
                      </>
                    )}
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
                      <Lightbulb size={20} />
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
