'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiBox, FiAlertCircle } from 'react-icons/fi'
import { navItems } from './Sidebar'

export function SearchResults({ isOpen, query }: { isOpen: boolean, query: string }) {
  const router = useRouter()
  const [results, setResults] = useState<{products: any[], nav: any[]}>({ products: [], nav: [] })

  useEffect(() => {
    if (query.length < 2) return setResults({ products: [], nav: [] })

    const performSearch = async () => {
      const filteredNav = navItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      const { data: products } = await supabase.from('products').select('*').ilike('name', `%${query}%`).limit(5)
      setResults({ products: products || [], nav: filteredNav })
    }

    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen || query.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-50">
        {/* Navigation Section */}
        {results.nav.map(item => (
          <button key={item.href} onClick={() => router.push(item.href)} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-blue-500">{item.icon}</span>
              <span className="text-xs font-bold text-slate-700">{item.name}</span>
            </div>
            <FiArrowRight className="opacity-0 group-hover:opacity-100 text-blue-400" />
          </button>
        ))}

        {/* Product Section with Stock Info */}
        {results.products.map(product => {
          const isLow = product.stock_qty < 10
          return (
            <button key={product.id} onClick={() => router.push('/dashboard/admin/inventory')} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isLow ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                  <FiBox />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-700">{product.name}</p>
                  <p className="text-[9px] font-black uppercase text-slate-400">Stock: {product.stock_qty}</p>
                </div>
              </div>
              {isLow && <FiAlertCircle className="text-rose-500" size={14} />}
            </button>
          )
        })}

        {results.nav.length === 0 && results.products.length === 0 && (
          <p className="text-center py-4 text-xs font-bold text-slate-400 italic">No results found...</p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}