'use client'
import { BulkImport } from './BulkImport'
import { AddProductForm } from './AddProductForm'

export function InventorySidebar({ onImport, onManualAdd, loading }: any) {
  return (
    <aside className="w-80 bg-white border-r border-slate-100 p-6 overflow-y-auto hidden lg:block">
      <div className="space-y-8">
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bulk Tools</h3>
          <BulkImport onImportFull={onImport} />
        </div>
        
        <div className="h-px bg-slate-50" />
        
        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Manual Entry</h3>
          <AddProductForm onAdd={onManualAdd} loading={loading} />
        </div>
      </div>
    </aside>
  )
}