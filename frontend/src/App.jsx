import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
              <div className="hidden md:flex space-x-8">
                {/* Temporary links for Dev testing */}
                <Link to="/itinerary/123" className="text-gray-500 hover:text-indigo-600 font-medium">Itinerary (Screen 9)</Link>
                <Link to="/community" className="text-gray-500 hover:text-indigo-600 font-medium">Community (Screen 10)</Link>
                <Link to="/calendar" className="text-gray-500 hover:text-indigo-600 font-medium">Calendar (Screen 11)</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">Welcome to GlobeTrotter!</h1>
                <p className="text-xl text-gray-500 mb-8">Devs, use the navigation above to access your isolated screens.</p>
              </div>
            } />
            
            {/* Dev 4 Routes */}
            <Route path="/itinerary/:id" element={<ItineraryView />} />
            <Route path="/community" element={<CommunityTab />} />
            <Route path="/calendar" element={<CalendarView />} />

            {/* Dev 1, Dev 2, Dev 3 Routes will go here later */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
