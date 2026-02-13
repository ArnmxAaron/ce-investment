'use client'
import { FiZap } from 'react-icons/fi'

export function QuickActions() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      <button className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
        <FiZap className="text-yellow-400" /> New Sale
      </button>
      <button className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-500 transition-all">
        Inventory Audit
      </button>
      <button className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-500 transition-all">
        Generate PDF
      </button>
    </div>
  )
}