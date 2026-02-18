import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
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
  ChevronRight,
  Lightbulb,
  Save,
  X
} from 'lucide-react';

const ProfileView = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try Firestore first
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setFormData(data);
          } else {
            // Fallback to localStorage or mock
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
              const parsed = JSON.parse(savedProfile);
              setProfile(parsed);
              setFormData(parsed);
            } else {
              const initialData = {
                displayName: user.displayName || 'Unnamed User',
                email: user.email,
                domain: 'Not Specified',
                fundingRequirement: '0',
                role: 'Founder',
                citizenship: 'Not Specified',
                gender: 'Not Specified',
                age: 'N/A',
                idea: 'No idea description provided yet.'
              };
              setProfile(initialData);
              setFormData(initialData);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      // First letter of first name + First letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // Fallback if only one name
    return name.substring(0, 2).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, formData);

      setProfile(formData);
      setIsEditing(false);
      
      // Update local storage as well for redundancy/cache
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData(profile); // Revert changes
    setIsEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40484f]"></div>
    </div>
  );
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
                <div className="size-32 rounded-3xl bg-gradient-to-br from-[#40484f] to-slate-600 p-1 border-4 border-white shadow-lg mb-6 group relative overflow-hidden flex items-center justify-center">
                  <span className="text-4xl font-black text-white tracking-widest leading-none">
                    {getInitials(profile.displayName)}
                  </span>
                  {!isEditing && (
                    <div 
                      onClick={() => setIsEditing(true)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <Edit3 className="text-white size-6" />
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="w-full mb-4 space-y-3">
                     <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full p-2 border border-slate-200 rounded-lg text-center font-bold text-slate-900 focus:ring-2 focus:ring-[#40484f] outline-none"
                    />
                     <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Role (e.g. Founder)"
                      className="w-full p-2 border border-slate-200 rounded-lg text-center text-sm font-bold uppercase tracking-widest text-[#40484f] focus:ring-2 focus:ring-[#40484f] outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">{profile.displayName || 'Unnamed User'}</h2>
                    <p className="text-[#40484f] font-black text-sm uppercase tracking-widest mb-4">{profile.role}</p>
                  </>
                )}

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
                    <p className="text-sm font-bold text-[#40484f]">Free</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
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
                {/* Helper function to render fields */}
                {[
                    { label: 'Domain / Industry', name: 'domain', icon: Globe },
                    { label: 'Funding Requirement', name: 'fundingRequirement', icon: DollarSign, type: 'number', prefix: '$', suffix: ' USD' },
                    { label: 'Citizenship', name: 'citizenship', icon: MapPin },
                    { label: 'Primary Role', name: 'role', icon: Briefcase }, // Duplicate field, but kept for layout consistency if needed, or remove. 
                    // Note: Role is already editable in the left card. 
                    // Let's keep it consistent: editing it here updates the same state.
                    { label: 'Gender', name: 'gender', icon: User },
                    { label: 'Age', name: 'age', icon: Calendar, suffix: ' Years' },
                ].map((field) => (
                    <div key={field.name} className="space-y-2">
                        <label className="text-[10px] font-black text-[#40484f] uppercase tracking-[0.2em] block">{field.label}</label>
                        <div className={`flex items-center gap-4 p-4 ${isEditing ? 'bg-slate-50 border border-slate-200' : 'bg-slate-100'} rounded-2xl transition-all`}>
                            <field.icon className="text-[#40484f] size-5 flex-shrink-0" />
                            {isEditing ? (
                                <input
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="bg-transparent w-full font-bold text-slate-900 outline-none placeholder-slate-400"
                                    placeholder={field.label}
                                />
                            ) : (
                                <span className="font-bold text-slate-700 truncate">
                                    {field.prefix}{field.name === 'fundingRequirement' ? Number(profile[field.name]).toLocaleString() : profile[field.name]}{field.suffix}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
              </div>

              {/* Startup Idea Section */}
              <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-50 rounded-xl">
                    <Lightbulb className="text-amber-500 size-6" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Research / Startup Idea</h4>
                </div>
                <div className={`bg-slate-50 p-8 rounded-[32px] border ${isEditing ? 'border-slate-300' : 'border-slate-100'} relative overflow-hidden transition-all`}>
                  {!isEditing && <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>}
                  
                  {isEditing ? (
                    <textarea
                        name="idea"
                        value={formData.idea}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-transparent border-none outline-none text-slate-600 font-medium leading-relaxed italic resize-none p-0 focus:ring-0"
                        placeholder="Describe your innovative research vision..."
                    />
                  ) : (
                    <p className="text-slate-600 font-medium leading-relaxed italic relative z-10">
                        "{profile.idea || "Your innovative research vision will appear here after you update your profile."}"
                    </p>
                  )}
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
