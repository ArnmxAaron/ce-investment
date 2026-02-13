'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiAlertCircle } from 'react-icons/fi'

interface ProductVariant {
  type: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  variants: ProductVariant[];
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, selectedPrice: number, variantType: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onConfirm }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // FIX: Stable dependency array prevents "changed size" error
  useEffect(() => {
    if (isOpen && product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [isOpen, product]); 

  if (!isOpen || !product) return null;

  const subtotal = (selectedVariant?.price || 0) * quantity;
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;
  const isOverLimit = selectedVariant ? quantity > selectedVariant.stock : false;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-1">
                {product.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {product.category} — Configuration
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                Select Type / Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants?.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    className={`relative p-4 rounded-[1.5rem] border-2 text-left transition-all ${
                      selectedVariant?.type === v.type 
                        ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    } ${v.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    disabled={v.stock <= 0}
                  >
                    <p className={`text-[10px] font-black uppercase mb-1 ${selectedVariant?.type === v.type ? 'text-blue-600' : 'text-slate-400'}`}>
                      {v.type}
                    </p>
                    <p className="font-mono font-black text-slate-900 text-lg">NLe {v.price.toLocaleString()}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${v.stock < 10 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                        {v.stock} in stock
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantity</label>
                {isOverLimit && (
                  <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1 animate-pulse">
                    <FiAlertCircle /> Max stock reached
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 rounded-[1.5rem] bg-white border border-slate-200 flex items-center justify-center text-xl font-black text-slate-400 hover:text-slate-900 active:scale-95 transition-all"
                >
                  <FiMinus />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-mono font-black text-slate-900">
                    {quantity.toString().padStart(2, '0')}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                  disabled={isOverLimit}
                  className="w-14 h-14 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none"
                >
                  <FiPlus />
                </button>
              </div>
            </section>

            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                  <h2 className="text-4xl font-mono font-black text-blue-600 tracking-tighter">
                    <span className="text-sm mr-1 italic">NLe</span>
                    {subtotal.toLocaleString()}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Price</p>
                  <p className="font-bold text-slate-600">NLe {selectedVariant?.price.toLocaleString()}</p>
                </div>
              </div>

              <button 
                disabled={isOutOfStock || isOverLimit}
                onClick={() => selectedVariant && onConfirm(product, quantity, selectedVariant.price, selectedVariant.type)}
                className={`w-full py-6 rounded-[2rem] font-black text-lg tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isOutOfStock 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98]'
                }`}
              >
                {isOutOfStock ? "OUT OF STOCK" : (
                  <>
                    <FiShoppingBag size={20} />
                    ADD TO RECEIPT
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}