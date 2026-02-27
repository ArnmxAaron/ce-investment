'use client'
import { FiCalendar, FiTrendingUp, FiDownload } from 'react-icons/fi'

export function DashboardHeader({ selectedDate, setSelectedDate }: any) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-end md:items-center pb-8 border-b border-slate-100 mb-8">
      {/* Title Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full" /> 
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Executive Hub
          </h1>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] flex items-center gap-2 pl-4">
          <FiTrendingUp className="text-blue-500" />
          Real-time Performance Metrics
        </p>
      </div>

      {/* Control Section */}
      <div className="flex items-center gap-4 mt-6 md:mt-0">
        {/* Export Utility - Standard for Executive Views */}
        <button className="flex items-center gap-2 px-5 py-3 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-colors border border-transparent hover:border-slate-200 rounded-2xl">
          <FiDownload size={16} />
          Export Report
        </button>

        {/* Date Filter - Professional "Standard" Design */}
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-blue-300 group">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Data Perspective
            </span>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-600" size={14} />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-xs font-black text-slate-800 bg-transparent cursor-pointer uppercase tracking-tighter" 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}