import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Map, MoreVertical } from 'lucide-react';

export default function MyTrips() {
  const trips = [
    { id: 1, name: 'Japan Adventure', status: 'Ongoing', date: 'Aug 10 - Aug 25, 2026' },
    { id: 2, name: 'Paris Getaway', status: 'Upcoming', date: 'Sep 05 - Sep 12, 2026' },
    { id: 3, name: 'Bali Retreat', status: 'Completed', date: 'Jan 15 - Jan 22, 2026' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Trips</h1>
        <Link to="/create" className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors">
          + New Trip
        </Link>
      </div>

      <div className="space-y-8">
        {['Ongoing', 'Upcoming', 'Completed'].map(status => (
          <div key={status}>
            <h2 className="text-xl font-bold text-slate-700 mb-4">{status}</h2>
            <div className="space-y-4">
              {trips.filter(t => t.status === status).map(trip => (
                <div key={trip.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Map size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{trip.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar size={14} /> {trip.date}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-2">
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
              {trips.filter(t => t.status === status).length === 0 && (
                <p className="text-slate-400 italic">No {status.toLowerCase()} trips.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
