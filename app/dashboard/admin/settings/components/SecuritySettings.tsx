'use client'
import { FiShield, FiSave, FiLoader, FiToggleLeft, FiToggleRight } from 'react-icons/fi'

interface SecuritySettingsProps {
  form: { pin: string; timeout: number; lockEnabled: boolean };
  setForm: (form: any) => void;
  handleSave: () => Promise<boolean>;
  loading: boolean;
}

export const SecuritySettings = ({ form, setForm, handleSave, loading }: SecuritySettingsProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-lg">
      <h2 className="text-xl font-black mb-6 flex items-center gap-2">
        <FiShield className="text-blue-600" /> System Security
      </h2>
      
      <div className="space-y-6">
        {/* Toggle Lock - ADDED type="button" to prevent form submission/bubble-up */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
          <span className="text-sm font-bold text-slate-700">Auto-Lock System</span>
          <button 
            type="button" 
            onClick={() => setForm({...form, lockEnabled: !form.lockEnabled})}
            className="transition-transform active:scale-95"
          >
            {form.lockEnabled ? (
              <FiToggleRight size={28} className="text-emerald-500" />
            ) : (
              <FiToggleLeft size={28} className="text-slate-400" />
            )}
          </button>
        </div>

        {/* Dynamic Timeout Options */}
        {form.lockEnabled && (
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Lock Timeout Duration</label>
            <select 
              value={form.timeout}
              onChange={(e) => setForm({ ...form, timeout: Number(e.target.value) })}
              className="w-full mt-1 p-3 border rounded-xl font-bold bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={180000}>3 Minutes</option>
              <option value={300000}>5 Minutes</option>
              <option value={600000}>10 Minutes</option>
            </select>
          </div>
        )}

        {/* PIN Input */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Admin PIN</label>
          <input 
            type="password"
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
            className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter secure PIN"
          />
        </div>

        {/* Save Button */}
        <button 
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiSave />} Save Configuration
        </button>
      </div>
    </div>
  )
}