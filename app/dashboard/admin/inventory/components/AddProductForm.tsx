'use client'
import { useState, useEffect } from 'react'
import { FiPlus, FiAlertCircle, FiSearch, FiArrowRight, FiActivity, FiMinusCircle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onAdd: (name: string, variants: any[]) => Promise<void>;
  loading: boolean;
  existingProducts: any[];
}

export function AddProductForm({ onAdd, loading, existingProducts = [] }: Props) {
  const [name, setName] = useState('')
  const [variants, setVariants] = useState([{ type: '', price: 0, stock: 0 }])
  const [match, setMatch] = useState<any>(null)

  // Sync Check
  useEffect(() => {
    console.log("DATABASE SIZE IN FORM:", existingProducts.length);
  }, [existingProducts]);

  const handleNameChange = (val: string) => {
    setName(val);
    const searchStr = val.trim().toUpperCase();
    
    if (searchStr.length >= 2) {
      const found = existingProducts.find(p => {
        const dbName = (p.name || p.product_name || "").toString().toUpperCase().trim();
        return dbName === searchStr;
      });
      setMatch(found || null);
    } else {
      setMatch(null);
    }
  };

  // --- NEW: REMOVE VARIANT ---
  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const scrollToProduct = () => {
    if (!match) return;
    const id = match.id || match._id;
    const element = document.getElementById(`product-${id}`);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.outline = "5px solid #F59E0B";
      element.style.outlineOffset = "4px";
      setTimeout(() => element.style.outline = "none", 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (match) return; 
    await onAdd(name.toUpperCase(), variants);
    setName('');
    setMatch(null);
    setVariants([{ type: '', price: 0, stock: 0 }]);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase">
        <FiActivity className={existingProducts.length > 0 ? "text-green-500" : "text-red-500"} />
        DB Sync: {existingProducts.length} items loaded
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* MATERIAL NAME */}
        <div className="relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Material Name</label>
          <input 
            placeholder="e.g. SOLVENT"
            className={`w-full p-4 rounded-2xl font-black text-sm outline-none transition-all border-2 ${
              match 
              ? 'bg-amber-50 border-amber-400 text-amber-900 ring-4 ring-amber-100' 
              : 'bg-white border-slate-100 text-slate-700 focus:border-blue-500 shadow-sm'
            }`}
            value={name} 
            onChange={(e) => handleNameChange(e.target.value)} 
            required 
          />

          <AnimatePresence>
            {match && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-800"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black text-amber-500 uppercase">Duplicate Alert</span>
                  </div>
                  <h4 className="text-white font-black text-lg tracking-tight uppercase">{match.name}</h4>
                  <button 
                    type="button"
                    onClick={scrollToProduct}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    <FiSearch size={16}/> Locate In Inventory
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VARIANTS SECTION */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Stock Details</label>
          <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {variants.map((v, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative group">
                
                {/* --- THE MINUS BUTTON --- */}
                {variants.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="absolute -top-2 -right-2 text-rose-500 bg-white rounded-full shadow-lg hover:text-rose-600 transition-all active:scale-90 z-10"
                  >
                    <FiMinusCircle size={24} />
                  </button>
                )}

                <input 
                  placeholder="SIZE/TYPE (e.g. KEY)" 
                  className="w-full bg-transparent border-b border-slate-50 py-1 font-black text-[11px] outline-none mb-3 uppercase focus:border-blue-400 transition-colors"
                  value={v.type} 
                  onChange={(e) => updateVariant(i, 'type', e.target.value.toUpperCase())} 
                  required 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-300 uppercase ml-1">Price</span>
                    <input type="number" className="w-full bg-slate-50 rounded-lg p-2 font-mono font-black text-xs outline-none focus:bg-white focus:ring-1 focus:ring-slate-200" value={v.price || ''} onChange={(e) => updateVariant(i, 'price', Number(e.target.value))} required />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-300 uppercase ml-1">Stock</span>
                    <input type="number" className="w-full bg-slate-50 rounded-lg p-2 font-mono font-black text-blue-600 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-100" value={v.stock || ''} onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} required />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={() => setVariants([...variants, { type: '', price: 0, stock: 0 }])} 
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all active:scale-[0.98]"
          >
            + Add Another Variant
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading || !!match} 
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all ${
            match 
            ? 'bg-slate-100 text-slate-300' 
            : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 active:scale-[0.98]'
          }`}
        >
          {loading ? 'SAVING...' : match ? 'ITEM ALREADY EXISTS' : 'CONFIRM UPLOAD'}
        </button>
      </form>
    </div>
  )
}