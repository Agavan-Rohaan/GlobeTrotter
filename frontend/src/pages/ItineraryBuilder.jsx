import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, Plus, Search, Calendar, MapPin, 
  Trash2, ArrowRight, Sparkles, X, Clock, DollarSign,
  Utensils, Camera, Ticket, ShoppingBag, Music, Landmark, CheckCircle2, Save, Loader2
} from 'lucide-react';
import api from '../services/api';
import MapTracker from '../components/MapTracker';

// Curated popular activities database for Instant Recommendations & Fallback
const POPULAR_ACTIVITIES = [
  {
    id: 'pop-1',
    name: 'Eiffel Tower Summit & Champagne Toast',
    city: 'Paris',
    country: 'France',
    category: 'Sightseeing',
    cost: 45,
    duration: '2-3 hrs',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop',
    lat: 48.8584,
    lng: 2.2945
  },
  {
    id: 'pop-2',
    name: 'Louvre Museum Guided Masterpieces Tour',
    city: 'Paris',
    country: 'France',
    category: 'Culture & Art',
    cost: 35,
    duration: '3 hrs',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
    lat: 48.8606,
    lng: 2.3376
  },
  {
    id: 'pop-3',
    name: 'Disneyland Paris 1-Day Park Pass',
    city: 'Paris',
    country: 'France',
    category: 'Amusement & Parks',
    cost: 95,
    duration: 'Full Day',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop',
    lat: 48.8722,
    lng: 2.7758
  },
  {
    id: 'pop-4',
    name: 'Gourmet French Croissant & Pastry Workshop',
    city: 'Paris',
    country: 'France',
    category: 'Food & Dining',
    cost: 65,
    duration: '2 hrs',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: 'pop-5',
    name: 'Colosseum & Roman Forum Priority Entry',
    city: 'Rome',
    country: 'Italy',
    category: 'Sightseeing',
    cost: 40,
    duration: '3 hrs',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
    lat: 41.8902,
    lng: 12.4922
  },
  {
    id: 'pop-6',
    name: 'Trastevere Evening Food & Wine Tasting Walk',
    city: 'Rome',
    country: 'Italy',
    category: 'Food & Dining',
    cost: 75,
    duration: '3.5 hrs',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    lat: 41.8883,
    lng: 12.4705
  },
  {
    id: 'pop-7',
    name: 'Sagrada Familia Fast-Track Basilica Tour',
    city: 'Barcelona',
    country: 'Spain',
    category: 'Culture & Art',
    cost: 38,
    duration: '2 hrs',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop',
    lat: 41.4036,
    lng: 2.1744
  },
  {
    id: 'pop-8',
    name: 'Shibuya Crossing & Harajuku Culture Experience',
    city: 'Tokyo',
    country: 'Japan',
    category: 'Sightseeing',
    cost: 25,
    duration: '3 hrs',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    lat: 35.6595,
    lng: 139.7004
  }
];

