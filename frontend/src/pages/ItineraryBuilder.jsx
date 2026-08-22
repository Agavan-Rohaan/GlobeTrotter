import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, Plus, Search, Calendar, MapPin, 
  Trash2, ArrowRight, Sparkles, X, Clock, DollarSign,
  Utensils, Camera, Ticket, ShoppingBag, Music, Landmark, CheckCircle2, AlertCircle, Save, Loader2, Layers, Filter
} from 'lucide-react';
import api from '../services/api';
import MapTracker from '../components/MapTracker';

// Fallback places for offline/demo support if Overpass service is slow
const FALLBACK_NEARBY_PLACES = [
  {
    id: 'osm-1',
    name: 'Eiffel Tower',
    category: 'Sightseeing',
    lat: 48.8584,
    lng: 2.2945
  },
  {
    id: 'osm-2',
    name: 'Louvre Museum',
    category: 'Culture & Art',
    lat: 48.8606,
    lng: 2.3376
  },
  {
    id: 'osm-3',
    name: 'Musée d’Orsay',
    category: 'Culture & Art',
    lat: 48.8599,
    lng: 2.3265
  },
  {
    id: 'osm-4',
    name: 'Jardin du Luxembourg',
    category: 'Amusement & Parks',
    lat: 48.8462,
    lng: 2.3372
  },
  {
    id: 'osm-5',
    name: 'Café de Flore',
    category: 'Food & Dining',
    lat: 48.8542,
    lng: 2.3325
  }
];

