'use client'
import { useState, useEffect } from 'react'
import { Product } from '../../../hooks/useSalesLogic'

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number, selectedPrice: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onConfirm }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedPrice(product.price);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{product.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure Item</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Quantity</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center text-2xl font-black hover:bg-slate-50 active:scale-90 transition-all"
                >-</button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="flex-1 text-center text-2xl font-mono font-black text-slate-900 outline-none"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-100 active:scale-90 transition-all"
                >+</button>
              </div>
            </div>

            {/* Total Preview */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase text-xs">Total Price</span>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {(selectedPrice * quantity).toLocaleString()}
              </span>
            </div>

            <button 
              onClick={() => onConfirm(product, quantity, selectedPrice)}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
            >
              ADD TO RECEIPT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}