'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SaleRecord {
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
    let query = supabase
      .from('sales')
      .select(`
        id,
        created_at,
        total_price,
        quantity,
        products (name),
        profiles (full_name)
      `)
      .order('created_at', { ascending: false })

    const { data, error } = await query
    if (!error) setSales((data as unknown as SaleRecord[]) || [])
    setLoading(false)
  }

  // Filter Logic
  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0]
    const matchesStart = startDate ? saleDate >= startDate : true
    const matchesEnd = endDate ? saleDate <= endDate : true
    return matchesSearch && matchesStart && matchesEnd
  })

  const totalFilteredAmount = filteredSales.reduce((acc, sale) => acc + Number(sale.total_price), 0)

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-white text-3xl font-black uppercase tracking-tight">Sales Audit & Receipts</h1>
        <p className="text-slate-500 italic">Search and verify every transaction in NLe</p>
      </header>

      {/* FILTERS SECTION */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-slate-500 text-[10px] font-black uppercase mb-2 block">Search Material</label>
          <input 
            type="text" 
            placeholder="e.g. Cement, Tiles..." 
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="text-slate-500 text-[10px] font-black uppercase mb-2 block">From Date</label>
          <input 
            type="date" 
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-slate-500 text-[10px] font-black uppercase mb-2 block">To Date</label>
          <input 
            type="date" 
            className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="bg-blue-600 p-3 rounded-xl text-center">
          <p className="text-[10px] font-black text-blue-100 uppercase">Total for Period</p>
          <p className="text-white font-black text-lg">NLe {totalFilteredAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-black">
            <tr>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Material</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Staff Member</th>
              <th className="p-4 text-right">Receipt Total</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center animate-pulse">Retrieving Ledger...</td></tr>
            ) : filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-xs">
                    {new Date(sale.created_at).toLocaleDateString()} <br/>
                    <span className="text-slate-500">{new Date(sale.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-4 font-bold text-white uppercase">{sale.products?.name}</td>
                  <td className="p-4">{sale.quantity}</td>
                  <td className="p-4 text-sm text-slate-400">{sale.profiles?.full_name}</td>
                  <td className="p-4 text-right font-black text-blue-400">NLe {sale.total_price.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="p-10 text-center text-slate-500">No records found for this period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}