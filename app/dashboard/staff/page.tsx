'use client'
import { useState } from 'react'
import { useSalesLogic, Product, CartItem } from '../../../hooks/useSalesLogic'
import { ProductCard } from '../../../components/ProductCard'
// Ensure these files exist in /app/dashboard/staff/components/
import { ProductModal } from './components/ProductModal'
import { CartItemRow } from './components/CartItemRow'

export default function StaffSalesPage() {
  const { 
    cart, 
    searchQuery, 
    setSearchQuery, 
    loading, 
    isprocessing, 
    newUpdate, 
    toast, 
    fetchProducts, 
    addToCart, 
    handleSale, 
    filteredProducts 
  } = useSalesLogic()

  // Modal State for configuring items
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Opens the pop-up when clicking "Add to Cart" or the "Pencil" icon
  const openConfigurator = (p: Product | CartItem) => {
    setSelectedProduct(p as Product);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (product: Product, quantity: number, price: number) => {
    // This loops the current addToCart logic based on the quantity selected in the modal
    for(let i = 0; i < quantity; i++) {
        addToCart(product); 
    }
    setIsModalOpen(false);
  };

  // Calculate total for the display
  const totalAmount = cart.reduce((acc: number, i: CartItem) => acc + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative font-sans selection:bg-blue-100">
      
      {/* Configuration Pop-up */}
      <ProductModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAdd}
      />

      {/* STATUS TOASTS */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl font-black text-white transition-all transform animate-bounce flex items-center gap-3 ${
          toast.type === 'success' 
            ? 'bg-emerald-600' 
            : toast.type === 'error' 
              ? 'bg-rose-600' 
              : 'bg-blue-600'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* MAIN SECTION: Product Discovery */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
              C & E <span className="text-blue-600 font-light border-l-2 border-slate-200 pl-4 uppercase">Inventory</span>
              
              <button 
                onClick={fetchProducts} 
                className={`p-2.5 rounded-xl transition-all active:rotate-180 duration-500 ${
                  newUpdate 
                  ? 'bg-orange-500 text-white animate-pulse shadow-lg shadow-orange-200' 
                  : 'bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Professional Sales Terminal</p>
          </div>

          <div className="relative w-full lg:w-96 group">
            <input 
              placeholder="Search inventory..." 
              className="bg-white border-2 border-slate-100 p-4 pl-14 rounded-2xl w-full shadow-sm outline-none focus:border-blue-500 text-slate-700 transition-all font-bold"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-300">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.2em] text-sm italic">Accessing Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p: Product) => (
              <ProductCard key={p.id} item={p} onAdd={() => openConfigurator(p)} />
            ))}
          </div>
        )}
      </div>

      {/* SIDEBAR: Digital Receipt */}
      <aside className="w-full md:w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)] z-10 h-screen">
        <div className="p-8 border-b border-slate-50">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Receipt</h2>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</span>
              <span className="text-[10px] font-mono text-slate-300 uppercase">#TEMP-{new Date().getTime().toString().slice(-6)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-bold uppercase text-[11px] tracking-[0.3em]">Ready for Sale</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                onEdit={() => openConfigurator(item)} 
              />
            ))
          )}
        </div>

        {/* FOOTER: Actions */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="flex justify-between items-end mb-8">
            <span className="font-bold text-slate-400 uppercase text-xs tracking-[0.2em]">Grand Total</span>
            <div className="text-right">
                <span className="text-sm font-bold text-blue-600 mr-2 uppercase tracking-tighter">NLe</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter font-mono">
                 {totalAmount.toLocaleString()}
                </span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSale}
              disabled={isprocessing || cart.length === 0}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-slate-200 hover:bg-blue-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isprocessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>FINALIZING...</span>
                </>
              ) : (
                <span>COMPLETE TRANSACTION</span>
              )}
            </button>
            
            <button disabled className="w-full py-4 rounded-2xl font-black border-2 border-dashed border-slate-200 text-slate-300 bg-transparent cursor-not-allowed uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-colors">
              🖨️ Print Receipt (Coming Soon)
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}