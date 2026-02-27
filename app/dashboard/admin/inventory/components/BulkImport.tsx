'use client'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { FiUploadCloud, FiCheckCircle, FiLoader, FiAlertTriangle, FiTrash2 } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'

interface Props {
  // Receives the Workbook object for multi-tab processing
  onImportFull: (workbook: XLSX.WorkBook) => Promise<void>;
}

export function BulkImport({ onImportFull }: Props) {
  const [loading, setLoading] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // OPTIONAL: Function to wipe the database before a clean re-import
  const handleWipeDatabase = async () => {
    const confirmWipe = confirm("⚠️ WARNING: This will delete ALL products in the database. Are you sure you want to start fresh?");
    if (!confirmWipe) return;

    setIsWiping(true);
    try {
      // Deletes all rows from the products table
      const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      alert("Database wiped successfully. You can now upload the clean Excel.");
    } catch (err: any) {
      alert("Error wiping database: " + err.message);
    } finally {
      setIsWiping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('idle');
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        // Read the file as a Workbook object to access all tabs
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        // Pass the entire workbook to the parent page logic (handleImportFull)
        await onImportFull(wb);
        
        setStatus('success');
        setTimeout(() => setStatus('idle'), 4000);
      } catch (err) {
        console.error("Upload Error:", err);
        setStatus('error');
        alert("Failed to read Excel file. Ensure it is a valid .xlsx or .xls file.");
      } finally {
        setLoading(false);
        e.target.value = ''; // Reset input
      }
    };

    reader.onerror = () => {
      setLoading(false);
      setStatus('error');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full space-y-4">
      {/* Wipe Database Button - Crucial for fixing your duplicate issue */}
      <button
        onClick={handleWipeDatabase}
        disabled={isWiping || loading}
        className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group"
      >
        {isWiping ? (
          <FiLoader className="animate-spin text-rose-500" />
        ) : (
          <FiTrash2 className="text-rose-500 group-hover:scale-110 transition-transform" />
        )}
        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
          {isWiping ? "Wiping Database..." : "Wipe Database for Clean Import"}
        </span>
      </button>

      <label className={`
        relative flex flex-col items-center justify-center w-full h-44 
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
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Processing Multi-Tabs...</p>
            </div>
          ) : status === 'success' ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600 animate-bounce">
              <FiCheckCircle size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">Master Sync Complete!</p>
            </div>
          ) : (
            <>
              <div className="mb-3 p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-slate-400">
                <FiUploadCloud size={32} />
              </div>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                Upload Master Excel <br/>
                <span className="text-[9px] font-bold text-slate-400 italic normal-case block mt-1">
                  (Groups duplicates & cleans 45/50 prices)
                </span>
              </p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {['General', 'Zinc', 'Paints'].map(tab => (
                  <span key={tab} className="text-[7px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md uppercase border border-slate-200">
                    {tab}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        
        <input 
          type="file" 
          className="hidden" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          disabled={loading || isWiping} 
        />
      </label>
      
      {status === 'error' && (
        <p className="text-center text-[9px] font-black text-rose-500 uppercase flex items-center justify-center gap-1">
          <FiAlertTriangle /> Error reading file. Check format.
        </p>
      )}
    </div>
  )
}