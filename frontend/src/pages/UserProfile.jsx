import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Camera, Globe, DollarSign, Trash2, 
  MapPin, Calendar, Clock, ArrowRight, CheckCircle, 
  Compass, AlertTriangle, ShieldCheck, Heart, Sparkles,
  Settings, Bookmark, X, Edit3
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UserProfile() {
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'preplanned' | 'previous' | 'bookmarks' | 'settings'

  // User state from localStorage or API
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  const [user, setUser] = useState({
    name: storedUser.name || 'Traveler',
    email: storedUser.email || '',
    profilePhoto: storedUser.profilePhoto || '',
    preferences: {
      language: storedUser.preferences?.language || 'en',
      currency: storedUser.preferences?.currency || 'USD'
    }
  });

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhoto, setEditPhoto] = useState(user.profilePhoto);
  const [editLanguage, setEditLanguage] = useState(user.preferences.language);
  const [editCurrency, setEditCurrency] = useState(user.preferences.currency);

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Real user data from backend only
  const [trips, setTrips] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);

  // Load user profile & trips
  useEffect(() => {
    fetchUserProfile();
    fetchUserTrips();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setEditName(data.name || '');
          setEditEmail(data.email || '');
          setEditPhoto(data.profilePhoto || '');
          setEditLanguage(data.preferences?.language || 'en');
          setEditCurrency(data.preferences?.currency || 'USD');
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (err) {
        console.error("Backend fetch profile error:", err);
      }
    }
    setLoading(false);
  };

  const fetchUserTrips = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTrips(data || []);
          return;
        }
      } catch (err) {
        console.error("Fetch trips error:", err);
      }
    }
    setTrips([]);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const updatedData = {
      name: editName,
      email: editEmail,
      profilePhoto: editPhoto,
      preferences: {
        language: editLanguage,
        currency: editCurrency,
      }
    };

    const token = localStorage.getItem('token');

    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to update profile');
        }

        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        window.dispatchEvent(new Event('auth-change'));
        setMessage('Settings & profile updated successfully!');
        setIsEditing(false);
      } catch (err) {
        setError(err.message || 'Failed to save changes');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/profile`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Delete account backend error:", err);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  // Filter trips into Preplanned vs Previous
  const preplannedTrips = trips.filter(t => t.status !== 'Completed');
  const previousTrips = trips.filter(t => t.status === 'Completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3 text-pistachio-800 font-semibold">
          <Compass size={36} className="animate-spin text-pistachio-600" />
          <span className="text-sm tracking-wider font-serif">Loading Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-pistachio-950 via-pistachio-900 to-pistachio-950 rounded-3xl p-8 sm:p-10 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-16 -translate-y-16 w-80 h-80 bg-pistachio-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-pistachio-400/40 bg-pistachio-900 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105 duration-300">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User size={64} className="text-pistachio-300" />
              )}
            </div>
            <button 
              type="button" 
              onClick={() => {
                const url = prompt("Enter Direct Profile Photo URL:", editPhoto);
                if (url !== null) { setEditPhoto(url); setIsEditing(true); }
              }}
              className="absolute bottom-1 right-1 bg-pistachio-600 hover:bg-pistachio-500 text-white p-2.5 rounded-full shadow-lg border-2 border-pistachio-950 transition-all cursor-pointer transform hover:scale-110"
              title="Update Profile Photo"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pistachio-800/80 border border-pistachio-700/50 text-[11px] font-bold text-pistachio-300 uppercase tracking-widest mb-1.5">
                  <ShieldCheck size={13} className="text-pistachio-400" />
                  <span>Personalized Traveler Profile</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {user.name || 'Traveler'}
                </h1>
                <p className="text-xs font-script text-pistachio-300 text-xl mt-1">
                  Personalized Travel Planning & Multi-City Escapes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-2 bg-pistachio-700 hover:bg-pistachio-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-soft transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Edit3 size={15} />
                <span>{isEditing ? 'Close Settings' : 'Edit Settings'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {user.email && (
                <span className="flex items-center gap-1.5 bg-pistachio-900/90 px-3.5 py-1.5 rounded-xl border border-pistachio-800 text-xs font-medium text-pistachio-200">
                  <Mail size={14} className="text-pistachio-400" />
                  {user.email}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-pistachio-900/90 px-3.5 py-1.5 rounded-xl border border-pistachio-800 text-xs font-medium text-pistachio-200">
                <Globe size={14} className="text-pistachio-400" />
                Lang: <strong className="text-white">{user.preferences?.language?.toUpperCase() || 'EN'}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-pistachio-900/90 px-3.5 py-1.5 rounded-xl border border-pistachio-800 text-xs font-medium text-pistachio-200">
                <DollarSign size={14} className="text-pistachio-400" />
                Currency: <strong className="text-white">{user.preferences?.currency || 'USD'}</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-pistachio-900/90 px-3.5 py-1.5 rounded-xl border border-pistachio-800 text-xs font-medium text-amber-300">
                <Sparkles size={14} />
                {trips.length} Total Journeys
              </span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Settings Drawer */}
      {isEditing && (
        <div className="bg-white rounded-3xl border border-pistachio-200 p-8 shadow-lifted space-y-6">
          <div className="border-b border-pistachio-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                <Settings size={20} className="text-pistachio-700" />
                Profile Settings
              </h2>
              <p className="text-xs text-slate-500 font-script text-base">Modify your account info and preferences</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all shadow-xs"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Language Preference
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all cursor-pointer shadow-xs"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="ja">Japanese (日本語)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Currency
                </label>
                <select
                  value={editCurrency}
                  onChange={(e) => setEditCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all cursor-pointer shadow-xs"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-pistachio-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-pistachio-700 hover:bg-pistachio-800 text-white font-semibold text-xs rounded-xl shadow-soft transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-pistachio-100/80">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-pistachio-800 text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-pistachio-50 border border-pistachio-100'
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preplanned')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'preplanned'
              ? 'bg-pistachio-800 text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-pistachio-50 border border-pistachio-100'
          }`}
        >
          Preplanned Trips ({preplannedTrips.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('previous')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'previous'
              ? 'bg-pistachio-800 text-white shadow-soft'
              : 'bg-white text-slate-600 hover:bg-pistachio-50 border border-pistachio-100'
          }`}
        >
          Previous Trips ({previousTrips.length})
        </button>
      </div>

      {/* Preplanned Trips Section */}
      {(activeTab === 'all' || activeTab === 'preplanned') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Preplanned Trips</h2>
              <p className="text-xs text-slate-500 font-script text-base">Upcoming adventures waiting on your calendar</p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pistachio-800 hover:text-pistachio-950 bg-pistachio-100 border border-pistachio-200 px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              <span>+ Plan New</span>
            </Link>
          </div>

          {preplannedTrips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-pistachio-100 p-8 text-center text-slate-400 space-y-3">
              <Compass size={36} className="mx-auto text-pistachio-400" />
              <p className="text-sm font-medium">No preplanned trips found.</p>
              <Link to="/create" className="inline-block text-xs font-bold text-pistachio-700 hover:underline">
                Create your first trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preplannedTrips.map((trip) => (
                <div 
                  key={trip._id}
                  className="bg-white rounded-3xl border border-pistachio-100 overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 flex flex-col group"
                >
                  <div className="h-44 relative overflow-hidden bg-pistachio-950">
                    <img 
                      src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'} 
                      alt={trip.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-pistachio-100/90 text-pistachio-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-pistachio-200 shadow-xs">
                      {trip.status || 'Planning'}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-pistachio-800 transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {trip.description || 'Custom multi-city travel itinerary.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-pistachio-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-pistachio-700" />
                        <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Dates TBD'}</span>
                      </div>

                      <Link
                        to={`/itinerary/${trip._id}`}
                        className="inline-flex items-center gap-1.5 bg-pistachio-700 hover:bg-pistachio-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                      >
                        <span>View</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous Trips Section */}
      {(activeTab === 'all' || activeTab === 'previous') && (
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Previous Trips</h2>
            <p className="text-xs text-slate-500 font-script text-base">Completed journeys & memories</p>
          </div>

          {previousTrips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-pistachio-100 p-8 text-center text-slate-400 space-y-2">
              <CheckCircle size={32} className="mx-auto text-pistachio-300" />
              <p className="text-sm font-medium">No previous trips recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousTrips.map((trip) => (
                <div 
                  key={trip._id}
                  className="bg-white rounded-3xl border border-pistachio-100 overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 flex flex-col group"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-900">
                    <img 
                      src={trip.coverPhoto || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'} 
                      alt={trip.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      Completed
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 group-hover:text-pistachio-800 transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {trip.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-pistachio-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={14} className="text-emerald-600" />
                        <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Past Trip'}</span>
                      </div>

                      <Link
                        to={`/itinerary/${trip._id}`}
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                      >
                        <span>View</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Privacy & Danger Zone */}
      <div className="bg-rose-50/50 rounded-3xl border border-rose-200/80 p-8 space-y-4 mt-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-rose-950 flex items-center gap-2">
              <Trash2 size={18} className="text-rose-600" />
              Delete Account & Privacy
            </h3>
            <p className="text-xs text-rose-700/80 mt-1">
              Permanently delete your profile, preferences, and all associated trip itineraries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">Are you sure?</h3>
              <p className="text-xs text-slate-500">
                This action is permanent. All your saved itineraries and settings will be permanently erased.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
