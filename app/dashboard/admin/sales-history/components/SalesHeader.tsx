'use client'
import { FiClock, FiDownload } from 'react-icons/fi'

export function SalesHeader({ sales }: { sales: any[] }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Audit Ledger</h1>
        <p className="text-slate-500 font-medium text-xs flex items-center gap-2 mt-2">
          <FiClock className="text-blue-500" /> System-verified transaction history
        </p>
      </div>
      
      <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
        <FiDownload size={14}/> Generate Audit Report
      </button>
    </div>
  )
}