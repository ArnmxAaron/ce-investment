'use client'
import { useState, useMemo } from 'react'
import { BulkImport } from './BulkImport'
import { AddProductForm } from './AddProductForm'
import { motion, AnimatePresence } from 'framer-motion' 
import { 
  FiCpu, FiPlusSquare, FiDatabase, FiCheckCircle, 
  FiXCircle, FiSearch, FiMenu, FiX, FiAlertCircle 
} from 'react-icons/fi'

export function InventorySidebar({ onImport, onManualAdd, loading, products = [] }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const isDataLoaded = products && products.length > 0;

  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase().trim();
    return products.filter((p: any) => 
      (p.name || "").toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery, products]);

  const exactMatch = products.find(
    (p: any) => (p.name || "").toLowerCase() === searchQuery.toLowerCase().trim()
  );

  return (
    <>
      {/* MOBILE TOGGLE - Fixed Z-index */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-slate-900 text-white p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* MOBILE OVERLAY - Improved conditional logic */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // We use pointer-events-auto only when open to prevent "ghost" blocking
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] lg:hidden pointer-events-auto" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[90]
        w-80 bg-[#FBFDFF] border-r border-slate-100 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full bg-white
      `}>
        {/* HEADER */}
        <div className="p-6 border-b border-slate-50 shrink-0">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <FiCpu className="text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Control Center</span>
            </div>
            {isDataLoaded ? <FiCheckCircle className="text-green-400" size={12} /> : <FiXCircle className="text-red-400" size={12} />}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* REGISTRY CHECK */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
              <FiSearch className="text-slate-400" size={14} />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry Check</h3>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Search or check name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />

              <AnimatePresence>
                {suggestions.length > 0 && !exactMatch && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 z-[110] bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden"
                  >
                    <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">System Suggestions:</span>
                    </div>
                    {suggestions.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setSearchQuery(p.name)}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex flex-col border-b border-slate-50 last:border-0"
                      >
                        <span className="text-[11px] font-bold text-slate-700 uppercase">{p.name}</span>
                        <span className="text-[8px] text-slate-400 font-black">EXISTING RECORD</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-3">
              {searchQuery.length > 1 && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-3 rounded-2xl flex items-center gap-3 border ${
                  exactMatch ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
                }`}>
                  {exactMatch ? (
                    <>
                      <FiAlertCircle className="text-rose-500" size={16} />
                      <div>
                        <p className="text-[10px] font-black text-rose-700 uppercase leading-tight">Name Taken</p>
                        <p className="text-[8px] text-rose-500 font-bold uppercase">{exactMatch.name}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-emerald-500" size={16} />
                      <p className="text-[10px] font-black text-emerald-700 uppercase leading-tight">
                        Unique Name <br/>
                        <span className="opacity-60 text-[8px]">Safe to add</span>
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </section>

          {/* Bulk Import */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
              <FiDatabase className="text-slate-400" size={14} />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Bulk Entry</h3>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <BulkImport onImportFull={onImport} />
            </div>
          </section>
          
          <div className="relative py-2 text-center text-[8px] font-black text-slate-300 tracking-[0.4em]">OR</div>
          
          {/* Manual Entry Form */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
              <FiPlusSquare className="text-slate-400" size={14} />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Manual Entry</h3>
            </div>
            <AddProductForm 
              onAdd={onManualAdd} 
              loading={loading} 
              existingProducts={products}
              // This logic ensures the form is either empty or follows the search
              {...({ defaultName: exactMatch ? '' : searchQuery } as any)} 
            />
          </section>
        </div>

        <div className="p-6 text-center border-t border-slate-50 shrink-0 bg-white">
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
            C & E Systems <br/> 
            <span className={isDataLoaded ? "text-blue-400" : "text-red-400"}>
              {products?.length || 0} TOTAL ITEMS
            </span>
          </p>
        </div>
      </aside>
    </>
  )
}