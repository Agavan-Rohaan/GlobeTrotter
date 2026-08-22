import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

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
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen bg-[#fafaf7] text-slate-800 flex flex-col font-sans selection:bg-pistachio-200 selection:text-pistachio-950">
        {/* Universal Top Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <Routes>
            {/* Screen 1 & 2: Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            {/* Root Path Route: First page for unauthenticated users is /login */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Screen 3: Landing / Dashboard (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Screen 4: Create Trip (Protected) */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><CreateTrip /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><CreateTrip /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 6: Trip Listing (Protected) */}
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><TripListing /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 5: Itinerary Builder (Protected - Only accessible when creating or selecting a trip) */}
            <Route
              path="/itinerary-builder"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ItineraryBuilder /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ItineraryBuilder /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 6 & 9: Itinerary & Budget View (Protected) */}
            <Route
              path="/itinerary/:id"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ItineraryView /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/itinerary-view"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ItineraryView /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 8: Activity Search (Protected) */}
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ActivitySearch /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity-search"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><ActivitySearch /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 10: Community Public Feed (Protected) */}
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><CommunityTab /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 11: Calendar View (Protected) */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><CalendarView /></div>
                </ProtectedRoute>
              }
            />

            {/* Screen 12: User Profile (Protected) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto p-6"><UserProfile /></div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
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
