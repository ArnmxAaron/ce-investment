'use client'
import { useState } from 'react'
import { FiShoppingBag, FiFileText, FiLogOut } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface SidebarProps {
  activeView: 'sales' | 'receipts';
  onViewChange: (view: 'sales' | 'receipts') => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const menuItems = [
    { id: 'sales', name: 'Sales Terminal', icon: <FiShoppingBag size={22}/> },
    { id: 'receipts', name: 'Receipts Log', icon: <FiFileText size={22}/> },
  ]

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isHovered ? 260 : 80 }}
      className="fixed left-0 top-0 h-screen bg-[#0f172a] text-white z-[500] flex flex-col shadow-2xl overflow-hidden border-r border-white/5"
    >
      <div className="p-6 mb-10 flex items-center gap-4">
        <div className="min-w-[32px] h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic text-sm">CE</div>
        {isHovered && <span className="font-black tracking-tighter text-lg whitespace-nowrap">STAFF <span className="text-blue-500">TERMINAL</span></span>}
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <div className="min-w-[24px]">{item.icon}</div>
            {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-4 p-4 w-full text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all">
          <FiLogOut size={22}/>
          {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest">Exit Terminal</span>}
        </button>
      </div>
    </motion.aside>
  )
}