import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, User, Plus, Globe, Phone, Mail, UserPlus, LogOut, Zap, Heart } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const devBypass = localStorage.getItem('dev_bypass') === 'true';
    const storedUser = localStorage.getItem('user');

    if (token || devBypass) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser({ name: 'User' });
        }
      } else {
        setUser({ name: 'Traveler' });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener('auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('dev_bypass');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const handleOneClickDevBypass = () => {
    localStorage.setItem('token', 'dev-secret-token-123');
    localStorage.setItem('dev_bypass', 'true');
    localStorage.setItem(
      'user',
      JSON.stringify({
        _id: 'dev-123',
        name: 'Dev User (Dev Mode)',
        email: 'dev@globetrotter.travel',
        role: 'admin',
      })
    );
    window.dispatchEvent(new Event('auth-change'));
    navigate('/dashboard');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* Top Micro Contact Bar */}
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
          {!isAuthenticated && (
            <button
              type="button"
              onClick={handleOneClickDevBypass}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30 transition-colors cursor-pointer"
              title="1-Click Developer Bypass Log In"
            >
              <Zap size={11} className="fill-amber-300" />
              <span>Dev 1-Click Bypass</span>
            </button>
          )}
          <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <Globe size={12} className="text-pistachio-400" />
            ENG (USD)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-pistachio-100 px-6 sm:px-10 py-3.5 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pistachio-700 to-pistachio-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Compass size={22} />
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
            to="/itinerary-builder"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/itinerary-builder')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            ITINERARY BUILDER
          </Link>
          <Link
            to="/community"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/community')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            COMMUNITY
          </Link>
          <Link
            to="/profile"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive('/profile')
                ? 'text-pistachio-700 border-b-2 border-pistachio-600 pb-1 font-bold'
                : 'text-slate-600 hover:text-pistachio-700'
            }`}
          >
            PROFILE
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              {/* Clickable Profile Badge */}
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 bg-pistachio-50 hover:bg-pistachio-100/80 rounded-xl border border-pistachio-200 text-xs font-semibold text-pistachio-900 transition-all cursor-pointer"
                title="Go to User Profile"
              >
                <User size={14} className="text-pistachio-700" />
                <span>{user?.name || 'Traveler'}</span>
              </Link>

              <Link
                to="/create"
                className="hidden sm:inline-flex items-center gap-2 bg-pistachio-700 hover:bg-pistachio-800 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-soft transition-all"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>Plan Trip</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl border border-rose-200 transition-all cursor-pointer"
                title="Log out of session"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all ${
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