export default function ItineraryBuilder() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedState = location.state || {};
  const [tripData, setTripData] = useState({
    name: passedState.name || passedState.tripName || 'Grand Multi-City Journey',
    startingPlace: passedState.startingPlace || passedState.startCity || 'Paris, France',
    startDate: passedState.startDate || '2026-07-10',
    endDate: passedState.endDate || '2026-07-24',
    destinations: passedState.destinations || [
      { city: passedState.toCity || 'Paris', country: passedState.toCountry || 'France', lat: passedState.lat || 48.8566, lng: passedState.lng || 2.3522 }
    ]
  });

  const [stops, setStops] = useState([
    {
      id: 'stop-1',
      title: `Arrival & Welcome in ${tripData.destinations[0]?.city || 'Paris'}`,
      city: tripData.destinations[0]?.city || 'Paris',
      country: tripData.destinations[0]?.country || 'France',
      category: 'Sightseeing',
      cost: 0,
      duration: 'Visit time varies',
      lat: tripData.destinations[0]?.lat || 48.8566,
      lng: tripData.destinations[0]?.lng || 2.3522,
      day: 1
    }
  ]);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State & Filter / Group By Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groupBy, setGroupBy] = useState('None'); // 'None' | 'Category'
  const [toastMessage, setToastMessage] = useState('');

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
      console.warn('Could not load backend trip context:', err.message);
    }
  };

  // Fetch real OpenStreetMap Overpass places whenever destination city coordinates change
  useEffect(() => {
    const primaryDest = tripData.destinations?.[0];
    const lat = primaryDest?.lat || 48.8566;
    const lng = primaryDest?.lng || 2.3522;

    setPlacesLoading(true);
    setPlacesError(null);

    api.get(`/places/nearby?lat=${lat}&lng=${lng}&radius=5000`)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setNearbyPlaces(res.data);
        } else {
          setNearbyPlaces(FALLBACK_NEARBY_PLACES);
        }
      })
      .catch((err) => {
        console.warn('Overpass places fetch fallback:', err.message);
        setNearbyPlaces(FALLBACK_NEARBY_PLACES);
      })
      .finally(() => setPlacesLoading(false));
  }, [tripData.destinations?.[0]?.lat, tripData.destinations?.[0]?.lng]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddStop = (item) => {
    if (typeof item.lat !== 'number' || typeof item.lng !== 'number') {
      showToast('This place is missing location coordinates.');
      return;
    }

    const primaryDest = tripData.destinations?.[0] || { city: 'Paris', country: 'France' };

    const newStop = {
      id: `stop-${Date.now()}`,
      title: item.name || item.title || 'New Activity',
      city: item.city || primaryDest.city,
      country: item.country || primaryDest.country,
      category: item.category || 'Sightseeing',
      cost: item.cost || 0,
      duration: item.duration || 'Visit time varies',
      lat: item.lat,
      lng: item.lng,
      day: stops.length + 1
    };

    setStops((prev) => [...prev, newStop]);
    showToast(`Added "${newStop.title}" to itinerary!`);
  };

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
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        
        const placeRes = await api.post('/places', {
          city_id: 'auto-generated',
          name: stop.title,
          description: stop.category,
          category: stop.category,
          location: { type: 'Point', coordinates: [stop.lng, stop.lat] },
          costInfo: (stop.cost || 0).toString(),
          duration: stop.duration || 'Visit time varies',
          images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80']
        });
        
        const place = placeRes.data;

        const eventDate = new Date(tripData.startDate);
        eventDate.setDate(eventDate.getDate() + (stop.day - 1));
        
        await api.post('/events', {
          trip_id: tripId,
          place_id: place._id,
          date: eventDate.toISOString(),
          startTime: '09:00',
          endTime: '11:00',
          cost: stop.cost || 0,
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

  // Filter Modal Activities against live nearbyPlaces & search query
  const displayedModalActivities = nearbyPlaces.filter((act) => {
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch = !searchQuery || act.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Grouping helper
  const groupedActivities = displayedModalActivities.reduce((acc, item) => {
    const key = item.category || 'Sightseeing';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const totalCost = stops.reduce((sum, s) => sum + (s.cost || 0), 0);

  return (
    <div className="space-y-8 pb-20 w-full max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-pistachio-900 text-white px-5 py-3 rounded-2xl shadow-lifted border border-pistachio-700/50 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-pistachio-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER (Trip Context & Route Flow) */}
      <section className="bg-gradient-to-r from-pistachio-950 via-pistachio-900 to-pistachio-950 text-white rounded-3xl p-6 sm:p-8 shadow-lifted relative overflow-hidden">
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

      {/* 2. MAIN SPLIT-SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TIMELINE & STOPS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl shadow-soft border border-pistachio-100 gap-4">
            <div>
              <h2 className="text-lg font-bold font-serif text-slate-900">Itinerary Timeline & Stops</h2>
              <p className="text-slate-500 text-xs">Organize your activities and city stops day-by-day</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft transition-all cursor-pointer"
              >
                <Plus size={16} className="stroke-[3]" />
                <span>Add Stop / Activity</span>
              </button>

              <button
                type="button"
                onClick={handleSaveItinerary}
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-soft transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{isSaving ? 'Saving...' : 'Save & Exit'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {stops.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-pistachio-100 shadow-soft space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-pistachio-50 text-pistachio-700 flex items-center justify-center mx-auto">
                  <Compass size={24} />
                </div>
                <h3 className="font-bold text-slate-800">Your Itinerary is Empty</h3>
                <p className="text-slate-500 text-xs">Click "+ Add Stop / Activity" to search real OpenStreetMap places.</p>
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
                  className="bg-white rounded-2xl p-5 border border-pistachio-100 shadow-soft hover:shadow-lifted transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-pistachio-100 text-pistachio-900 font-bold flex items-center justify-center text-sm shrink-0 border border-pistachio-200">
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                          {stop.category || 'Sightseeing'}
                        </span>
                        <span className="text-xs font-semibold text-pistachio-700 flex items-center gap-1">
                          <MapPin size={12} />
                          {stop.city}, {stop.country}
                        </span>
                      </div>

                      <h3 className="font-bold font-serif text-slate-900 text-base group-hover:text-pistachio-800 transition-colors">
                        {stop.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {stop.duration || 'Visit time varies'}
                        </span>
                        {stop.cost > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-pistachio-800">
                            <DollarSign size={12} /> ${stop.cost}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStop(stop.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Remove Stop"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MAP & ROUTING */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-pistachio-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-slate-900">Point-to-Point Route Map</h2>
              <p className="text-slate-500 text-xs">OpenStreetMap Leaflet markers & polyline route</p>
            </div>
            <span className="text-xs font-bold text-pistachio-800 bg-pistachio-100 px-2.5 py-1 rounded-full">
              {stops.length} Markers
            </span>
          </div>

          <MapTracker locations={stops} />
        </div>
      </div>

      {/* 3. CENTER SEARCH MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-pistachio-100 max-h-[90vh] flex flex-col space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-pistachio-600" />
                  Search Places & Activities
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Real-world OpenStreetMap points of interest near {tripData.destinations?.[0]?.city || 'your destination'}
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

            {/* Search Bar & Group By Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places by name (e.g. Museum, Park, Cafe)..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-pistachio-600 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              {/* Group By Control */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shrink-0 text-xs">
                <Layers size={14} className="text-slate-500" />
                <span className="font-semibold text-slate-600">Group By:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="bg-transparent font-bold text-pistachio-800 focus:outline-none cursor-pointer"
                >
                  <option value="None">None</option>
                  <option value="Category">Category</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
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
              
              {placesLoading && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Loading OpenStreetMap places...
                </div>
              )}

              {!placesLoading && placesError && (
                <div className="text-center py-10 text-red-500 text-xs font-medium">
                  {placesError}
                </div>
              )}

              {!placesLoading && !placesError && displayedModalActivities.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No places found matching your search or category filter.
                </div>
              )}

              {/* UNGROUPED VIEW */}
              {!placesLoading && !placesError && groupBy === 'None' && (
                <div className="space-y-3">
                  {displayedModalActivities.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 hover:border-pistachio-200 shadow-xs hover:shadow-soft transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-pistachio-100 text-pistachio-800 flex items-center justify-center font-bold shrink-0">
                          <Landmark size={20} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pistachio-100 text-pistachio-800">
                              {item.category}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <MapPin size={11} className="text-pistachio-600" />
                              {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-pistachio-800 transition-colors">
                            {item.name}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddStop(item)}
                        className="bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-soft"
                      >
                        <Plus size={14} className="stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* GROUPED BY CATEGORY VIEW */}
              {!placesLoading && !placesError && groupBy === 'Category' && (
                <div className="space-y-6">
                  {Object.keys(groupedActivities).map((catName) => (
                    <div key={catName} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-pistachio-800 flex items-center gap-1.5">
                          <Landmark size={14} />
                          {catName}
                        </h4>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {groupedActivities[catName].length} Spots
                        </span>
                      </div>

                      {groupedActivities[catName].map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 hover:bg-white rounded-2xl p-3.5 border border-slate-100 hover:border-pistachio-200 shadow-xs hover:shadow-soft transition-all flex items-center justify-between gap-4 group"
                        >
                          <div className="space-y-1">
                            <h5 className="font-serif font-bold text-slate-900 text-sm group-hover:text-pistachio-800 transition-colors">
                              {item.name}
                            </h5>
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <MapPin size={11} className="text-pistachio-600" />
                              {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddStop(item)}
                            className="bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-soft"
                          >
                            <Plus size={14} className="stroke-[3]" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
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
