'use client'
import { FiAward, FiPackage, FiChevronRight, FiTrendingUp } from 'react-icons/fi'

export function TopProducts({ products = [] }: { products: any[] }) {
  // 1. Calculate max revenue to normalize the performance bars
  const maxRevenue = products.length > 0 
    ? Math.max(...products.map(p => p.revenue || 0), 1) 
    : 1;

  return (
    <div className="py-10 bg-white">
      {/* Header Section */}
      <div className="mb-10 px-2 flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
            <FiTrendingUp size={14} /> Performance Leaders
          </h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Top Sellers
          </h2>
        </div>
        <div className="text-right pb-1">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Ranked by
          </p>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
            Gross Revenue
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-1">
        {products.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem]">
            <FiPackage size={32} className="mx-auto mb-4 text-slate-100" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Waiting for Sales Data...
            </p>
          </div>
        ) : (
          products.map((product, idx) => {
            // Calculate percentage for the performance bar
            const performanceWidth = ((product.revenue || 0) / maxRevenue) * 100;
            
            return (
              <div 
                key={product.id || idx} 
                className="group relative p-5 rounded-[1.5rem] hover:bg-slate-50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-5">
                    {/* Rank Badge */}
                    <div className={`
                      h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs italic transition-all
                      ${idx === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 group-hover:bg-white'}
                    `}>
                      #{idx + 1}
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">
                          {product.category || 'General'}
                        </span>
                        {product.variant_count > 1 && (
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">
                            • {product.variant_count} Variants
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-400">NLE</span>
                      <span className="text-lg font-black text-slate-900 leading-none tracking-tighter">
                        {(product.revenue || 0).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                      +{product.units || 0} Units
                    </p>
                  </div>
                </div>

                {/* Performance Progress Bar */}
                <div className="relative">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm
                        ${idx === 0 ? 'bg-blue-600' : 'bg-slate-400 group-hover:bg-blue-400'}
                      `}
                      style={{ width: `${performanceWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer Action */}
      <button className="w-full mt-10 flex items-center justify-center gap-3 py-5 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-400 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-100 uppercase tracking-[0.25em] transition-all group">
        <FiAward className="group-hover:scale-125 transition-transform" />
        Analyze Full Product Performance
        <FiChevronRight />
      </button>
    </div>
  )
}