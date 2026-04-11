import { FiUser, FiX, FiCheck } from 'react-icons/fi';

export const CustomerEntryModal = ({ isOpen, onClose, buyerName, setBuyerName, buyerAddress, setBuyerAddress, isAnonymous, setIsAnonymous, onConfirm }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-8 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><FiUser size={20} /></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Entry</span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-rose-500 transition-colors"><FiX size={24} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="space-y-4">
          <div className={`space-y-4 transition-all duration-300 ${isAnonymous ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            <input autoFocus required={!isAnonymous} placeholder="Customer Name" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            <input placeholder="Address (Optional)" className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer border border-transparent hover:border-slate-200 transition-all">
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>
              {isAnonymous && <FiCheck className="text-white" />}
              <input type="checkbox" className="hidden" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-600">Walking Customer</span>
          </label>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
            {isAnonymous ? "Skip and Continue" : "Confirm Details"}
          </button>
        </form>
      </div>
    </div>
  );
};