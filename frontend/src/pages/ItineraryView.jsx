import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MapPin, Clock, DollarSign, Calendar as CalendarIcon } from 'lucide-react';

export default function ItineraryView() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial scaffolding (will be replaced by actual API call)
  const mockEvents = [
    { id: 1, title: 'Eiffel Tower Tour', day: 1, time: '10:00 AM', cost: 50, type: 'Activity', location: 'Paris, France' },
    { id: 2, title: 'Lunch at Le Jules Verne', day: 1, time: '01:00 PM', cost: 120, type: 'Dining', location: 'Paris, France' },
    { id: 3, title: 'Louvre Museum', day: 2, time: '09:00 AM', cost: 30, type: 'Activity', location: 'Paris, France' },
  ];

  const budgetData = [
    { name: 'Activities', value: 80, color: '#aa3bff' },
    { name: 'Dining', value: 120, color: '#f59e0b' },
    { name: 'Transport', value: 0, color: '#3b82f6' },
  ];

  useEffect(() => {
    // In a real scenario, this connects to GET /api/events/:tripId
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your masterpiece...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Timeline Section */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trip Itinerary</h1>
          <p className="text-gray-500">Day-by-day plan for your upcoming adventure.</p>
        </div>

        <div className="space-y-6">
          {/* Day 1 Block */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-600">
              <CalendarIcon className="w-5 h-5 mr-2" /> Day 1
            </h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {events.filter(e => e.day === 1).map((evt, idx) => (
                <div key={evt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{evt.title}</h3>
                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{evt.time}</span>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1"/> ${evt.cost}</span>
                      <span className="flex items-center">{evt.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
           {/* Day 2 Block */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-600">
              <CalendarIcon className="w-5 h-5 mr-2" /> Day 2
            </h2>
            <div className="space-y-4">
               {events.filter(e => e.day === 2).map((evt) => (
                  <div key={evt.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{evt.title}</h3>
                      <p className="text-sm text-gray-500">{evt.location}</p>
                    </div>
                    <div className="text-right">
                       <span className="block font-medium text-indigo-600">{evt.time}</span>
                       <span className="text-sm text-gray-500">${evt.cost}</span>
                    </div>
                  </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      {/* Budget & Insights Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="text-lg font-bold mb-4">Budget Breakdown</h3>
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
               <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">${item.value}</span>
               </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg">
               <span>Total Estimated</span>
               <span className="text-indigo-600">$200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
