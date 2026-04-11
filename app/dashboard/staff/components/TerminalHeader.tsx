'use client'
import { useState, useEffect } from 'react'
import { FiSearch, FiClock, FiArrowDown, FiArrowUp, FiXCircle } from 'react-icons/fi'

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalSalesToday: number;
  sortBy: 'low' | 'high' | 'none';
  setSortBy: (sort: 'low' | 'high' | 'none') => void;
}

export function TerminalHeader({ 
  searchQuery, 
  setSearchQuery, 
  totalSalesToday, 
  sortBy, 
  setSortBy 
}: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-[40] bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between gap-8">
      {/* BRAND SECTION */}
      <div className="flex items-center gap-4 min-w-fit">
        <div className="flex flex-col text-left">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none flex items-center gap-2">
            C <span className="text-blue-600">&</span> E 
            <span className="not-italic font-light text-slate-300 ml-2">|</span>
            <span className="not-italic font-black text-blue-600 tracking-[0.2em] text-lg ml-1">INVENTORY</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-emerald-100" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="flex-1 max-w-xl relative group">
        <input 
          placeholder="Quick search inventory..." 
          className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 font-bold text-slate-900 placeholder:text-slate-400 text-sm transition-all text-left"
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
      </div>

      {/* CONTROLS & STATS SECTION */}
      <div className="flex items-center gap-6">
        
        {/* SHUFFLE CONTROLS */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setSortBy(sortBy === 'low' ? 'none' : 'low')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black tracking-wider transition-all duration-200 ${
              sortBy === 'low' 
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiArrowDown className={sortBy === 'low' ? 'animate-bounce' : ''} /> 
            {sortBy === 'low' ? 'LOW STOCK ACTIVE' : 'LOW STOCK'}
          </button>
          
          <button 
            onClick={() => setSortBy(sortBy === 'high' ? 'none' : 'high')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black tracking-wider transition-all duration-200 ${
              sortBy === 'high' 
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FiArrowUp className={sortBy === 'high' ? 'animate-bounce' : ''} /> 
            {sortBy === 'high' ? 'HIGH STOCK ACTIVE' : 'HIGH STOCK'}
          </button>

          {sortBy !== 'none' && (
            <button 
              onClick={() => setSortBy('none')}
              className="ml-1 p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Reset Sorting"
            >
              <FiXCircle size={16} />
            </button>
          )}
        </div>

        {/* STATUS CAPSULE */}
        <div className="bg-slate-900 px-6 py-3 rounded-2xl flex items-center gap-5 shadow-xl shadow-slate-200 ring-1 ring-white/10">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] opacity-80">Today's Revenue</span>
            <div className="flex items-baseline gap-1.5 leading-none mt-1">
              <span className="text-[10px] font-black text-white/40">NLE</span>
              <span className="text-xl font-black text-white tracking-tighter">
                {totalSalesToday.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center gap-3">
            <FiClock className="text-blue-500" size={16} />
            <span className="text-xs font-black font-mono text-white tracking-widest bg-white/5 px-2 py-1 rounded-md">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}