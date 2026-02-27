'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { InventoryList } from './components/InventoryList'
import { InventoryHeader } from './components/InventoryHeader'
import { InventorySidebar } from './components/InventorySidebar'
import { AdminAccessModal } from '@/components/ui/AdminAccessModal'
import { useInventoryActions } from './useInventoryActions'
import { useInventoryUndo } from './useInventoryUndo'

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyZero, setShowOnlyZero] = useState(false)
  const [loading, setLoading] = useState(false)
  // New state for skeleton loading on initial fetch
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string, payload: any } | null>(null)

  const { executeCleanup, executeBulkImport, executeManualAdd } = useInventoryActions(fetchInventory)
  
  const { 
    showUndo, 
    undoItem, 
    errorMessage, 
    startDeleteTimer, 
    handleUndo, 
    UNDO_DURATION 
  } = useInventoryUndo(products, setProducts)

  const forceUnlockScreen = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
    setLoading(false);
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
    const backdrops = document.querySelectorAll('.fixed.inset-0');
    backdrops.forEach(el => (el as HTMLElement).style.display = 'none');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') forceUnlockScreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forceUnlockScreen]);

  useEffect(() => { fetchInventory() }, [])

  async function fetchInventory() {
    try {
      // Show skeleton only if it's the first load or explicit refresh
      if (products.length === 0) setIsInitialLoading(true)
      
      const { data } = await supabase
        .from('products')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('name', { ascending: true }) 
      
      setProducts(data || [])
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleSecuritySuccess = async () => {
    const action = pendingAction
    forceUnlockScreen();
    if (!action) return

    try {
      if (action.type === 'delete') {
        startDeleteTimer(action.payload)
      } else if (action.type === 'import') {
        await executeBulkImport(action.payload, setLoading)
      } else if (action.type === 'add') {
        await executeManualAdd(action.payload.name, action.payload.variants, setLoading)
      } else if (action.type === 'cleanup') {
        await executeCleanup(setLoading)
      }
    } catch (error) {
      forceUnlockScreen();
    }
  }

  const filtered = products
    .filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const hasZeroStock = p.variants?.some((v: any) => v.stock === 0)
      return showOnlyZero ? (matchesSearch && hasZeroStock) : matchesSearch
    })
    .filter((p, i, self) => i === self.findIndex(t => t.name?.trim().toUpperCase() === p.name?.trim().toUpperCase()))
    .sort((a, b) => (a.name || "").toString().localeCompare((b.name || "").toString()))

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden relative text-slate-900 font-sans">
      <InventoryHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        showOnlyZero={showOnlyZero} 
        setShowOnlyZero={setShowOnlyZero} 
        products={products} 
      />
      
      <div className="flex flex-1 overflow-hidden w-full">
        <aside className="hidden md:block w-72 lg:w-80 xl:w-96 border-r bg-white/50 overflow-y-auto">
          <InventorySidebar 
            onImport={(wb: any) => { setPendingAction({ type: 'import', payload: wb }); setIsModalOpen(true); }}
            onManualAdd={(name: string, variants: any) => { setPendingAction({ type: 'add', payload: { name, variants } }); setIsModalOpen(true); }}
            onCleanup={() => { setPendingAction({ type: 'cleanup', payload: null }); setIsModalOpen(true); }}
            loading={loading} 
            products={products} 
          />
        </aside>
        
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-10 w-full">
          <div className="w-full">
            <InventoryList 
              products={filtered} 
              isLoading={isInitialLoading} // Pass skeleton state here
              onRefresh={fetchInventory} 
              onDelete={(id: string) => { 
                  setPendingAction({ type: 'delete', payload: id }); 
                  setIsModalOpen(true); 
              }} 
            />
          </div>
        </main>
      </div>

      {/* Undo UI, Modals, and Spinner Loading stay as they were */}
      <AnimatePresence>
        {showUndo && (
          <motion.div 
            initial={{ y: 100, x: "-50%", opacity: 0 }} 
            animate={{ y: 0, x: "-50%", opacity: 1 }} 
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className={`fixed bottom-10 left-1/2 z-[1000] w-[90%] max-w-[380px] ${errorMessage ? 'bg-rose-600' : 'bg-slate-900'} text-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 transition-colors duration-500`}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  {errorMessage ? 'System Error' : 'Removing Item'}
                </span>
                <span className="text-sm font-bold truncate max-w-[220px]">
                  {errorMessage ? errorMessage : undoItem?.name}
                </span>
              </div>
              {!errorMessage && (
                <button onClick={handleUndo} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-[11px] font-black uppercase transition-all active:scale-95">
                    Undo
                </button>
              )}
            </div>
            {!errorMessage && (
              <div className="h-1 w-full bg-white/10">
                <motion.div 
                    initial={{ width: "100%" }} 
                    animate={{ width: "0%" }} 
                    transition={{ duration: UNDO_DURATION / 1000, ease: "linear" }} 
                    className="h-full bg-blue-500" 
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {isModalOpen && (
          <AdminAccessModal key="master-security-lock" isOpen={isModalOpen} onClose={forceUnlockScreen} onSuccess={handleSecuritySuccess} />
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[9999] pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}