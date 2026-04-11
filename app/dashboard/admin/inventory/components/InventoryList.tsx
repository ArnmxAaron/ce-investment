'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { TbCheck, TbPhotoPlus, TbTrash, TbLoader2, TbPhotoOff, TbChevronDown, TbPlus } from 'react-icons/tb'

interface Variant {
  type: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  image_path?: string; 
  variants: Variant[];
}

interface InventoryListProps {
  product: Product;
  onDelete: (id: string) => void;
  onUpdate: (updatedProduct: any) => void; 
  userRole?: 'admin' | 'staff';
}

export function InventoryList({ 
  product, 
  onDelete, 
  onUpdate,
  userRole = 'staff' 
}: InventoryListProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [localVariants, setLocalVariants] = useState<Variant[]>(product.variants || [])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAdmin = userRole === 'admin'

  // Calculate totals for UI display only
  const currentTotalStock = localVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
  const currentTotalValue = localVariants.reduce((sum, v) => sum + ((Number(v.price) || 0) * (Number(v.stock) || 0)), 0)

  useEffect(() => {
    setLocalVariants(product.variants || [])
  }, [product.variants])

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isAdmin) return
    setIsSaving(true)
    try {
      const fileName = `${Math.random()}-${Date.now()}.${file.name.split('.').pop()}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data, error: updateError } = await supabase
        .from('products').update({ image_path: fileName }).eq('id', product.id).select().single()
      
      if (updateError) throw updateError
      onUpdate(data)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally { setIsSaving(false) }
  }

  const saveToSupabase = async (variantsToSave: Variant[]) => {
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ variants: variantsToSave })
        .eq('id', product.id)
        .select()
        .single()

      if (error) throw error
      if (data) onUpdate(data)
      
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (error: any) {
      console.error("Update failed:", error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (index: number, field: keyof Variant, value: string | number) => {
    if (!isAdmin) return;
    const updatedVariants = [...localVariants]
    updatedVariants[index] = { 
      ...updatedVariants[index], 
      [field]: field === 'type' ? value : Number(value) 
    }
    setLocalVariants(updatedVariants)
    await saveToSupabase(updatedVariants)
  }

  const addVariant = async () => {
    if (!isAdmin) return;
    const newVariant: Variant = { type: 'NEW SIZE/TYPE', price: 0, stock: 0 }
    const updatedVariants = [...localVariants, newVariant]
    setLocalVariants(updatedVariants)
    await saveToSupabase(updatedVariants)
  }

  const removeVariant = async (index: number) => {
    if (!isAdmin || localVariants.length <= 1) return;
    const updatedVariants = localVariants.filter((_, i) => i !== index)
    setLocalVariants(updatedVariants)
    await saveToSupabase(updatedVariants)
  }

  return (
    <div className="group relative bg-white rounded-4xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col w-full h-[580px] overflow-hidden">
      
      <AnimatePresence>
        {showSaved && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 12, x: "-50%" }} exit={{ opacity: 0, y: -20 }} className="absolute top-0 left-1/2 z-50 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <TbCheck className="text-lg" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Synced</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0F172A] p-6 text-white relative shrink-0">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center relative">
              {product.image_path ? (
                <img src={getImageUrl(product.image_path)!} className="w-full h-full object-cover" alt="" />
              ) : (
                <TbPhotoPlus className="text-slate-600 text-3xl" />
              )}
            </div>
            {isAdmin && (
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl hover:bg-blue-500 shadow-xl z-10">
                <TbPhotoPlus size={16} />
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <div className="flex-1 min-w-0">
            {/* FIX: Fallback for product name */}
            <h3 className="text-xl font-black uppercase tracking-tight truncate mb-3">{product.name ?? "UNNAMED PRODUCT"}</h3>
            <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-xl">
                <p className="text-[7px] text-slate-500 font-black uppercase">Stock</p>
                <p className="text-xs font-black">{currentTotalStock}</p>
              </div>
              <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-xl">
                <p className="text-[7px] text-emerald-500 font-black uppercase">Value</p>
                <p className="text-xs font-black text-emerald-400">NLe {currentTotalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          {isAdmin && <button onClick={() => onDelete(product.id)} className="p-2 text-slate-500 hover:text-rose-500"><TbTrash size={22} /></button>}
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar relative">
        {localVariants.map((variant, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-[2rem] relative group/variant">
             {isAdmin && localVariants.length > 1 && (
               <button onClick={() => removeVariant(idx)} className="absolute -top-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full border border-slate-100 shadow-sm opacity-0 group-hover/variant:opacity-100 transition-opacity z-10">
                 <TbTrash size={14} />
               </button>
             )}
             <div className="mb-3">
                <input 
                  disabled={!isAdmin}
                  // FIX: Use fallback for variant type string
                  value={variant.type ?? ""}
                  onChange={(e) => {
                    const updated = [...localVariants];
                    updated[idx].type = e.target.value;
                    setLocalVariants(updated);
                  }}
                  onBlur={(e) => handleUpdate(idx, 'type', e.target.value)}
                  className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-widest outline-none focus:text-blue-600 w-full"
                />
             </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
                <label className="text-[7px] font-black text-slate-400 uppercase block mb-1">Price</label>
                <input 
                  type="number" 
                  // FIX: Use fallback for price number
                  value={variant.price ?? 0} 
                  disabled={!isAdmin}
                  onChange={(e) => {
                    const updated = [...localVariants];
                    updated[idx].price = Number(e.target.value);
                    setLocalVariants(updated);
                  }}
                  onBlur={(e) => handleUpdate(idx, 'price', e.target.value)}
                  className="w-full font-black text-slate-900 bg-transparent outline-none text-sm" 
                />
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200">
                <label className="text-[7px] font-black text-slate-400 uppercase block mb-1">Stock</label>
                <input 
                  type="number" 
                  // FIX: Use fallback for stock number
                  value={variant.stock ?? 0} 
                  disabled={!isAdmin}
                  onChange={(e) => {
                    const updated = [...localVariants];
                    updated[idx].stock = Number(e.target.value);
                    setLocalVariants(updated);
                  }}
                  onBlur={(e) => handleUpdate(idx, 'stock', e.target.value)}
                  className="w-full font-black text-slate-900 bg-transparent outline-none text-sm" 
                />
              </div>
            </div>
          </div>
        ))}

        {isAdmin && (
          <button 
            onClick={addVariant}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 group/add"
          >
            <TbPlus className="group-hover/add:rotate-90 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Add New Variation</span>
          </button>
        )}
        
        {localVariants.length > 2 && (
          <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none">
            <div className="bg-white/80 backdrop-blur p-1 rounded-full border shadow-sm animate-bounce">
              <TbChevronDown className="text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {isSaving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-[60] flex items-center justify-center">
          <TbLoader2 className="animate-spin text-blue-600" size={32} />
        </div>
      )}
    </div>
  )
}