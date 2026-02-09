import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Briefcase, Globe, DollarSign, Flag, Calendar, ArrowRight } from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    domain: '',
    fundingRequirement: '',
    gender: '',
    age: '',
    role: 'Founder',
    citizenship: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                  Funding Requirement (USD)
                </label>
                <input
                  type="number"
                  name="fundingRequirement"
                  required
                  placeholder="e.g. 50000"
                  value={formData.fundingRequirement}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
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

              {/* Citizenship */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Flag className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Citizenship
                </label>
                <input
                  type="text"
                  name="citizenship"
                  required
                  placeholder="e.g. United States"
                  value={formData.citizenship}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                />
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

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[var(--color-secondary)]" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  placeholder="e.g. 25"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                />
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
