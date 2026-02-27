'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiSearch, FiCommand, FiLock, FiLogOut, FiBell, FiCalendar, FiClock } from 'react-icons/fi'
import { SearchResults } from './SearchResults'

export function GlobalHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // 1. Initialize with null or a fixed state to avoid server/client mismatch
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // 2. Set mounted to true once on the client
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40 relative">
      
      {/* Search Section */}
      <div className="relative w-full max-w-xs">
        <div className={`flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-xl border transition-all ${isSearchOpen ? 'border-blue-400 bg-white shadow-lg' : 'border-transparent'}`}>
          <FiSearch className={isSearchOpen ? 'text-blue-500' : 'text-slate-400'} />
          <input 
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-xs font-bold text-slate-700 w-full"
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="hidden md:flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm text-[9px] font-black text-slate-400">
            <FiCommand size={10} /> K
          </kbd>
        </div>
        <SearchResults isOpen={isSearchOpen} query={searchQuery} />
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-6">
        
        {/* Date & Time Display */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <FiCalendar size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {/* 3. Conditional rendering: placeholder on server, real date on client */}
              {mounted ? currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--- --, ----'}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-500">
            <FiClock size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {/* 3. Conditional rendering: placeholder on server, real time on client */}
              {mounted ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </span>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <FiLock className="text-emerald-600" size={16} />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Protected</span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/dashboard/admin/notifications')}
            className="p-3 hover:bg-slate-100 rounded-xl transition-colors relative group"
          >
            <FiBell size={20} className="text-slate-600 group-hover:text-blue-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-wider border border-rose-100"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>

        {/* Profile */}
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-xs text-white shadow-lg">
          AD
        </div>
      </div>
    </header>
  )
}