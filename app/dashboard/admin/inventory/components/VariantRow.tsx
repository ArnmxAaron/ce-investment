'use client'
import { FiAlertCircle, FiMinusCircle } from 'react-icons/fi'

// Added onRemove and showRemove to the props
export const VariantRow = ({ v, onUpdate, onRemove, showRemove }: any) => (
  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm relative group">
    
    {/* --- THE MINUS BUTTON --- */}
    {showRemove && (
      <button 
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 text-rose-500 bg-white rounded-full shadow-md hover:text-rose-700 transition-all active:scale-90 z-10"
        title="Remove Variant"
      >
        <FiMinusCircle size={20} />
      </button>
    )}

    <div className="flex justify-between items-center mb-1 pr-2">
      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate max-w-[120px]">
        {v.type}
      </span>
      {v.stock < 10 && (
        <span className="text-rose-600 font-bold text-[8px] uppercase flex items-center gap-1 shrink-0">
          <FiAlertCircle size={10}/> LOW
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
        <label className="text-[7px] font-black text-slate-400 uppercase block mb-0.5">Price</label>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-bold text-slate-400">NLe</span>
          <input 
            type="number" 
            defaultValue={v.price} 
            onBlur={(e) => onUpdate(v.type, 'price', e.target.value)}
            className="w-full bg-transparent text-xs font-black text-blue-700 outline-none" 
          />
        </div>
      </div>

      <div className={`p-1.5 rounded-xl border ${v.stock < 10 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
        <label className="text-[7px] font-black text-slate-400 uppercase block mb-0.5">Stock</label>
        <input 
          type="number" 
          defaultValue={v.stock} 
          onBlur={(e) => onUpdate(v.type, 'stock', e.target.value)}
          className={`w-full bg-transparent text-xs font-black outline-none ${v.stock < 10 ? 'text-rose-600' : 'text-slate-900'}`} 
        />
      </div>
    </div>
  </div>
)