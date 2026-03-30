'use client'
import { useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { DashboardHeader } from './components/DashboardHeader'
import { MetricBar } from './components/MetricBar'
import { RevenueChart } from './components/RevenueChart'
import { SalesFeed } from './components/SalesFeed'
import { TopProducts } from './components/TopProducts'

export default function AdminHome() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Custom hook fetching live Supabase data (now includes monthly totals)
  const { stats, chartData, recentSales, topProducts, loading } = useAdminDashboard(selectedDate);

  return (
    <div className="max-w-screen-2xl mx-auto space-y-6 pb-12">
      {/* 1. Header with Date Filter */}
      <DashboardHeader 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />

      {/* 2. Key Performance Metrics 
          Updated to map to: Daily Revenue, Monthly Sales, Daily Orders, and Total Products
      */}
      <MetricBar 
        stats={{
          revenue: stats.dailyIncome,
          monthlySales: stats.monthlySales, // Maps to the new monthly total
          totalOrders: stats.totalOrders,   // Today's order count
          totalProducts: stats.totalProducts // Total inventory items
        }} 
      />

      {/* 3. Main Analytics Grid */}
      <div className={`grid grid-cols-1 xl:grid-cols-4 gap-12 transition-all duration-500 ${loading ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}>
        
        {/* LEFT & CENTER: Performance Trends (3/4 Width) */}
        <div className="xl:col-span-3 space-y-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <RevenueChart data={chartData} />
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               System Status: Enterprise Secured • Real-time Data Active
             </p>
          </div>
        </div>

        {/* RIGHT: Live Activity & Inventory Leaders (1/4 Width) */}
        <div className="xl:col-span-1 border-l border-slate-100 pl-10 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pl-1">Recent Activity</h3>
            <SalesFeed sales={recentSales} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pl-1">Low Stock Alerts</h3>
            <TopProducts products={topProducts} />
          </div>
        </div>
        
      </div>
    </div>
  )
}