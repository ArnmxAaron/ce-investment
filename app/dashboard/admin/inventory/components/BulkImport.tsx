'use client'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { FiUploadCloud, FiCheckCircle, FiLoader } from 'react-icons/fi'

interface Props {
  // Updated to receive the full Workbook object for multi-tab processing
  onImportFull: (workbook: XLSX.WorkBook) => Promise<void>;
}

export function BulkImport({ onImportFull }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('idle');
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        // Read the file as a Workbook object to access all tabs (General, Zinc, Paints, etc.)
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        // Pass the entire workbook to page.tsx for multi-tab processing
        await onImportFull(wb);
        
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      } catch (err) {
        console.error("Upload Error:", err);
        setStatus('error');
        alert("Failed to read Excel file. Ensure it is a valid .xlsx or .xls file.");
      } finally {
        setLoading(false);
        // Reset input value so the same file can be uploaded again if needed
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setStatus('error');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full">
      <label className={`
        relative flex flex-col items-center justify-center w-full h-40 
        border-2 border-dashed rounded-[2.5rem] cursor-pointer
        transition-all duration-500 group
        ${status === 'success' ? 'bg-emerald-50 border-emerald-300' : 
          status === 'error' ? 'bg-rose-50 border-rose-200' :
          'bg-white border-slate-100 hover:border-blue-400 hover:bg-blue-50/30'}
      `}>
        <div className="flex flex-col items-center justify-center px-6 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Reading All Tabs...</p>
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600 animate-bounce">
              <FiCheckCircle size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">Multi-Tab Import Ready!</p>
            </div>
          ) : (
            <>
              <div className="mb-3 p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-slate-400">
                <FiUploadCloud size={32} />
              </div>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                Bulk Upload Master Excel <br/>
                <span className="text-[9px] font-bold text-slate-400 italic normal-case">
                  (ITEM, DESCRIPTION, UNIT PRICE)
                </span>
              </p>
              <div className="mt-4 flex gap-2">
                {['General', 'Zinc', 'Paints'].map(tab => (
                  <span key={tab} className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-md uppercase">
                    {tab}
                  </span>
                ))}
                <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-md uppercase">...</span>
              </div>
            </>
          )}
        </div>
        
        <input 
          type="file" 
          className="hidden" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          disabled={loading} 
        />
      </label>
      
      {status === 'success' && (
        <p className="mt-2 text-center text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
          Check the right panel to update stock counts
        </p>
      )}
    </div>
  )
}