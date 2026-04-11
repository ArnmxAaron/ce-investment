'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSalesLogic, Product, CartItem } from '../../../hooks/useSalesLogic'
import { ProductCard } from '../../../components/ProductCard'
import { Sidebar } from './components/Sidebar'
import { ReceiptsLog } from './components/ReceiptsLog'
import { SalesHistory } from './components/SalesHistory' 
import { ProductModal } from './components/ProductModal'
import { CartItemRow } from './components/CartItemRow'
import { PrintableInvoice } from './components/PrintableInvoice'
import { TerminalHeader } from './components/TerminalHeader'
import { ErrorModal } from './components/ErrorModal'
import { CustomerEntryModal } from './components/CustomerEntryModal'
import { FiShoppingBag, FiLoader, FiPrinter } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
// --- IMPORTED CHAT COMPONENT ---
import { TerminalChat } from './components/TerminalChat'

// --- SKELETON COMPONENT ---
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
    <div className="skeleton-image" />
    <div className="skeleton-title" />
    <div className="skeleton-subtitle" />
    <div className="skeleton-button" />
  </div>
);

export default function StaffTerminal() {
  const { 
    cart, setCart, searchQuery, setSearchQuery, isProcessing, 
    loading, addToCart, handleSale, filteredProducts, totalAmount,
    fetchProducts 
  } = useSalesLogic()

  const [activeView, setActiveView] = useState<'sales' | 'receipts' | 'history'>('sales');
  
  const [mounted, setMounted] = useState(false);
  const [tempId, setTempId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isBuyerSet, setIsBuyerSet] = useState(false);
  const [showBuyerEntry, setShowBuyerEntry] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorStatus, setErrorStatus] = useState({ show: false, msg: "" });
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [sortBy, setSortBy] = useState<'low' | 'high' | 'none'>('none');

  const fetchDailyRevenue = useCallback(async () => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const { data, error } = await supabase
        .from('receipts')
        .select('total_amount')
        .gte('created_at', startOfToday);

      if (error) throw error;

      if (data) {
        const total = data.reduce((sum, record) => {
          return sum + (parseFloat(record.total_amount) || 0);
        }, 0);

        setTotalSalesToday(total);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') return;
        console.error("❌ Revenue Sync Error:", err.message);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    setTempId(new Date().getTime().toString().slice(-6));
    fetchDailyRevenue();

    const channel = supabase
      .channel('terminal-revenue-sync')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'receipts' }, 
        () => fetchDailyRevenue()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchDailyRevenue]);

  const onCompleteSale = async () => {
    if (cart.length === 0 || isProcessing) return;

    const finalName = isAnonymous ? "Walking Customer" : (buyerName || "Walking Customer");

    const success = await handleSale(
      finalName, 
      buyerAddress || "N/A"
    ); 
    
    if (success) {
      if (fetchProducts) await fetchProducts();
      await fetchDailyRevenue(); 
      
      setCart([]); 
      setBuyerName(""); 
      setBuyerAddress(""); 
      setIsBuyerSet(false);
      setIsAnonymous(false); 
      setTempId(new Date().getTime().toString().slice(-6));
      setActiveView('receipts');
    } else {
      setErrorStatus({ 
        show: true, 
        msg: "Transaction failed. Please check stock levels or network connection." 
      });
    }
  };

  const getTotalStock = (p: Product) => {
    return p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  };

  const getSortedProducts = () => {
    let products = [...filteredProducts];
    if (sortBy === 'low') return products.sort((a, b) => getTotalStock(a) - getTotalStock(b));
    if (sortBy === 'high') return products.sort((a, b) => getTotalStock(b) - getTotalStock(a));
    return products;
  };

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

  const handleConfirmAdd = (product: Product, quantity: number, price: number, variantType: string) => {
    const variant = product.variants.find(v => (v as any).type === variantType || v.name === variantType);
    if (variant) addToCart(product, variant, quantity); 
    setIsModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex relative font-sans overflow-hidden text-slate-900">
      <style jsx global>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .skeleton-card { background: #fff; border-radius: 24px; padding: 20px; border: 1px solid #f1f5f9; position: relative; overflow: hidden; height: 340px; }
        .skeleton-shimmer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); animation: shimmer 2s infinite; transform: translateX(-100%); }
        .skeleton-image { height: 180px; background: #f1f5f9; border-radius: 16px; margin-bottom: 16px; }
        .skeleton-title { height: 16px; background: #f1f5f9; border-radius: 8px; width: 70%; margin-bottom: 8px; }
        .skeleton-subtitle { height: 12px; background: #f8fafc; border-radius: 8px; width: 40%; margin-bottom: 20px; }
        .skeleton-button { height: 45px; background: #f1f5f9; border-radius: 12px; width: 100%; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 ml-20 transition-all relative h-screen">
        {activeView === 'sales' ? (
          <div className="flex flex-col md:flex-row w-full h-full animate-in fade-in duration-500 overflow-hidden text-left">
            <PrintableInvoice cart={cart} buyerName={buyerName} buyerAddress={buyerAddress} total={totalAmount} tempId={tempId} />
            <ErrorModal isOpen={errorStatus.show} message={errorStatus.msg} onClose={() => setErrorStatus({ show: false, msg: "" })} />
            <CustomerEntryModal 
                isOpen={showBuyerEntry} 
                onClose={() => setShowBuyerEntry(false)} 
                buyerName={buyerName} setBuyerName={setBuyerName} 
                buyerAddress={buyerAddress} setBuyerAddress={setBuyerAddress}
                isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous}
                onConfirm={() => { setIsBuyerSet(true); setShowBuyerEntry(false); if (selectedProduct) setIsModalOpen(true); }}
            />
            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmAdd} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <TerminalHeader 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                totalSalesToday={totalSalesToday} sortBy={sortBy} setSortBy={setSortBy} 
              />
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                  ) : (
                    getSortedProducts().map((p) => (
                      <ProductCard 
                        key={p.id} item={p} 
                        onAdd={() => { setSelectedProduct(p); if (!isBuyerSet) setShowBuyerEntry(true); else setIsModalOpen(true); }} 
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="w-full md:w-100 bg-white flex flex-col h-screen border-l border-slate-100 shadow-2xl z-50">
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase leading-none">RECEIPT</h2>
                    {isBuyerSet && <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded mt-2 inline-block truncate max-w-[150px]">Buyer: {isAnonymous ? "Walking Customer" : buyerName}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">TRX ID</p>
                    <p className="text-[11px] font-mono font-bold text-slate-400">#TEMP-{tempId}</p>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
              </div>

              <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-200">
                    <FiShoppingBag size={64} className="mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">No items selected</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <CartItemRow key={item.id} item={item} onIncrease={(id) => updateQuantity(id, 1)} onDecrease={(id) => updateQuantity(id, -1)} onRemove={removeFromCart} />
                  ))
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">GRAND TOTAL</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-blue-600 font-bold text-sm">NLE</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={onCompleteSale} 
                  disabled={isProcessing || cart.length === 0} 
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? <FiLoader className="spin" /> : "COMPLETE SALE"}
                </button>
                <button onClick={() => window.print()} className="w-full mt-4 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <FiPrinter size={14}/> PRINT INVOICE
                </button>
              </div>
            </aside>
          </div>
        ) : activeView === 'receipts' ? (
          <ReceiptsLog />
        ) : (
          <SalesHistory /> 
        )}
      </main>

      {/* --- ADDED CHAT COMPONENT HERE --- */}
      <TerminalChat />

    </div>
  )
}