'use client'
import { FiCalendar, FiBell } from 'react-icons/fi'

export function DashboardHeader({ selectedDate, setSelectedDate, notifications, setNotifications }: any) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Executive Hub</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          Live Revenue & Inventory Metrics
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setNotifications(0)}
          className="relative p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-all group"
        >
          <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
          {notifications > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              {notifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
            <FiCalendar size={18} />
          </div>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-xs font-black text-slate-700 bg-transparent cursor-pointer uppercase tracking-tight" 
          />
        </div>
      </div>
    </header>
  )
}