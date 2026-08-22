import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-10 text-white flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-4xl font-bold mb-3">Where to next, Explorer?</h1>
          <p className="text-amber-50 text-lg">Your personalized travel planning starts here.</p>
        </div>
        <Link to="/create" className="bg-white text-amber-600 font-bold px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors shadow-sm">
          Plan a New Trip
        </Link>
      </div>

      {/* Recommended Destinations */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Top Regional Selections</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Kyoto, Japan', 'Paris, France', 'Bali, Indonesia', 'Rome, Italy'].map((city, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
              <div className="h-32 bg-slate-200 relative">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800">{city}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> Popular right now
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Trips */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Recent Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex gap-4">
            <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
              <CalendarDays />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Summer in Europe</h3>
              <p className="text-sm text-slate-500">Jul 12 - Aug 05, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
