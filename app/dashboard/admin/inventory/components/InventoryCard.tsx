'use client'
import { useState } from 'react'
import { FiTrash2, FiEdit3, FiCheck, FiCamera, FiPlus, FiImage, FiLoader } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { VariantRow } from './VariantRow'

export function InventoryCard({ product, onRefresh, onDelete }: any) {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(product.name);
  const [isUploading, setIsUploading] = useState(false);

  const uniqueVariants = product.variants || [];

  const publicImageUrl = product.image_path 
    ? supabase.storage.from('product-images').getPublicUrl(product.image_path).data.publicUrl 
    : null;

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too heavy! Use a file smaller than 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${product.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) return alert(`Storage Error: ${uploadError.message}`);

      const { error: dbError } = await supabase
        .from('products')
        .update({ image_path: fileName })
        .eq('id', product.id);

      if (dbError) return alert("Database link failed.");

      onRefresh();
    } finally {
      setIsUploading(false);
    }
  };

  // --- VARIANT ACTIONS ---
  const addNewVariant = async () => {
    const newVariant = { type: 'NEW VARIANT', price: 0, stock: 0 };
    const updatedVariants = [...uniqueVariants, newVariant];
    await supabase.from('products').update({ variants: updatedVariants }).eq('id', product.id);
    onRefresh();
  };

  const removeVariant = async (typeToRemove: string) => {
    if (uniqueVariants.length <= 1) return;
    const updatedVariants = uniqueVariants.filter((v: any) => v.type !== typeToRemove);
    await supabase.from('products').update({ variants: updatedVariants }).eq('id', product.id);
    onRefresh();
  };

  const updateVariant = async (type: string, field: string, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) && field !== 'type') return;
    const updated = uniqueVariants.map((v: any) => 
      v.type === type ? { ...v, [field]: field === 'type' ? val.toUpperCase() : num } : v
    );
    await supabase.from('products').update({ variants: updated }).eq('id', product.id);
    onRefresh();
  };

  const totalStock = uniqueVariants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
  const totalValue = uniqueVariants.reduce((acc: number, v: any) => acc + ((v.stock || 0) * (v.price || 0)), 0);

  return (
    /* FIX: Removed max-w-[300px]. 
       Added w-full to ensure it fills the grid cell.
    */
    <motion.div layout className="bg-white border-2 border-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl flex flex-col h-full w-full group/card transition-all hover:shadow-2xl">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 p-5 lg:p-6">
        <div className="grid grid-cols-[56px_1fr_40px] gap-4 items-center mb-5">
          
          {/* IMAGE PREVIEW */}
          <div className="h-14 w-14 bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shrink-0 relative">
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <FiLoader className="text-blue-400 animate-spin" />
              </div>
            )}
            {publicImageUrl ? (
              <img src={publicImageUrl} className="h-full w-full object-cover" alt="" />
            ) : (
              <FiImage className="text-white/20" size={24} />
            )}
          </div>

          <div className="min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input 
                   autoFocus
                   value={newName} 
                   onChange={e => setNewName(e.target.value)} 
                   className="text-xs font-black p-1.5 rounded bg-white w-full uppercase text-black outline-none" 
                />
                <button onClick={async () => { await supabase.from('products').update({ name: newName.toUpperCase() }).eq('id', product.id); setEditingName(false); onRefresh(); }} className="text-emerald-400"><FiCheck size={18}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h4 className="text-sm lg:text-base font-black text-white uppercase italic tracking-tighter truncate leading-tight">
                  {product.name}
                </h4>
                <button onClick={() => setEditingName(true)} className="text-blue-400 opacity-0 group-hover/title:opacity-100 transition-opacity">
                  <FiEdit3 size={14}/>
                </button>
              </div>
            )}
            
            <label className={`text-[9px] font-black uppercase cursor-pointer flex items-center gap-1.5 mt-1.5 transition-colors ${isUploading ? 'text-slate-500' : 'text-blue-400 hover:text-white'}`}>
              <FiCamera size={11}/> {isUploading ? 'Uploading...' : publicImageUrl ? 'Change Image' : 'Add Image'}
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isUploading} />
            </label>
          </div>
          
          <button onClick={() => onDelete(product.id)} className="h-10 w-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shrink-0">
            <FiTrash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl text-center">
            <p className="text-blue-300 text-[8px] font-black uppercase tracking-widest">Stock</p>
            <p className="text-sm font-black text-white">{totalStock}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/10 p-2.5 rounded-xl text-center">
            <p className="text-emerald-300 text-[8px] font-black uppercase tracking-widest">Value</p>
            <p className="text-sm font-black text-white">NLe {totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* VARIANTS LIST */}
      <div className="p-4 flex-1 bg-slate-50 overflow-y-auto max-h-[350px] custom-scrollbar">
        <div className="space-y-3 mb-4">
          {uniqueVariants.map((v: any, i: number) => (
            <VariantRow 
              key={`${v.type}-${i}`} 
              v={v} 
              onUpdate={updateVariant} 
              onRemove={() => removeVariant(v.type)}
              showRemove={uniqueVariants.length > 1}
            />
          ))}
        </div>

        <button 
          onClick={addNewVariant}
          className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all active:scale-95"
        >
          <FiPlus size={14} /> Add New Variant
        </button>
      </div>
    </motion.div>
  );
}