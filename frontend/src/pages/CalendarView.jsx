import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function CalendarView() {
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const tripResponse = await api.get('/trips');
        const availableTrips = Array.isArray(tripResponse.data) ? tripResponse.data : [];
        setTrips(availableTrips);
        const eventResponses = await Promise.all(
          availableTrips.map((trip) => api.get(`/events/${trip._id}`))
        );
        setEvents(eventResponses.flatMap((response, index) =>
          (response.data || []).map((event) => ({
            ...event,
            tripName: availableTrips[index].name
          }))
        ));
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Calendar data could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    loadCalendar();
  }, []);

  const days = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: firstDay + daysInMonth }, (_, index) =>
      index < firstDay ? null : new Date(year, monthIndex, index - firstDay + 1)
    );
  }, [month]);

  const eventsForDay = (day) => events.filter((event) => {
    const eventDate = new Date(event.date || event.startTime);
    return day && eventDate.getFullYear() === day.getFullYear()
      && eventDate.getMonth() === day.getMonth()
      && eventDate.getDate() === day.getDate();
  });

  const shiftMonth = (amount) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  if (loading) {
    return <div className="min-h-[420px] flex items-center justify-center text-pistachio-800"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-pistachio-700 text-sm font-bold uppercase tracking-wider"><CalendarDays size={17} /> Schedule</div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Trip Calendar</h1>
          <p className="text-slate-500">Every scheduled activity across your trips.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-pistachio-100 rounded-xl p-1 shadow-soft">
          <button type="button" onClick={() => shiftMonth(-1)} className="p-2 text-slate-500 hover:bg-pistachio-50 rounded-lg" aria-label="Previous month"><ChevronLeft size={18} /></button>
          <span className="min-w-32 text-center font-bold text-slate-800">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button type="button" onClick={() => shiftMonth(1)} className="p-2 text-slate-500 hover:bg-pistachio-50 rounded-lg" aria-label="Next month"><ChevronRight size={18} /></button>
        </div>
      </header>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}
      {!error && trips.length === 0 && <div className="bg-white border border-pistachio-100 rounded-2xl p-10 text-center text-slate-500">Create a trip to start filling your calendar.</div>}
      {trips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-pistachio-100 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-pistachio-100 bg-pistachio-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="p-3 text-center text-xs font-bold uppercase tracking-wider text-pistachio-800">{day}</div>)}
          </div>
          <div className="grid grid-cols-7 auto-rows-[minmax(110px,1fr)]">
            {days.map((day, index) => {
              const dayEvents = eventsForDay(day);
              return <div key={day?.toISOString() || `empty-${index}`} className="border-b border-r border-pistachio-100 p-2 bg-white">
                {day && <><span className={`text-sm ${day.toDateString() === new Date().toDateString() ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-pistachio-700 text-white font-bold' : 'text-slate-500'}`}>{day.getDate()}</span>
                  <div className="mt-2 space-y-1">{dayEvents.map((event) => <div key={event._id} className="truncate rounded-md bg-pistachio-100 px-2 py-1 text-xs font-semibold text-pistachio-900" title={event.place_id?.name || event.tripName}>{event.place_id?.name || event.tripName || 'Activity'}</div>)}</div>
                </>}
              </div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
