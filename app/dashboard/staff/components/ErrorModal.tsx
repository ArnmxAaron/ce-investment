import { FiAlertCircle, FiX } from 'react-icons/fi';

export const ErrorModal = ({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string; }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-rose-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
        <div className="bg-rose-50 w-20 h-20 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
          <FiAlertCircle size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Action Required</h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-8 px-4">{message}</p>
        <button onClick={onClose} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2"><FiX /> Close & Review</button>
      </div>
    </div>
  );
};