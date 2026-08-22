import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, User, Plus, Globe, LogOut, UserPlus } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser({ name: 'Traveler' });
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
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      <nav className="bg-white border-b border-pistachio-100 px-6 sm:px-10 py-3.5 flex items-center justify-between transition-all max-w-7xl mx-auto">
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

        {/* Center Nav Links (Protected Links) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/dashboard"
              className={`text-sm font-semibold tracking-wide transition-colors ${
                isActive('/dashboard')
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
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-1 pr-3.5 bg-pistachio-50 hover:bg-pistachio-100/90 rounded-full border border-pistachio-200 text-xs font-semibold text-pistachio-950 shadow-xs hover:shadow-soft transition-all cursor-pointer group"
                title={`Logged in as ${user?.name || 'Traveler'} - View Profile`}
              >
                <div className="w-7 h-7 rounded-full bg-pistachio-700 text-white flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>
                <span className="truncate max-w-[120px] font-bold">{user?.name || 'Traveler'}</span>
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
