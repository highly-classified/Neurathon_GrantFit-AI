import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  DollarSign,
  Calendar,
  Edit3,
  ArrowLeft,
  Shield,
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';

const ProfileView = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Try to load from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Mock data if none exists
      setProfile({
        displayName: 'John Doe',
        email: 'john.doe@example.com',
        domain: 'AI & ML',
        fundingRequirement: '250000',
        role: 'Founder',
        citizenship: 'United States',
        gender: 'Male',
        age: '28'
      });
    }
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-['Public Sans',_sans-serif]">
      {/* Background Header Decoration */}
      <div className="h-48 bg-[#40484f] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <main className="max-w-5xl mx-auto px-6 -mt-24 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Profile Card */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className="size-32 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg mb-6 group relative overflow-hidden">
                  <span className="text-4xl font-black text-slate-600">
                    {(() => {
                      const names = (profile.displayName || '').trim().split(/\s+/);
                      if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
                      return (profile.displayName || 'UN').substring(0, 2).toUpperCase();
                    })()}
                  </span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Edit3 className="text-white size-6" />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">{profile.displayName || 'Unnamed User'}</h2>
                <p className="text-[#40484f] font-black text-sm uppercase tracking-widest mb-4">{profile.role}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-8">
                  <Mail size={14} />
                  {profile.email}
                </div>

                <div className="w-full grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-8">
                  <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-emerald-600">Verified</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                    <p className="text-sm font-bold text-[#40484f]">Enterprise</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/profile-setup')}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-slate-100">
              <div className="space-y-2">


                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 text-red-600">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <LogOut size={18} />
                    </div>
                    <span className="font-bold">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Details */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Personal Details</h3>
                  <p className="text-slate-400 font-medium text-sm">Information used for grant eligibility matching.</p>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#40484f] font-bold text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  Dashboard
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Domain / Industry</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <Globe className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">{profile.domain}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Funding Requirement</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <DollarSign className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">${Number(profile.fundingRequirement).toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Citizenship</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <MapPin className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">{profile.citizenship}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Primary Role</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <Briefcase className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">{profile.role}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Gender</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <User className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">{profile.gender}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">Age</label>
                  <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl">
                    <Calendar className="text-[#40484f] size-5" />
                    <span className="font-bold text-slate-700">{profile.age} Years</span>
                  </div>
                </div>
              </div>

              {/* Data Privacy Note */}
              <div className="mt-16 p-6 bg-[#40484f]/5 rounded-2xl border border-[#40484f]/10 flex items-start gap-4">
                <Shield className="text-[#40484f] size-6 mt-1" />
                <div>
                  <h4 className="font-bold text-[#40484f] mb-1">Data Privacy Commitment</h4>
                  <p className="text-xs text-[#40484f]/80 font-medium leading-relaxed">
                    Your profile data is encrypted and only used to match you with relevant funding opportunities.
                    We never share your personal information with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
