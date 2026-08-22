import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, Clock, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import MapTracker from '../components/MapTracker';

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [events, setEvents] = useState([]);
  const [magicPlaces, setMagicPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const budgetData = [
    { name: 'Activities', value: 80, color: '#3f5e33' }, // Pistachio 700
    { name: 'Dining', value: 120, color: '#e5ede0' }, // Pistachio 100
    { name: 'Transport', value: 0, color: '#2c3f25' }, // Pistachio 900
  ];

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const [tripRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/api/trips/${id}`, { headers }),
          axios.get(`${API_URL}/api/events/${id}`, { headers })
        ]);
        
        setTrip(tripRes.data);
        
        const mappedEvents = eventsRes.data.map((evt, idx) => {
           const place = evt.place_id || {};
           const d = new Date(evt.startTime);
           return {
             id: evt._id,
             title: place.name || 'Activity',
             day: idx + 1, // simple sequential mapping for now
             time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             cost: evt.cost || 0,
             type: place.category || 'Sightseeing',
             location: place.address || (place.destination_id ? place.destination_id.city : ''),
             lat: place.coordinates && place.coordinates.length === 2 ? place.coordinates[1] : 0,
             lng: place.coordinates && place.coordinates.length === 2 ? place.coordinates[0] : 0,
           };
        });
        
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch trip data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripData();
  }, [id, API_URL]);

  const handleMagicScrape = async () => {
    setScraping(true);
    setScrapeError(null);
    try {
      const queryCity = trip && trip.destinations && trip.destinations.length > 0 
        ? trip.destinations[0].city 
        : trip?.startingPlace?.split(',')[0] || 'Paris';
        
      const response = await axios.post(`${API_URL}/api/scrape/magic-build`, {
        query: queryCity, 
        tripId: id
      });
      setMagicPlaces(response.data.places);
    } catch (err) {
      setScrapeError(err.response?.data?.message || 'Failed to aggregate attractions.');
    } finally {
      setScraping(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-serif text-xl">Loading your masterpiece...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Timeline Section */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 text-slate-900">{trip ? trip.name : 'Trip Itinerary'}</h1>
          <p className="text-slate-500 font-sans">{trip ? trip.description : 'Day-by-day plan for your upcoming adventure.'}</p>
        </div>

        <div className="space-y-6">
          {/* Timeline Blocks */}
          {[...new Set(events.map(e => e.day))].map((dayNum) => (
            <div key={dayNum} className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0]">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center text-[#3f5e33]">
                <CalendarIcon className="w-6 h-6 mr-2 text-[#3f5e33]" /> Day {dayNum}
              </h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#e5ede0] before:to-transparent">
                {events.filter(e => e.day === dayNum).map((evt, idx) => (
                  <div key={evt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#e5ede0] text-[#3f5e33] shadow-soft shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-[#e5ede0] shadow-soft hover:shadow-lifted transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif font-bold text-slate-900">{evt.title}</h3>
                        <span className="text-sm font-sans font-medium text-[#3f5e33] bg-[#f4f7f1] px-2 py-1 rounded-md">{evt.time}</span>
                      </div>
                      <div className="flex gap-4 mt-3 text-sm font-sans text-slate-500">
                        <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1"/> ${evt.cost}</span>
                        <span className="flex items-center">{evt.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="bg-white p-10 rounded-2xl shadow-soft border border-[#e5ede0] text-center">
              <p className="text-slate-500 font-serif">No activities scheduled yet.</p>
            </div>
          )}

        </div>
      </div>

      {/* Sidebar: Map, Magic Scraper & Budget Section */}
      <div className="space-y-6">
        
        {/* Magic Scraper AI Ideas Board */}
        <div className="bg-gradient-to-br from-pistachio-950 to-pistachio-900 p-6 rounded-2xl shadow-soft border border-pistachio-800 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-serif font-bold mb-2 text-pistachio-100 flex items-center">
              <span className="text-2xl mr-2">Γ£¿</span> Magic Ideas Board
            </h3>
            <p className="text-sm font-sans text-pistachio-200 mb-5">
              Let our AI scrape the web for the absolute best things to do in your destination and save them to your database.
            </p>

            {magicPlaces.length === 0 ? (
              <button 
                onClick={handleMagicScrape}
                disabled={scraping}
                className="w-full bg-pistachio-500 hover:bg-pistachio-400 text-pistachio-950 font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {scraping ? 'Scraping the Web...' : 'Auto-Generate Places'}
              </button>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {magicPlaces.map((place, i) => (
                  <div key={place._id || i} className="bg-pistachio-800/50 p-3 rounded-lg border border-pistachio-700 hover:bg-pistachio-800 transition-colors cursor-grab">
                    <h4 className="font-bold font-serif text-sm text-white mb-1">{place.name}</h4>
                    <p className="text-xs text-pistachio-200 line-clamp-2">{place.notes}</p>
                  </div>
                ))}
              </div>
            )}
            
            {scrapeError && (
              <div className="mt-3 p-2 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-200 text-xs text-center">
                {scrapeError}
              </div>
            )}
          </div>
          {/* Background Decorative Circle */}
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pistachio-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Map Visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0] sticky top-24">
          <h3 className="text-xl font-serif font-bold mb-4 text-slate-900">Map View</h3>
          <MapTracker locations={events} />
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0]">
          <h3 className="text-xl font-serif font-bold mb-4 text-slate-900">Budget Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4">
            {budgetData.map(item => (
               <div key={item.name} className="flex justify-between items-center text-sm font-sans">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">${item.value}</span>
               </div>
            ))}
            <div className="pt-3 border-t border-[#e5ede0] flex justify-between font-bold text-lg font-sans">
               <span className="text-slate-900">Total Estimated</span>
               <span className="text-[#3f5e33]">$200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
