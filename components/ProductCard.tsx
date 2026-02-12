import { Product } from '../hooks/useSalesLogic'

interface ProductCardProps {
  item: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ item, onAdd }: ProductCardProps) => {
  const isLowStock = item.stock_qty < 10;

  return (
    <div className="group relative bg-white rounded-3xl p-5 transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] border border-slate-100/80 overflow-hidden">
      {/* Decorative Glow Background */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-50/50 blur-3xl transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {item.category}
            </span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isLowStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {item.stock_qty} in stock
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-800 leading-snug h-12 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {item.name}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-blue-600 uppercase">NLe</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono leading-none">
                {item.price.toLocaleString()}
              </span>
            </div>
          </div>

          <button 
            onClick={() => onAdd(item)}
            className="flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 active:scale-90 transition-all duration-300"
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}