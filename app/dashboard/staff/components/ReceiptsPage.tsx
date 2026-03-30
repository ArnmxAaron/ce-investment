'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FiSearch, FiRefreshCw, FiPrinter, FiChevronRight 
} from 'react-icons/fi'
import { FaUserTie } from 'react-icons/fa' // Professional Human Icon

export const ReceiptsLog = () => {
  const [sales, setSales] = useState<any[]>([])
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const [searchName, setSearchName] = useState('')
  const [searchDate, setSearchDate] = useState('')

  useEffect(() => {
    fetchSales()
  }, [])

  async function fetchSales() {
    setIsRefreshing(true)
    const { data } = await supabase
      .from('sales') 
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) {
      setSales(data)
      if (data.length > 0) setSelectedSale(data[0])
    }
    setLoading(false)
    setIsRefreshing(false)
  }

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesName = sale.buyer_name?.toLowerCase().includes(searchName.toLowerCase())
      const matchesDate = searchDate ? new Date(sale.created_at).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true
      return matchesName && matchesDate
    })
  }, [sales, searchName, searchDate])

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-left">
      
      {/* SIDEBAR: RECEIPT LIST */}
      <div className="w-[350px] border-r border-slate-200 flex flex-col h-full bg-white shadow-lg z-10">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Sales Log</h2>
            <button 
              onClick={fetchSales}
              className={`p-2 rounded-lg bg-slate-50 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-400'}`}
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                placeholder="Buyer Name..."
                className="w-full bg-slate-50 border border-slate-200 p-2 pl-9 rounded-lg text-xs font-bold outline-none focus:border-blue-500"
                value={searchName} onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <input 
              type="date"
              className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs font-bold outline-none"
              value={searchDate} onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
          {filteredSales.map((sale) => (
            <button 
              key={sale.id}
              onClick={() => setSelectedSale(sale)}
              className={`w-full p-4 text-left rounded-xl transition-all flex items-center justify-between
                ${selectedSale?.id === sale.id ? 'bg-white shadow-md ring-2 ring-blue-500' : 'bg-white border border-slate-200'}
              `}
            >
              <div className="flex gap-3 items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedSale?.id === sale.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <FaUserTie size={16} />
                </div>
                <div className="truncate">
                  <p className="font-black text-[11px] uppercase truncate w-32">{sale.buyer_name || 'Walking Customer'}</p>
                  <p className="text-[10px] font-bold text-slate-400">{new Date(sale.created_at).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 text-[11px]">NLE {sale.total_amount?.toLocaleString()}</p>
                <FiChevronRight className="ml-auto text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL VIEW: THE PRINTABLE INVOICE */}
      <div className="flex-1 overflow-y-auto bg-slate-300 p-10 flex flex-col items-center">
        {selectedSale ? (
          <>
            <div className="w-full max-w-[800px] mb-6 flex justify-end print:hidden">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-lg font-black text-xs uppercase hover:bg-blue-600 transition-all shadow-xl"
              >
                <FiPrinter size={18} /> Print Record
              </button>
            </div>

            {/* START OF ACTUAL INVOICE DESIGN */}
            <div className="bg-white p-12 shadow-2xl w-full max-w-[800px] font-serif text-black receipt-print-area">
              
              {/* HEADER */}
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black uppercase tracking-tight">C & E INVESTMENT</h1>
                <p className="text-sm font-bold">Dealer in all types Building Materials</p>
                <p className="text-xs">558 Devil hole, Freetown Waterloo High Way</p>
                <p className="text-xs font-bold">Mobile: +232 78 827 220</p>
              </div>

              <div className="border-y-4 border-black py-2 mb-8 text-center">
                <h2 className="text-2xl font-black tracking-[0.4em] uppercase">PROFORMA / INVOICE</h2>
              </div>

              {/* BUYER INFO */}
              <div className="flex justify-between mb-8 text-sm">
                <div className="space-y-4 w-2/3">
                  <div className="flex gap-2 border-b-2 border-black pb-1">
                    <span className="font-black uppercase shrink-0">BUYER:</span>
                    <span className="uppercase">{selectedSale.buyer_name || 'WALKING CUSTOMER'}</span>
                  </div>
                  <div className="flex gap-2 border-b-2 border-black pb-1">
                    <span className="font-black uppercase shrink-0">ADDRESS:</span>
                    <span className="uppercase">{selectedSale.buyer_address || 'N/A'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg underline uppercase">
                    Date: {new Date(selectedSale.created_at).toLocaleDateString('en-GB')}
                  </p>
                  <p className="text-[10px] mt-1 font-mono text-slate-400">ID: #INV-{selectedSale.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* TABLE */}
              <table className="w-full border-collapse border-4 border-black">
                <thead>
                  <tr className="bg-white">
                    <th className="border-4 border-black p-2 text-center text-[10px] uppercase font-black w-16">QTY</th>
                    <th className="border-4 border-black p-2 text-left text-[10px] uppercase font-black">PRODUCT DESCRIPTION</th>
                    <th className="border-4 border-black p-2 text-right text-[10px] uppercase font-black w-32">UNIT PRICE</th>
                    <th className="border-4 border-black p-2 text-right text-[10px] uppercase font-black w-32">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items?.map((item: any, i: number) => (
                    <tr key={i} className="h-10">
                      <td className="border-4 border-black p-2 text-center font-black">{item.quantity}</td>
                      <td className="border-4 border-black p-2 font-black uppercase text-xs">{item.name}</td>
                      <td className="border-4 border-black p-2 text-right text-xs">NLe {item.price.toLocaleString()}</td>
                      <td className="border-4 border-black p-2 text-right font-black text-sm">NLe {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                  {/* Empty Rows Filler */}
                  {[...Array(Math.max(0, 12 - (selectedSale.items?.length || 0)))].map((_, i) => (
                    <tr key={i} className="h-10">
                      <td className="border-4 border-black p-2"></td>
                      <td className="border-4 border-black p-2"></td>
                      <td className="border-4 border-black p-2"></td>
                      <td className="border-4 border-black p-2"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="border-4 border-black p-3 text-right font-black uppercase text-sm">GRAND TOTAL</td>
                    <td className="border-4 border-black p-3 text-right font-black text-xl underline decoration-double">
                      NLe {selectedSale.total_amount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* SIGNATURES */}
              <div className="flex justify-between mt-24">
                <div className="w-60 border-t-2 border-black text-center pt-2">
                  <p className="text-[10px] font-black uppercase">CUSTOMER SIGNATURE</p>
                </div>
                <div className="w-72 border-t-2 border-black text-center pt-2">
                  <p className="text-[10px] font-black uppercase italic underline">FOR: C & E INVESTMENT (MANAGER)</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
             <FaUserTie size={80} className="mb-4" />
             <p className="uppercase font-black tracking-widest text-xs">Select a record</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-print-area, .receipt-print-area * { visibility: visible; }
          .receipt-print-area { 
            position: absolute; left: 0; top: 0; width: 100% !important; 
            padding: 0 !important; margin: 0 !important; box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}