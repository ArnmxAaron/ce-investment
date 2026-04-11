'use client'
import { useState, useRef, useMemo } from 'react'
import { Product, Variant } from '../hooks/useSalesLogic'
import { FiImage, FiEdit3, FiCheck, FiX, FiPlus, FiCamera, FiLoader, FiTrash2, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { deleteProduct } from '@/lib/productService'

interface ProductCardProps {
  item: Product;
  onAdd: (product: Product) => void;
  isAdmin?: boolean;
}

export const ProductCard = ({ item, onAdd, isAdmin = false }: ProductCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form state
  const [editForm, setEditForm] = useState({
    name: item.name,
    price: item.variants?.[0]?.price || 0,
    stock: item.variants?.[0]?.stock || 0,
    image_path: item.image_path ?? null 
  })

  // --- CALCULATION LOGIC ---
  const totalStock = useMemo(() => {
    if (!item.variants || !Array.isArray(item.variants)) return 0;
    return item.variants.reduce((acc, v) => acc + (Number(v?.stock) || 0), 0);
  }, [item.variants]);

  const displayPrice = useMemo(() => {
    if (!item.variants || item.variants.length === 0) return 0;
    const prices = item.variants.map(v => Number(v.price)).filter(p => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  }, [item.variants]);

  const getImageUrl = (path: string | null) => {
    if (!path) return null
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(getImageUrl(item.image_path ?? null))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const filePath = `products/${Date.now()}_${file.name}`
    try {
      const { error } = await supabase.storage.from('product-images').upload(filePath, file)
      if (error) throw error
      setEditForm(prev => ({ ...prev, image_path: filePath }))
      setPreviewUrl(getImageUrl(filePath))
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 1. Prepare the variants array (modifying the first one)
      const currentVariants = Array.isArray(item.variants) ? item.variants : [];
      const updatedVariants = [...currentVariants];
      
      if (updatedVariants.length > 0) {
        // Use 'any' to avoid the strict 'type' property error
        const firstVariant: any = { ...updatedVariants[0] };
        firstVariant.price = Number(editForm.price);
        firstVariant.stock = Number(editForm.stock);
        
        // Ensure "type" exists if it was there before (for JSONB structure)
        if (!firstVariant.type && firstVariant.name) {
          firstVariant.type = firstVariant.name;
        }
        
        updatedVariants[0] = firstVariant;
      }

      // 2. Update Supabase
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          image_path: editForm.image_path,
          variants: updatedVariants 
        })
        .eq('id', item.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-4xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden text-left h-full">
      
      {/* IMAGE SECTION */}
      <div className="relative aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="text-slate-200"><FiImage size={48} /></div>
        )}

        {isAdmin && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-white shadow-lg rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
              {isEditing ? <FiX size={16}/> : <FiEdit3 size={16}/>}
            </button>
            {!isEditing && (
              <button onClick={() => setShowConfirmDelete(true)} className="p-2 bg-white shadow-lg rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                <FiTrash2 size={16}/>
              </button>
            )}
          </div>
        )}

        {isEditing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
             <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-white rounded-2xl text-slate-800 shadow-2xl scale-110">
               {uploading ? <FiLoader className="animate-spin text-blue-600"/> : <FiCamera size={24}/>}
             </button>
             <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="flex flex-col flex-1">
        {isEditing ? (
          <input 
            value={editForm.name} 
            onChange={e => setEditForm({...editForm, name: e.target.value.toUpperCase()})}
            className="w-full text-sm font-black border-b-2 border-blue-500 outline-none mb-4 bg-blue-50/50 p-1 rounded"
          />
        ) : (
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 truncate">
            {item.name}
          </h3>
        )}

        <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
              {(item.variants?.length || 0) > 1 && !isEditing ? 'From Price' : 'Price'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-blue-600">NLE</span>
              {isEditing ? (
                <input 
                  type="number" 
                  className="w-20 font-black text-xl border-b border-slate-200 outline-none" 
                  value={editForm.price} 
                  onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                />
              ) : (
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter">
                  {displayPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
              {(item.variants?.length || 0) > 1 && !isEditing ? 'Total Stock' : 'Stock'}
            </span>
            {isEditing ? (
              <input 
                type="number" 
                className="w-14 text-right font-black text-lg border-b border-slate-200 outline-none" 
                value={editForm.stock} 
                onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})}
              />
            ) : (
              <span className={`text-lg font-black leading-none ${totalStock <= 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {totalStock}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={() => isEditing ? handleSave() : onAdd(item)}
          className={`w-full mt-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2
            ${isEditing ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-900 hover:bg-blue-600 hover:text-white'}`}
        >
          {loading ? <FiLoader className="animate-spin" /> : (
            isEditing ? <><FiCheck size={14}/> Save Changes</> : <><FiPlus size={14}/> Add to Receipt</>
          )}
        </button>
      </div>

      {/* DELETE CONFIRMATION */}
      {showConfirmDelete && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-rose-500/20 p-4 rounded-full mb-4">
            <FiAlertCircle className="text-rose-500" size={32}/>
          </div>
          <p className="text-white font-black text-xs uppercase tracking-widest mb-6">Soft delete this product?</p>
          <div className="flex flex-col w-full gap-2">
            <button 
              disabled={loading}
              onClick={async () => { 
                setLoading(true); 
                try {
                   await deleteProduct(item.id, item.image_path); 
                   setShowConfirmDelete(false);
                } catch (e) {
                   alert("Delete failed");
                } finally {
                   setLoading(false);
                }
              }} 
              className="bg-rose-600 text-white w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </button>
            <button onClick={() => setShowConfirmDelete(false)} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest py-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}