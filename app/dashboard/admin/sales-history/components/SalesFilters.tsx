'use client'
import { FiSearch, FiCalendar } from 'react-icons/fi'

export function SalesFilters({ searchTerm, setSearchTerm, startDate, setStartDate, endDate, setEndDate, total }: any) {
  return (
    <div className="bg-white border border-slate-100 p-2 rounded-[2.5rem] shadow-sm flex flex-wrap lg:flex-nowrap items-center gap-2">
      <div className="flex-1 flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-[2rem] border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
        <FiSearch className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search materials..." 
          className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-100 px-4">
        <FiCalendar className="text-blue-500" size={14} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-slate-600 outline-none" />
        <span className="text-slate-300">→</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase text-slate-600 outline-none" />
      </div>

      <div className="px-8 py-3 bg-blue-600 rounded-[2rem] text-white flex flex-col items-center min-w-[160px]">
        <span className="text-[8px] font-black uppercase tracking-widest text-blue-200 leading-none mb-1">Total Revenue</span>
        <span className="text-sm font-black italic">NLe {total.toLocaleString()}</span>
      </div>
    </div>
  )
}