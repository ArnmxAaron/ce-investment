'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FiClock, 
  FiArrowRight, 
  FiActivity, 
  FiChevronDown, 
  FiChevronUp, 
  FiBox, 
  FiHash,
  FiTrendingUp
} from 'react-icons/fi'

interface SaleItem {
  name: string
  quantity: number
  price: number
  variant?: string
}

interface SaleRecord {
  id: string
  created_at: string
  buyer_name: string
  total_amount: number
  items: SaleItem[]
}

interface GroupedSales {
  dateKey: string
  dateDisplay: string 
  dayOnly: string    
  monthYear: string  
  sales: SaleRecord[]
  dayTotal: number
}

export const SalesHistory = () => {
  const [groupedData, setGroupedData] = useState<GroupedSales[]>([])
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null)

  const processSalesData = useCallback((data: SaleRecord[]) => {
    const groups: { [key: string]: GroupedSales } = {}

    data.forEach((sale) => {
      const dateObj = new Date(sale.created_at)
      const dateKey = dateObj.toLocaleDateString('en-GB')

      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateKey,
          dateDisplay: dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          dayOnly: dateObj.toLocaleDateString('en-GB', { day: 'numeric' }),
          monthYear: dateObj.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          sales: [],
          dayTotal: 0
        }
      }
      groups[dateKey].sales.push(sale)
      groups[dateKey].dayTotal += parseFloat(sale.total_amount.toString())
    })
    
    return Object.values(groups).sort((a, b) => 
      new Date(b.sales[0].created_at).getTime() - new Date(a.sales[0].created_at).getTime()
    )
  }, [])

  const fetchHistory = useCallback(async () => {
    const { data } = await supabase
      .from('receipts')
      .select('id, created_at, buyer_name, total_amount, items')
      .order('created_at', { ascending: false })

    if (data) {
      setGroupedData(processSalesData(data as SaleRecord[]))
    }
    setLoading(false)
  }, [processSalesData])

  useEffect(() => {
    fetchHistory()
    const channel = supabase
      .channel('history-live-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'receipts' }, () => fetchHistory())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchHistory])

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Financial Ledger</p>
    </div>
  )

  const activeGroup = groupedData[selectedDateIndex]

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-900">
      
      {/* LEFT SIDE: DATE SELECTOR */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase">History</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {groupedData.map((group, index) => (
            <button
              key={group.dateKey}
              onClick={() => { setSelectedDateIndex(index); setExpandedSaleId(null); }}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                selectedDateIndex === index 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 translate-x-2' 
                : 'hover:bg-slate-50 text-slate-400 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black tracking-tighter leading-none">{group.dayOnly}</span>
                <FiArrowRight className={`transition-transform ${selectedDateIndex === index ? 'opacity-100 scale-110' : 'opacity-0'}`} />
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-black uppercase tracking-tighter block opacity-60">{group.monthYear}</span>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${selectedDateIndex === index ? 'bg-white/20' : 'bg-slate-100'}`}>
                    {group.sales.length} TXNS
                  </span>
                  <span className="font-bold text-xs">NLE {group.dayTotal.toLocaleString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: TABLE */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeGroup ? (
          <>
            <div className="p-10 flex justify-between items-center bg-white border-b border-slate-100 shadow-sm z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-600">
                  <FiTrendingUp size={14} />
                  <span className="font-black text-[10px] uppercase tracking-[0.4em]">Settlement Report</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">{activeGroup.dateDisplay}</h1>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Revenue</p>
                  <p className="text-3xl font-black tracking-tighter leading-none">
                    <span className="text-sm text-blue-500 mr-2">NLE</span>
                    {activeGroup.dayTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-50/50 border-b border-slate-100">
                      <th className="p-6">Time</th>
                      <th className="p-6">Customer / Client</th>
                      <th className="p-6 text-center">Reference</th>
                      <th className="p-6 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {activeGroup.sales.map((sale) => (
                      <React.Fragment key={sale.id}>
                        <tr 
                          onClick={() => setExpandedSaleId(expandedSaleId === sale.id ? null : sale.id)}
                          className={`group cursor-pointer transition-all duration-200 ${expandedSaleId === sale.id ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-3 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                              <FiClock size={12} />
                              {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="font-black text-sm uppercase tracking-tight text-slate-800">{sale.buyer_name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Registered Transaction</span>
                            </div>
                          </td>
                          <td className="p-6 text-center">
                             <span className="inline-flex items-center gap-2 bg-white border border-slate-100 text-[10px] font-black px-3 py-1.5 rounded-full text-slate-600 shadow-sm">
                                <FiHash size={10} className="text-blue-500" />
                                {sale.id.slice(0, 8).toUpperCase()}
                             </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-black text-lg tracking-tighter text-slate-900">
                                {sale.total_amount.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1">
                                {expandedSaleId === sale.id ? <FiChevronUp className="text-blue-500" /> : <FiChevronDown className="text-slate-300" />}
                                <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Details</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        
                        {expandedSaleId === sale.id && (
                          <tr className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <td colSpan={4} className="p-6 bg-slate-50/80 border-y border-slate-100">
                              <div className="max-w-3xl mx-auto space-y-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FiBox className="text-blue-500" /> Itemized Cargo Load-list
                                  </p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Generated TRX Log</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {sale.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm hover:border-blue-200 transition-colors">
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                          <FiBox size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-xs font-black uppercase text-slate-800">{item.name}</span>
                                          <span className="text-[9px] font-bold text-blue-500 uppercase">{item.variant || 'Standard Unit'}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-12">
                                        <div className="text-right">
                                          <p className="text-[8px] font-bold text-slate-400 uppercase">Quantity</p>
                                          <p className="text-xs font-black">x{item.quantity}</p>
                                        </div>
                                        <div className="text-right min-w-20">
                                          <p className="text-[8px] font-bold text-slate-400 uppercase">Subtotal</p>
                                          <p className="text-xs font-black text-blue-600">{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <FiActivity size={60} className="mb-4 opacity-20" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-40">Financial Records Empty</p>
          </div>
        )}
      </main>
    </div>
  )
}