'use client'
import { useState } from 'react'
import { CartItemRow } from './CartItemRow'
import { FiPrinter, FiUser, FiMapPin, FiTrash2 } from 'react-icons/fi'
import { CartItem } from '@/hooks/useSalesLogic'

interface Props {
  cart: CartItem[];
  total: number;
  onEditItem: (item: CartItem) => void;
  onClearCart: () => void;
  onCheckout: (buyerInfo: { name: string; address: string }) => void;
}

export function Cart({ cart, total, onEditItem, onClearCart, onCheckout }: Props) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-hidden">
      {/* HEADER */}
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">C & E Investment</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Proforma / Invoice System</p>
          </div>
          <button 
            onClick={onClearCart} 
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear All"
          >
            <FiTrash2 size={18} />
          </button>
        </div>

        {/* BUYER INFO INPUTS */}
        <div className="space-y-2 mt-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
            <input 
              placeholder="BUYER'S NAME" 
              className="w-full bg-white/10 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:bg-white/20 transition-all placeholder:text-slate-500"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
            <input 
              placeholder="ADDRESS" 
              className="w-full bg-white/10 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold uppercase outline-none focus:bg-white/20 transition-all placeholder:text-slate-500"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-20">
            <div className="w-16 h-16 border-4 border-dashed border-slate-300 rounded-full mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cart is Empty</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {cart.map((item) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                // We pass the logic required by CartItemRow's props
                onIncrease={() => onEditItem({ ...item, quantity: item.quantity + 1 })}
                onDecrease={() => onEditItem({ ...item, quantity: Math.max(1, item.quantity - 1) })}
                onRemove={() => onEditItem({ ...item, quantity: 0 })} // Setting qty to 0 usually triggers removal in useSalesLogic
              />
            ))}
          </div>
        )}
      </div>

      {/* FOOTER / TOTALS */}
      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex justify-between items-end mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
          <div className="text-right">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Sierra Leone Leones</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">
              NLe {total.toLocaleString()}
            </p>
          </div>
        </div>

        <button 
          onClick={() => onCheckout({ name: buyerName, address: buyerAddress })}
          disabled={cart.length === 0}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none disabled:text-slate-400"
        >
          <FiPrinter size={18} /> Print Proforma
        </button>
      </div>
    </div>
  );
}