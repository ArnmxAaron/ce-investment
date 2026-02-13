'use client'
import { FiPackage, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiTrendingUp } from 'react-icons/fi'

export function StatCard({ label, value, type, trend }: any) {
  const configs: any = {
    stock: { icon: <FiPackage />, color: 'text-blue-600', bg: 'bg-blue-50' },
    orders: { icon: <FiShoppingCart />, color: 'text-purple-600', bg: 'bg-purple-50' },
    income: { icon: <FiDollarSign />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    warning: { icon: <FiAlertTriangle />, color: 'text-rose-600', bg: 'bg-rose-50' },
  }

  const style = configs[type] || configs.stock

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${style.bg} ${style.color} transition-transform group-hover:rotate-12`}>
          {style.icon}
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg ${type === 'warning' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
          <FiTrendingUp /> {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</h2>
      </div>
    </div>
  )
}