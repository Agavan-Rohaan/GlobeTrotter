import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, Plus, Search, Calendar, MapPin, 
  Trash2, ArrowRight, Sparkles, Clock, Globe,
  CheckCircle2, AlertCircle, Share2, Eye
} from 'lucide-react';
import api from '../services/api';

// High-fidelity fallback trips if backend database is fresh or user not logged in
const DEMO_TRIPS = [
  {
    _id: 'demo-1',
    name: 'Mediterranean Summer Grand Tour',
    description: 'Scenic exploration of coastal France, Italian vineyards, and Spanish historic quarters.',
    startDate: '2026-07-10T00:00:00.000Z',
    endDate: '2026-07-24T00:00:00.000Z',
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    destinations: [
      { name: 'Nice', country: 'France' },
      { name: 'Florence', country: 'Italy' },
      { name: 'Barcelona', country: 'Spain' }
    ],
    totalBudget: 3400,
    currency: 'USD'
  },
  {
    _id: 'demo-2',
    name: 'Cherry Blossom Journey & Kyoto Temples',
    description: 'Spring adventure immersing in Tokyo culture, Kyoto ancient shrines, and Mount Fuji.',
    startDate: '2026-03-25T00:00:00.000Z',
    endDate: '2026-04-06T00:00:00.000Z',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    destinations: [
      { name: 'Tokyo', country: 'Japan' },
      { name: 'Kyoto', country: 'Japan' },
      { name: 'Osaka', country: 'Japan' }
    ],
    totalBudget: 2850,
    currency: 'USD'
  },
  {
    _id: 'demo-3',
    name: 'Swiss Alps & Bavarian Castles',
    description: 'Winter wonderland through Interlaken peaks, Zurich lake, and Munich historic breweries.',
    startDate: '2025-12-15T00:00:00.000Z',
    endDate: '2025-12-23T00:00:00.000Z',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    destinations: [
      { name: 'Zurich', country: 'Switzerland' },
      { name: 'Interlaken', country: 'Switzerland' },
      { name: 'Munich', country: 'Germany' }
    ],
    totalBudget: 2100,
    currency: 'USD'
  }
];

