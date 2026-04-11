'use client'
import { useState, useEffect } from 'react'
import { 
  FiShoppingBag, 
  FiFileText, 
  FiLogOut, 
  FiUser, 
  FiChevronRight, 
  FiClock 
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  activeView: 'sales' | 'receipts' | 'history';
  onViewChange: (view: 'sales' | 'receipts' | 'history') => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      // FIX: Use getSession first to avoid auth-token lock competition
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUserEmail(session.user.email ?? 'Staff Member')
      } else {
        // Fallback check if session isn't in memory
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUserEmail(user.email ?? 'Staff Member')
      }
    }
    
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { id: 'sales', name: 'Sales Terminal', icon: <FiShoppingBag size={20}/> },
    { id: 'receipts', name: 'Receipts Log', icon: <FiFileText size={20}/> },
    { id: 'history', name: 'Daily Ledger', icon: <FiClock size={20}/> }, 
  ]

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ 
        width: isHovered ? 280 : 88,
        backgroundColor: isHovered ? '#0f172a' : '#020617' 
      }}
      className="fixed left-0 top-0 h-screen text-white z-[500] flex flex-col shadow-2xl overflow-hidden border-r border-white/5 transition-colors duration-300"
    >
      {/* --- BRAND LOGO SECTION --- */}
      <div className="p-6 mb-8 flex items-center gap-4">
        <div className="min-w-[40px] h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="font-black italic text-sm tracking-tighter">CE</span>
        </div>
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-black tracking-tighter text-lg leading-none">C&E <span className="text-blue-500">POS</span></span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Investment Terminal</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as any)}
            className={`group w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative ${
              activeView === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <AnimatePresence mode="wait">
                {isHovered && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {isHovered && activeView === item.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FiChevronRight className="text-white/50" />
              </motion.div>
            )}
          </button>
        ))}
      </nav>

      {/* --- BOTTOM SECTION (USER & LOGOUT) --- */}
      <div className="p-4 mt-auto space-y-2 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="min-w-[32px] h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
            <FiUser size={16} />
          </div>
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">
                  {userEmail?.split('@')[0]}
                </span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Authorized</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-4 p-4 w-full text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <FiLogOut size={20}/>
          </div>
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="font-bold text-[10px] uppercase tracking-widest whitespace-nowrap"
              >
                Secure Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}