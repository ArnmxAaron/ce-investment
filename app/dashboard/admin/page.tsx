'use client'
import { useState } from 'react'
import { useAdminDashboard } from '../../../hooks/useAdminDashboard'
import { FiCalendar, FiBell } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard } from '../StatCard' // Create this component next

export default function AdminHome() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const { stats, chartData, recentSales, notifications, setNotifications, loading } = useAdminDashboard(selectedDate)

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time revenue & inventory tracking</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button 
            onClick={() => setNotifications(0)}
            className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-all"
          >
            <FiBell size={24} />
            {notifications > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                {notifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
            <FiCalendar className="text-blue-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none text-sm font-bold text-slate-700 bg-transparent cursor-pointer" 
            />
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Stock" value={stats.totalStockItems} type="stock" />
        <StatCard label="Sales Volume" value={stats.totalOrders} type="orders" />
        <StatCard label="Daily Income" value={`NLe ${stats.dailyIncome}`} type="income" />
        <StatCard label="Alerts" value={stats.outOfStockCount} type="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT SALES MINI-LIST */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/10">
          <h3 className="font-bold mb-6 text-blue-400 uppercase tracking-widest text-xs">Live Sales Feed</h3>
          <div className="space-y-6">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <p className="text-sm font-bold truncate w-32 uppercase tracking-tight">{sale.products.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sale.profiles.full_name}</p>
                </div>
                <p className="font-mono font-black text-blue-400">NLe {sale.total_price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}