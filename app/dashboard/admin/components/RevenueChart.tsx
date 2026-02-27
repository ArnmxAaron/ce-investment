'use client'
import { FiActivity, FiArrowUpRight } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Custom Tooltip for premium look
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
        <p className="text-xl font-black text-white italic tracking-tighter">
          NLe {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: { data: any[] }) {
  // Calculate total for display
  const totalRevenue = data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  return (
    <div className="py-10 border-b border-slate-100 bg-white group">
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
            <FiActivity size={14} /> Performance Analytics
          </h3>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Revenue Trend
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period Total</p>
          <div className="flex items-center gap-3 justify-end">
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
              <FiArrowUpRight /> Live
            </span>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              NLe {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={5} 
              fillOpacity={1} 
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}