import { FiBox, FiTrendingUp, FiShoppingCart, FiAlertTriangle } from 'react-icons/fi'

interface StatCardProps {
  label: string;
  value: string | number;
  type: 'stock' | 'income' | 'orders' | 'warning';
}

export const StatCard = ({ label, value, type }: StatCardProps) => {
  // Define styles and icons based on the "type" prop
  const config = {
    stock: {
      icon: <FiBox />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    income: {
      icon: <FiTrendingUp />,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    orders: {
      icon: <FiShoppingCart />,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    warning: {
      icon: <FiAlertTriangle />,
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100',
    }
  }

  const style = config[type]

  return (
    <div className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${style.bg}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${style.iconBg} ${style.text}`}>
          {style.icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            {label}
          </p>
          <h3 className={`text-2xl font-black tracking-tighter ${style.text}`}>
            {value}
          </h3>
        </div>
      </div>
    </div>
  )
}