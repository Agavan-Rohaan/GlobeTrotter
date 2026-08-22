import React, { useState, useEffect } from 'react';
import { Share2, MapPin, Calendar, Globe } from 'lucide-react';
import api from '../services/api';

export default function CommunityTab() {
  const [publicTrips, setPublicTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const fetchPublicTrips = async () => {
    try {
      const res = await api.get('/trips/public');
      setPublicTrips(res.data);
    } catch (error) {
      console.error('Failed to load public trips', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const diff = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-serif text-xl">Loading community inspiration...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Traveler Community</h1>
        <p className="text-xl text-slate-500 font-sans">Discover and get inspired by public itineraries shared by GlobeTrotters worldwide.</p>
      </div>

      {publicTrips.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-pistachio-200 rounded-3xl bg-pistachio-50">
          <Globe className="mx-auto text-pistachio-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold font-serif text-slate-800">No public trips yet!</h2>
          <p className="text-slate-500 mt-2">Be the first to share your itinerary to the community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicTrips.map(trip => {
            const daysCount = calculateDays(trip.startDate, trip.endDate);
            return (
              <div key={trip._id} className="bg-white rounded-3xl shadow-soft border border-pistachio-100 overflow-hidden hover:shadow-lifted transition-all group flex flex-col cursor-pointer">
                <div className="h-48 bg-slate-200 w-full relative overflow-hidden">
                  <img 
                    src={trip.coverPhoto || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop`} 
                    alt="Trip Cover" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold text-pistachio-800 shadow-sm flex items-center">
                    <Calendar size={12} className="mr-1" /> {daysCount} Days
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pistachio-600 to-pistachio-400 text-white flex items-center justify-center font-bold font-serif text-lg mr-3 shadow-inner">
                      {trip.user_id?.firstName ? trip.user_id.firstName.charAt(0) : 'A'}
                    </div>
                    <div>
                      <h3 className="font-bold font-serif text-slate-900 leading-tight">{trip.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">By {trip.user_id?.firstName || 'Anonymous'}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                    {trip.description || 'A beautiful journey waiting to be discovered.'}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-xs text-pistachio-700 font-bold tracking-wide uppercase">Community</span>
                     <button className="text-pistachio-600 hover:text-pistachio-800 transition-colors p-2 hover:bg-pistachio-50 rounded-full">
                       <Share2 size={16} />
                     </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
