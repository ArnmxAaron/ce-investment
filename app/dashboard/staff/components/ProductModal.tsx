'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiAlertCircle, FiCheck } from 'react-icons/fi'
import { Product, Variant } from '@/hooks/useSalesLogic' 

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, selectedPrice: number, variantType: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onConfirm }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (isOpen && product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const subtotal = (selectedVariant?.price || 0) * quantity;
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const isOverLimit = selectedVariant ? quantity >= selectedVariant.stock : false;

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity(0); // Allow clearing to type a new number
      return;
    }
    
    const num = parseInt(val);
    if (isNaN(num)) return;

    const max = selectedVariant?.stock || 1;
    // Clamp value between 1 and max stock
    if (num > max) setQuantity(max);
    else if (num < 1) setQuantity(1);
    else setQuantity(num);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="text-left">
              <h3 className="text-lg font-black text-slate-900 leading-tight uppercase italic tracking-tighter">
                {product.name}
              </h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                {product.category}
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 rounded-full transition-all">
              <FiX size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6 text-left">
            {/* VARIANT SELECTION */}
            <section>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-tight">
                Select Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedVariant?.id === v.id 
                        ? 'border-blue-600 bg-blue-50/30' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    } ${v.stock <= 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    disabled={v.stock <= 0}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] font-black uppercase ${selectedVariant?.id === v.id ? 'text-blue-600' : 'text-slate-400'}`}>
                        {v.name}
                      </p>
                      {selectedVariant?.id === v.id && <FiCheck className="text-blue-600" size={12} />}
                    </div>
                    <p className="font-black text-slate-900 text-sm mt-1">NLe {v.price.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{v.stock} in stock</p>
                  </button>
                ))}
              </div>
            </section>

            {/* QUANTITY INPUT SECTION */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Quantity</label>
                {isOverLimit && (
                  <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1">
                    <FiAlertCircle /> Max Stock
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm active:scale-90 transition-transform"
                >
                  <FiMinus />
                </button>
                
                {/* MANUAL INPUT FIELD */}
                <input 
                  type="number"
                  value={quantity === 0 ? "" : quantity}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent text-center font-black text-xl text-slate-900 outline-none border-none focus:ring-0 w-full"
                />

                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                  disabled={isOverLimit}
                  className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
                >
                  <FiPlus />
                </button>
              </div>
            </section>

            {/* FOOTER & TOTALS */}
            <div className="pt-4 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                    <span className="text-sm font-bold text-blue-600 mr-1">NLe</span>
                    {subtotal.toLocaleString()}
                  </h2>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Price</p>
                   <p className="text-sm font-bold text-slate-600">NLe {selectedVariant?.price.toLocaleString()}</p>
                </div>
              </div>

              <button 
                disabled={isOutOfStock || quantity < 1}
                onClick={() => selectedVariant && onConfirm(product, quantity, selectedVariant.price, selectedVariant.name)}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isOutOfStock || quantity < 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                {isOutOfStock ? "OUT OF STOCK" : (
                  <>
                    <FiShoppingBag size={18} />
                    ADD TO RECEIPT
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}