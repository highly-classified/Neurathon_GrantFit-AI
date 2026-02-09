import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import PitchPractice from './components/landing/PitchPractice';
import Footer from './components/landing/Footer';
import LoginPage from './components/auth/LoginPage';
import ProfileSetup from './components/profile/ProfileSetup';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <PitchPractice />
    <Footer />
  </>
);

const Dashboard = () => (
  <div className="min-h-screen flex items-center justify-center text-3xl font-bold bg-[var(--color-background)] text-[var(--color-text-main)]">
    Dashboard Coming Soon...
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-main)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
