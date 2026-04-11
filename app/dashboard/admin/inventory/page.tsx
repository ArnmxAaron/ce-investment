'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { InventoryList } from './components/InventoryList'
import { InventoryHeader } from './components/InventoryHeader'
import { InventorySidebar } from './components/InventorySidebar'
import { useInventoryActions } from './useInventoryActions'
import { useInventoryUndo } from './useInventoryUndo'
import { FiRefreshCw } from 'react-icons/fi'

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyZero, setShowOnlyZero] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [newUpdate, setNewUpdate] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'staff'>('admin')

  const { executeCleanup, executeBulkImport, executeManualAdd } = useInventoryActions(fetchInventory)
  
  const { 
    showUndo, 
    undoItem, 
    errorMessage, 
    startDeleteTimer, 
    handleUndo, 
    UNDO_DURATION 
  } = useInventoryUndo(products, setProducts)

  const handleUpdateProduct = useCallback((updatedProduct: any) => {
    setProducts(prev => 
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    )
  }, [])

  // --- RE-FETCH LOGIC ---
  async function fetchInventory() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('name', { ascending: true }) 
      
      if (error) throw error

      const processedData = (data || []).map(p => {
        if (p.image_url && !p.image_url.startsWith('http')) {
          const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(p.image_url)
          return { ...p, image_url: publicUrlData.publicUrl }
        }
        return p
      })

      setProducts(processedData)
      
      // Auto-hide the sync indicator after 3 seconds
      setTimeout(() => setNewUpdate(false), 3000)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setIsInitialLoading(false)
    }
  }

  // --- REAL-TIME DUAL SUBSCRIPTION ---
  useEffect(() => { 
    fetchInventory() 

    // 1. Listen for Inventory changes (Manual Edits)
    const productChannel = supabase
      .channel('admin-inventory-live-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, (payload) => {
        console.log("Product update detected")
        setNewUpdate(true)
        fetchInventory() 
      })
      .subscribe()

    // 2. Listen for Sales changes (Staff Receipts)
    // This ensures stock levels refresh as soon as a receipt is generated
    const salesChannel = supabase
      .channel('admin-sales-sync')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'sales' 
      }, (payload) => {
        console.log("New Sale recorded! Refreshing stock levels...")
        setNewUpdate(true)
        fetchInventory() 
      })
      .subscribe()

    return () => { 
        supabase.removeChannel(productChannel)
        supabase.removeChannel(salesChannel)
    }
  }, [])

  // --- HANDLERS ---
  const handleManualAdd = async (name: string, variants: any) => {
    setLoading(true)
    await executeManualAdd(name, variants, setLoading)
    setLoading(false)
  }

  const handleBulkImport = async (wb: any) => {
    setLoading(true)
    await executeBulkImport(wb, setLoading)
    setLoading(false)
  }

  const handleCleanup = async () => {
    setLoading(true)
    await executeCleanup(setLoading)
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return products
      .filter(p => {
        if (!p || !p.name) return false;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const hasZeroStock = Array.isArray(p.variants) && p.variants.some((v: any) => v.stock <= 0)
        return showOnlyZero ? (matchesSearch && hasZeroStock) : matchesSearch
      })
      .filter((p, i, self) => 
        i === self.findIndex(t => t.name?.trim().toUpperCase() === p.name?.trim().toUpperCase())
      )
  }, [products, searchQuery, showOnlyZero])

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden relative text-slate-900 font-sans">
      <InventoryHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        showOnlyZero={showOnlyZero} 
        setShowOnlyZero={setShowOnlyZero} 
        products={products} 
      />

      {/* Real-time Status Indicator */}
      <AnimatePresence>
        {newUpdate && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-24 right-10 z-[100] bg-blue-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20"
          >
            <FiRefreshCw className="animate-spin text-sm" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Sync Active</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-1 overflow-hidden w-full">
        <aside className="hidden md:block w-72 lg:w-80 xl:w-96 border-r bg-white overflow-y-auto">
          <InventorySidebar 
            userRole={userRole}
            onImport={handleBulkImport}
            onManualAdd={handleManualAdd}
            onCleanup={handleCleanup}
            loading={loading} 
            products={products} 
          />
        </aside>
        
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-10 w-full bg-slate-50/50">
          <div className="max-w-[1400px] mx-auto text-left">
            {isInitialLoading ? (
              <div className="flex justify-center p-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <InventoryList 
                    key={p.id}
                    product={p} 
                    userRole={userRole} 
                    onUpdate={handleUpdateProduct}
                    onDelete={(id: string) => startDeleteTimer(id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showUndo && (
          <motion.div 
            initial={{ y: 100, x: "-50%", opacity: 0 }} 
            animate={{ y: 0, x: "-50%", opacity: 1 }} 
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className={`fixed bottom-10 left-1/2 z-[1000] w-[90%] max-w-md ${errorMessage ? 'bg-rose-600' : 'bg-slate-900'} text-white rounded-3xl shadow-2xl overflow-hidden border border-white/10`}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                  {errorMessage ? 'System Error' : 'Removing Item'}
                </span>
                <span className="text-sm font-bold truncate max-w-[200px]">
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

      {loading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}