export default function TripListing() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch trips from backend GET /api/trips
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setTrips(res.data);
      } else {
        setTrips(DEMO_TRIPS);
      }
    } catch (err) {
      console.warn('Backend trips API error, loading demo trips:', err);
      setTrips(DEMO_TRIPS);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Delete trip handler
  const handleDeleteTrip = async (id) => {
    try {
      setDeleting(true);
      if (!id.startsWith('demo-')) {
        await api.delete(`/trips/${id}`);
      }
      setTrips((prev) => prev.filter((t) => t._id !== id));
      showToast('Trip itinerary deleted successfully');
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete trip:', err);
      // Still remove locally for smooth UX if demo
      setTrips((prev) => prev.filter((t) => t._id !== id));
      showToast('Trip removed from your dashboard');
      setDeleteConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleShare = async (id, currentStatus) => {
    try {
      if (!id.startsWith('demo-')) {
        await api.put(`/trips/${id}/share`);
      }
      setTrips(trips.map(t => t._id === id ? { ...t, isPublic: !currentStatus } : t));
      showToast(currentStatus ? 'Trip is now private.' : 'Trip shared to Community!');
    } catch (err) {
      console.error('Failed to toggle share:', err);
    }
  };

  // Compute Trip Status dynamically based on dates if not provided
  const getTripStatus = (trip) => {
    if (trip.status) return trip.status;
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (now >= start && now <= end) return 'Ongoing';
    if (now < start) return 'Upcoming';
    return 'Completed';
  };

  // Format date range helper
  const formatDateRange = (start, end) => {
    if (!start || !end) return 'Flexible Dates';
    const s = new Date(start);
    const e = new Date(end);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-US', options)}`;
  };

  // Calculate duration in days
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const diff = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  // Filtered trips list
  const filteredTrips = trips.filter((trip) => {
    const status = getTripStatus(trip);
    const matchesTab = 
      activeTab === 'All' || 
      status.toLowerCase() === activeTab.toLowerCase();

    const matchesQuery = 
      trip.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinations?.some(d => d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d.city?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesQuery;
  });

  // Calculate summary metrics
  const totalTripsCount = trips.length;
  const totalDestinationsCount = trips.reduce((acc, t) => acc + (t.destinations?.length || 1), 0);
  const ongoingCount = trips.filter(t => getTripStatus(t) === 'Ongoing').length;
  const upcomingCount = trips.filter(t => getTripStatus(t) === 'Upcoming').length;

  return (
    <div className="space-y-10 pb-20 w-full max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-pistachio-900 text-white px-5 py-3 rounded-2xl shadow-lifted border border-pistachio-700/50 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-pistachio-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-pistachio-100 text-center space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Delete Trip Itinerary?</h3>
              <p className="text-slate-500 text-sm mt-1">
                Are you sure you want to delete this trip and all its scheduled multi-city stops? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTrip(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-soft"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. HERO HEADER & QUICK SUMMARY STATS                         */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-pistachio-950 via-pistachio-900 to-pistachio-950 text-white rounded-3xl p-8 sm:p-12 shadow-lifted relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pistachio-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-pistachio-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-pistachio-800/80 border border-pistachio-400/30 text-pistachio-200 px-3.5 py-1 rounded-full text-xs font-semibold tracking-widest uppercase backdrop-blur-xs">
              <Compass size={14} className="text-pistachio-300" />
              Dev-01 Travel Workspace
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
              My Travel Journeys
            </h1>
            <p className="text-pistachio-200 font-script text-2xl sm:text-3xl">
              Curated Adventures & Living Memories
            </p>
          </div>

          {/* Quick CTA */}
          <Link
            to="/create"
            className="inline-flex items-center justify-center gap-2 bg-pistachio-400 hover:bg-pistachio-300 text-pistachio-950 font-bold px-6 py-3.5 rounded-2xl shadow-soft hover:shadow-lifted transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <Plus size={20} className="stroke-[3]" />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-pistachio-800/60 text-white">
          <div className="bg-pistachio-900/60 border border-pistachio-700/30 p-4 rounded-2xl backdrop-blur-xs">
            <span className="text-xs text-pistachio-300 font-semibold uppercase tracking-wider block">Total Trips</span>
            <span className="text-2xl sm:text-3xl font-bold font-serif mt-1 block">{totalTripsCount}</span>
          </div>

          <div className="bg-pistachio-900/60 border border-pistachio-700/30 p-4 rounded-2xl backdrop-blur-xs">
            <span className="text-xs text-pistachio-300 font-semibold uppercase tracking-wider block">Stops & Cities</span>
            <span className="text-2xl sm:text-3xl font-bold font-serif mt-1 block">{totalDestinationsCount}</span>
          </div>

          <div className="bg-pistachio-900/60 border border-pistachio-700/30 p-4 rounded-2xl backdrop-blur-xs">
            <span className="text-xs text-pistachio-300 font-semibold uppercase tracking-wider block">Active / Ongoing</span>
            <span className="text-2xl sm:text-3xl font-bold font-serif mt-1 block text-pistachio-300">{ongoingCount}</span>
          </div>

          <div className="bg-pistachio-900/60 border border-pistachio-700/30 p-4 rounded-2xl backdrop-blur-xs">
            <span className="text-xs text-pistachio-300 font-semibold uppercase tracking-wider block">Upcoming</span>
            <span className="text-2xl sm:text-3xl font-bold font-serif mt-1 block text-cream-200">{upcomingCount}</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SEARCH & STATUS FILTER BAR                                */}
      {/* ============================================================ */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-soft border border-pistachio-100">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Ongoing', 'Upcoming', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'bg-pistachio-700 text-white shadow-soft font-bold'
                  : 'text-slate-600 hover:bg-pistachio-50 hover:text-pistachio-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips or cities..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-pistachio-600 focus:bg-white pl-10 pr-4 py-2 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TRIPS LISTING CARDS GRID                                  */}
      {/* ============================================================ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-pistachio-100 shadow-soft animate-pulse space-y-4">
              <div className="h-52 bg-slate-200 rounded-2xl w-full" />
              <div className="h-6 bg-slate-200 rounded-md w-3/4" />
              <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              <div className="h-10 bg-slate-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-pistachio-100 shadow-soft max-w-xl mx-auto space-y-4 my-8">
          <div className="h-16 w-16 bg-pistachio-50 text-pistachio-700 rounded-2xl flex items-center justify-center mx-auto">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-800">No Trips Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            {searchQuery 
              ? `No itineraries matching "${searchQuery}". Try a different keyword or reset filters.`
              : 'You haven’t planned any adventures in this category yet. Let’s create your first journey!'}
          </p>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-pistachio-700 hover:bg-pistachio-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-soft transition-all"
            >
              <Plus size={16} />
              <span>Create New Trip</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Populated Trip Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredTrips.map((trip) => {
            const status = getTripStatus(trip);
            const daysCount = calculateDays(trip.startDate, trip.endDate);

            return (
              <div
                key={trip._id}
                className="bg-white rounded-3xl overflow-hidden border border-pistachio-100 shadow-soft hover:shadow-lifted transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
              >
                {/* Cover Image with Status Overlay */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                  <img
                    src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop'}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${
                        status === 'Ongoing'
                          ? 'bg-emerald-500 text-white'
                          : status === 'Upcoming'
                          ? 'bg-pistachio-600 text-white'
                          : 'bg-slate-700/90 text-slate-200 backdrop-blur-xs'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Delete Trigger */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(trip._id)}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/40 hover:bg-red-600 text-white backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                    title="Delete Itinerary"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Date & Duration Pill at Bottom of Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      <Calendar size={13} className="text-pistachio-300" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                    <span className="bg-pistachio-800/90 text-pistachio-200 px-2 py-1 rounded-lg font-bold">
                      {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-pistachio-800 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {trip.description || 'Custom multi-city travel itinerary with scheduled daily activities.'}
                    </p>
                  </div>

                  {/* Multi-City Stops Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destinations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.destinations && trip.destinations.length > 0 ? (
                        trip.destinations.map((dest, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 bg-pistachio-50 text-pistachio-900 border border-pistachio-200/60 px-2 py-0.5 rounded-md text-xs font-medium"
                          >
                            <MapPin size={11} className="text-pistachio-600" />
                            {dest.name || dest.city || 'Stop'}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No stops added yet</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {/* Make Public / Share */}
                    <button
                      type="button"
                      onClick={() => handleToggleShare(trip._id, trip.isPublic)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        trip.isPublic 
                          ? 'border-pistachio-600 text-pistachio-700 bg-pistachio-50' 
                          : 'border-slate-200 hover:border-pistachio-600 text-slate-400 hover:text-pistachio-700 hover:bg-pistachio-50'
                      }`}
                      title={trip.isPublic ? "Unshare from Community" : "Share to Community"}
                    >
                      <Share2 size={14} />
                    </button>

                    {/* Open Itinerary Builder (Dev-03) */}
                    <button
                      type="button"
                      onClick={() => navigate(`/itinerary-builder?tripId=${trip._id}`)}
                      className="flex-1 bg-pistachio-700 hover:bg-pistachio-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-soft hover:shadow-md cursor-pointer"
                    >
                      <span>Open Builder</span>
                      <ArrowRight size={14} />
                    </button>

                    {/* View Timeline / Itinerary (Dev-04) */}
                    <button
                      type="button"
                      onClick={() => navigate(`/itinerary/${trip._id}`)}
                      className="h-9 px-3 rounded-xl border border-slate-200 hover:border-pistachio-600 text-slate-700 hover:text-pistachio-800 hover:bg-pistachio-50 text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="View Timeline & Budget"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
