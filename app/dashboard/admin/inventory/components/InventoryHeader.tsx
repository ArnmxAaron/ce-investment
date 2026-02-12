'use client'
import { FiSearch, FiDownload, FiFileText, FiFilter } from 'react-icons/fi'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function InventoryHeader({ searchQuery, setSearchQuery, showOnlyZero, setShowOnlyZero, products }: any) {
  
  const exportToExcel = () => {
    const data = products.flatMap((p: any) => p.variants.map((v: any) => ({
      "ITEM": p.name, "DESCRIPTION": v.type, "UNIT PRICE": v.price, "STOCK": v.stock
    })))
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "C_E_Stock_Backup.xlsx");
  }

  return (
    <header className="bg-white border-b border-slate-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4 z-20">
      <h1 className="text-2xl font-black uppercase italic tracking-tighter">Inventory</h1>
      
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setShowOnlyZero(!showOnlyZero)}
          className={`p-2 rounded-xl border transition-all ${showOnlyZero ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
        >
          <FiFilter size={20} />
        </button>

        <button onClick={exportToExcel} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl font-black text-xs uppercase hover:bg-slate-50">
          <FiDownload className="text-emerald-600" /> Excel
        </button>
      </div>
    </header>
  )
}