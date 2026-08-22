import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, User, Plus, Search, Globe, Phone, Mail, Heart, UserPlus } from 'lucide-react';


export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-xs">
      {/* Top Micro Contact Bar matching the reference UI */}
      <div className="bg-pistachio-900 text-pistachio-200 text-xs px-6 py-1.5 flex justify-between items-center border-b border-pistachio-800/40">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Phone size={12} className="text-pistachio-400" />
            +1 800 345 3457
          </span>
          <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
            <Mail size={12} className="text-pistachio-400" />
            hello@globetrotter.travel
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <Globe size={12} className="text-pistachio-400" />
            ENG (USD)
          </span>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav className="glass-panel border-b border-pistachio-100/80 px-6 sm:px-10 py-3.5 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pistachio-700 to-pistachio-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Compass size={22} className="animate-spin-slow" />
          </div>
          <div>
            <span className="text-2xl font-serif font-bold tracking-tight text-pistachio-950 flex items-center gap-1.5">
              GLOBETROTTER
              <span className="text-xs font-sans font-bold px-1.5 py-0.5 rounded bg-pistachio-100 text-pistachio-800 border border-pistachio-200">2.0</span>
            </span>
            <p className="text-[10px] font-script tracking-wider text-pistachio-700 -mt-1">
              Personalized Travel Planning
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/dashboard') || isActive('/')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            DASHBOARD
          </Link>
          <Link
            to="/trips"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/trips')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            MY TRIPS
          </Link>
          <Link
            to="/create"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/create')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            ITINERARY BUILDER
          </Link>
          <Link
            to="/login"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/login')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/register')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            REGISTER
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
              isActive('/login')
                ? 'bg-pistachio-100 text-pistachio-800 font-bold'
                : 'text-slate-700 hover:text-pistachio-700 hover:bg-pistachio-50'
            }`}
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-pistachio-700 hover:bg-pistachio-800 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-soft hover:shadow-lifted transition-all transform hover:-translate-y-0.5"
          >
            <UserPlus size={16} />
            <span>Sign Up</span>
          </Link>

          <Link
            to="/create"
            className="hidden sm:inline-flex items-center gap-2 border border-pistachio-600 text-pistachio-800 hover:bg-pistachio-50 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Plan Trip</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
