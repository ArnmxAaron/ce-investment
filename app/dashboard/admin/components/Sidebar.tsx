'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { FiGrid, FiBox, FiClock, FiUsers, FiSettings, FiShield, FiBell, FiHelpCircle, FiLock, FiUnlock } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { LockScreen } from './LockScreen'

export const navItems = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: <FiGrid size={20} /> },
  { name: 'Inventory', href: '/dashboard/admin/inventory', icon: <FiBox size={20} /> },
  { name: 'Sales History', href: '/dashboard/admin/sales-history', icon: <FiClock size={20} /> },
  { name: 'Staff Activity', href: '/dashboard/admin/staff-logs', icon: <FiUsers size={20} /> },
  { name: 'Notifications', href: '/dashboard/admin/notifications', icon: <FiBell size={20} /> },
  { name: 'Settings', href: '/dashboard/admin/settings', icon: <FiSettings size={20} /> },
  { name: 'Help & Support', href: '/dashboard/admin/help', icon: <FiHelpCircle size={20} /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isLocked, setIsLocked] = useState(false)
  const [isHovered, setIsHovered] = useState(false) // Trigger for expand/collapse
  const [security, setSecurity] = useState({ pin: '1234', timeout: 30000 })
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*').single()
      if (data) setSecurity({ pin: data.admin_pin, timeout: data.lock_timeout })
    }
    fetchSettings()
  }, [isLocked])

  const handleActivity = useCallback(() => {
    if (security.timeout === 0 || isLocked) return
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsLocked(true), security.timeout)
  }, [security.timeout, isLocked])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'touchstart']
    events.forEach(e => window.addEventListener(e, handleActivity))
    handleActivity()
    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [handleActivity])

  return (
    <>
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{ width: isHovered ? 288 : 88 }} // 72 (w-72) vs 22 (icon only)
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-black border-r border-slate-800 flex flex-col sticky top-0 h-screen z-[100] overflow-hidden whitespace-nowrap shadow-2xl"
      >
        
        {/* Header Section */}
        <div className="p-6 mb-2 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiShield className="text-white text-xl" />
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-lg font-black text-white italic tracking-tighter leading-none">C & E</h2>
                  <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-1">Admin System</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} 
                className={`relative flex items-center gap-4 px-3 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
                <div className="min-w-[24px] flex justify-center z-10">{item.icon}</div>
                <AnimatePresence>
                  {isHovered && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm uppercase tracking-wide z-10"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav" 
                    className="absolute inset-0 bg-blue-700 rounded-xl shadow-md border border-blue-500/50" 
                  />
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* Footer / Lock Button */}
        <button 
          onClick={() => setIsLocked(true)}
          className="group flex items-center gap-4 p-6 hover:bg-white/5 transition-all border-t border-slate-800"
        >
          <div className="min-w-[36px] h-9 bg-slate-900 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <FiUnlock size={16} />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-1 justify-between items-center"
              >
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Session</p>
                  <p className="text-xs font-black text-white uppercase italic">Active</p>
                </div>
                <FiLock size={18} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>

      <LockScreen 
        isOpen={isLocked} 
        correctPin={security.pin} 
        onUnlock={() => setIsLocked(false)} 
      />
    </>
  )
}