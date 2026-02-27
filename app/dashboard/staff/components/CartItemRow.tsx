// app/dashboard/staff/components/CartItemRow.tsx
import { FiX } from 'react-icons/fi'

export function CartItemRow({ item }: any) {
  return (
    <div className="group relative mb-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-start">
          {/* Item Badge */}
          <div className="bg-[#0f172a] text-white text-[10px] font-black w-7 h-6 flex items-center justify-center rounded italic">
            {item.quantity}x
          </div>
          <div>
            <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
              {item.name}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              UNIT: NLE {item.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-1">
             {(item.price * item.quantity).toLocaleString()}
           </p>
           <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">AMOUNT</p>
        </div>
      </div>
      {/* Dashed line matching image */}
      <div className="mt-6 border-b border-dashed border-slate-100 w-full" />
    </div>
  )
}