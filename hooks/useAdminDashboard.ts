'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminDashboard(selectedDate: string) {
  const [stats, setStats] = useState({
    dailyIncome: 0,
    monthlySales: 0,
    totalOrders: 0,
    totalProducts: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    
    try {
      // 1. Get Date Ranges
      const now = new Date()
      const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // 2. Fetch Sales Data (Both for the day and for the month)
      const { data: monthSales } = await supabase
        .from('sales')
        .select('total_amount, created_at')
        .gte('created_at', firstDayMonth)

      // 3. Fetch Total Product Count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // 4. Calculate Stats from monthSales
      if (monthSales) {
        // Today's specific totals (resets every day based on selectedDate)
        const todaySales = monthSales.filter(s => s.created_at.startsWith(selectedDate))
        
        const todayIncome = todaySales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0)
        const monthlyTotal = monthSales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0)

        setStats({
          dailyIncome: todayIncome,
          monthlySales: monthlyTotal,
          totalOrders: todaySales.length,
          totalProducts: productCount || 0
        })

        // Format Chart Data (Last 7 distinct days)
        const groups = monthSales.reduce((acc: any, sale) => {
          const day = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' })
          acc[day] = (acc[day] || 0) + (Number(sale.total_amount) || 0)
          return acc
        }, {})
        
        setChartData(Object.keys(groups).map(key => ({ day: key, amount: groups[key] })))
      }

      // 5. Fetch Recent Sales Feed
      const { data: history } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

      // 6. Top Products (Low Stock Alerts)
      const { data: lowStockProducts } = await supabase
        .from('products')
        .select('*')
        .limit(5)

      setRecentSales(history || [])
      setTopProducts(lowStockProducts || [])

    } catch (err) {
      console.error("Dashboard Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Real-time: Refresh when any sale is added
    const channel = supabase
      .channel('admin-live-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, () => {
        setNotifications(prev => prev + 1)
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedDate])

  return { 
    stats, 
    chartData, 
    recentSales, 
    topProducts, 
    notifications, 
    setNotifications, 
    loading, 
    fetchData 
  }
}