'use client'
import { FiActivity } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 h-full relative overflow-hidden group">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-8">
        <FiActivity className="text-blue-500" /> Performance Analytics
      </h3>
      
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={10} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }} 
              itemStyle={{ fontWeight: 900, fontSize: '12px', color: '#1e293b' }}
            />
            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}