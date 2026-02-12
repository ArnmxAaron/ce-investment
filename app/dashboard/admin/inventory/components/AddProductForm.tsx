'use client'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

interface Props {
  onAdd: (name: string, variants: any[]) => Promise<void>;
  loading: boolean;
}

export function AddProductForm({ onAdd, loading }: Props) {
  const [name, setName] = useState('')
  const [variants, setVariants] = useState([{ type: '', price: 0, stock: 0 }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onAdd(name, variants)
    setName('')
    setVariants([{ type: '', price: 0, stock: 0 }])
  }

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  return (
    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm sticky top-8">
      <h3 className="text-lg font-black text-slate-800 mb-6 uppercase flex items-center gap-2">
        <FiPlus className="text-blue-600" /> New Entry
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Material Name</label>
          <input 
            placeholder="e.g. Steel Nails"
            className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Variants & Stock</label>
          {variants.map((v, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl mb-3 border border-slate-100 animate-in fade-in duration-300">
              <input 
                placeholder="Size/Type (e.g. 4 inches)" 
                className="w-full bg-transparent border-b border-slate-200 py-1 font-bold text-sm outline-none mb-3 text-slate-700"
                value={v.type} 
                onChange={(e) => updateVariant(i, 'type', e.target.value)} 
                required 
              />
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Price</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-transparent font-mono font-black text-slate-800 outline-none" 
                    value={v.price || ''}
                    onChange={(e) => updateVariant(i, 'price', Number(e.target.value))} 
                    required 
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Stock</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-transparent font-mono font-black text-blue-600 outline-none" 
                    value={v.stock || ''}
                    onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={() => setVariants([...variants, { type: '', price: 0, stock: 0 }])} 
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors mt-2"
          >
            + Add Size/Type
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-100 disabled:bg-slate-200"
        >
          {loading ? 'Saving to Database...' : 'Confirm Upload'}
        </button>
      </form>
    </div>
  )
}