'use client'
import { useState, useEffect } from 'react'
import { useSalesLogic, Product, CartItem } from '../../../hooks/useSalesLogic'
import { ProductCard } from '../../../components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { CartItemRow } from './components/CartItemRow'
import { PrintableInvoice } from './components/PrintableInvoice'
import { FiPrinter, FiSearch, FiShoppingBag, FiCheckCircle, FiX } from 'react-icons/fi'

export default function StaffSalesPage() {
  const { 
    cart, searchQuery, setSearchQuery, isprocessing, 
    toast, addToCart, handleSale, filteredProducts 
  } = useSalesLogic()

  const [mounted, setMounted] = useState(false);
  const [tempId, setTempId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [isBuyerSet, setIsBuyerSet] = useState(false);
  const [showBuyerEntry, setShowBuyerEntry] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTempId(new Date().getTime().toString().slice(-6));
  }, []);

  if (!mounted) return null;

  const handleConfirmAdd = (product: Product, quantity: number, price: number, variantType: string) => {
    addToCart(product, quantity, price, variantType); 
    setIsModalOpen(false);
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerName.trim().length >= 2) {
      setIsBuyerSet(true);
      setShowBuyerEntry(false);
      if (selectedProduct) setIsModalOpen(true);
    }
  };

  const totalAmount = cart.reduce((acc: number, i: CartItem) => acc + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-white flex relative font-sans overflow-hidden">
      <PrintableInvoice 
        cart={cart} buyerName={buyerName} buyerAddress={buyerAddress} 
        total={totalAmount} tempId={tempId}
      />

      {showBuyerEntry && (
        <div className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Customer Details</span>
              <button onClick={() => setShowBuyerEntry(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              <input 
                autoFocus required placeholder="Customer Name"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
              />
              <input 
                placeholder="Address (Optional)"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-slate-900"
                value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)}
              />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full h-screen">
        <ProductModal 
          product={selectedProduct} isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmAdd}
        />

        <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen custom-scrollbar bg-slate-50/50">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            {/* Header Restored to Inventory */}
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              C & E <span className="text-blue-600 font-light border-l-2 border-slate-200 pl-4 not-italic uppercase">Inventory</span>
            </h1>

            {/* FIXED SEARCH BAR: Text is now clearly visible */}
            <div className="relative w-full lg:w-96">
              <input 
                placeholder="SEARCH..." 
                className="bg-white border-2 border-slate-100 p-4 pl-12 rounded-2xl w-full shadow-sm outline-none focus:border-blue-500 font-bold text-slate-900 placeholder:text-slate-300"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            </div>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredProducts.map((p: Product) => (
              <ProductCard key={p.id} item={p} onAdd={() => {
                setSelectedProduct(p);
                if (!isBuyerSet) setShowBuyerEntry(true);
                else setIsModalOpen(true);
              }} />
            ))}
          </div>
        </div>

        {/* --- RECEIPT SIDEBAR: Matches your Screenshot exactly --- */}
        <aside className="w-full md:w-[400px] bg-white flex flex-col h-screen border-l border-slate-50 shadow-sm">
          <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase">RECEIPT</h2>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">TRANSACTION ID</p>
                <p className="text-[11px] font-mono font-bold text-slate-400">#TEMP-{tempId}</p>
              </div>
            </div>
            <div className="h-[1px] bg-slate-100 w-full" />
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-200">
                <FiShoppingBag size={64} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Empty Cart</p>
              </div>
            ) : (
              cart.map((item: CartItem) => (
                  <CartItemRow key={item.id} item={item} />
              ))
            )}
          </div>

          <div className="p-8 pt-4 bg-white">
            <div className="flex justify-between items-baseline mb-8">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">GRAND TOTAL</span>
              <div className="flex items-baseline gap-2">
                <span className="text-blue-600 font-bold text-sm">NLE</span>
                <span className="text-7xl font-black text-[#1a1f2c] tracking-tighter">
                  {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleSale} disabled={isprocessing || cart.length === 0}
                className="w-full bg-[#0f172a] text-white py-6 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-100"
              >
                {isprocessing ? "PROCESSING..." : "COMPLETE TRANSACTION"}
              </button>
              
              <button 
                onClick={() => window.print()} disabled={cart.length === 0}
                className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-all flex items-center justify-center gap-2"
              >
                <FiPrinter size={16} className="opacity-50" /> PRINT PROFORMA
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}