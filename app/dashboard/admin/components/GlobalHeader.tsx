'use client'
import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiCommand } from 'react-icons/fi'
import { SearchResults } from './SearchResults'

export function GlobalHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between z-40 relative">
      <div className="relative w-full max-w-md">
        <div className={`flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border transition-all ${isSearchOpen ? 'border-blue-400 bg-white shadow-xl shadow-blue-500/5' : 'border-transparent'}`}>
          <FiSearch className={isSearchOpen ? 'text-blue-500' : 'text-slate-400'} />
          <input 
            ref={searchInputRef}
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none text-xs font-bold text-slate-700 w-full"
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-sm">
            <FiCommand size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase">K</span>
          </div>
        </div>

        <SearchResults 
          isOpen={isSearchOpen} 
          query={searchQuery} 
        />
      </div>

      <div className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center font-black text-xs text-white">
        AD
      </div>
    </header>
  )
}