import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, Users, Map, Plane, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/stats`, config),
          axios.get(`${apiUrl}/api/admin/users`, config)
        ]);

        // Format popular destinations for Recharts
        const formattedChartData = statsRes.data.popularDestinations.map(d => ({
          name: d._id,
          count: d.count
        }));

        setStats({ ...statsRes.data, chartData: formattedChartData });
        setUsers(usersRes.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        } else {
          setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
         <Loader2 className="w-10 h-10 animate-spin text-[#3f5e33]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#152311] text-white min-h-screen p-6 hidden md:block">
        <h1 className="text-2xl font-serif font-bold mb-8 tracking-wider text-[#aec59f]">GLOBETROTTER</h1>
        <p className="text-[#88a776] text-xs font-bold uppercase tracking-widest mb-6">Admin Portal</p>
        <nav className="space-y-2 font-sans">
          <a href="#" className="block py-2.5 px-4 bg-[#2c3f25] rounded-xl text-white font-medium">Dashboard</a>
          <a href="#" className="block py-2.5 px-4 text-[#88a776] hover:bg-[#2c3f25] hover:text-white rounded-xl transition-colors">Users</a>
          <a href="#" className="block py-2.5 px-4 text-[#88a776] hover:bg-[#2c3f25] hover:text-white rounded-xl transition-colors">Trips</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Platform Overview</h2>
            <p className="text-slate-500 font-sans mt-1">Live statistics and user management.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white border border-[#e5ede0] text-slate-700 px-4 py-2 rounded-xl font-medium shadow-soft hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0] flex items-start justify-between">
            <div>
              <h3 className="text-slate-500 font-sans text-sm font-medium mb-1">Total Registered Users</h3>
              <p className="text-4xl font-serif font-bold text-[#3f5e33]">{stats?.users || 0}</p>
            </div>
            <div className="p-3 bg-[#f4f7f1] rounded-xl text-[#678b54]">
              <Users className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0] flex items-start justify-between">
            <div>
              <h3 className="text-slate-500 font-sans text-sm font-medium mb-1">Total Trips Planned</h3>
              <p className="text-4xl font-serif font-bold text-[#3f5e33]">{stats?.trips || 0}</p>
            </div>
            <div className="p-3 bg-[#f4f7f1] rounded-xl text-[#678b54]">
              <Plane className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0] flex items-start justify-between">
            <div>
              <h3 className="text-slate-500 font-sans text-sm font-medium mb-1">Total Destinations</h3>
              <p className="text-4xl font-serif font-bold text-[#3f5e33]">{stats?.destinations || 0}</p>
            </div>
            <div className="p-3 bg-[#f4f7f1] rounded-xl text-[#678b54]">
              <Map className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Data Visualization */}
          <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-soft border border-[#e5ede0]">
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-6">Popular Destinations</h3>
            <div className="h-72 w-full">
              {stats?.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5ede0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f4f7f1' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#88a776" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Not enough data to display.</div>
              )}
            </div>
          </div>

          {/* User Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-soft border border-[#e5ede0] overflow-hidden">
             <div className="p-6 border-b border-[#e5ede0]">
                <h3 className="text-xl font-serif font-bold text-slate-900">Registered Users</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left font-sans">
                 <thead className="bg-[#f4f7f1] text-[#506f40] text-sm uppercase tracking-wide">
                   <tr>
                     <th className="px-6 py-4 font-semibold">Name</th>
                     <th className="px-6 py-4 font-semibold">Email</th>
                     <th className="px-6 py-4 font-semibold">Role</th>
                     <th className="px-6 py-4 font-semibold">Joined</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#e5ede0]">
                   {users.map(user => (
                     <tr key={user._id} className="hover:bg-slate-50 transition-colors text-slate-700">
                       <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{user.name}</td>
                       <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 py-1 text-xs font-bold rounded-md ${user.role === 'admin' ? 'bg-[#3f5e33] text-white' : 'bg-[#e5ede0] text-[#2c3f25]'}`}>
                           {user.role}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                         {new Date(user.createdAt).toLocaleDateString()}
                       </td>
                     </tr>
                   ))}
                   {users.length === 0 && (
                     <tr>
                       <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No users found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
