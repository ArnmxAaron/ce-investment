'use client'
import { FiUser, FiArrowUpRight, FiPrinter } from 'react-icons/fi'
import { SaleRecord } from '../page'

export function SalesTable({ sales, loading }: { sales: SaleRecord[], loading: boolean }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Reference</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed By</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] animate-pulse">Syncing...</td></tr>
          ) : sales.map((sale) => (
            <tr key={sale.id} className="group hover:bg-blue-50/30 transition-all">
              <td className="px-8 py-5">
                <p className="text-xs font-black text-slate-900 leading-none mb-1">{new Date(sale.created_at).toLocaleDateString()}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {sale.id.slice(0, 8)}</p>
              </td>
              <td className="px-8 py-5">
                <p className="text-xs font-black text-slate-800 uppercase">{sale.products?.name}</p>
              </td>
              <td className="px-8 py-5 text-center">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600">{sale.quantity}</span>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><FiUser size={10}/></div>
                  <span className="text-[11px] font-bold text-slate-600 italic">{sale.profiles?.full_name}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 leading-none">NLe {sale.total_price.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1">Cleared <FiArrowUpRight/></p>
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <FiPrinter size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}