'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiGrid, FiBox, FiClock, FiUsers, FiLogOut, FiShield } from 'react-icons/fi'
import { motion } from 'framer-motion'

export const navItems = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: <FiGrid /> },
  { name: 'Inventory', href: '/dashboard/admin/inventory', icon: <FiBox /> },
  { name: 'Sales History', href: '/dashboard/admin/sales-history', icon: <FiClock /> },
  { name: 'Staff Activity', href: '/dashboard/admin/staff-logs', icon: <FiUsers /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col sticky top-0 h-screen z-50">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <FiShield className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white italic tracking-tighter leading-none">C & E</h2>
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.3em] mt-1">Admin OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <span className={`text-lg z-10 ${isActive ? 'text-white' : 'text-slate-600'}`}>{item.icon}</span>
              <span className="text-[11px] uppercase tracking-widest leading-none z-10">{item.name}</span>
              {isActive && <motion.div layoutId="activeNav" className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-slate-900/50">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
          <FiLogOut size={16} /> Logout Session
        </button>
      </div>
    </aside>
  )
}