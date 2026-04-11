'use client'
import { useState, useEffect, useCallback } from 'react'
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

  const fetchData = useCallback(async () => {
    try {
      const now = new Date()
      const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // 1. Fetch Receipts (Replacing 'sales')
      const { data: monthReceipts } = await supabase
        .from('receipts')
        .select('total_amount, created_at, buyer_name')
        .gte('created_at', firstDayMonth)

      // 2. Fetch All Products with Variants for proper stock calculation
      const { data: allProducts, count: productCount } = await supabase
        .from('products')
        .select('*, variants(*)')

      // 3. Process Receipt Stats
      if (monthReceipts) {
        const todayReceipts = monthReceipts.filter(r => r.created_at.startsWith(selectedDate))
        
        const todayIncome = todayReceipts.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0)
        const monthlyTotal = monthReceipts.reduce((acc, r) => acc + (Number(r.total_amount) || 0), 0)

        setStats(prev => ({
          ...prev,
          dailyIncome: todayIncome,
          monthlySales: monthlyTotal,
          totalOrders: todayReceipts.length,
          totalProducts: productCount || 0
        }))

        // Chart Data (Last 7 days)
        const groups = monthReceipts.reduce((acc: any, r) => {
          const day = new Date(r.created_at).toLocaleDateString('en-US', { weekday: 'short' })
          acc[day] = (acc[day] || 0) + (Number(r.total_amount) || 0)
          return acc
        }, {})
        
        setChartData(Object.keys(groups).map(key => ({ day: key, amount: groups[key] })))
      }

      // 4. Fetch Recent Sales Feed (From receipts)
      const { data: history } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

      // 5. Process Top Products / Low Stock (Summing Variants)
      if (allProducts) {
        const processedProducts = allProducts.map(p => {
          const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
          return {
            ...p,
            totalStock,
            variant_count: p.variants?.length || 0
          }
        })

        // Filter for "Low Stock Alerts" - items with less than 10 total units
        const lowStock = processedProducts
          .filter(p => p.totalStock < 10)
          .sort((a, b) => a.totalStock - b.totalStock)
          .slice(0, 5)

        setTopProducts(lowStock)
      }

      setRecentSales(history || [])

    } catch (err) {
      console.error("Dashboard Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    setLoading(true)
    fetchData()

    // --- REAL-TIME SYNC ENGINE ---
    const channel = supabase
      .channel('admin-live-updates')
      // Listen for receipts (Revenue updates)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'receipts' 
      }, () => {
        setNotifications(prev => prev + 1)
        fetchData()
      })
      // Listen for products or variants (Stock updates)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'variants' 
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [selectedDate, fetchData])

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