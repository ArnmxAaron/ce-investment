'use client'
import { BulkImport } from './BulkImport'
import { AddProductForm } from './AddProductForm'
import { FiCpu, FiPlusSquare, FiDatabase } from 'react-icons/fi'

export function InventorySidebar({ onImport, onManualAdd, loading }: any) {
  return (
    <aside className="w-80 bg-[#FBFDFF] border-r border-slate-100 flex flex-col hidden lg:flex">
      {/* Sidebar Header/Status */}
      <div className="p-6 border-b border-slate-50 bg-white">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
          <FiCpu className="text-blue-400 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Control Center</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {/* Bulk Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <FiDatabase className="text-slate-400" size={14} />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Bulk Operations</h3>
          </div>
          <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
            <BulkImport onImportFull={onImport} />
          </div>
        </section>
        
        {/* Divider with subtle label */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[8px] uppercase font-black text-slate-300 bg-[#FBFDFF] px-2 w-max mx-auto tracking-[0.3em]">OR</div>
        </div>
        
        {/* Manual Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <FiPlusSquare className="text-slate-400" size={14} />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Single Entry</h3>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <AddProductForm onAdd={onManualAdd} loading={loading} />
          </div>
        </section>
      </div>

      {/* Mini Footer */}
      <div className="p-6 text-center">
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
          C & E Systems <br/> v2.0.4 Stable
        </p>
      </div>
    </aside>
  )
}