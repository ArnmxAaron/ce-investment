'use client'
import { useState } from 'react'
import { FiTrash2, FiDroplet, FiPackage, FiBox, FiLayers, FiTrendingUp, FiTool, FiAlertCircle, FiEdit3, FiCheck } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export function InventoryList({ products, onRefresh, onDelete }: any) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  
  // States for Inline Editing
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const STOCK_TARGET = 50;

  const getProductIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('paint') || n.includes('brush')) return <FiDroplet className="text-blue-500" />;
    if (n.includes('cement') || n.includes('concrete')) return <FiLayers className="text-orange-500" />;
    if (n.includes('tool') || n.includes('lock') || n.includes('hammer')) return <FiTool className="text-slate-500" />;
    if (n.includes('zinc') || n.includes('bar') || n.includes('wire')) return <FiBox className="text-emerald-500" />;
    return <FiPackage className="text-indigo-500" />;
  };

  // Logic to update Product Name
  const saveNewName = async (productId: string) => {
    if (!newName.trim()) return;
    const { error } = await supabase.from('products').update({ name: newName }).eq('id', productId);
    if (!error) {
      setEditingNameId(null);
      onRefresh();
    }
  };

  const updateProductData = async (productId: string, variantType: string, field: 'stock' | 'price', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setUpdatingId(`${productId}-${variantType}-${field}`);
    const product = products.find((p: any) => p.id === productId);
    const updatedVariants = product.variants.map((v: any) => {
      if (v.type === variantType) return { ...v, [field]: numValue };
      return v;
    });

    const { error } = await supabase.from('products').update({ variants: updatedVariants }).eq('id', productId);
    
    if (!error) {
      setUpdatingId(null);
      setShowSuccess(`${productId}-${variantType}-${field}`);
      setTimeout(() => setShowSuccess(null), 2000);
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 pb-10 items-start">
      <AnimatePresence mode='popLayout'>
        {products.map((product: any) => {
          const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
          const sectionValue = product.variants?.reduce((acc: number, v: any) => acc + ((v.stock || 0) * (v.price || 0)), 0);

          return (
            <motion.div 
              layout
              key={product.id} 
              className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Header */}
              <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center text-xl border border-slate-100 flex-shrink-0">
                      {getProductIcon(product.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editingNameId === product.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            autoFocus
                            className="bg-white border border-blue-200 px-2 py-1 rounded-lg font-black text-slate-800 uppercase italic text-sm w-full outline-none"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveNewName(product.id)}
                          />
                          <button onClick={() => saveNewName(product.id)} className="bg-blue-600 text-white p-1 rounded-md"><FiCheck /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/title">
                          <h4 className="font-black text-slate-900 uppercase tracking-tight italic text-[14px] truncate leading-none">
                            {product.name}
                          </h4>
                          <button 
                            onClick={() => { setEditingNameId(product.id); setNewName(product.name); }}
                            className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <FiEdit3 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => onDelete(product.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors"><FiTrash2 size={18} /></button>
                </div>

                {/* BIGGER BADGES FOR ADMIN VISIBILITY */}
                <div className="flex gap-3">
                  <div className="bg-blue-600 px-3 py-1.5 rounded-full shadow-lg shadow-blue-100">
                    <span className="text-white text-[11px] font-black uppercase tracking-wider">
                      {totalStock.toLocaleString()} Units
                    </span>
                  </div>
                  <div className="bg-emerald-500 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-100 flex items-center gap-1">
                    <FiTrendingUp className="text-emerald-100" size={12} />
                    <span className="text-white text-[11px] font-black uppercase tracking-wider">
                      NLe {sectionValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div className="p-6 space-y-6 flex-1">
                {product.variants?.map((v: any, i: number) => {
                  const itemValue = (v.stock || 0) * (v.price || 0);
                  const stockPercentage = Math.min(((v.stock || 0) / STOCK_TARGET) * 100, 100);
                  const isLow = v.stock < 10;

                  return (
                    <div key={i} className="relative group/variant">
                      <div className="mb-2 flex justify-between items-end px-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.type}</span>
                        <span className={`text-[9px] font-black uppercase ${isLow ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                          {isLow && <FiAlertCircle className="inline mr-1" />}
                          {Math.round(stockPercentage)}% Cap
                        </span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stockPercentage}%` }}
                          className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-blue-500'}`}
                        />
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 group-hover/variant:bg-white group-hover/variant:border-blue-100 transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-blue-400 uppercase">Price: NLe</span>
                            <input 
                              type="number"
                              defaultValue={v.price}
                              onBlur={(e) => updateProductData(product.id, v.type, 'price', e.target.value)}
                              className="w-20 bg-transparent font-mono font-black text-blue-600 text-sm outline-none"
                            />
                          </div>
                          <p className="text-[10px] font-mono font-bold text-slate-400 italic">V: {itemValue.toLocaleString()}</p>
                        </div>

                        <div className="relative">
                          <input 
                            type="number"
                            className={`w-full px-4 py-3 rounded-xl text-sm font-black outline-none transition-all ${
                              v.stock === 0 ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-white border border-slate-200 text-slate-800'
                            }`}
                            defaultValue={v.stock}
                            onBlur={(e) => updateProductData(product.id, v.type, 'stock', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  )
}