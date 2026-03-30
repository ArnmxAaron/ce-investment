'use client'
import { useState, useEffect } from 'react'
import { FiPlus, FiAlertCircle, FiSearch, FiArrowRight, FiActivity, FiMinusCircle, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onAdd: (name: string, variants: any[]) => Promise<void>;
  loading: boolean;
  existingProducts: any[];
  defaultName?: string; // Added to receive name from Sidebar search
}

export function AddProductForm({ onAdd, loading, existingProducts = [], defaultName = '' }: Props) {
  const [name, setName] = useState(defaultName)
  const [variants, setVariants] = useState([{ type: '', price: 0, stock: 0 }])
  const [match, setMatch] = useState<any>(null)

  // Keep name in sync if user types in the sidebar search
  useEffect(() => {
    if (defaultName) {
      setName(defaultName.toUpperCase());
      handleNameChange(defaultName);
    }
  }, [defaultName]);

  const handleNameChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setName(upperVal);
    
    const searchStr = upperVal.trim();
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

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
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
      setTimeout(() => element.style.outline = "none", 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (match || loading) return; 
    
    // Direct call to onAdd - the password check happens in the parent of this component!
    await onAdd(name.trim().toUpperCase(), variants);
    
    // Reset Form
    setName('');
    setMatch(null);
    setVariants([{ type: '', price: 0, stock: 0 }]);
  };

  const isFormReady = name.length >= 2 && !match && variants.every(v => v.type && v.price >= 0);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* MATERIAL NAME */}
        <div className="relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Material Name</label>
          <input 
            placeholder="e.g. SOLVENT"
            className={`w-full p-4 rounded-2xl font-black text-sm outline-none transition-all border-2 ${
              match 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-white border-slate-100 text-slate-700 focus:border-blue-500 shadow-sm'
            }`}
            value={name} 
            onChange={(e) => handleNameChange(e.target.value)} 
            required 
          />

          {/* DUPLICATE ALERT */}
          <AnimatePresence>
            {match && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <FiAlertCircle size={14}/>
                    <span className="text-[9px] font-black uppercase">Already in System</span>
                  </div>
                  <button 
                    type="button"
                    onClick={scrollToProduct}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase transition-all"
                  >
                    Locate In Inventory
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VARIANTS */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing & Stock</label>
            <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{variants.length} Types</span>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {variants.map((v, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative group">
                {variants.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="absolute -top-2 -right-2 text-rose-500 bg-white rounded-full shadow-md hover:scale-110 transition-all z-10"
                  >
                    <FiMinusCircle size={22} />
                  </button>
                )}

                <input 
                  placeholder="TYPE (E.G. 5L CAN)" 
                  className="w-full bg-transparent border-b border-slate-50 py-1 font-black text-[11px] outline-none mb-3 uppercase focus:border-blue-400 transition-colors"
                  value={v.type} 
                  onChange={(e) => updateVariant(i, 'type', e.target.value.toUpperCase())} 
                  required 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Price</span>
                    <input type="number" className="w-full bg-slate-50 rounded-lg p-2 font-mono font-black text-xs outline-none focus:bg-white" value={v.price || ''} onChange={(e) => updateVariant(i, 'price', Number(e.target.value))} required />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-300 uppercase">Stock</span>
                    <input type="number" className="w-full bg-slate-50 rounded-lg p-2 font-mono font-black text-blue-600 text-xs outline-none focus:bg-white" value={v.stock || ''} onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} required />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={() => setVariants([...variants, { type: '', price: 0, stock: 0 }])} 
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[9px] font-black text-slate-400 uppercase hover:border-blue-300 hover:text-blue-500 transition-all"
          >
            + Add Another Variant
          </button>
        </div>

        {/* UPLOAD BUTTON */}
        <button 
          type="submit" 
          disabled={loading || !!match || name.length < 2} 
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
            match 
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
            : isFormReady 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'
              : 'bg-slate-900 text-white opacity-50'
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : match ? (
            'Duplicate Detected'
          ) : (
            <><FiCheck /> Confirm Upload</>
          )}
        </button>
      </form>
    </div>
  )
}