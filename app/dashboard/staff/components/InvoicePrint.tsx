'use client'
import { CartItem } from '@/hooks/useSalesLogic'

interface Props {
  cart: CartItem[];
  buyerName: string;
  buyerAddress: string;
  total: number;
}

export function InvoicePrint({ cart, buyerName, buyerAddress, total }: Props) {
  return (
    <div 
      id="printable-invoice" 
      className="hidden print:block p-10 bg-white text-black font-serif"
    >
      {/* HEADER: C & E INVESTMENT */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">C & E investment</h1>
        <p className="text-sm font-bold italic">Dealer in all types Building Materials</p>
        <p className="text-sm">558 Devil hole, Freetown Waterloo High Way</p>
        <p className="text-sm font-bold">Mobile: +23278827 220</p>
      </div>

      <div className="border-y-4 border-black py-2 mb-8 text-center">
        <h2 className="text-xl font-black tracking-[0.4em] uppercase">Proforma / Invoice</h2>
      </div>

      {/* BUYER SECTION */}
      <div className="flex justify-between mb-10 text-sm">
        <div className="space-y-4 w-2/3">
          <div className="flex gap-2 border-b border-black">
            <span className="font-black uppercase">Buyer's Name:</span>
            <span>{buyerName || '__________________________'}</span>
          </div>
          <div className="flex gap-2 border-b border-black">
            <span className="font-black uppercase">Address:</span>
            <span>{buyerAddress || '__________________________'}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold uppercase underline">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full border-collapse border-2 border-black mb-10">
        <thead>
          <tr className="bg-slate-100">
            <th className="border-2 border-black p-2 text-center text-xs uppercase">Qty</th>
            <th className="border-2 border-black p-2 text-left text-xs uppercase">Item Description</th>
            <th className="border-2 border-black p-2 text-right text-xs uppercase">Price</th>
            <th className="border-2 border-black p-2 text-right text-xs uppercase">Amount</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, i) => (
            <tr key={i} className="h-10">
              <td className="border-2 border-black p-2 text-center font-bold">{item.quantity}</td>
              <td className="border-2 border-black p-2 font-bold uppercase">{item.name}</td>
              <td className="border-2 border-black p-2 text-right">NLe {item.price.toLocaleString()}</td>
              <td className="border-2 border-black p-2 text-right font-black">NLe {(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
          {/* Fill remaining space with empty rows */}
          {[...Array(Math.max(0, 10 - cart.length))].map((_, i) => (
            <tr key={i} className="h-10">
              <td className="border-2 border-black p-2"></td>
              <td className="border-2 border-black p-2"></td>
              <td className="border-2 border-black p-2"></td>
              <td className="border-2 border-black p-2"></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="border-2 border-black p-3 text-right font-black uppercase bg-slate-50">Grand Total</td>
            <td className="border-2 border-black p-3 text-right font-black text-xl">NLe {total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {/* SIGNATURES */}
      <div className="flex justify-between mt-20 pt-10">
        <div className="w-64 border-t-2 border-black text-center pt-2">
          <p className="text-[10px] font-black uppercase">Customer's Signature</p>
        </div>
        <div className="w-64 border-t-2 border-black text-center pt-2">
          <p className="text-[10px] font-black uppercase italic underline">For: C & E Investment (Manager)</p>
        </div>
      </div>
    </div>
  )
}