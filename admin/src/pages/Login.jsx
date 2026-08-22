import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Zap, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      
      const { user, token } = response.data;
      
      if (user.role !== 'admin') {
        setError('Forbidden: Administrator privileges required to access this portal.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevBypass = () => {
    setEmail('admin@globetrotter.com');
    setPassword('admin123');
    setTimeout(() => {
      const form = document.getElementById('login-form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-soft border border-[#e5ede0]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#e5ede0] rounded-full flex items-center justify-center mb-4">
             <ShieldAlert className="w-8 h-8 text-[#3f5e33]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 font-sans mt-2">Sign in to manage GlobeTrotter</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form id="login-form" onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#cdddc2] rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#678b54] outline-none transition-all"
              placeholder="admin@globetrotter.com"
            />
          </div>
          
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
             <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#cdddc2] rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#678b54] outline-none transition-all pl-10"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#3f5e33] hover:bg-[#354c2b] text-white font-semibold py-3 rounded-xl shadow-soft hover:shadow-lifted transition-all flex items-center justify-center"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e5ede0]">
           <button 
             onClick={handleDevBypass}
             className="w-full flex items-center justify-center gap-2 bg-[#152311] hover:bg-[#2c3f25] text-[#aec59f] py-2 rounded-xl transition-colors font-medium text-sm"
           >
             <Zap className="w-4 h-4" /> 1-Click Dev Bypass
           </button>
        </div>

      </div>
    </div>
  );
}
