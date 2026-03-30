'use client'
import { useState } from 'react'
import { FiActivity, FiUser, FiPackage, FiX, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export function SalesFeed({ sales }: { sales: any[] }) {
  const [selectedSale, setSelectedSale] = useState<any | null>(null)
  const maxSale = sales.length > 0 ? Math.max(...sales.map(s => s.total_amount || 0)) : 1;

  return (
    <div className="bg-slate-950 rounded-[2rem] p-5 text-white shadow-2xl border border-slate-800 flex flex-col w-[320px] h-[580px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-black text-slate-500 uppercase tracking-[0.2em] text-[7px]">Daily Feed</h3>
        </div>
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
          {sales.length} Active
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="space-y-2 overflow-y-auto no-scrollbar flex-1 pr-0.5">
        {sales.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
            <FiActivity size={20} />
            <p className="text-[8px] font-black uppercase tracking-widest mt-2 text-center">System Idle<br/>Waiting for Sale</p>
          </div>
        ) : (
          sales.map((sale) => {
            const itemCount = sale.items?.length || 0;
            const barWidth = ((sale.total_amount || 0) / maxSale) * 100;

            return (
              <button 
                key={sale.id} 
                onClick={() => setSelectedSale(sale)}
                className="w-full text-left group relative bg-white/[0.03] p-3.5 rounded-[1.5rem] hover:bg-white/[0.07] transition-all border border-transparent hover:border-slate-700"
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 group-hover:border-blue-500 transition-colors">
                      <FiUser className="text-slate-600 group-hover:text-blue-400" size={12} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white uppercase tracking-tight truncate w-20 leading-none mb-1">
                        {sale.buyer_name || "Customer"}
                      </p>
                      <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <FiPackage size={7} className="text-blue-600" /> {itemCount} Items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-white text-[13px] tracking-tighter leading-none mb-0.5">
                      {Number(sale.total_amount).toLocaleString()}
                    </p>
                    <p className="text-[6px] text-blue-500 font-black uppercase tracking-[0.1em] opacity-80 italic">NLe</p>
                  </div>
                </div>
                <div className="mt-2.5 w-full h-[1px] bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${barWidth}%` }} />
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* --- POP-UP MODAL WITH DATE/TIME --- */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Dark Header with Timestamp */}
              <div className="bg-slate-950 p-6 text-white relative">
                <button onClick={() => setSelectedSale(null)} className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors">
                  <FiX size={18} />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500/10 p-2 rounded-xl">
                    <FiCheckCircle className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] leading-none mb-1">Verified Transaction</p>
                    <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">{selectedSale.buyer_name}</h2>
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="flex items-center gap-4 border-t border-slate-800 pt-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-slate-500" size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                      {new Date(selectedSale.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-slate-500" size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
                      {new Date(selectedSale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 space-y-3 max-h-[250px] overflow-y-auto no-scrollbar">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 mb-2">Purchase Summary</p>
                {selectedSale.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-slate-950 uppercase leading-none mb-1">{item.name}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-950 tracking-tight">NLe {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="p-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                  <p className="text-xl font-black text-slate-950 italic tracking-tighter">
                    NLe {Number(selectedSale.total_amount).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSale(null)} 
                  className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.1em] hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Exit Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}