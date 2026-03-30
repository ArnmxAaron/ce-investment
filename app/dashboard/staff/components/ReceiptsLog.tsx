'use client'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FiSearch, FiRefreshCw, FiChevronRight, 
  FiPrinter, FiClock, FiMapPin
} from 'react-icons/fi'
import { FaUserTie, FaFileInvoiceDollar } from 'react-icons/fa'

export const ReceiptsLog = () => {
  const [sales, setSales] = useState<any[]>([])
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Single search state for Name or ID
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchSales()
  }, [])

  async function fetchSales() {
    setIsRefreshing(true)
    const { data, error } = await supabase
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

  // UPDATED: Search matches Name OR the last 6 digits of the ID (No: #XXXXXX)
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const cleanSearch = searchTerm.toLowerCase().replace('#', '')
      const receiptId = sale.id.slice(-6).toLowerCase()
      const buyerName = (sale.buyer_name || '').toLowerCase()
      
      return buyerName.includes(cleanSearch) || receiptId.includes(cleanSearch)
    })
  }, [sales, searchTerm])

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Ledger...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-left">
      
      {/* LEFT: THE LEDGER LIST */}
      <div className="w-[400px] border-r border-slate-200 flex flex-col h-full bg-white relative z-10 shadow-xl no-print">
        <div className="p-8 border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Records</h2>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">C&E Investment Portfolio</span>
            </div>
            <button onClick={fetchSales} className={`p-2.5 rounded-xl bg-slate-50 transition-all ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}>
              <FiRefreshCw size={18} />
            </button>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              placeholder="Search Name or ID (e.g. #850CBE)"
              className="w-full bg-slate-50 border border-slate-100 p-3 pl-11 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
          {filteredSales.map((sale) => (
            <button 
              key={sale.id}
              onClick={() => setSelectedSale(sale)}
              className={`w-full p-5 text-left rounded-2xl transition-all flex justify-between items-center group relative
                ${selectedSale?.id === sale.id ? 'bg-white shadow-lg border-l-4 border-blue-600' : 'bg-transparent hover:bg-white/60 border-l-4 border-transparent'}
              `}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${selectedSale?.id === sale.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-500'}`}>
                  <FaUserTie size={16} />
                </div>
                <div className="max-w-[160px]">
                  <p className={`font-black text-[11px] uppercase truncate ${selectedSale?.id === sale.id ? 'text-blue-600' : 'text-slate-900'}`}>
                    {sale.buyer_name || 'Walking Customer'}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                    No: #{sale.id.slice(-6).toUpperCase()} • {new Date(sale.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 text-xs italic">NLE {sale.total_amount?.toLocaleString()}</p>
                <FiChevronRight className={`ml-auto mt-2 ${selectedSale?.id === sale.id ? 'text-blue-600 translate-x-1' : 'text-slate-200'}`} />
              </div>
            </button>
          ))}
          {filteredSales.length === 0 && (
            <div className="text-center py-10 opacity-30">
              <p className="text-[10px] font-black uppercase">No records found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: THE RECEIPT AREA */}
      <div className="flex-1 overflow-y-auto bg-[#F1F5F9] p-8 custom-scrollbar">
        {selectedSale ? (
          <div className="max-w-3xl mx-auto">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 no-print">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified Ledger Entry</span>
               <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-3 px-8 py-4 bg-[#0f172a] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl"
               >
                  <FiPrinter size={16} /> Print Official Invoice
               </button>
            </div>

            {/* RECEIPT DESIGN */}
            <div className="receipt-print-area bg-white p-10 text-black font-serif relative border border-slate-200">
              
              {/* WATERMARK WITH ID */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.04] select-none z-0">
                <div className="border-[12px] border-black p-8 -rotate-45 flex flex-col items-center">
                    <h1 className="text-[120px] font-black uppercase leading-none">ORIGINAL</h1>
                    <p className="text-[30px] font-black tracking-[0.5em] mt-2 italic">#{selectedSale.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              {/* Header Section */}
              <div className="text-center mb-4 relative z-10">
                <h1 className="text-5xl font-black uppercase tracking-tight mb-1">C & E INVESTMENT</h1>
                <p className="text-sm font-bold italic">Dealer in all types Building Materials</p>
                <p className="text-xs">558 Devil hole, Freetown Waterloo High Way</p>
                <p className="text-xs font-bold">Mobile: +232 78 827 220</p>
              </div>

              <div className="border-y-4 border-black py-2 my-4 text-center relative z-10">
                <h2 className="text-2xl font-black tracking-[0.5em] uppercase">OFFICIAL INVOICE</h2>
              </div>

              {/* Buyer Info */}
              <div className="grid grid-cols-2 gap-10 mb-4 text-sm relative z-10">
                <div className="space-y-4">
                  <div className="flex gap-2 border-b-2 border-dotted border-black pb-1">
                    <span className="font-black uppercase shrink-0">Buyer:</span>
                    <span className="uppercase font-bold text-base">{selectedSale.buyer_name || "WALKING CUSTOMER"}</span>
                  </div>
                  <div className="flex gap-2 border-b-2 border-dotted border-black pb-1">
                    <span className="font-black uppercase shrink-0">Address:</span>
                    <span className="uppercase font-bold text-base">{selectedSale.buyer_address || "N/A"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl underline decoration-2 underline-offset-8">
                    Date: {mounted ? new Date(selectedSale.created_at).toLocaleDateString('en-GB') : ""}
                  </p>
                  <p className="text-[11px] mt-6 text-black font-black uppercase tracking-widest border-2 border-black inline-block px-3 py-1">
                    No: #{selectedSale.id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border-2 border-black text-sm relative z-10">
                <thead>
                  <tr className="uppercase text-[11px] font-black bg-slate-50">
                    <th className="border-2 border-black p-2 w-16 text-center">Qty</th>
                    <th className="border-2 border-black p-2 text-left">Product Description</th>
                    <th className="border-2 border-black p-2 w-32 text-right">Price</th>
                    <th className="border-2 border-black p-2 w-36 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="h-10">
                      <td className="border-2 border-black p-2 text-center font-black text-lg">{item.quantity}</td>
                      <td className="border-2 border-black p-2 uppercase font-black text-sm">{item.name}</td>
                      <td className="border-2 border-black p-2 text-right">NLe {item.price?.toLocaleString()}</td>
                      <td className="border-2 border-black p-2 text-right font-black text-lg">
                        NLe {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {[...Array(Math.max(0, 8 - (selectedSale.items?.length || 0)))].map((_, i) => (
                    <tr key={i} className="h-10">
                      <td className="border-2 border-black"></td>
                      <td className="border-2 border-black"></td>
                      <td className="border-2 border-black"></td>
                      <td className="border-2 border-black"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50">
                    <td colSpan={3} className="border-2 border-black p-3 text-right font-black uppercase text-lg">Total Amount Paid</td>
                    <td className="border-2 border-black p-3 text-right font-black text-2xl underline decoration-double">
                      NLe {selectedSale.total_amount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Signature Row */}
              <div className="mt-12 flex justify-between items-end px-4 relative z-10 break-inside-avoid">
                <div className="text-center w-56 border-t-2 border-black pt-2">
                  <p className="text-[10px] uppercase font-black tracking-tighter">Customer Signature</p>
                </div>
                
                <div className="flex flex-col items-center">
                   <div className="w-20 h-20 border-4 border-double border-black rounded-full flex items-center justify-center -rotate-12 mb-1 opacity-50">
                      <div className="text-center">
                        <p className="text-[8px] font-black uppercase leading-none">C&E</p>
                        <p className="text-[10px] font-black uppercase py-1 border-y border-black my-1 italic">PAID</p>
                        <p className="text-[7px] font-bold uppercase leading-none">Official</p>
                      </div>
                   </div>
                </div>

                <div className="text-center w-72 border-t-2 border-black pt-2">
                  <p className="text-[10px] uppercase font-black italic underline decoration-1">For: C & E INVESTMENT (Manager)</p>
                </div>
              </div>

              <div className="mt-8 text-center opacity-40 relative z-10">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Computer Generated Invoice • No Refunds Without Receipt</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-30">
             <FaFileInvoiceDollar size={60} className="mb-4" />
             <p className="font-black uppercase tracking-widest text-[10px]">Select Record</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          .receipt-print-area, .receipt-print-area * { visibility: visible; }
          .receipt-print-area { position: absolute; left: 0; top: 0; width: 100% !important; border: none !important; padding: 10mm !important; }
          .break-inside-avoid { break-inside: avoid; }
          * { -webkit-print-color-adjust: exact; color-adjust: exact; }
          @page { size: A4 portrait; margin: 10mm; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  )
}