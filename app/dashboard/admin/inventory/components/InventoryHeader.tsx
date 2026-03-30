'use client'
import { useState, useMemo } from 'react'
import { FiSearch, FiDownload, FiFilter, FiActivity, FiRefreshCw } from 'react-icons/fi'
import * as XLSX from 'xlsx'

interface Variant {
  type?: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  variants: Variant[] | string; // Supporting string in case of raw JSONB returns
}

interface InventoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showOnlyZero: boolean;
  setShowOnlyZero: (show: boolean) => void;
  products: Product[];
  onRefresh?: () => Promise<void>;
}

export function InventoryHeader({ 
  searchQuery, 
  setSearchQuery, 
  showOnlyZero, 
  setShowOnlyZero, 
  products = [], 
  onRefresh 
}: InventoryHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // --- BULLETPROOF CALCULATION ---
  // Memoizing this ensures it only re-calculates when the products array changes
  const { grandTotalValue, totalItemsCount } = useMemo(() => {
    let totalValue = 0;
    let totalVariants = 0;

    products.forEach((p) => {
      // 1. Ensure variants is an array (Parse if it's a JSON string)
      const variantsArray: Variant[] = Array.isArray(p.variants) 
        ? p.variants 
        : typeof p.variants === 'string' 
          ? JSON.parse(p.variants) 
          : [];

      totalVariants += variantsArray.length;

      // 2. Sum up the value for this specific product
      const productSum = variantsArray.reduce((sum, v) => {
        const p = Number(v.price) || 0;
        const s = Number(v.stock) || 0;
        return sum + (p * s);
      }, 0);

      totalValue += productSum;
    });

    return { grandTotalValue: totalValue, totalItemsCount: totalVariants };
  }, [products]);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }

  const exportToExcel = () => {
    if (products.length === 0) return;
    
    const data = products.flatMap((p) => {
      const variantsArray: Variant[] = Array.isArray(p.variants) 
        ? p.variants 
        : typeof p.variants === 'string' 
          ? JSON.parse(p.variants) 
          : [];

      return variantsArray.map((v) => ({
        "ITEM NAME": p.name, 
        "VARIANT/TYPE": v.type || 'Standard', 
        "UNIT PRICE (NLe)": Number(v.price) || 0, 
        "CURRENT STOCK": Number(v.stock) || 0,
        "SUBTOTAL VALUE": (Number(v.price) || 0) * (Number(v.stock) || 0)
      }));
    });
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory_Report");
    XLSX.writeFile(wb, `CE_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  return (
    <header className="w-full bg-white border-b border-slate-100 p-6 px-4 md:px-8 lg:px-12 flex flex-col xl:flex-row justify-between items-center gap-6 z-20">
      
      {/* BRANDING & TOTALS */}
      <div className="flex items-center justify-between xl:justify-start gap-8 w-full xl:w-auto flex-1">
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Inventory</h1>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-all active:scale-90"
            >
              <FiRefreshCw className={`text-lg ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
              <FiActivity size={12} /> {totalItemsCount} Variations
            </span>
          </div>
        </div>

        <div className="h-10 w-px bg-slate-100 hidden md:block" />

        {/* DESKTOP VALUE DISPLAY */}
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Warehouse Value</p>
          <p className="text-xl font-mono font-black text-emerald-600">
            NLe {grandTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full xl:w-auto xl:flex-1 xl:justify-end">
        <div className="relative flex-1 max-w-md w-full md:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-[1.2rem] font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
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
            <FiDownload className="text-emerald-400" /> 
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* MOBILE VALUE DISPLAY */}
      <div className="md:hidden w-full p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Warehouse Value</p>
        <p className="text-lg font-mono font-black text-emerald-700">
          NLe {grandTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </header>
  )
}