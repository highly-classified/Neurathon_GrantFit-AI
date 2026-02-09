import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<div className="p-8 text-center text-2xl font-bold text-[#0a192f]">Dashboard Placeholder</div>} />
      </Routes>
    </Router>
  );
}

export default App;
