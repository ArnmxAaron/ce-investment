'use client'
export function SalesFeed({ sales }: { sales: any[] }) {
  return (
    <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-900/20 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-blue-400 uppercase tracking-[0.2em] text-[10px]">Live Sales Feed</h3>
        <span className="bg-white/10 px-2 py-1 rounded text-[8px] font-black animate-pulse">LIVE</span>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
        {sales.map((sale) => (
          <div key={sale.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-black text-xs">
                {sale.products?.name[0]}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-tight truncate w-24 mb-1 leading-none">{sale.products?.name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">{sale.profiles?.full_name?.split(' ')[0]}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-black text-blue-400 text-sm">+{sale.total_price}</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase">NLe</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}