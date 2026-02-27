'use client'
import { BulkImport } from './BulkImport'
import { AddProductForm } from './AddProductForm'
import { FiCpu, FiPlusSquare, FiDatabase, FiCheckCircle, FiXCircle } from 'react-icons/fi'

export function InventorySidebar({ onImport, onManualAdd, loading, products = [] }: any) {
  // Check if data is actually arriving
  const isDataLoaded = products && products.length > 0;

  return (
    <aside className="w-80 bg-[#FBFDFF] border-r border-slate-100 flex flex-col hidden lg:flex h-full">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-50 bg-white">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
          <div className="flex items-center gap-3">
            <FiCpu className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Control Center</span>
          </div>
          {/* Visual Data Status */}
          {isDataLoaded ? (
            <FiCheckCircle className="text-green-400" size={12} title="Data Connected" />
          ) : (
            <FiXCircle className="text-red-400 animate-bounce" size={12} title="No Data Found" />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {/* Bulk Section */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <FiDatabase className="text-slate-400" size={14} />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Bulk Operations</h3>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <BulkImport onImportFull={onImport} />
          </div>
        </section>
        
        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-300 bg-[#FBFDFF] px-2 w-max mx-auto tracking-[0.3em]">OR</div>
        </div>
        
        {/* Manual Section */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <FiPlusSquare className="text-slate-400" size={14} />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Single Entry</h3>
          </div>
          
          {/* THE FORM: Now explicitly passing products */}
          <AddProductForm 
            onAdd={onManualAdd} 
            loading={loading} 
            existingProducts={products} 
          />
        </section>
      </div>

      <div className="p-6 text-center border-t border-slate-50">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
          C & E Systems <br/> 
          <span className={isDataLoaded ? "text-blue-400" : "text-red-400"}>
            {products?.length || 0} ITEMS IN MEMORY
          </span>
        </p>
      </div>
    </aside>
  )
}