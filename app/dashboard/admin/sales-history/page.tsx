'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SalesHeader } from './components/SalesHeader'
import { SalesFilters } from './components/SalesFilters'
import { SalesTable } from './components/SalesTable'

export interface SaleRecord {
  id: string
  created_at: string
  total_price: number
  quantity: number
  products: { name: string }
  profiles: { full_name: string }
}

export default function SalesHistory() {
  const [sales, setSales] = useState<SaleRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSales()
  }, [])

  async function fetchSales() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sales')
      .select(`
        id, created_at, total_price, quantity,
        products (name),
        profiles (full_name)
      `)
      .order('created_at', { ascending: false })

    if (!error) setSales((data as unknown as SaleRecord[]) || [])
    setLoading(false)
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0]
    const matchesStart = startDate ? saleDate >= startDate : true
    const matchesEnd = endDate ? saleDate <= endDate : true
    return matchesSearch && matchesStart && matchesEnd
  })

  return (
    <div className="space-y-8">
      <SalesHeader sales={filteredSales} />
      
      <SalesFilters 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        total={filteredSales.reduce((acc, s) => acc + Number(s.total_price), 0)}
      />

      <SalesTable sales={filteredSales} loading={loading} />
    </div>
  )
}