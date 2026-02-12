import { CartItem } from '../../../hooks/useSalesLogic'

interface Props {
  item: CartItem;
  onEdit: (item: CartItem) => void;
}

export function CartItemRow({ item, onEdit }: Props) {
  return (
    <div className="flex justify-between items-start group animate-in fade-in slide-in-from-right-4 duration-300 bg-white hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-black text-xs uppercase text-slate-800 leading-tight">{item.name}</p>
          <button 
            onClick={() => onEdit(item)}
            className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <p className="text-[11px] font-bold text-blue-500 font-mono">
          {item.quantity} × {item.price.toLocaleString()}
        </p>
      </div>
      <p className="font-black text-sm text-slate-900 font-mono bg-slate-50 px-3 py-1 rounded-lg">
        {(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  );
}