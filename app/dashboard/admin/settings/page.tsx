'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SettingsSidebar } from './components/SettingsSidebar'
import { SecuritySettings } from './components/SecuritySettings'
import { ModalPortal } from './components/ModalPortal'
import { FiShield, FiClock, FiCheck } from 'react-icons/fi'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('security')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Form state
  const [form, setForm] = useState({ 
    pin: '', 
    timeout: 300000,
    lockEnabled: true 
  })

  // 1. Hydration & Clock
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 2. Load Data
  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 'global')
        .single()

      if (settings) {
        setForm({ 
          pin: settings.admin_pin || '', 
          timeout: settings.lock_timeout || 300000,
          lockEnabled: settings.lock_enabled ?? true 
        })
      }
      
      const { data: logData } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (logData) setLogs(logData)
    }
    loadData()
  }, [])

  // 3. Save Handler
  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('system_settings').upsert({ 
        id: 'global', 
        admin_pin: form.pin, 
        lock_timeout: form.timeout,
        lock_enabled: form.lockEnabled,
        updated_at: new Date().toISOString()
      })
      
      if (!error) {
        setShowModal(true)
        // Log the success
        await supabase.from('security_logs').insert({
          action: 'Settings Updated',
          details: `PIN Updated, Timeout: ${form.timeout}ms`,
          status: 'success'
        })
        return true
      }
      return false
    } catch (err) {
      console.error("Save error:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    // Main Wrapper: Added 'relative' and 'z-0' to ensure it stays below the Portal
    <div className="relative z-0 flex h-[calc(100vh-140px)] -m-6 lg:-m-8 bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50">
      
      <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar flex flex-col">
        {/* Header */}
        <div className="px-12 py-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">System Operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
            <FiClock />
            <span>{mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-12 lg:p-20 pointer-events-auto">
          {activeTab === 'security' ? (
            <SecuritySettings 
              form={form} 
              setForm={setForm} 
              handleSave={handleSave} 
              loading={loading} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <FiShield size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">Section Under Construction</p>
            </div>
          )}
        </div>
      </div>

      {/* PORTAL MODAL - This sits outside the layout above */}
      {showModal && (
        <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 max-w-[320px] w-full text-center relative z-[9999]">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
              <FiCheck size={28} />
            </div>
            
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
              Protocol Updated
            </h3>
            
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide leading-relaxed mb-8">
              System access credentials and security timeout parameters have been synchronized.
            </p>

            <button 
              type="button" 
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-slate-950 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg active:scale-95"
            >
              Acknowledge
            </button>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}