import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Briefcase, Globe, DollarSign, Flag, Calendar, ArrowRight, Search, ChevronDown, Check } from 'lucide-react';
import { countries } from '../../constants/countries';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const [formData, setFormData] = useState({
    domain: '',
    fundingRequirement: '',
    gender: '',
    age: '',
    dob: '',
    role: 'Founder',
    citizenship: '',
    idea: ''
  });

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent negative values for funding
    if (name === 'fundingRequirement' && value < 0) return;

    if (name === 'dob') {
        const age = calculateAge(value);
        if (age < 0) return; // Prevent future dates resulting in negative age
        setFormData({ ...formData, dob: value, age: age });
    } else if (name === 'idea') {
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount <= 300) {
            setFormData({ ...formData, [name]: value });
        }
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const profileData = {
        ...formData,
        email: user.email,
        displayName: user.displayName || '',
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), profileData);
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please check your internet connection or try again.");
      if (error.code === 'permission-denied') {
        setError("Permission denied. Please ensure Firestore Database is created in Firebase Console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Left Side - Visuals (Hidden on mobile, 40% width) */}
      <div className="hidden lg:flex w-5/12 bg-[var(--color-primary)] relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-secondary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-6">Let's Tailor Your Experience</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            GrantFit AI uses your profile to discover the most relevant funding opportunities and personalize your pitch feedback.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-4 opacity-80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <span>Curated Matches</span>
            </div>
            <div className="flex items-center space-x-4 opacity-80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <span>Smart Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (Full width on mobile, 60% on desktop) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="mb-10 text-center">
             <div className="flex justify-center mb-6">
                <div className="bg-[var(--color-primary)] p-3 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 flex items-center justify-center inline-block">
                    <img src="/logo-white.png" alt="GrantFit AI Logo" className="h-14 w-auto" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Build Your Profile</h1>
            <p className="text-[var(--color-text-muted)]">Tell us about yourself to unlock tailored grant matches.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
              <p className="text-sm text-red-700 font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Idea Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                    Your Big Idea (Max 300 words)
                </label>
                <textarea
                    name="idea"
                    required
                    value={formData.idea}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Describe your startup idea or project..."
                ></textarea>
                <p className="text-xs text-gray-400 text-right">
                    {formData.idea.trim().split(/\s+/).filter(w => w.length > 0).length}/300 words
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Domain */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Domain / Industry
                </label>
                <select
                  name="domain"
                  required
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select Domain</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="FinTech">FinTech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="EdTech">EdTech</option>
                  <option value="CleanTech">CleanTech</option>
                  <option value="AI_ML">AI & ML</option>
                  <option value="Social_Impact">Social Impact</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Funding Requirement */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Funding Requirement ({(() => {
                    const country = countries.find(c => c.name === formData.citizenship);
                    // Only show currency code, e.g., USD, EUR
                    return country ? country.currency : 'USD';
                  })()})
                </label>
                <input
                  type="number"
                  name="fundingRequirement"
                  required
                  min="0"
                  placeholder={`e.g. ${(() => {
                    const country = countries.find(c => c.name === formData.citizenship);
                    return country ? country.symbol : '';
                  })()} 50000`}
                  value={formData.fundingRequirement}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Primary Role
                </label>
                <div className="flex space-x-4">
                  {['Founder', 'Researcher'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`flex-1 p-3 rounded-xl border transition-all ${formData.role === role
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] font-medium'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Citizenship (Custom Dropdown) */}
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Flag className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Citizenship
                </label>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none flex items-center justify-between text-left"
                  >
                    {formData.citizenship ? (
                      <span className="flex items-center gap-2">
                         {(() => {
                            const c = countries.find(C => C.name === formData.citizenship);
                            return c ? (
                                <>
                                  <img 
                                    src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                    srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                                    width="20" 
                                    alt={c.name} 
                                    className="rounded-sm object-cover"
                                  />
                                  <span className="text-[#0f172a] font-medium">{c.name}</span>
                                </>
                            ) : formData.citizenship;
                         })()}
                      </span>
                    ) : (
                      <span className="text-gray-400">Select Citizenship</span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCountryOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                      {/* Search */}
                      <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search countries..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* List */}
                      <div className="overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
                        {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                          <button
                            key={country.name}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, citizenship: country.name });
                              setIsCountryOpen(false);
                              setCountrySearch('');
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} 
                                srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                                width="20" 
                                alt={country.name} 
                                className="rounded-sm object-cover shadow-sm"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-[#0f172a] font-medium">{country.name}</span>
                            </div>
                            {formData.citizenship === country.name && (
                              <Check className="w-4 h-4 text-[var(--color-primary)]" />
                            )}
                          </button>
                        ))}
                        {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                             <div className="p-4 text-center text-sm text-gray-400">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Gender
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth/Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                />
                {formData.age !== '' && (
                    <p className="text-xs text-gray-500 text-right">Age: {formData.age} years</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center p-4 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-all transform hover:scale-[1.01] shadow-lg shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Profile
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;
