import React from 'react';

export default function CalendarView() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trip Calendar</h1>
          <p className="text-gray-500">Visual overview of your scheduled events.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          Export to Google Calendar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Simple static calendar mock for layout purposes */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
          {Array.from({ length: 35 }).map((_, i) => {
            const isTripDay = i === 15 || i === 16 || i === 17;
            return (
              <div key={i} className={`border-b border-r border-gray-100 p-2 ${isTripDay ? 'bg-indigo-50/50' : 'bg-white'}`}>
                <span className={`block text-right text-sm ${isTripDay ? 'font-bold text-indigo-600' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                {isTripDay && (
                  <div className="mt-2 bg-indigo-600 text-white text-xs p-1.5 rounded truncate">
                    {i === 15 ? '✈️ Flight to Paris' : '🏛️ Museum Tour'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
