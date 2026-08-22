import React from 'react';

export default function CommunityTab() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Traveler Community</h1>
        <p className="text-xl text-gray-500">Discover and get inspired by public itineraries shared by globe trotters.</p>
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 w-full relative">
              <img 
                src={`https://source.unsplash.com/800x400/?travel,city&sig=${i}`} 
                alt="Trip Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-indigo-600">
                5 Days
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold mr-3">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Alex's Euro Trip</h3>
                  <p className="text-sm text-gray-500">Shared 2 days ago</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                An incredible journey through the heart of Europe. We visited Paris, Rome, and Barcelona. Highly recommend these restaurants!
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">Paris</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">Rome</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">Budget-friendly</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
