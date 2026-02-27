'use client'
import { FiAward, FiPackage, FiChevronRight } from 'react-icons/fi'

export function TopProducts({ products = [] }: { products: any[] }) {
  // Find the highest revenue to calculate relative progress bars
  const maxRevenue = products.length > 0 
    ? Math.max(...products.map(p => p.revenue || 0), 1) 
    : 1;

  return (
    <div className="py-10 border-b border-slate-100 bg-white">
      {/* Header Section */}
      <div className="mb-10 px-2 flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
            <FiAward size={14} /> Inventory Leaders
          </h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Top Sellers
          </h2>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1">
          By Revenue
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-2">
        {products.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No data available</p>
          </div>
        ) : (
          products.map((product, idx) => (
            <div 
              key={idx} 
              className="group relative p-4 rounded-2xl hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-300 group-hover:text-blue-600 transition-colors italic w-5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                      {product.name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                      {product.category || 'Standard Entry'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none tracking-tighter">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">NLe</span>
                    {(product.revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[9px] font-black text-emerald-600 uppercase mt-1">
                    {product.units || 0} Units Sold
                  </p>
                </div>
              </div>

              {/* Visual Performance Bar - Executive Standard */}
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((product.revenue || 0) / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Action */}
      <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-all group">
        <FiPackage />
        View Full Inventory Report
        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}