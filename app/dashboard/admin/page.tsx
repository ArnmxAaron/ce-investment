'use client'
import { useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { DashboardHeader } from './components/DashboardHeader'
import { MetricBar } from './components/MetricBar' // Redesigned Stat area
import { RevenueChart } from './components/RevenueChart'
import { SalesFeed } from './components/SalesFeed'
import { TopProducts } from './components/TopProducts'

export default function AdminHome() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Custom hook fetching your Supabase data
// Fixed
const { stats, chartData, recentSales, topProducts, loading } = useAdminDashboard(selectedDate);


  return (
    <div className="max-w-screen-2xl mx-auto space-y-2">
      {/* 1. Header with Date Filter */}
      <DashboardHeader 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />

      {/* 2. Key Performance Metrics (MetricBar replaces StatCards for a cleaner look) */}
      <MetricBar 
        stats={{
          revenue: stats.dailyIncome,
          units: stats.totalOrders,
          inventory: stats.totalStockItems,
          alerts: stats.outOfStockCount
        }} 
      />

      {/* 3. Main Analytics Grid */}
      <div className={`grid grid-cols-1 xl:grid-cols-4 gap-12 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        
        {/* LEFT & CENTER: Performance Trends (3/4 Width) */}
        <div className="xl:col-span-3 space-y-12">
          <RevenueChart data={chartData} />
          
          {/* Optional: Add a secondary detailed table or map here later */}
          <div className="pt-6 border-t border-slate-50">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
               System Status: Enterprise Secured • Real-time Data Active
             </p>
          </div>
        </div>

        {/* RIGHT: Live Activity & Inventory Leaders (1/4 Width) */}
        <div className="xl:col-span-1 border-l border-slate-100 pl-10 space-y-4">
          <SalesFeed sales={recentSales} />
          <TopProducts products={topProducts} />
        </div>
        
      </div>
    </div>
  )
}