import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Plus, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../services/api';

export default function CreateTrip() {
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [stops, setStops] = useState([]);
  const [errors, setErrors] = useState({});
  const [tripDuration, setTripDuration] = useState(0);

  // Live Nominatim City Search State
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Stop state with lat and lng
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [editingStopId, setEditingStopId] = useState(null);
  const [stopForm, setStopForm] = useState({
    city: '',
    country: '',
    arrivalDate: '',
    departureDate: '',
    lat: null,
    lng: null
  });
  const [stopErrors, setStopErrors] = useState('');

  // Debounced City Search Effect hitting GET /api/places/cities/search
  useEffect(() => {
    if (!citySearchQuery || citySearchQuery.trim().length < 2) {
      setCityResults([]);
      return;
    }

    setCityLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get(`/places/cities/search?q=${encodeURIComponent(citySearchQuery)}`);
        setCityResults(res.data || []);
      } catch (err) {
        console.warn('City search API error:', err.message);
        setCityResults([]);
      } finally {
        setCityLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [citySearchQuery]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (end < start) {
        setErrors(prev => ({ ...prev, date: 'End date cannot be before start date.' }));
        setTripDuration(0);
      } else {
        setErrors(prev => ({ ...prev, date: null }));
        setTripDuration(diffDays);
      }
    }
  }, [startDate, endDate]);

  const calculateStopDuration = (arrival, departure) => {
    if (!arrival || !departure) return 0;
    const start = new Date(arrival);
    const end = new Date(departure);
    if (end < start) return 0;
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const validateStopDates = (arrival, departure, excludeId = null) => {
    if (!startDate || !endDate) return "Please set trip start and end dates first.";
    
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const arrDate = new Date(arrival);
    const depDate = new Date(departure);
    
    sDate.setHours(0,0,0,0); eDate.setHours(0,0,0,0);
    arrDate.setHours(0,0,0,0); depDate.setHours(0,0,0,0);

    if (depDate < arrDate) return "Departure date cannot be before arrival date.";
    if (arrDate < sDate) return "Arrival date cannot be before trip start date.";
    if (depDate > eDate) return "Departure date cannot be after trip end date.";

    for (let stop of stops) {
      if (stop.id === excludeId) continue;
      const sArr = new Date(stop.arrivalDate); sArr.setHours(0,0,0,0);
      const sDep = new Date(stop.departureDate); sDep.setHours(0,0,0,0);
      
      if (
        (arrDate >= sArr && arrDate <= sDep) || 
        (depDate >= sArr && depDate <= sDep) ||
        (arrDate <= sArr && depDate >= sDep)
      ) {
        return `Stop dates overlap with ${stop.city}.`;
      }
    }
    return null;
  };

  const handleSaveStop = () => {
    if (!stopForm.city || !stopForm.country || !stopForm.arrivalDate || !stopForm.departureDate) {
      setStopErrors("All fields are required.");
      return;
    }

    const validationError = validateStopDates(stopForm.arrivalDate, stopForm.departureDate, editingStopId);
    if (validationError) {
      setStopErrors(validationError);
      return;
    }

    if (editingStopId) {
      setStops(stops.map(s => s.id === editingStopId ? { ...s, ...stopForm } : s));
      setEditingStopId(null);
    } else {
      setStops([...stops, { ...stopForm, id: Date.now().toString() }]);
    }
    
    setStopForm({ city: '', country: '', arrivalDate: '', departureDate: '', lat: null, lng: null });
    setIsAddingStop(false);
    setStopErrors('');
  };

  const handleEditStop = (stop) => {
    setStopForm({ 
      city: stop.city, 
      country: stop.country, 
      arrivalDate: stop.arrivalDate, 
      departureDate: stop.departureDate,
      lat: stop.lat || null,
      lng: stop.lng || null
    });
    setCitySearchQuery(stop.city);
    setEditingStopId(stop.id);
    setIsAddingStop(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStop = (id) => {
    setStops(stops.filter(s => s.id !== id));
  };

  const moveStop = (index, direction) => {
    const newStops = [...stops];
    if (direction === 'up' && index > 0) {
      [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    } else if (direction === 'down' && index < newStops.length - 1) {
      [newStops[index + 1], newStops[index]] = [newStops[index], newStops[index + 1]];
    }
    setStops(newStops);
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!tripName || !startDate || !endDate || !startingPoint) {
      setErrors(prev => ({ ...prev, submit: "Please fill in all basic trip information." }));
      return;
    }
    if (errors.date) return;
    if (stops.length === 0) {
      setErrors(prev => ({ ...prev, submit: "Please add at least one stop." }));
      return;
    }
    
    // Pass full trip context with lat/lng coordinates to ItineraryBuilder
    const destinationObjects = stops.map(s => ({
      city: s.city,
      country: s.country,
      lat: s.lat,
      lng: s.lng
    }));

    navigate('/itinerary-builder', {
      state: {
        name: tripName,
        startDate,
        endDate,
        startingPlace: startingPoint,
        destinations: destinationObjects
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-4">
      {/* LEFT / MAIN SECTION */}
      <div className="w-full lg:w-2/3 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-pistachio-950 mb-2">Create New Trip</h1>
          <p className="text-slate-500 font-sans">Define your journey, add your stops, and let's get planning.</p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleCreateTrip} className="space-y-8">
          {/* Trip Basic Information */}
          <div className="bg-white rounded-2xl border border-pistachio-100 p-6 shadow-soft">
            <h2 className="text-xl font-serif font-semibold text-slate-800 mb-6 border-b border-pistachio-100 pb-3">Trip Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trip Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                  placeholder="e.g., European Grand Tour" 
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-pistachio-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-pistachio-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              
              {tripDuration > 0 && (
                <div className="bg-pistachio-50 text-pistachio-800 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-pistachio-200">
                  <Calendar size={18} />
                  <span className="font-semibold">{tripDuration} Days Total</span>
                </div>
              )}

              <div className="pt-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Starting Point <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-pistachio-500" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                    placeholder="e.g., Paris, France" 
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    required 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">This represents the beginning of your route. It is not treated as an activity stop.</p>
              </div>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="bg-white rounded-2xl border border-pistachio-100 p-6 shadow-soft">
             <div className="flex justify-between items-center mb-6 border-b border-pistachio-100 pb-3">
                <h2 className="text-xl font-serif font-semibold text-slate-800">Your Route</h2>
                <button 
                  type="button"
                  onClick={() => setIsAddingStop(true)}
                  className="bg-pistachio-100 hover:bg-pistachio-200 text-pistachio-900 font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-sm"
                >
                  <Plus size={16} /> Add Stop
                </button>
             </div>
            
            <div className="space-y-0 pl-2">
              {/* Starting Point Node */}
              <div className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-2 border-slate-300 z-10 relative">
                    <MapPin size={16} className="text-slate-600" />
                  </div>
                  {stops.length > 0 && <div className="w-0.5 h-full bg-pistachio-200 min-h-[30px] my-1"></div>}
                </div>
                <div className="pt-1 pb-6 font-semibold text-slate-700">
                  {startingPoint || "Starting Point (Not Set)"}
                </div>
              </div>
              
              {/* Stops Nodes */}
              {stops.map((stop, index) => (
                <div key={stop.id} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-pistachio-100 text-pistachio-800 flex items-center justify-center font-bold shrink-0 border-2 border-pistachio-300 z-10 relative">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    {index < stops.length - 1 && <div className="w-0.5 h-full bg-pistachio-200 min-h-[40px] my-1"></div>}
                  </div>
                  
                  <div className="flex-1 pb-6 w-full">
                    <div className="bg-white border border-pistachio-200 rounded-xl p-4 shadow-sm w-full hover:shadow-md transition-shadow group">
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <h4 className="font-bold text-slate-800 text-lg">{stop.city}</h4>
                           <p className="text-sm text-slate-500 font-medium">{formatDate(stop.arrivalDate)} <ArrowRight size={14} className="inline mx-0.5" /> {formatDate(stop.departureDate)}</p>
                         </div>
                         <span className="bg-pistachio-50 text-pistachio-800 text-xs px-2.5 py-1 rounded-md border border-pistachio-200 font-bold tracking-wide">
                           {calculateStopDuration(stop.arrivalDate, stop.departureDate)} Days
                         </span>
                       </div>
                       
                       <div className="flex justify-end gap-2 mt-4 border-t border-slate-50 pt-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => moveStop(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-pistachio-700 disabled:opacity-30 rounded-lg hover:bg-pistachio-50 transition-colors"><ChevronUp size={18}/></button>
                          <button type="button" onClick={() => moveStop(index, 'down')} disabled={index === stops.length - 1} className="p-1.5 text-slate-400 hover:text-pistachio-700 disabled:opacity-30 rounded-lg hover:bg-pistachio-50 transition-colors"><ChevronDown size={18}/></button>
                          <button type="button" onClick={() => handleEditStop(stop)} className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-2"><Edit2 size={16}/></button>
                          <button type="button" onClick={() => handleDeleteStop(stop.id)} className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}

              {stops.length === 0 && (
                <div className="text-center py-10 px-4 text-slate-400 border-2 border-dashed border-pistachio-200 rounded-xl bg-pistachio-50/50 mt-4">
                  <MapPin className="mx-auto mb-2 opacity-50" size={32} />
                  <p className="font-medium text-slate-600">No stops added yet.</p>
                  <p className="text-sm">Click "+ Add Stop" to build your route.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Add Stop Form / Modal (Inline) */}
          {isAddingStop && (
            <div className="bg-white rounded-2xl border border-pistachio-200 p-6 shadow-soft ring-4 ring-pistachio-50 mb-6">
              <h3 className="text-lg font-serif font-bold text-slate-800 mb-5 pb-2 border-b border-pistachio-100">{editingStopId ? 'Edit Stop Details' : 'Add New Stop'}</h3>
              
              {stopErrors && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm mb-5 border border-red-200 font-medium">
                  {stopErrors}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Destination / City</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-pistachio-200 rounded-xl focus:ring-2 focus:ring-pistachio-500 outline-none transition-all placeholder-slate-400 text-sm" 
                    value={citySearchQuery} 
                    onChange={e => {
                      setCitySearchQuery(e.target.value);
                      setStopForm({...stopForm, city: e.target.value});
                      setShowCityDropdown(true);
                    }} 
                    onFocus={() => setShowCityDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                    placeholder="Search city (e.g. Paris, Tokyo)..." 
                  />

                  {/* Nominatim City Dropdown */}
                  {showCityDropdown && citySearchQuery && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-pistachio-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {cityLoading && (
                        <div className="px-4 py-3 text-xs text-slate-400">Searching OpenStreetMap Nominatim...</div>
                      )}
                      {!cityLoading && cityResults.length === 0 && (
                        <div className="px-4 py-3 text-xs text-slate-400">No cities found.</div>
                      )}
                      {!cityLoading && cityResults.map((city, idx) => (
                        <div 
                          key={idx}
                          className="px-4 py-3 hover:bg-pistachio-50 cursor-pointer border-b border-slate-50 last:border-0"
                          onClick={() => {
                            setCitySearchQuery(city.name);
                            setStopForm({
                              ...stopForm,
                              city: city.name,
                              country: city.country,
                              lat: city.lat,
                              lng: city.lng
                            });
                            setShowCityDropdown(false);
                          }}
                        >
                          <span className="font-bold text-slate-800 block text-sm">{city.name}</span>
                          <span className="text-xs text-slate-500">{city.displayName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-pistachio-200 rounded-xl focus:ring-2 focus:ring-pistachio-500 outline-none transition-all placeholder-slate-400 text-sm" value={stopForm.country} onChange={e => setStopForm({...stopForm, country: e.target.value})} placeholder="e.g. France" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Arrival Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-pistachio-200 rounded-xl focus:ring-2 focus:ring-pistachio-500 outline-none transition-all text-sm" value={stopForm.arrivalDate} onChange={e => setStopForm({...stopForm, arrivalDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Departure Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-pistachio-200 rounded-xl focus:ring-2 focus:ring-pistachio-500 outline-none transition-all text-sm" value={stopForm.departureDate} onChange={e => setStopForm({...stopForm, departureDate: e.target.value})} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddingStop(false); setEditingStopId(null); setStopErrors(''); }} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors text-sm">Cancel</button>
                <button type="button" onClick={handleSaveStop} className="px-5 py-2.5 bg-pistachio-700 hover:bg-pistachio-800 text-white rounded-xl font-semibold shadow-soft hover:shadow-lifted transition-all text-sm">Save Stop</button>
              </div>
            </div>
          )}

          {/* Submit Button (Mobile only) */}
          <div className="lg:hidden">
            <button type="submit" className="w-full bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold px-5 py-3.5 rounded-xl shadow-soft hover:shadow-lifted transition-all flex items-center justify-center gap-2 text-lg">
              Create Trip <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT SECTION: Live Trip Summary */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-24 bg-white rounded-2xl border border-pistachio-100 p-6 shadow-soft">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Trip Summary</h2>
          <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 pb-4 border-b border-pistachio-100 truncate">{tripName || "Unnamed Trip"}</h3>
          
          <div className="flex gap-3 mb-6">
            <div className="flex-1 flex items-center justify-center gap-2 text-pistachio-900 bg-pistachio-50 py-2.5 rounded-xl border border-pistachio-100">
              <Calendar size={18} className="text-pistachio-600" />
              <span className="text-sm font-bold">{tripDuration} Days</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 text-pistachio-900 bg-pistachio-50 py-2.5 rounded-xl border border-pistachio-100">
              <MapPin size={18} className="text-pistachio-600" />
              <span className="text-sm font-bold">{stops.length} Stops</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Route Overview</p>
              <div className="text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-pistachio-700">{startingPoint || "Start"}</span>
                {stops.map(s => (
                  <span key={s.id}> 
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline mx-1.5 text-slate-300">→</span>
                    <span className="sm:hidden mx-1.5 text-slate-300">↓</span>
                    {s.city}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(startDate) || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">End Date</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(endDate) || 'Not set'}</p>
              </div>
            </div>
          </div>

          <button onClick={handleCreateTrip} className="w-full bg-pistachio-700 hover:bg-pistachio-800 text-white font-bold px-5 py-3.5 rounded-xl shadow-soft hover:shadow-lifted transition-all hidden lg:flex items-center justify-center gap-2 text-lg">
            Create Trip <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
