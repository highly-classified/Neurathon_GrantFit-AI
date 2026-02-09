import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ideaSummary: '',
    domain: '',
    fundingRequirement: '',
    role: '',
    citizenship: '',
    gender: '',
    ageGroup: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...formData,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        createdAt: serverTimestamp(),
        profileCompleted: true
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving profile: ", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f6f8] text-[#0e121b] antialiased min-h-screen font-sans">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white border-b border-[#e7ebf3] sticky top-0 z-50">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1347ae] p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0e121b]">GranFit AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#4e6797]">Need help?</span>
            <div className="h-10 w-10 rounded-full bg-[#1347ae]/10 border border-[#1347ae]/20 flex items-center justify-center text-[#1347ae] font-bold">
               {auth.currentUser?.displayName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="w-full py-12 px-6 lg:px-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-black text-[#0e121b] tracking-tight mb-3">Let's build your AI profile</h2>
          <p className="text-lg text-[#4e6797]">Provide your project details to improve grant matching accuracy. Our AI uses this data to find specific funding opportunities tailored for you.</p>
        </div>
        
        {/* Onboarding Container */}
        <div className="bg-white border border-[#e7ebf3] rounded-xl shadow-sm overflow-hidden">
          {/* Progress Indicator */}
          <div className="p-8 border-b border-[#e7ebf3] bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-[#1347ae] uppercase tracking-wider">Step 1 of 3: Project & Professional Details</span>
              <span className="text-sm font-medium text-[#4e6797]">33% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-[#d0d7e7] rounded-full overflow-hidden">
              <div className="h-full bg-[#1347ae] rounded-full transition-all duration-500 ease-in-out" style={{ width: '33%' }}></div>
            </div>
          </div>
          
          {/* Form Body */}
          <div className="p-8 space-y-8">
            {/* Section: Project Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-base font-bold text-[#0e121b]">Idea Summary</label>
                  <span className="material-symbols-outlined text-[#1347ae] text-lg cursor-help" title="Detailed summaries allow our AI to match niche research categories.">info</span>
                </div>
                <textarea 
                  name="ideaSummary"
                  value={formData.ideaSummary}
                  onChange={handleChange}
                  className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] placeholder-[#4e6797] focus:ring-2 focus:ring-[#1347ae] focus:border-transparent transition-shadow min-h-[160px] p-4 text-base leading-relaxed" 
                  placeholder="Describe your research project, startup concept, or innovation goals in detail..."
                ></textarea>
                <p className="mt-2 text-xs text-[#4e6797]">Minimum 100 characters recommended for better matching.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Domain / Industry</label>
                  <select 
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12 px-4"
                  >
                    <option disabled value="">Select a domain</option>
                    <option value="biotech">Biotechnology & Health</option>
                    <option value="ai">Artificial Intelligence & ML</option>
                    <option value="energy">Renewable Energy & Sustainability</option>
                    <option value="edu">EdTech & Learning Sciences</option>
                    <option value="agri">Agriculture & Food Systems</option>
                    <option value="space">Space Exploration & Aerospace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Funding Requirement (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4e6797]">$</span>
                    <input 
                      name="fundingRequirement"
                      value={formData.fundingRequirement}
                      onChange={handleChange}
                      className="w-full pl-8 rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12" 
                      placeholder="e.g. 250,000" 
                      type="number"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-[#e7ebf3]"></div>
            
            {/* Section: Personal & Professional Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#0e121b]">Personal & Eligibility Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Current Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12 px-4"
                  >
                    <option disabled value="">Select your role</option>
                    <option value="pi">Principal Investigator</option>
                    <option value="founder">Founder / CEO</option>
                    <option value="phd">PhD Researcher</option>
                    <option value="nonprofit">Non-Profit Director</option>
                    <option value="other">Other Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Citizenship</label>
                  <select 
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12 px-4"
                  >
                    <option disabled value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="eu">European Union Member</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12 px-4"
                  >
                    <option disabled value="">Prefer not to say</option>
                    <option value="f">Female</option>
                    <option value="m">Male</option>
                    <option value="nb">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0e121b] mb-2">Age Group</label>
                  <select 
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[#d0d7e7] bg-white text-[#0e121b] focus:ring-2 focus:ring-[#1347ae] h-12 px-4"
                  >
                    <option disabled value="">Select range</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-8 bg-gray-50/50 border-t border-[#e7ebf3] flex items-center justify-between">
            <button className="px-6 py-3 text-sm font-bold text-[#4e6797] hover:text-[#1347ae] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Previous
            </button>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 text-sm font-bold text-[#4e6797] hover:text-[#1347ae] transition-colors">
                Save Draft
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-[#1347ae] hover:bg-[#1347ae]/90 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Next: Eligibility Checks'}
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#4e6797] uppercase tracking-widest font-semibold">
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-green-500">lock</span> Secure Encryption</span>
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-green-500">verified_user</span> GDPR Compliant</span>
          <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-green-500">shield</span> Privacy Protected</span>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetup;
