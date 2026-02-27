'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SettingsSidebar } from './components/SettingsSidebar'
import { SecuritySettings } from './components/SecuritySettings'
import { UpdateModal } from './components/UpdateModal'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('security')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [form, setForm] = useState({ pin: '', timeout: 300000 })

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase.from('system_settings').select('*').single()
      if (settings) setForm({ pin: settings.admin_pin, timeout: settings.lock_timeout })
      
      const { data: logData } = await supabase.from('security_logs')
        .select('*').order('created_at', { ascending: false }).limit(4)
      if (logData) setLogs(logData)
    }
    loadData()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('system_settings').upsert({ 
        id: 'global', 
        admin_pin: form.pin, 
        lock_timeout: form.timeout 
      })
      
      if (!error) {
        setShowModal(true)
        return true
      }
      return false
    } catch (err) {
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-140px)] -m-6 lg:-m-8 bg-white rounded-[2rem] overflow-hidden border border-slate-200">
      <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-12 lg:p-20 bg-white overflow-y-auto custom-scrollbar">
        {activeTab === 'security' && (
          <SecuritySettings 
            form={form} 
            setForm={setForm} 
            showPin={showPin} 
            setShowPin={setShowPin} 
            handleSave={handleSave} 
            loading={loading} 
            logs={logs} 
          />
        )}
      </div>

      <UpdateModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}