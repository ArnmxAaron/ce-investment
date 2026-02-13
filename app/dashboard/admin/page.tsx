'use client'
import { useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { StatCard } from './components/StatCard'
import { DashboardHeader } from './components/DashboardHeader'
import { QuickActions } from './components/QuickActions'
import { RevenueChart } from './components/RevenueChart'
import { SalesFeed } from './components/SalesFeed'

export default function AdminHome() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const { stats, chartData, recentSales, notifications, setNotifications } = useAdminDashboard(selectedDate)

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8">
      <DashboardHeader 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        notifications={notifications} 
        setNotifications={setNotifications} 
      />

      <QuickActions />

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Live Inventory" value={stats.totalStockItems} type="stock" trend="+4%" />
        <StatCard label="Orders Today" value={stats.totalOrders} type="orders" trend="+18%" />
        <StatCard label="Revenue Today" value={`NLe ${stats.dailyIncome}`} type="income" trend="+12.5%" />
        <StatCard label="Stock Alerts" value={stats.outOfStockCount} type="warning" trend="Critical" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <div>
          <SalesFeed sales={recentSales} />
        </div>
      </div>
    </div>
  )
}