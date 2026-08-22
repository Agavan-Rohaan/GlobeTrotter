import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  Search,
  Plus,
  Globe2,
  DollarSign,
  Layers,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { fetchTrips } from '../services/api';

// Curated Top Regional Selections matching the reference UI
const REGIONAL_DESTINATIONS = [
  {
    id: 'dest-1',
    city: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    tag: 'Historical & Culture',
    costIndex: '$$$',
    highlights: 'Temples, Cherry Blossoms, Traditional Ryokans',
    opportunities: 42,
  },
  {
    id: 'dest-2',
    city: 'Sydney & Reef',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop',
    tag: 'Coast & Adventure',
    costIndex: '$$$',
    highlights: 'Opera House, Bondi Coast, Great Barrier Reef',
    opportunities: 65,
  },
  {
    id: 'dest-3',
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop',
    tag: 'Romance & Cuisine',
    costIndex: '$$$$',
    highlights: 'Eiffel Tower, Louvre, Montmartre Cafes',
    opportunities: 58,
  },
  {
    id: 'dest-4',
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop',
    tag: 'Nature & Wellness',
    costIndex: '$',
    highlights: 'Ubud Forests, Water Temples, Beach Clubs',
    opportunities: 39,
  },
  {
    id: 'dest-5',
    city: 'Bavaria',
    country: 'Germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop',
    tag: 'Castles & Alps',
    costIndex: '$$$',
    highlights: 'Neuschwanstein, Munich Old Town, Alpine Trails',
    opportunities: 31,
  },
  {
    id: 'dest-6',
    city: 'Serengeti',
    country: 'Tanzania',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop',
    tag: 'Wildlife & Safari',
    costIndex: '$$$$',
    highlights: 'Great Migration, Crater Reserve, Sunrise Ballooning',
    opportunities: 24,
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredDest, setHoveredDest] = useState(null);

  const carouselRef = useRef(null);

  useEffect(() => {
    loadUserTrips();
  }, []);

  const loadUserTrips = async () => {
    try {
      setLoadingTrips(true);
      const data = await fetchTrips();
      setTrips(data || []);
    } catch (err) {
      console.warn('Trips fetch (using fallback/demo if unauthenticated):', err.message);
      // Fallback display if not logged in yet
      setTrips([
        {
          _id: 'demo-1',
          name: 'Classic European Summer',
          description: 'Exploring Rome, Swiss Alps & Paris over 14 days',
          startDate: '2026-07-10',
          endDate: '2026-07-24',
          status: 'Ongoing',
          coverPhoto: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop',
        },
        {
          _id: 'demo-2',
          name: 'Autumn in Japan',
          description: 'Tokyo, Kyoto shrines, and Mount Fuji photography trip',
          startDate: '2026-10-05',
          endDate: '2026-10-18',
          status: 'Planning',
          coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
        }
      ]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/create?destination=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredDestinations = REGIONAL_DESTINATIONS.filter(d => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Asia') return d.country === 'Japan' || d.country === 'Indonesia';
    if (activeCategory === 'Europe') return d.country === 'France' || d.country === 'Germany';
    if (activeCategory === 'Africa/Oceania') return d.country === 'Australia' || d.country === 'Tanzania';
    return true;
  });

  return (
    <div className="space-y-16 pb-20 w-full">

      {/* ============================================================ */}
      {/* 1. HERO BANNER SECTION (Pistachio Nature & Brush Script)       */}
      {/* ============================================================ */}
      <section className="relative min-h-[750px] py-20 sm:py-28 lg:py-36 flex items-center justify-center overflow-hidden bg-pistachio-950">
        {/* Immersive Travel Waterfall/Nature Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />

        {/* Lush Pistachio & Dark Emerald Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-pistachio-950/95 via-pistachio-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-pistachio-950/80 via-transparent to-pistachio-950/70" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white w-full">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pistachio-900/80 border border-pistachio-400/30 text-pistachio-200 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-soft">
            <Sparkles size={14} className="text-pistachio-300" />
            Empowering Personalized Travel Planning
          </div>

          {/* Main Title with Fancy Cursive Script Overlay */}
          <div className="relative mb-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-sans uppercase">
              PROVIDING
            </h1>
            <div className="font-script text-5xl sm:text-7xl lg:text-8xl text-pistachio-300 font-normal -mt-3 sm:-mt-6 lg:-mt-8 transform -rotate-2 drop-shadow-md">
              Inspiration
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white font-sans uppercase -mt-2 sm:-mt-4">
              ABROAD
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-pistachio-100/90 text-base sm:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed font-light">
            Giving you the freedom to dream, design, and organize multi-city itineraries with automatic budgets and live city intelligence.
          </p>

          {/* Interactive Search Bar & Quick Categories */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-lifted border border-white/40 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-3 px-4 w-full flex-1">
                <Search size={20} className="text-pistachio-700 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to explore? (e.g., Paris, Tokyo, Bali)..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 font-sans text-sm focus:outline-none py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-pistachio-700 hover:bg-pistachio-800 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-soft hover:shadow-md"
              >
                <span>Search</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
              {['All', 'Asia', 'Europe', 'Africa/Oceania'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${activeCategory === cat
                    ? 'bg-pistachio-400 text-pistachio-950 font-bold shadow-xs'
                    : 'bg-pistachio-900/60 text-pistachio-200 hover:bg-pistachio-800/80 border border-pistachio-700/40'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fancy Torn Bottom Paper Mask / Curve */}
        <div className="absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-[#fafaf7] torn-paper" />
      </section>

      {/* ============================================================ */}
      {/* 2. TOP REGIONAL ADAPTORS (Curated Destination Carousel)       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Stylized Header & Call to Action */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-3xl sm:text-4xl font-script text-pistachio-700 block transform -rotate-1">
              Curated Escapes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-pistachio-950 uppercase">
              REGIONAL ADAPTORS
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">
              Hand-picked global destinations enriched with live scraped intelligence, budget estimates, and suggested activities.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/create"
                className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-pistachio-800 hover:text-pistachio-950 group"
              >
                <span className="h-10 w-10 rounded-full bg-pistachio-700 group-hover:bg-pistachio-800 text-white flex items-center justify-center transition-all shadow-soft group-hover:scale-105">
                  <ArrowRight size={16} />
                </span>
                <span className="underline underline-offset-4 decoration-pistachio-400">Explore All Cities</span>
              </Link>
            </div>

            {/* Scroll Navigation Arrows */}
            <div className="hidden lg:flex items-center gap-2 pt-4">
              <button
                onClick={() => scrollCarousel('left')}
                className="h-9 w-9 rounded-full bg-white border border-pistachio-200 text-pistachio-800 hover:bg-pistachio-100 flex items-center justify-center transition-all shadow-xs"
                title="Scroll Left"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="h-9 w-9 rounded-full bg-white border border-pistachio-200 text-pistachio-800 hover:bg-pistachio-100 flex items-center justify-center transition-all shadow-xs"
                title="Scroll Right"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Horizontal Cards Stream */}
          <div
            ref={carouselRef}
            className="lg:col-span-9 flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-2 snap-x snap-mandatory"
          >
            {filteredDestinations.map((dest) => {
              const isHovered = hoveredDest === dest.id;

              return (
                <div
                  key={dest.id}
                  onMouseEnter={() => setHoveredDest(dest.id)}
                  onMouseLeave={() => setHoveredDest(null)}
                  onClick={() => navigate(`/create?city=${encodeURIComponent(dest.city)}&country=${encodeURIComponent(dest.country)}`)}
                  className="relative min-w-[240px] sm:min-w-[270px] h-[360px] rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted transition-all duration-300 cursor-pointer snap-start group shrink-0 border border-pistachio-100"
                >
                  {/* Destination Background Photo */}
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Default State: Dark Gradient with City Name */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent p-5 flex flex-col justify-end transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-xs font-semibold uppercase tracking-wider text-pistachio-300">
                      {dest.country}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-white mt-0.5">
                      {dest.city}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <MapPin size={12} className="text-pistachio-400" />
                      {dest.tag}
                    </p>
                  </div>

                  {/* Hovered State: Pistachio Green Luxury Frosted Overlay */}
                  <div className={`absolute inset-0 bg-pistachio-800/90 backdrop-blur-xs p-6 text-white flex flex-col justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-pistachio-200 block mb-1">
                        {dest.country}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-white">
                        {dest.city}
                      </h3>
                      <p className="text-xs text-pistachio-100/90 mt-3 font-sans leading-relaxed">
                        {dest.highlights}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-pistachio-900/70 text-pistachio-200 border border-pistachio-600">
                          Cost: {dest.costIndex}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-pistachio-600/60 flex items-center justify-between">
                      <span className="text-xs font-semibold text-pistachio-200">
                        {dest.opportunities} Curated Stops
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                        Plan Trip <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. RECENT JOURNEYS & MY TRIPS (Screen 3 Wireframe Integration)*/}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Header */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-3xl sm:text-4xl font-script text-pistachio-700 block transform -rotate-1">
              Your Adventures
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-pistachio-950 uppercase">
              RECENT TRIPS
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-sans">
              Jump back into your saved itineraries, adjust stops, explore activities, or visualize upcoming day-by-day plans.
            </p>

            <div className="pt-2">
              <Link
                to="/trips"
                className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-pistachio-800 hover:text-pistachio-950 group"
              >
                <span className="h-10 w-10 rounded-full bg-pistachio-700 group-hover:bg-pistachio-800 text-white flex items-center justify-center transition-all shadow-soft group-hover:scale-105">
                  <ArrowRight size={16} />
                </span>
                <span className="underline underline-offset-4 decoration-pistachio-400">View All My Trips ({trips.length})</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Trips Cards Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Live Trips Loaded from Backend */}
            {trips.slice(0, 2).map((trip) => (
              <div
                key={trip._id}
                onClick={() => navigate(`/trips`)}
                className="bg-white rounded-2xl border border-pistachio-100 shadow-soft hover:shadow-lifted overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Trip Cover Image */}
                  <div className="h-44 bg-pistachio-100 relative overflow-hidden">
                    <img
                      src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop'}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status Pill Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${trip.status === 'Ongoing'
                        ? 'bg-pistachio-700 text-white'
                        : trip.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/90 text-pistachio-900 backdrop-blur-xs border border-pistachio-200'
                        }`}>
                        {trip.status || 'Planning'}
                      </span>
                    </div>
                  </div>

                  {/* Trip Content */}
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-pistachio-700 transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-sans">
                      {trip.description || 'Custom multi-city personalized itinerary.'}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-pistachio-800">
                    <Calendar size={14} />
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Flexible'}
                    {trip.endDate ? ` - ${new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
                  </span>
                  <span className="text-pistachio-700 font-bold flex items-center gap-1">
                    Open <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}

            {/* "+ Plan a New Trip" CTA Card */}
            <div
              onClick={() => navigate('/create')}
              className="bg-pistachio-50/70 hover:bg-pistachio-100/80 border-2 border-dashed border-pistachio-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[300px] shadow-xs"
            >
              <div className="h-14 w-14 rounded-full bg-pistachio-700 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-soft">
                <Plus size={24} className="stroke-[2.5]" />
              </div>
              <h4 className="font-serif font-bold text-lg text-pistachio-950">
                Plan a New Trip
              </h4>
              <p className="text-xs text-pistachio-800/80 mt-1 max-w-[200px]">
                Create a customized multi-city itinerary with activities & budget.
              </p>
              <span className="mt-4 text-xs font-bold text-pistachio-800 underline underline-offset-4 decoration-pistachio-400 group-hover:text-pistachio-950">
                Start Building →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PLATFORM HIGHLIGHTS / VALUE PROP BANNER                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-4">
        <div className="bg-pistachio-900 rounded-3xl p-8 sm:p-12 text-white shadow-lifted relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-pistachio-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-pistachio-800/80 border border-pistachio-600/50 flex items-center justify-center text-pistachio-300 shrink-0">
                <Globe2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Multi-City Stops</h4>
                <p className="text-xs text-pistachio-200 mt-1">Seamlessly sequence cities, dates, and order.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-pistachio-800/80 border border-pistachio-600/50 flex items-center justify-center text-pistachio-300 shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Live Intelligence</h4>
                <p className="text-xs text-pistachio-200 mt-1">Native Cheerio scraper enriches city data on the fly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-pistachio-800/80 border border-pistachio-600/50 flex items-center justify-center text-pistachio-300 shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Budget Estimation</h4>
                <p className="text-xs text-pistachio-200 mt-1">Automatic cost tracking by stay, transit, and food.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-pistachio-800/80 border border-pistachio-600/50 flex items-center justify-center text-pistachio-300 shrink-0">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Timeline & Calendar</h4>
                <p className="text-xs text-pistachio-200 mt-1">Interactive day-by-day scheduler for every stop.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
