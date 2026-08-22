import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUpWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token & user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));

      // Redirect to trips listing
      navigate('/trips');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError('Google Sign-Up is configured. Please use Email/Password for direct registration.');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <style>{`
        @keyframes slideFromBottom {
          0% { transform: translate3d(0, 20px, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .modal-content-animated {
          animation: slideFromBottom 0.3s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md modal-content-animated">
        <div className="flex flex-col p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-center text-gray-500 mb-6">
            Start planning your next adventure with GlobeTrotter
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mb-6 border border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm cursor-pointer"
            aria-label="Sign up with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-xs uppercase font-medium">or email</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignUpWithEmail}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
