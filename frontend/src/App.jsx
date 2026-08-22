import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import { PlaneTakeoff } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-amber-500">
            <PlaneTakeoff size={28} />
            GlobeTrotter
          </Link>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-slate-600 hover:text-amber-500 font-medium">Dashboard</Link>
            <Link to="/trips" className="text-slate-600 hover:text-amber-500 font-medium">My Trips</Link>
            <Link to="/create" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Plan New Trip</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateTrip />} />
            <Route path="/trips" element={<MyTrips />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
