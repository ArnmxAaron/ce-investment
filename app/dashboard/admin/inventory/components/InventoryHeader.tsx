'use client'
import { FiSearch, FiDownload, FiFilter, FiActivity } from 'react-icons/fi'
import * as XLSX from 'xlsx'

export function InventoryHeader({ searchQuery, setSearchQuery, showOnlyZero, setShowOnlyZero, products }: any) {
  
  // 1. Calculate Grand Total Value (Price * Stock for every single item)
  const grandTotalValue = products.reduce((acc: number, product: any) => {
    const productVal = product.variants?.reduce((vAcc: number, v: any) => 
      vAcc + ((v.stock || 0) * (v.price || 0)), 0
    );
    return acc + (productVal || 0);
  }, 0);

  // 2. Count Total Unique Items (Variants)
  const totalItemsCount = products.reduce((acc: number, p: any) => acc + (p.variants?.length || 0), 0);

  const exportToExcel = () => {
    const data = products.flatMap((p: any) => p.variants.map((v: any) => ({
      "ITEM": p.name, 
      "DESCRIPTION": v.type, 
      "UNIT PRICE": v.price, 
      "STOCK": v.stock,
      "TOTAL VALUE": (v.price || 0) * (v.stock || 0)
    })))
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `C_E_Stock_Report_${new Date().toLocaleDateString()}.xlsx`);
  }

  return (
    <header className="bg-white border-b border-slate-100 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 z-20">
      {/* BRANDING & TOTAL VALUE */}
      <div className="flex items-center gap-6 w-full xl:w-auto">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Inventory</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
              <FiActivity size={12} /> {totalItemsCount} Products
            </span>
          </div>
        </div>

        <div className="h-10 w-px bg-slate-100 hidden md:block" />

        <div className="hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Warehouse Value</p>
          <p className="text-xl font-mono font-black text-emerald-600">
            NLe {grandTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap gap-3 w-full xl:w-auto">
        <div className="relative flex-1 md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-[1.2rem] font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search items or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setShowOnlyZero(!showOnlyZero)}
          className={`flex items-center gap-2 px-5 py-3 rounded-[1.2rem] border font-black text-[10px] uppercase tracking-widest transition-all ${
            showOnlyZero 
            ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200' 
            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <FiFilter size={16} /> {showOnlyZero ? 'Out of Stock' : 'Filter 0'}
        </button>

        <button 
          onClick={exportToExcel} 
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
        >
          <FiDownload className="text-emerald-400" /> Export Excel
        </button>
      </div>

      {/* MOBILE ONLY VALUE DISPLAY */}
      <div className="md:hidden w-full p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total Value</p>
        <p className="text-lg font-mono font-black text-emerald-700">NLe {grandTotalValue.toLocaleString()}</p>
      </div>
    </header>
  )
}