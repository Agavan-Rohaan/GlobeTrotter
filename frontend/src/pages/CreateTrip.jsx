import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTrip() {
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    navigate('/trips');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Plan a New Trip</h1>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Trip Name</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g., Summer Getaway in Europe" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="What is this trip about?"></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">Save Trip</button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Suggestions for places to visit/activities to perform</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
