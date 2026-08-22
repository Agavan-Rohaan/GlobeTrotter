import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, ArrowDown } from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [tripDuration, setTripDuration] = useState(0);
  const [dateError, setDateError] = useState('');

  // Calculate duration inclusively
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (end < start) {
        setDateError('End date cannot be before start date.');
        setTripDuration(0);
      } else {
        setDateError('');
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
        setTripDuration(diffDays);
      }
    } else {
      setTripDuration(0);
      setDateError('');
    }
  }, [startDate, endDate]);

  const isFormValid = tripName.trim() !== '' && 
                      fromLocation.trim() !== '' && 
                      toLocation.trim() !== '' && 
                      startDate !== '' && 
                      endDate !== '' && 
                      dateError === '';

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    // 1. Validate all fields (already done via isFormValid / dateError check)
    // 2. Save the basic trip information (Stubbed API call)
    // 3. Create the trip (Stubbed API call)
    
    // 4. Redirect the user to the NEXT PAGE
    navigate('/builder');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4 sm:px-6">
      {/* LEFT / MAIN SECTION */}
      <div className="w-full lg:w-2/3 space-y-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-pistachio-950 mb-3">Create a New Trip</h1>
          <p className="text-slate-500 font-sans text-lg">Start planning your next adventure.</p>
        </div>

        <form onSubmit={handleCreateTrip} className="bg-white rounded-2xl border border-pistachio-100 p-6 md:p-8 shadow-soft space-y-8">
          
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Trip Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all text-lg" 
              placeholder="e.g. Gujarat Explorer" 
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-6">
            {/* FROM */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">From <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-pistachio-500" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                  placeholder="🔍 Search city (e.g. Rajkot, India)" 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Visual separator */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-pistachio-50 rounded-full p-2 border border-pistachio-100">
                <ArrowDown size={18} className="text-pistachio-700" />
              </div>
            </div>

            {/* TO */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">To <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-pistachio-600" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                  placeholder="🔍 Search destination city (e.g. Ahmedabad, India)" 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          {/* DATES */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>
            
            {dateError && <p className="text-red-500 text-sm mt-3 font-medium">{dateError}</p>}
            
            {tripDuration > 0 && (
              <div className="mt-4 flex justify-center md:justify-start">
                 <div className="bg-pistachio-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-soft flex items-center gap-2">
                   ⏱ {tripDuration} Days Trip
                 </div>
              </div>
            )}
          </div>

          {/* Submit Button (Desktop & Mobile) */}
          <div className="pt-4 border-t border-pistachio-100">
            <button 
              type="submit" 
              disabled={!isFormValid}
              className="w-full bg-pistachio-700 hover:bg-pistachio-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl shadow-soft hover:shadow-lifted transition-all flex items-center justify-center gap-2 text-lg"
            >
              Create Trip <ArrowRight size={22} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT SECTION: Trip Summary */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-24 bg-white rounded-2xl border border-pistachio-100 p-8 shadow-soft">
          <div className="text-center mb-8 border-b border-pistachio-100 pb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trip Summary</p>
            <h3 className="text-3xl font-serif font-bold text-pistachio-950 truncate leading-tight">
              {tripName || "Not specified"}
            </h3>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute left-1/2 top-[30px] bottom-[30px] w-0.5 bg-pistachio-200 -translate-x-1/2"></div>
              
              <div className="bg-white px-4 py-2 w-full text-center relative z-10">
                <MapPin size={24} className="mx-auto text-pistachio-600 mb-2" />
                <p className="font-semibold text-slate-800 text-lg break-words">
                  {fromLocation || <span className="text-slate-400 italic font-normal">Select starting city</span>}
                </p>
              </div>
              
              <div className="bg-white p-2 rounded-full border-2 border-pistachio-200 text-pistachio-600 relative z-10 my-4 shadow-sm">
                <ArrowDown size={20} />
              </div>
              
              <div className="bg-white px-4 py-2 w-full text-center relative z-10">
                <MapPin size={24} className="mx-auto text-pistachio-600 mb-2 fill-pistachio-100" />
                <p className="font-semibold text-slate-800 text-lg break-words">
                  {toLocation || <span className="text-slate-400 italic font-normal">Select destination</span>}
                </p>
              </div>
            </div>

            <div className="bg-pistachio-50 rounded-xl p-5 border border-pistachio-100 text-center space-y-4 mt-6">
              <div className="flex items-center justify-center gap-3">
                <Calendar size={20} className="text-pistachio-700" />
                <div className="text-slate-700 font-semibold flex items-center gap-2">
                   {startDate ? formatDate(startDate) : '---'} 
                   <ArrowRight size={14} className="text-slate-400" /> 
                   {endDate ? formatDate(endDate) : '---'}
                </div>
              </div>
              
              <div className="bg-white py-2 rounded-lg border border-pistachio-200 text-pistachio-800 font-bold text-lg shadow-sm">
                ⏱ {tripDuration > 0 ? `${tripDuration} Days` : '---'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
