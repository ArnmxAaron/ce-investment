'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiAlertCircle, FiCheck } from 'react-icons/fi'

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

  // Reset state when a new product is opened
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight">
                {product.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {product.category}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Variant Selection */}
            <section>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-3 tracking-tight">
                Select Option / Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants?.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                      selectedVariant?.type === v.type 
                        ? 'border-blue-600 bg-blue-50/30' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    } ${v.stock <= 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    disabled={v.stock <= 0}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] font-bold uppercase ${selectedVariant?.type === v.type ? 'text-blue-600' : 'text-slate-400'}`}>
                        {v.type}
                      </p>
                      {selectedVariant?.type === v.type && <FiCheck className="text-blue-600" size={12} />}
                    </div>
                    <p className="font-bold text-slate-900 text-sm mt-1">NLe {v.price.toLocaleString()}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-0.5">{v.stock} in stock</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Quantity Selector */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">Quantity</label>
                {isOverLimit && (
                  <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1">
                    <FiAlertCircle /> Maximum Stock
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                >
                  <FiMinus />
                </button>
                <div className="flex-1 text-center font-bold text-xl text-slate-900">
                  {quantity}
                </div>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                  disabled={isOverLimit}
                  className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all active:scale-90 disabled:bg-slate-200 disabled:shadow-none"
                >
                  <FiPlus />
                </button>
              </div>
            </section>

            {/* Footer Pricing & Button */}
            <div className="pt-4 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    <span className="text-sm font-medium text-slate-400 mr-1">NLe</span>
                    {subtotal.toLocaleString()}
                  </h2>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</p>
                   <p className="text-sm font-bold text-slate-600">NLe {selectedVariant?.price.toLocaleString()}</p>
                </div>
              </div>

              <button 
                disabled={isOutOfStock}
                onClick={() => selectedVariant && onConfirm(product, quantity, selectedVariant.price, selectedVariant.type)}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isOutOfStock 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-slate-900 active:transform active:scale-[0.98] shadow-blue-100'
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