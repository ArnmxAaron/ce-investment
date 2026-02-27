'use client'
import { FiShield, FiDatabase, FiCpu } from 'react-icons/fi'

export function SettingsSidebar({ activeTab, setActiveTab }: any) {
  const menus = [
    { id: 'security', label: 'Security', sub: 'Terminal Lock', icon: <FiShield /> },
    { id: 'database', label: 'Systems', sub: 'Cloud Core', icon: <FiCpu />, disabled: true },
  ]

  return (
    <div className="w-72 border-r border-slate-100 bg-slate-50/30 flex flex-col">
      <div className="p-8 border-b border-slate-100 bg-white">
        <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] italic">Configuration</h1>
      </div>
      <nav className="p-3 space-y-1">
        {menus.map((m) => (
          <button 
            key={m.id}
            disabled={m.disabled}
            onClick={() => setActiveTab(m.id)} 
            className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all border ${
              activeTab === m.id ? 'bg-white shadow-md border-slate-200' : 'hover:bg-white/60 border-transparent opacity-50'
            } ${m.disabled && 'cursor-not-allowed'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === m.id ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' : 'bg-slate-200 text-slate-500'
            }`}>
              {m.icon}
            </div>
            <div className="text-left">
              <p className="font-black text-slate-900 uppercase text-[10px] leading-tight">{m.label}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.sub}</p>
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}