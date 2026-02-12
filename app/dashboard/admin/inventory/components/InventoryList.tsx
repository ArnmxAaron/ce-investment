'use client'
import { useState } from 'react'
import { FiTrash2, FiCheckCircle } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export function InventoryList({ products, onRefresh, onDelete }: any) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const updateStock = async (productId: string, variantType: string, value: string) => {
    const newStock = parseInt(value);
    if (isNaN(newStock)) return;

    setUpdatingId(`${productId}-${variantType}`);
    const product = products.find((p: any) => p.id === productId);
    const updatedVariants = product.variants.map((v: any) => {
      if (v.type === variantType) return { ...v, stock: newStock };
      return v;
    });

    const { error } = await supabase.from('products').update({ variants: updatedVariants }).eq('id', productId);
    
    if (!error) {
      setUpdatingId(null);
      setShowSuccess(`${productId}-${variantType}`);
      setTimeout(() => setShowSuccess(null), 2000);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {products.map((product: any) => (
        <div key={product.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm uppercase italic">
                {product.name[0]}
              </span>
              <h4 className="font-black text-slate-800 uppercase tracking-tight italic">{product.name}</h4>
            </div>
            <button onClick={() => onDelete(product.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors">
              <FiTrash2 size={18} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {product.variants?.map((v: any, i: number) => (
              <div key={i} className="relative p-4 rounded-2xl border border-slate-100 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{v.type}</span>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">NLe {v.price}</span>
                </div>
                
                <div className="relative flex items-center">
                  <input 
                    type="number"
                    className={`w-full pl-4 pr-10 py-2.5 rounded-xl text-sm font-black outline-none transition-all ${
                      v.stock === 0 ? 'bg-rose-50 border-rose-200 text-rose-600 focus:border-rose-400' : 'bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 text-slate-700'
                    }`}
                    defaultValue={v.stock}
                    onBlur={(e) => updateStock(product.id, v.type, e.target.value)}
                    onKeyDown={(e: any) => e.key === 'Enter' && e.currentTarget.blur()}
                  />
                  
                  <AnimatePresence>
                    {showSuccess === `${product.id}-${v.type}` && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -right-2 -top-8 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg z-10"
                      >
                        <FiCheckCircle /> UPDATED
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {updatingId === `${product.id}-${v.type}` && (
                    <div className="absolute right-3 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}