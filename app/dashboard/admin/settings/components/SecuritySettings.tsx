'use client'
import { useState, useEffect } from 'react'
import { FiKey, FiClock, FiLock, FiLoader, FiAlertTriangle, FiArrowRight, FiRefreshCw } from 'react-icons/fi'

export function SecuritySettings({ form, setForm, showPin, setShowPin, handleSave, loading, logs }: any) {
  const [stage, setStage] = useState<'input' | 'confirm'>('input')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (stage === 'confirm' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (stage === 'confirm' && timeLeft === 0) {
      resetProcess()
    }
    return () => clearInterval(timer)
  }, [stage, timeLeft])

  const resetProcess = () => {
    setStage('input')
    setConfirmPin('')
    setTimeLeft(30)
    setError(false)
  }

  const finalize = async () => {
    if (confirmPin === form.pin) {
      const success = await handleSave()
      if (success) resetProcess()
    } else {
      setError(true)
      setConfirmPin('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="max-w-md animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[1px] w-6 bg-blue-600" />
          <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.3em]">Protocol 04-A</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Access Control</h2>
      </header>

      {/* Fixed Height Container to prevent "jumping" */}
      <div className="min-h-[320px]">
        {stage === 'input' ? (
          <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <FiKey size={10} className="text-blue-600" /> New Master Pin
              </label>
              <input 
                type={showPin ? "text" : "password"} 
                value={form.pin}
                onChange={(e) => setForm({...form, pin: e.target.value.replace(/\D/g, '')})}
                maxLength={4}
                className="w-full bg-transparent text-xl font-black tracking-[0.4em] outline-none text-slate-900"
                placeholder="****"
              />
            </div>
            
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 mb-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <FiClock size={10} /> Auto-Lock
              </label>
              <select 
                value={form.timeout}
                onChange={(e) => setForm({...form, timeout: Number(e.target.value)})}
                className="w-full bg-transparent text-[10px] font-black uppercase italic text-slate-900 outline-none"
              >
                <option value={300000}>5 Minutes</option>
                <option value={900000}>15 Minutes</option>
              </select>
            </div>

            <button 
              onClick={() => setStage('confirm')}
              disabled={form.pin.length < 4}
              className="w-full py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all bg-slate-950 hover:bg-blue-600 text-white disabled:opacity-30"
            >
              Initialize Change <FiArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className={`p-5 rounded-2xl border transition-all shadow-sm ${error ? 'bg-rose-50 border-rose-200' : 'bg-blue-50/30 border-blue-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <label className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${error ? 'text-rose-500' : 'text-blue-600'}`}>
                  {error ? <FiAlertTriangle /> : <FiLock />} Confirm Action
                </label>
                <span className={`text-[10px] font-black tabular-nums px-2 py-0.5 rounded bg-white/50 border border-slate-200 ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
              </div>
              <input 
                autoFocus
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                className="w-full bg-transparent text-xl font-black tracking-[0.4em] outline-none text-slate-900"
                placeholder="****"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button onClick={resetProcess} className="col-span-1 py-4 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center border border-slate-200/50 hover:bg-slate-200 transition-all">
                <FiRefreshCw size={14} />
              </button>
              <button 
                onClick={finalize}
                disabled={loading || confirmPin.length < 4 || timeLeft === 0}
                className={`col-span-3 py-4 rounded-xl font-black uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${error ? 'bg-rose-600' : 'bg-blue-600'} text-white shadow-xl shadow-blue-100 disabled:opacity-20`}
              >
                {loading ? <FiLoader className="animate-spin" /> : error ? 'No Match' : 'Finalize Commit'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-50">
        <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Access History</h3>
        <div className="space-y-1.5">
          {logs.map((log: any) => (
            <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-slate-50/50 rounded-lg">
              <span className="text-[8px] font-black text-slate-600 uppercase italic">Entry Denied</span>
              <span className="text-[8px] font-medium text-slate-400">
                {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}