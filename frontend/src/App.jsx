import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import PitchPractice from './components/landing/PitchPractice';
import Footer from './components/landing/Footer';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import ProfileSetup from './components/profile/ProfileSetup';
import Tracking from './components/tracking/Tracking';
import RegistrationPage from './components/dashboard/RegistrationPage';
import Credits from './components/credits/Credits';
import ProfileView from './components/profile/ProfileView';
import PitchModule from './components/pitch/PitchModule';

const LandingPage = () => {
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page-bg">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PitchPractice />
      <Footer />
    </div>
  );
};

function App() {
  // Trigger Daily Check-in on mount/auth
  React.useEffect(() => {
    // Dynamic import to avoid top-level dependency issues if any, 
    // though standard import is better. The file already has imports.
    // Use the firebase auth listener.
    import('./firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
            await fetch(`${API_BASE_URL}/api/credits/check-in`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.uid })
            });
            console.log("Daily check-in attempted.");
          } catch (e) {
            console.error("Global check-in failed:", e);
          }
        }
      });
      return () => unsubscribe();
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/register/:id" element={<RegistrationPage />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/pitch/:grantId" element={<PitchModule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
