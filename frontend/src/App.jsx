import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafaf7] text-slate-800 flex flex-col font-sans selection:bg-pistachio-200 selection:text-pistachio-950">
        {/* Universal Top Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<div className="max-w-7xl mx-auto p-6"><CreateTrip /></div>} />
            <Route path="/trips" element={<div className="max-w-7xl mx-auto p-6"><MyTrips /></div>} />
          </Routes>
        </main>

        {/* Elegant Footer matching the pistachio aesthetic */}
        <footer className="bg-pistachio-950 text-pistachio-300 py-12 px-6 sm:px-10 border-t border-pistachio-900 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-xl text-white tracking-wider">GLOBETROTTER</span>
              <span className="text-xs text-pistachio-400 font-script text-base">Personalized Travel Planning</span>
            </div>
            <p className="text-xs text-pistachio-400">
              © {new Date().getFullYear()} GlobeTrotter Inc. Empowering multi-city personalized adventures.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
