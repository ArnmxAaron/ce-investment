// app/dashboard/staff/components/CartItemRow.tsx
'use client'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'

interface CartItemProps {
  item: any;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="group relative mb-8 animate-in fade-in slide-in-from-right-4 transition-all">
      <div className="flex justify-between items-start">
        
        {/* Left Side: Info and Controls */}
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-center gap-1">
             {/* Dynamic Item Badge */}
            <div className="bg-[#0f172a] text-white text-[10px] font-black w-8 h-7 flex items-center justify-center rounded italic shadow-lg">
              {item.quantity}x
            </div>
            
            {/* Quick Quantity Toggles */}
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => onIncrease(item.id)}
                className="p-1 hover:bg-blue-50 text-blue-600 rounded border border-blue-100"
               >
                 <FiPlus size={10} />
               </button>
               <button 
                onClick={() => onDecrease(item.id)}
                className="p-1 hover:bg-red-50 text-red-600 rounded border border-red-100"
               >
                 <FiMinus size={10} />
               </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                {item.name}
              </h4>
              {/* Delete Button - only visible on hover */}
              <button 
                onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
              >
                <FiX size={14} />
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              UNIT: NLE {item.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Side: Calculation */}
        <div className="text-right">
           <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">
             {(item.price * item.quantity).toLocaleString()}
           </p>
           <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">AMOUNT</p>
        </div>
      </div>

      {/* Dashed line */}
      <div className="mt-6 border-b border-dashed border-slate-100 w-full" />
    </div>
  )
}