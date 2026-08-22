import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Page Imports across all 13 Screens
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import TripListing from './pages/TripListing';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import ActivitySearch from './pages/ActivitySearch';
import CommunityTab from './pages/CommunityTab';
import CalendarView from './pages/CalendarView';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafaf7] text-slate-800 flex flex-col font-sans selection:bg-pistachio-200 selection:text-pistachio-950">
        {/* Universal Top Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <Routes>
            {/* Screen 3: Landing / Dashboard (Dev1) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Screen 1 & 2: Auth (Dev2) */}
            <Route path="/login" element={<div className="max-w-md mx-auto p-6 mt-10"><Login /></div>} />
            <Route path="/register" element={<div className="max-w-md mx-auto p-6 mt-10"><Registration /></div>} />

            {/* Screen 4: Create Trip (Dev3) */}
            <Route path="/create" element={<div className="max-w-7xl mx-auto p-6"><CreateTrip /></div>} />
            <Route path="/create-trip" element={<div className="max-w-7xl mx-auto p-6"><CreateTrip /></div>} />

            {/* Screen 6: Trip Listing (Dev1) */}
            <Route path="/trips" element={<div className="max-w-7xl mx-auto p-6"><MyTrips /></div>} />

            {/* Screen 5: Itinerary Builder (Dev3) */}
            <Route path="/itinerary-builder" element={<div className="max-w-7xl mx-auto p-6"><ItineraryBuilder /></div>} />
            <Route path="/builder" element={<div className="max-w-7xl mx-auto p-6"><ItineraryBuilder /></div>} />

            {/* Screen 6 & 9: Itinerary & Budget View (Dev4) */}
            <Route path="/itinerary/:id" element={<div className="max-w-7xl mx-auto p-6"><ItineraryView /></div>} />
            <Route path="/itinerary-view" element={<div className="max-w-7xl mx-auto p-6"><ItineraryView /></div>} />

            {/* Screen 8: Activity Search (Dev3) */}
            <Route path="/activities" element={<div className="max-w-7xl mx-auto p-6"><ActivitySearch /></div>} />
            <Route path="/activity-search" element={<div className="max-w-7xl mx-auto p-6"><ActivitySearch /></div>} />

            {/* Screen 10: Community Public Feed (Dev4) */}
            <Route path="/community" element={<div className="max-w-7xl mx-auto p-6"><CommunityTab /></div>} />

            {/* Screen 11: Calendar View (Dev4) */}
            <Route path="/calendar" element={<div className="max-w-7xl mx-auto p-6"><CalendarView /></div>} />

            {/* Screen 12: User Profile (Dev1) */}
            <Route path="/profile" element={<div className="max-w-7xl mx-auto p-6"><UserProfile /></div>} />
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
