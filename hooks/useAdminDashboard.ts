'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminDashboard(selectedDate: string) {
  const [stats, setStats] = useState({
    dailyIncome: 0,
    totalOrders: 0,
    totalStockItems: 0,
    outOfStockCount: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([]) // FIXED: Added missing state
  const [notifications, setNotifications] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    
    // 1. Total Stock
    const { data: products } = await supabase.from('products').select('stock_qty, name, id')
    const totalStock = products?.reduce((acc, p) => acc + Number(p.stock_qty), 0) || 0
    const outOfStock = products?.filter(p => p.stock_qty <= 0).length || 0

    // 2. Sales for Selected Date
    const { data: salesToday } = await supabase
      .from('sales')
      .select('total_price, created_at')
      .gte('created_at', `${selectedDate}T00:00:00`)
      .lte('created_at', `${selectedDate}T23:59:59`)

    const income = salesToday?.reduce((acc, s) => acc + Number(s.total_price), 0) || 0

    // 3. Chart Data (Last 7 Days)
    const { data: weeklySales } = await supabase
      .from('sales')
      .select('total_price, created_at')
      .order('created_at', { ascending: true })

    const groups = weeklySales?.reduce((acc: any, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' })
      acc[date] = (acc[date] || 0) + Number(sale.total_price)
      return acc
    }, {})
    
    const formattedChart = Object.keys(groups || {}).map(key => ({ day: key, amount: groups[key] }))

    // 4. Recent Sales
    const { data: history } = await supabase
      .from('sales')
      .select('*, products(name), profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(8)

    // 5. Top Products Logic (FIXED: Added this to satisfy the Admin Page)
    // Here we fetch products with the lowest stock to show on the dashboard
    const { data: topData } = await supabase
      .from('products')
      .select('*')
      .order('stock_qty', { ascending: true })
      .limit(5)
    
    setStats({
      dailyIncome: income,
      totalOrders: salesToday?.length || 0,
      totalStockItems: totalStock,
      outOfStockCount: outOfStock
    })
    setChartData(formattedChart)
    setRecentSales(history || [])
    setTopProducts(topData || []) // FIXED: Setting the top products state
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // REAL-TIME NOTIFICATION LOGIC
    const channel = supabase
      .channel('realtime-sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, (payload) => {
        setNotifications(prev => prev + 1)
        fetchData() // Refresh data when a sale happens
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedDate])

  // FIXED: Added topProducts to the return object
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