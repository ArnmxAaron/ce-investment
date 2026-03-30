'use client'
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiBox, 
  FiLayers, 
  FiArrowUpRight 
} from 'react-icons/fi'

interface MetricBarProps {
  stats: {
    revenue: number;      // Today's Income
    monthlySales: number;  // Total Sales this month
    totalOrders: number;   // Today's order count
    totalProducts: number; // Total product count
  }
}

export const MetricBar = ({ stats }: MetricBarProps) => {
  const metrics = [
    {
      label: "Today's Revenue",
      value: `NLE ${stats.revenue.toLocaleString()}`,
      icon: <FiTrendingUp size={24} />,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      bgLight: "bg-emerald-50"
    },
    {
      label: "Total Sales (Month)",
      value: `NLE ${stats.monthlySales.toLocaleString()}`,
      icon: <FiShoppingBag size={24} />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      label: "Orders Today",
      value: stats.totalOrders,
      icon: <FiLayers size={24} />,
      color: "bg-violet-500",
      textColor: "text-violet-600",
      bgLight: "bg-violet-50"
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <FiBox size={24} />,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
      {metrics.map((m, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${m.bgLight} ${m.textColor} group-hover:scale-110 transition-transform`}>
              {m.icon}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
              <FiArrowUpRight /> +Live
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{m.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}