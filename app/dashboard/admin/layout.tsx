'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-8">
          <h2 className="text-2xl font-black text-white italic tracking-tighter">C & E</h2>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em]">Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard/admin" className="block px-4 py-3 text-white bg-blue-600 rounded-xl font-bold">Dashboard</Link>
          <Link href="/dashboard/admin/inventory" className="block px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-all">Inventory</Link>
          <Link href="/dashboard/admin/sales-history" className="block px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-all">Sales History</Link>
          <Link href="/dashboard/admin/staff-logs" className="block px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-all">Staff Activity</Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold transition-all text-left">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}