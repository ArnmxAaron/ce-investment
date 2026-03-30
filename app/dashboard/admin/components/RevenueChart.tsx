'use client'
import { FiActivity, FiBarChart2 } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenue Stream</p>
        <p className="text-lg font-black text-slate-900 tracking-tighter">
          NLe {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: { data: any[] }) {
  const totalRevenue = data?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

  return (
    <div className="py-8 bg-white rounded-[2rem] border border-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 px-8 gap-4">
        <div>
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
            <FiActivity size={14} /> Analytics Engine
          </h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            Revenue Trend
          </h2>
        </div>

        <div className="text-left md:text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cumulative Total</p>
          <div className="flex items-center gap-3 justify-start md:justify-end">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-2xl font-black text-slate-900 tracking-tighter">
              NLe {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[350px] w-full px-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}}
              tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9', radius: 12}} />
            <Bar 
              dataKey="amount" 
              radius={[10, 10, 10, 10]} 
              barSize={40}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? '#2563eb' : '#cbd5e1'} 
                  className="transition-all duration-300 hover:fill-blue-600"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}