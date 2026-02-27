'use client'
import { FiDollarSign, FiShoppingBag, FiLayers, FiAlertCircle } from 'react-icons/fi'

export function MetricBar({ stats }: { stats: any }) {
  // Safe mapping of stats to handle potential undefined values during loading
  const items = [
    { 
      label: 'Daily Revenue', 
      value: `NLe ${stats?.revenue?.toLocaleString() || 0}`, 
      icon: <FiDollarSign />, 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Orders Today', 
      value: stats?.units || 0, 
      icon: <FiShoppingBag />, 
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Live Inventory', 
      value: stats?.inventory || 0, 
      icon: <FiLayers />, 
      color: 'text-slate-600',
      bg: 'bg-slate-100'
    },
    { 
      label: 'Stock Alerts', 
      value: stats?.alerts || 0, 
      icon: <FiAlertCircle />, 
      color: (stats?.alerts > 0) ? 'text-rose-600' : 'text-slate-400',
      bg: (stats?.alerts > 0) ? 'bg-rose-50' : 'bg-slate-50'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-100 bg-white">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col group">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${item.bg} ${item.color} transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
              {item.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {item.label}
            </p>
          </div>
          <p className={`text-3xl font-black tracking-tighter italic ${item.label === 'Stock Alerts' && stats?.alerts > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}

// Fallback default export to prevent resolution errors
export default MetricBar;