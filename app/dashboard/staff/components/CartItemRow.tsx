'use client'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'
import { CartItem } from '@/hooks/useSalesLogic'

interface CartItemProps {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="group relative p-6 border-b border-dashed border-slate-100 last:border-0 hover:bg-slate-50 transition-all animate-in fade-in slide-in-from-right-4">
      <div className="flex justify-between items-start">
        
        {/* Left Side: Quantity Controls and Item Info */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-center gap-2">
            {/* Quantity Badge */}
            <div className="bg-slate-900 text-white text-[10px] font-black w-10 h-8 flex items-center justify-center rounded italic shadow-lg">
              {item.quantity}x
            </div>
            
            {/* Step Controls - visible on hover */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => onIncrease(item.id)}
                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded border border-blue-100 transition-colors"
                title="Increase Quantity"
               >
                 <FiPlus size={12} />
               </button>
               <button 
                onClick={() => onDecrease(item.id)}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded border border-red-100 transition-colors"
                title="Decrease Quantity"
               >
                 <FiMinus size={12} />
               </button>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-none">
                {item.name}
              </h4>
              <button 
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-600 p-1"
                title="Remove Item"
              >
                <FiX size={16} />
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              UNIT: NLE {item.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Side: Total Calculation */}
        <div className="text-right pt-1">
           <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">
             {(item.price * item.quantity).toLocaleString()}
           </p>
           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
             Subtotal
           </p>
        </div>
      </div>
    </div>
  )
}