export default function ItineraryBuilder() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract trip metadata from Dev-03's state or query string or defaults
  const passedState = location.state || {};
  const [tripData, setTripData] = useState({
    name: passedState.name || passedState.tripName || 'Grand Multi-City European Journey',
    startingPlace: passedState.startingPlace || passedState.startCity || 'Paris, France',
    startDate: passedState.startDate || '2026-07-10',
    endDate: passedState.endDate || '2026-07-24',
    destinations: passedState.destinations || [
      { city: 'Paris', country: 'France' },
      { city: 'Rome', country: 'Italy' },
      { city: 'Barcelona', country: 'Spain' }
    ]
  });

  // Trip Timeline Stops state
  const [stops, setStops] = useState([
    {
      id: 'stop-1',
      title: 'Arrival & Welcome Dinner in Paris',
      city: 'Paris',
      country: 'France',
      category: 'Food & Dining',
      cost: 65,
      duration: '2 hrs',
      lat: 48.8566,
      lng: 2.3522,
      day: 1
    },
    {
      id: 'stop-2',
      title: 'Eiffel Tower Summit & Champagne Toast',
      city: 'Paris',
      country: 'France',
      category: 'Sightseeing',
      cost: 45,
      duration: '3 hrs',
      lat: 48.8584,
      lng: 2.2945,
      day: 2
    },
    {
      id: 'stop-3',
      title: 'Colosseum & Roman Forum Priority Entry',
      city: 'Rome',
      country: 'Italy',
      category: 'Culture & Art',
      cost: 40,
      duration: '3 hrs',
      lat: 41.8902,
      lng: 12.4922,
      day: 4
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedResults, setScrapedResults] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch live backend trip if tripId param exists
  useEffect(() => {
    const tripId = searchParams.get('tripId');
    if (tripId && !tripId.startsWith('demo-')) {
      fetchBackendTrip(tripId);
    }
  }, [searchParams]);

  const fetchBackendTrip = async (tripId) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      if (res.data) {
        setTripData({
          name: res.data.name || tripData.name,
          startingPlace: res.data.startingPlace || tripData.startingPlace,
          startDate: res.data.startDate || tripData.startDate,
          endDate: res.data.endDate || tripData.endDate,
          destinations: res.data.destinations || tripData.destinations
        });
      }
    } catch (err) {
      console.warn('Could not load backend trip, keeping initial trip context:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Perform Live Scraper Search or Filter Popular Activities
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsScraping(true);
      const res = await api.get(`/scrape/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setScrapedResults(res.data);
      } else {
        setScrapedResults([]);
      }
    } catch (err) {
      console.warn('Live scraper endpoint unavailable, showing fallback list:', err);
      setScrapedResults([]);
    } finally {
      setIsScraping(false);
    }
  };

  // Add Activity / Stop to Itinerary & Update Map Route
  const handleAddStop = (item) => {
    const newStop = {
      id: `stop-${Date.now()}`,
      title: item.name || item.title || 'New Activity',
      city: item.city || tripData.destinations[0]?.city || 'Paris',
      country: item.country || tripData.destinations[0]?.country || 'France',
      category: item.category || 'Sightseeing',
      cost: item.cost || 30,
      duration: item.duration || '2 hrs',
      lat: item.lat || (48.8566 + (Math.random() - 0.5) * 0.08),
      lng: item.lng || (2.3522 + (Math.random() - 0.5) * 0.08),
      day: stops.length + 1
    };

    setStops((prev) => [...prev, newStop]);
    showToast(`Added "${newStop.title}" to itinerary!`);
  };

  // Remove Stop
  const handleRemoveStop = (id) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
    showToast('Stop removed from itinerary');
  };

  const handleSaveItinerary = async () => {
    const tripId = searchParams.get('tripId');
    if (!tripId || tripId.startsWith('demo-')) {
      showToast('Cannot save demo trip to backend.');
      return;
    }
    setIsSaving(true);
    try {
      // Create Places and Events for each stop
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        
        // 1. Create Place
        const placeRes = await api.post('/places', {
          city_id: 'auto-generated',
          name: stop.title,
          description: stop.category,
          category: stop.category,
          location: { type: 'Point', coordinates: [stop.lng, stop.lat] },
          costInfo: stop.cost.toString(),
          duration: stop.duration,
          images: [stop.image || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80']
        });
        
        const place = placeRes.data;

        // 2. Create Event
        const eventDate = new Date(tripData.startDate);
        eventDate.setDate(eventDate.getDate() + (stop.day - 1));
        
        await api.post('/events', {
          trip_id: tripId,
          place_id: place._id,
          date: eventDate.toISOString(),
          startTime: '09:00',
          endTime: '11:00',
          cost: stop.cost,
          currency: 'USD'
        });
      }
      showToast('Itinerary successfully saved to backend!');
      setTimeout(() => navigate(`/itinerary/${tripId}`), 1500);
    } catch (err) {
      console.error('Failed to save itinerary', err);
      showToast('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter Modal Activities
  const displayedModalActivities = POPULAR_ACTIVITIES.filter((act) => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesCity = selectedCityFilter === 'All' || act.city.toLowerCase() === selectedCityFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  // Calculate Metrics
  const totalCost = stops.reduce((sum, s) => sum + (s.cost || 0), 0);
  const totalCitiesCount = new Set(stops.map(s => s.city)).size || tripData.destinations.length;

  return (
    <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-pistachio-900 text-white px-5 py-3 rounded-2xl shadow-lifted border border-pistachio-700/50 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-pistachio-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. TOP HEADER (Trip Context & Route Flow)                     */}
      {/* ============================================================ */}
      <section className="glass-dark bg-pistachio-950/90 text-white rounded-3xl p-6 sm:p-8 shadow-lifted relative overflow-hidden border border-pistachio-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pistachio-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-pistachio-800/80 border border-pistachio-400/30 text-pistachio-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
                <Compass size={14} className="text-pistachio-300" />
                Screen 5 — Multi-City Itinerary Builder
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white">
                {tripData.name}
              </h1>
              <p className="text-pistachio-200 text-sm font-sans flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-pistachio-400" />
                <span>{tripData.startDate} – {tripData.endDate}</span>
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3">
              <div className="bg-pistachio-900/80 border border-pistachio-700/50 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-pistachio-300 block">Est. Budget</span>
                <span className="text-lg font-bold font-serif text-white">${totalCost}</span>
              </div>
              <div className="bg-pistachio-900/80 border border-pistachio-700/50 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-pistachio-300 block">Total Stops</span>
                <span className="text-lg font-bold font-serif text-white">{stops.length}</span>
              </div>
            </div>
          </div>

          {/* Point-to-Point Destination Sequence Bar */}
          <div className="pt-3 border-t border-pistachio-800/60 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-pistachio-400 font-bold uppercase tracking-wider">Start:</span>
            <span className="bg-pistachio-800 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <MapPin size={12} className="text-pistachio-300" />
              {tripData.startingPlace}
            </span>
            <ArrowRight size={14} className="text-pistachio-500" />
            <span className="text-pistachio-400 font-bold uppercase tracking-wider">Destinations:</span>
            {tripData.destinations.map((d, idx) => (
              <React.Fragment key={idx}>
                <span className="bg-pistachio-900/90 text-pistachio-200 border border-pistachio-700/50 px-2.5 py-1 rounded-lg font-medium">
                  {d.city || d.name}, {d.country}
                </span>
                {idx < tripData.destinations.length - 1 && (
                  <ArrowRight size={12} className="text-pistachio-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MAIN SPLIT-SCREEN LAYOUT (Timeline Left | Map Right)      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TIMELINE & STOPS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-5 rounded-3xl shadow-lifted border border-pistachio-200/50 gap-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-pistachio-950">Itinerary Timeline & Stops</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Organize your activities and city stops day-by-day</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-pistachio-100 hover:bg-pistachio-200 text-pistachio-800 font-bold text-sm px-5 py-2.5 rounded-xl shadow-soft transition-all transform hover:-translate-y-0.5 cursor-pointer border border-pistachio-200"
              >
                <Plus size={16} className="stroke-[3]" />
                <span>Add Stop</span>
              </button>

              <button
                type="button"
                onClick={handleSaveItinerary}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lifted transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} className="stroke-[3]" />}
                <span>{isSaving ? 'Saving...' : 'Save & Exit'}</span>
              </button>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-4">
            {stops.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-pistachio-100 shadow-soft space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-pistachio-50 text-pistachio-700 flex items-center justify-center mx-auto">
                  <Compass size={24} />
                </div>
                <h3 className="font-bold text-slate-800">Your Itinerary is Empty</h3>
                <p className="text-slate-500 text-xs">Click "+ Add Stop / Activity" to search sightseeing, food, or amusement spots.</p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-pistachio-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-soft hover:bg-pistachio-800 transition-all cursor-pointer"
                >
                  Search Activities & Cities
                </button>
              </div>
            ) : (
              stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="glass-panel bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-pistachio-200/50 shadow-soft hover:shadow-lifted hover:border-pistachio-400 transition-all flex items-start justify-between gap-4 group transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Index Badge */}
                    <div className="h-12 w-12 rounded-2xl bg-pistachio-700 text-white font-bold flex items-center justify-center text-lg shrink-0 shadow-inner">
                      #{index + 1}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-pistachio-100/80 text-pistachio-800 border border-pistachio-200/50">
                          {stop.category || 'Activity'}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wide">
                          <MapPin size={12} className="text-pistachio-500" />
                          {stop.city}, {stop.country}
                        </span>
                      </div>

                      <h3 className="font-bold font-serif text-slate-900 text-xl group-hover:text-pistachio-800 transition-colors">
                        {stop.title}
                      </h3>

                      <div className="flex items-center gap-5 text-sm text-slate-500 pt-2 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-pistachio-600" /> {stop.duration || '2 hrs'}
                        </span>
                        <span className="flex items-center gap-1.5 text-pistachio-800 font-bold">
                          <DollarSign size={14} className="text-pistachio-600" /> ${stop.cost || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(stop.id)}
                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm border border-transparent hover:border-red-100"
                    title="Remove Stop"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MAP & ROUTING (5 Cols Sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="glass-panel p-5 rounded-3xl shadow-lifted border border-pistachio-200/50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-pistachio-950">Point-to-Point Map</h2>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Live Leaflet route tracking</p>
            </div>
            <span className="text-sm font-bold text-pistachio-900 bg-pistachio-100 px-3 py-1.5 rounded-xl border border-pistachio-200">
              {stops.length} Stops
            </span>
          </div>

          {/* OpenStreetMap Component */}
          <div className="rounded-3xl overflow-hidden shadow-lifted border-4 border-white">
            <MapTracker locations={stops} />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CENTER SEARCH MODAL OVERLAY (Decent-Sized Modal)           */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-pistachio-100 max-h-[90vh] flex flex-col space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-pistachio-600" />
                  Search Activities & Cities
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Explore sightseeing, food tours, amusement parks, or add new city stops
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activity (e.g. Louvre, Croissant Class) or City..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-pistachio-600 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isScraping}
                className="bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-soft"
              >
                {isScraping ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              {['All', 'Sightseeing', 'Food & Dining', 'Amusement & Parks', 'Culture & Art'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-pistachio-700 text-white shadow-soft font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-pistachio-50 hover:text-pistachio-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1 max-h-[420px]">
              
              {/* Popular Curated Activities List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Popular Recommended Spots & Activities
                </span>

                {displayedModalActivities.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    No activities found matching your search or category filter.
                  </div>
                ) : (
                  displayedModalActivities.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-3.5 border border-slate-100 hover:border-pistachio-200 shadow-xs hover:shadow-soft transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pistachio-100 text-pistachio-800">
                              {item.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <MapPin size={11} className="text-pistachio-600" />
                              {item.city}, {item.country}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-pistachio-800 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>{item.duration}</span>
                            <span>•</span>
                            <span className="font-bold text-pistachio-800">${item.cost}</span>
                          </div>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={() => handleAddStop(item)}
                        className="bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-soft"
                      >
                        <Plus size={14} className="stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
