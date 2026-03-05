'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FiShoppingBag, FiHash, FiUser, FiTrash2, FiX, FiCheckCircle, FiPackage, FiAlertCircle } from 'react-icons/fi'

export default function NotificationsPage() {
  const [sales, setSales] = useState<any[]>([])
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ... (Supabase Realtime Logic same as before) ...

  return (
    <div className="flex h-[calc(100vh-140px)] -m-10"> {/* Negative margin to touch layout edges */}
      
      {/* LEFT: Live Feed */}
      <div className="w-[380px] flex flex-col border-r border-slate-200 bg-white">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Live Sales</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Feed Update: Live</p>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Clear all"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sales.map((sale) => (
            <button
              key={sale.id}
              onClick={() => setSelectedSale(sale)}
              className={`w-full p-6 border-b border-slate-50 transition-all relative ${
                selectedSale?.id === sale.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'
              }`}
            >
              {selectedSale?.id === sale.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
              )}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  #{sale.receipt_id || '9942'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="font-black text-slate-900 uppercase text-sm">Sale Processed</p>
              <p className="text-xs text-slate-500 font-medium">By {sale.staff_name || 'Staff Member'}</p>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Detail View (Clean Standard) */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
        {selectedSale ? (
          <div className="max-w-4xl p-12">
            <div className="flex justify-between items-start mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  <FiCheckCircle /> Verified Transaction
                </span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                  Details
                </h2>
                <p className="text-slate-400 mt-2 font-medium">Official receipt record for transaction {selectedSale.receipt_id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collected</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter">${selectedSale.total_amount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Processed By</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-xs">
                     {selectedSale.staff_name?.substring(0,2).toUpperCase() || 'ST'}
                  </div>
                  <p className="font-black text-slate-900 uppercase text-sm">{selectedSale.staff_name || 'System Staff'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reference ID</p>
                <p className="font-black text-slate-900 uppercase text-sm">{selectedSale.id}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-12">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <FiPackage /> Line Items
              </h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-4">Description</th>
                    <th className="pb-4 text-center">Qty</th>
                    <th className="pb-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {selectedSale.sale_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-5 font-bold text-slate-900">{item.product_name}</td>
                      <td className="py-5 text-center font-black text-slate-400">x{item.quantity}</td>
                      <td className="py-5 text-right font-black text-slate-900">${item.unit_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <FiShoppingBag size={80} strokeWidth={1} />
            <p className="mt-4 font-black uppercase tracking-widest text-xs">Waiting for selection</p>
          </div>
        )}
      </div>

      {/* UNIQUE IN-APP MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
              <FiAlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">Clear Logs?</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              Are you sure you want to clear the live sales feed? This will only remove them from this view, not from the permanent database.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setSales([]);
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 transition-all"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}