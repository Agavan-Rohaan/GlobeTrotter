import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Camera, Globe, DollarSign, Trash2, 
  MapPin, Calendar, Clock, ArrowRight, CheckCircle, 
  Compass, AlertTriangle, ShieldCheck, Heart, Sparkles
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_DEV_USER = {
  name: 'MeetRaval91',
  email: 'hetalraval1209@gmail.com',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  preferences: {
    language: 'en',
    currency: 'USD'
  }
};

export default function UserProfile() {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(DEFAULT_DEV_USER);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(DEFAULT_DEV_USER.name);
  const [editEmail, setEditEmail] = useState(DEFAULT_DEV_USER.email);
  const [editPhoto, setEditPhoto] = useState(DEFAULT_DEV_USER.profilePhoto);
  const [editLanguage, setEditLanguage] = useState(DEFAULT_DEV_USER.preferences.language);
  const [editCurrency, setEditCurrency] = useState(DEFAULT_DEV_USER.preferences.currency);

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Trips data from backend
  const [trips, setTrips] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([
    { id: '1', city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80', description: 'City of light & romance' },
    { id: '2', city: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80', description: 'Traditional temples & gardens' },
    { id: '3', city: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80', description: 'Ancient history & cuisine' },
  ]);

  // Load user profile & trips
  useEffect(() => {
    fetchUserProfile();
    fetchUserTrips();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const merged = {
          name: parsed.name || DEFAULT_DEV_USER.name,
          email: parsed.email || DEFAULT_DEV_USER.email,
          profilePhoto: parsed.profilePhoto || DEFAULT_DEV_USER.profilePhoto,
          preferences: {
            language: parsed.preferences?.language || DEFAULT_DEV_USER.preferences.language,
            currency: parsed.preferences?.currency || DEFAULT_DEV_USER.preferences.currency
          }
        };
        setUser(merged);
        setEditName(merged.name);
        setEditEmail(merged.email);
        setEditPhoto(merged.profilePhoto);
        setEditLanguage(merged.preferences.language);
        setEditCurrency(merged.preferences.currency);
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }


    if (token && token !== 'dev-secret-token-123') {
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
    if (token && token !== 'dev-secret-token-123') {
      try {
        const res = await fetch(`${API_URL}/api/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTrips(data);
          return;
        }
      } catch (err) {
        console.error("Fetch trips error:", err);
      }
    }

    // Default sample trips for presentation
    setTrips([
      {
        _id: 'sample-trip-1',
        name: 'Summer Escapade in Tokyo & Kyoto',
        description: 'Exploring temples, izakayas, and high-speed shinkansen trains.',
        startDate: '2026-09-10',
        endDate: '2026-09-24',
        status: 'Planning',
        coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      },
      {
        _id: 'sample-trip-2',
        name: 'Amalfi Coast Coastal Discovery',
        description: 'Cliffside villages, limoncello tastings, and Mediterranean sunsets.',
        startDate: '2026-06-01',
        endDate: '2026-06-12',
        status: 'Completed',
        coverPhoto: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
      },
    ]);
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

    if (token && token !== 'dev-secret-token-123') {
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
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } catch (err) {
        setError(err.message || 'Failed to save changes');
      } finally {
        setSaving(false);
      }
    } else {
      // Local development state save
      const localUser = {
        ...user,
        name: editName,
        email: editEmail,
        profilePhoto: editPhoto,
        preferences: { language: editLanguage, currency: editCurrency }
      };
      setUser(localUser);
      localStorage.setItem('user', JSON.stringify(localUser));
      window.dispatchEvent(new Event('auth-change'));
      setMessage('Profile updated locally!');
      setIsEditing(false);
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (token && token !== 'dev-secret-token-123') {
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
    localStorage.removeItem('dev_bypass');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  // Filter trips into Preplanned vs Previous (from Excalidraw mockup wireframe)
  const preplannedTrips = trips.filter(t => t.status !== 'Completed');
  const previousTrips = trips.filter(t => t.status === 'Completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-pistachio-700 font-semibold">
          <Compass size={28} className="animate-spin" />
          <span>Loading Profile Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner Accent */}
      <div className="bg-pistachio-950 rounded-3xl p-8 sm:p-10 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-pistachio-800/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* User Avatar Circle with Dropbox Support */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-pistachio-400/40 bg-pistachio-900 flex items-center justify-center text-white shadow-xl">
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <User size={56} className="text-pistachio-300" />
              )}
            </div>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { const url = prompt("Enter Dropbox Direct Image URL:"); if (url) setEditPhoto(url); }}
                className="absolute bottom-1 right-1 bg-pistachio-600 hover:bg-pistachio-500 text-white p-2 rounded-full shadow-md transition-all cursor-pointer"
                title="Change Photo URL"
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* User Info & Edit Action Header */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  {user.name || 'Traveler Explorer'}
                </h1>
                <p className="text-sm font-script text-pistachio-300 text-lg mt-0.5">
                  Member of GlobeTrotter Personalized Escapes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-2 bg-pistachio-700 hover:bg-pistachio-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-soft transition-all cursor-pointer"
              >
                <Camera size={14} />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile & Settings'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-pistachio-200 pt-2">
              <span className="flex items-center gap-1.5 bg-pistachio-900/80 px-3 py-1 rounded-lg border border-pistachio-800">
                <Mail size={13} className="text-pistachio-400" />
                {user.email || 'user@globetrotter.travel'}
              </span>
              <span className="flex items-center gap-1.5 bg-pistachio-900/80 px-3 py-1 rounded-lg border border-pistachio-800">
                <Globe size={13} className="text-pistachio-400" />
                {user.preferences?.language?.toUpperCase() || 'EN'} | {user.preferences?.currency || 'USD'}
              </span>
              <span className="flex items-center gap-1.5 bg-pistachio-900/80 px-3 py-1 rounded-lg border border-pistachio-800 text-emerald-300">
                <ShieldCheck size={13} />
                Verified Traveler
              </span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editable Settings Card (Screen 12 Functional Requirement) */}
      {isEditing && (
        <div className="bg-white rounded-3xl border border-pistachio-100 p-8 shadow-soft space-y-6">
          <div className="border-b border-pistachio-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-900">Update Settings & Preferences</h2>
              <p className="text-xs text-slate-500 font-script text-base">Control your data, language, and Dropbox photo URL</p>
            </div>
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
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Profile Photo URL (Dropbox or Web Link)
                </label>
                <input
                  type="text"
                  placeholder="https://dl.dropboxusercontent.com/s/your-photo-link.jpg"
                  value={editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We strictly support Dropbox direct image URLs for high reliability as specified in system architecture.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Language Preference
                </label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all cursor-pointer"
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
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-pistachio-500 outline-none transition-all cursor-pointer"
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
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-all"
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

      {/* SECTION 1: Preplanned Trips (From Excalidraw Wireframe Screen 7) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Preplanned Trips</h2>
            <p className="text-xs text-slate-500 font-script text-base">Upcoming adventures waiting on your calendar</p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pistachio-800 hover:text-pistachio-950 bg-pistachio-100 border border-pistachio-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>+ Plan New</span>
          </Link>
        </div>

        {preplannedTrips.length === 0 ? (
          <div className="bg-white rounded-3xl border border-pistachio-100 p-8 text-center text-slate-400 space-y-3">
            <Compass size={36} className="mx-auto text-pistachio-400" />
            <p className="text-sm font-medium">No preplanned trips found.</p>
            <Link to="/create" className="inline-block text-xs font-bold text-pistachio-700 hover:underline">
              Create your first preplanned trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preplannedTrips.map((trip) => (
              <div 
                key={trip._id}
                className="bg-white rounded-3xl border border-pistachio-100 overflow-hidden shadow-soft hover:shadow-lifted transition-all flex flex-col group"
              >
                <div className="h-44 relative overflow-hidden bg-pistachio-900">
                  <img 
                    src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80'} 
                    alt={trip.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-pistachio-100/90 text-pistachio-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-pistachio-200">
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
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={14} className="text-pistachio-700" />
                      <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Dates TBD'}</span>
                    </div>

                    {/* View Button from Wireframe */}
                    <Link
                      to={`/itinerary/${trip._id}`}
                      className="inline-flex items-center gap-1 bg-pistachio-700 hover:bg-pistachio-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
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

      {/* SECTION 2: Previous Trips (From Excalidraw Wireframe Screen 7) */}
      <div className="space-y-6 pt-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Previous Trips</h2>
          <p className="text-xs text-slate-500 font-script text-base">Completed journeys & cherished memories</p>
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
                className="bg-white rounded-3xl border border-pistachio-100 overflow-hidden shadow-soft hover:shadow-lifted transition-all flex flex-col group opacity-90 hover:opacity-100"
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img 
                    src={trip.coverPhoto || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'} 
                    alt={trip.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Completed
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {trip.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pistachio-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={14} className="text-emerald-600" />
                      <span>{trip.startDate ? new Date(trip.startDate).toLocaleDateString() : 'Past Trip'}</span>
                    </div>

                    {/* View Button from Wireframe */}
                    <Link
                      to={`/itinerary/${trip._id}`}
                      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
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

      {/* SECTION 3: Saved Destinations & Bookmarks */}
      <div className="space-y-6 pt-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Saved Destinations & Ideas</h2>
          <p className="text-xs text-slate-500 font-script text-base">Bookmarked cities for future itinerary builds</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDestinations.map((dest) => (
            <div 
              key={dest.id} 
              className="bg-white rounded-3xl border border-pistachio-100 p-5 shadow-soft hover:shadow-lifted transition-all flex items-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-pistachio-100">
                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-serif font-bold text-slate-900 truncate">{dest.city}, {dest.country}</h4>
                <p className="text-xs text-slate-500 truncate">{dest.description}</p>
                <Link to="/create" className="text-[11px] font-bold text-pistachio-700 hover:underline mt-1 inline-block">
                  Add to Trip +
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Account Privacy & Danger Zone */}
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
                This action is permanent and cannot be undone. All your saved itineraries, destinations, and settings will be permanently erased.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md"
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
