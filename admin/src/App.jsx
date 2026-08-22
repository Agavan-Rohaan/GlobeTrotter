import React, { useState, useEffect } from 'react';

function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from /api/admin/stats with a JWT token
    setStats({
      users: 15,
      trips: 42,
      destinations: 120
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-8 tracking-wider">GLOBETROTTER</h1>
        <p className="text-slate-400 text-sm mb-6">ADMIN PORTAL</p>
        <nav className="space-y-4">
          <a href="#" className="block py-2 px-4 bg-slate-800 rounded-lg text-white">Dashboard</a>
          <a href="#" className="block py-2 px-4 text-slate-400 hover:text-white">Users</a>
          <a href="#" className="block py-2 px-4 text-slate-400 hover:text-white">Trips</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">Overview</h2>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium">Logout</button>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-slate-800">{stats?.users || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Trips Planned</h3>
            <p className="text-3xl font-bold text-slate-800">{stats?.trips || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Destinations Scraped</h3>
            <p className="text-3xl font-bold text-slate-800">{stats?.destinations || 0}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
          <p className="text-gray-400">Admin dashboard data visualization will go here.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
