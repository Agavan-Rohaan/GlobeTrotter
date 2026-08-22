import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Compass, Zap, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PasswordVisibilityToggle = ({ isVisible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isVisible ? 'Hide password' : 'Show password'}
    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pistachio-500 text-slate-400 hover:text-slate-600 cursor-pointer"
  >
    {isVisible ? '🙈' : '👁️'}
  </button>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1-Click Developer Bypass Function
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check for DEV123 Secret Key in password field
    if (password === 'DEV123' || password === 'dev123') {
      handleOneClickDevBypass();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store JWT token & user info locally
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      
      window.dispatchEvent(new Event('auth-change'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError('Google Sign-In is configured. Use Email/Password or 1-Click Dev Bypass.');
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-8">
      <style>{`
        @keyframes slideFromBottom {
          0% { transform: translate3d(0, 20px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .modal-content { animation: slideFromBottom 0.3s ease-out; }
      `}</style>

      <div className="bg-white rounded-3xl shadow-soft border border-pistachio-100/80 w-full max-w-md modal-content overflow-hidden">
        {/* Header Branding Accent */}
        <div className="bg-pistachio-950 px-8 py-6 text-center text-white relative">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-pistachio-800/80 text-pistachio-300 mb-2 border border-pistachio-700/50">
            <Compass size={26} className="animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-white">Log In</h1>
          <p className="text-xs font-script text-pistachio-300 mt-0.5 text-base">Personalized Travel Escapes</p>
        </div>

        <div className="p-8 flex flex-col gap-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* Prominent 1-Click Developer Bypass Button */}
          <button
            type="button"
            onClick={handleOneClickDevBypass}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
          >
            <Zap size={18} className="fill-white" />
            <span>⚡ 1-Click Dev Bypass (Instant Log In)</span>
          </button>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-pistachio-50/50 text-slate-800 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 border border-pistachio-200 transition-colors shadow-xs cursor-pointer text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-pistachio-100"></div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-pistachio-100"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••• (or DEV123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pistachio-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-pistachio-500 focus:border-pistachio-500 outline-none transition-all text-sm pr-12"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <PasswordVisibilityToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-pistachio-700 hover:bg-pistachio-800 text-white font-semibold rounded-xl shadow-soft hover:shadow-lifted transition-all focus:outline-none focus:ring-2 focus:ring-pistachio-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Registration Redirect Card */}
          <div className="bg-pistachio-50/70 border border-pistachio-200/80 rounded-2xl p-4 text-center flex flex-col gap-2">
            <p className="text-xs text-slate-600 font-medium">Don't have an account yet?</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white text-pistachio-900 border border-pistachio-300 py-2.5 px-4 rounded-xl hover:bg-pistachio-100 transition-all shadow-xs"
            >
              <UserPlus size={14} className="text-pistachio-700" />
              <span>Create New Account (Sign Up)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
