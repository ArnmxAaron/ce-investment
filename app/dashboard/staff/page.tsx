'use client'
import { useState, useEffect } from 'react'
import { useSalesLogic, Product, CartItem } from '../../../hooks/useSalesLogic'
import { ProductCard } from '../../../components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { CartItemRow } from './components/CartItemRow'
import { PrintableInvoice } from './components/PrintableInvoice'
import { Sidebar } from './components/Sidebar'
import { ReceiptsLog } from './components/ReceiptsLog'
import { FiPrinter, FiSearch, FiShoppingBag, FiX, FiUser, FiCheck } from 'react-icons/fi'

export default function StaffTerminal() {
  const { 
    cart, setCart, searchQuery, setSearchQuery, isprocessing, 
    addToCart, handleSale, filteredProducts 
  } = useSalesLogic()

  const [activeView, setActiveView] = useState<'sales' | 'receipts'>('sales');
  const [mounted, setMounted] = useState(false);
  const [tempId, setTempId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isBuyerSet, setIsBuyerSet] = useState(false);
  const [showBuyerEntry, setShowBuyerEntry] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTempId(new Date().getTime().toString().slice(-6));
  }, []);

  if (!mounted) return null;

  // --- QUANTITY & REMOVE LOGIC ---
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev: CartItem[]) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev: CartItem[]) => prev.filter(item => item.id !== id));
  };

  // --- RE-SYNCHRONIZED SALE HANDLER ---
  const onCompleteSale = async () => {
    // 1. Send the current state to the hook
    const success = await handleSale(buyerName, buyerAddress);
    
    // 2. Only clear UI if the database update was successful
    if (success === true) {
      setCart([]);
      setBuyerName("");
      setBuyerAddress("");
      setIsBuyerSet(false);
      setIsAnonymous(false);
      
      // Refresh IDs and Views
      setTempId(new Date().getTime().toString().slice(-6));
      setActiveView('receipts'); 
    }
  };

  const handleConfirmAdd = (product: Product, quantity: number, price: number, variantType: string) => {
    addToCart(product, quantity, price, variantType); 
    setIsModalOpen(false);
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnonymous) {
      setBuyerName("Walking Customer");
      setBuyerAddress("N/A");
      setIsBuyerSet(true);
      setShowBuyerEntry(false);
      if (selectedProduct) setIsModalOpen(true);
    } else if (buyerName.trim().length >= 2) {
      setIsBuyerSet(true);
      setShowBuyerEntry(false);
      if (selectedProduct) setIsModalOpen(true);
    }
  };

  const totalAmount = cart.reduce((acc: number, i: CartItem) => acc + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-white flex relative font-sans overflow-hidden text-slate-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 ml-20 transition-all relative h-screen">
        {activeView === 'sales' ? (
          <div className="flex flex-col md:flex-row w-full h-full animate-in fade-in duration-500">
            <PrintableInvoice 
              cart={cart} buyerName={buyerName} buyerAddress={buyerAddress} 
              total={totalAmount} tempId={tempId}
            />

            {/* CUSTOMER ENTRY MODAL */}
            {showBuyerEntry && (
              <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                         <FiUser size={20} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Entry</span>
                    </div>
                    <button onClick={() => setShowBuyerEntry(false)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleBuyerSubmit} className="space-y-4">
                    <div className={`space-y-4 transition-all duration-300 ${isAnonymous ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
                      <input 
                        autoFocus required={!isAnonymous} placeholder="Customer Name"
                        className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                        value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                      />
                      <input 
                        placeholder="Address (Optional)"
                        className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                        value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)}
                      />
                    </div>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer border border-transparent hover:border-slate-200 transition-all">
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>
                        {isAnonymous && <FiCheck className="text-white" />}
                        <input type="checkbox" className="hidden" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-600">Walking / Anonymous Customer</span>
                    </label>

                    <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                      {isAnonymous ? "Skip and Continue" : "Confirm Details"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <ProductModal 
              product={selectedProduct} isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmAdd}
            />

            {/* PRODUCT GRID SECTION */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto h-screen custom-scrollbar bg-slate-50/50">
              <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                  C & E <span className="text-blue-600 font-light border-l-2 border-slate-200 pl-4 not-italic uppercase">Inventory</span>
                </h1>

                <div className="relative w-full lg:w-96">
                  <input 
                    placeholder="SEARCH INVENTORY..." 
                    className="bg-white border-2 border-slate-100 p-4 pl-12 rounded-2xl w-full shadow-sm outline-none focus:border-blue-500 font-black text-slate-900 placeholder:text-slate-300 text-xs tracking-widest"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                </div>
              </header>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 text-left">
                {filteredProducts.map((p: Product) => (
                  <ProductCard 
                    key={p.id} 
                    item={p} 
                    onAdd={() => {
                      setSelectedProduct(p);
                      if (!isBuyerSet) setShowBuyerEntry(true);
                      else setIsModalOpen(true);
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR CART */}
            <aside className="w-full md:w-100 bg-white flex flex-col h-screen border-l border-slate-100 shadow-sm relative z-50 text-left">
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">RECEIPT</h2>
                    {isBuyerSet && <span className="text-[10px] font-bold text-blue-600 uppercase mt-2 max-w-[150px] truncate">Buyer: {buyerName}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">TRX ID</p>
                    <p className="text-[11px] font-mono font-bold text-slate-400">#TEMP-{tempId}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-200">
                    <FiShoppingBag size={64} className="mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">No items selected</p>
                  </div>
                ) : (
                  cart.map((item: CartItem) => (
                    <CartItemRow 
                      key={item.id} 
                      item={item} 
                      onIncrease={(id) => updateQuantity(id, 1)}
                      onDecrease={(id) => updateQuantity(id, -1)}
                      onRemove={removeFromCart}
                    />
                  ))
                )}
              </div>

              <div className="p-8 pt-4 bg-white border-t border-slate-50">
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">TOTAL AMOUNT</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-blue-600 font-bold text-sm">NLE</span>
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={onCompleteSale} 
                    disabled={isprocessing || cart.length === 0}
                    className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-slate-100 active:scale-95"
                  >
                    {isprocessing ? "PROCESSING..." : "COMPLETE SALE"}
                  </button>
                  <button onClick={() => window.print()} disabled={cart.length === 0} className="w-full py-3 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                    <FiPrinter size={14} className="opacity-50" /> PRINT INVOICE
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <ReceiptsLog />
        )}
      </main>
    </div>
  )
}