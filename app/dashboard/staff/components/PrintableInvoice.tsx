'use client'
import { useState, useEffect } from 'react'
import { CartItem } from '@/hooks/useSalesLogic'

interface Props {
  cart: CartItem[];
  buyerName: string;
  buyerAddress: string;
  total: number;
  tempId: string;
}

export function PrintableInvoice({ cart, buyerName, buyerAddress, total, tempId }: Props) {
  // Fix for Hydration Error: Date must only render on client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div id="printable-invoice" className="hidden print:block p-10 bg-white text-black font-serif">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight">C & E INVESTMENT</h1>
        <p className="text-sm font-bold">Dealer in all types Building Materials</p>
        <p className="text-xs">558 Devil hole, Freetown Waterloo High Way</p>
        <p className="text-xs font-bold">Mobile: +232 78 827 220</p>
      </div>

      <div className="border-y-2 border-black py-2 my-6 text-center">
        <h2 className="text-xl font-black tracking-[0.3em] uppercase">PROFORMA / INVOICE</h2>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-dotted border-black pb-1">
            <span className="font-bold uppercase shrink-0">Buyer:</span>
            <span className="uppercase font-medium">{buyerName || "__________________________"}</span>
          </div>
          <div className="flex gap-2 border-b border-dotted border-black pb-1">
            <span className="font-bold uppercase shrink-0">Address:</span>
            <span className="uppercase font-medium">{buyerAddress || "__________________________"}</span>
          </div>
        </div>
        <div className="text-right">
          {/* Format date only after mounting to prevent mismatch */}
          <p className="font-bold text-base underline">
            Date: {mounted ? new Date().toLocaleDateString('en-GB') : ""}
          </p>
          <p className="text-[10px] mt-1 text-slate-500 font-mono italic">Valid for 7 days</p>
          <p className="text-[10px] text-slate-400 font-mono uppercase">ID: #TEMP-{tempId}</p>
        </div>
      </div>

      {/* Table Section */}
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr className="bg-slate-50 uppercase text-[10px]">
            <th className="border border-black p-2 w-16 text-center">Qty</th>
            <th className="border border-black p-2 text-left">Product Description</th>
            <th className="border border-black p-2 w-32 text-right">Unit Price</th>
            <th className="border border-black p-2 w-32 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={idx} className="h-10">
              <td className="border border-black p-2 text-center font-bold">{item.quantity}</td>
              <td className="border border-black p-2 uppercase text-xs font-bold">{item.name}</td>
              <td className="border border-black p-2 text-right">NLe {item.price.toLocaleString()}</td>
              <td className="border border-black p-2 text-right font-bold font-mono">
                NLe {(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
          {/* Fill empty rows to maintain layout height */}
          {[...Array(Math.max(0, 10 - cart.length))].map((_, i) => (
            <tr key={i} className="h-10"><td colSpan={4} className="border border-black"></td></tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border border-black p-3 text-right font-black uppercase">Grand Total</td>
            <td className="border border-black p-3 text-right font-black text-xl bg-slate-50 underline decoration-double">
              NLe {total.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Footer / Signature Section */}
      <div className="mt-24 flex justify-between items-end px-4">
        <div className="text-center w-48 border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold text-slate-400">Customer Signature</p>
        </div>
        <div className="text-center w-64 border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold underline italic">For: C & E INVESTMENT (Manager)</p>
        </div>
      </div>
    </div>
  )
}