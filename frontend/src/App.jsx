import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Dev1
import LandingPage from './pages/Dev1/LandingPage';
import TripListing from './pages/Dev1/TripListing';
import UserProfile from './pages/Dev1/UserProfile';
// Dev2
import Login from './pages/Dev2/Login';
import Registration from './pages/Dev2/Registration';
// Dev3
import CreateTrip from './pages/Dev3/CreateTrip';
import ItineraryBuilder from './pages/Dev3/ItineraryBuilder';
import ActivitySearch from './pages/Dev3/ActivitySearch';
// Dev4
import ItineraryView from './pages/Dev4/ItineraryView';
import CommunityTab from './pages/Dev4/CommunityTab';
import CalendarView from './pages/Dev4/CalendarView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex shrink-0 items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">GlobeTrotter</Link>
              </div>
              <div className="hidden md:flex space-x-4 overflow-x-auto whitespace-nowrap py-4">
                <Link to="/login" className="text-gray-500 hover:text-indigo-600 font-medium">Login</Link>
                <Link to="/trips" className="text-gray-500 hover:text-indigo-600 font-medium">My Trips</Link>
                <Link to="/create-trip" className="text-gray-500 hover:text-indigo-600 font-medium">Create Trip</Link>
                <Link to="/itinerary-builder" className="text-gray-500 hover:text-indigo-600 font-medium">Builder</Link>
                <Link to="/itinerary/123" className="text-indigo-600 font-medium border-b-2 border-indigo-600">Dev4: Itinerary</Link>
                <Link to="/community" className="text-indigo-600 font-medium border-b-2 border-indigo-600">Dev4: Community</Link>
                <Link to="/calendar" className="text-indigo-600 font-medium border-b-2 border-indigo-600">Dev4: Calendar</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Dev 1 Routes */}
            <Route path="/trips" element={<TripListing />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* Dev 2 Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            {/* Dev 3 Routes */}
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
            <Route path="/search" element={<ActivitySearch />} />
            
            {/* Dev 4 Routes */}
            <Route path="/itinerary/:id" element={<ItineraryView />} />
            <Route path="/community" element={<CommunityTab />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
