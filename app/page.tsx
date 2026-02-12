'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-12">
        <h1 className="text-7xl font-black text-white tracking-tighter mb-2">
          C & E <span className="text-blue-500">INVESTMENT</span>
        </h1>
        <p className="text-slate-300 uppercase tracking-widest text-sm font-bold">
          Building Material Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Admin Selection */}
        <Link href="/login?role=admin" className="group p-8 bg-slate-800 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all shadow-2xl">
          <div className="text-4xl mb-4 text-blue-500">🛡️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Management Login</h2>
          <p className="text-slate-400 text-sm">Access sales reports, income analytics, and stock controls.</p>
          <div className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold group-hover:bg-blue-500">
            Login as Admin
          </div>
        </Link>

        {/* Staff Selection */}
        <Link href="/login?role=staff" className="group p-8 bg-slate-800 rounded-2xl border-2 border-transparent hover:border-green-500 transition-all shadow-2xl">
          <div className="text-4xl mb-4 text-green-500">🏗️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Staff Sales Portal</h2>
          <p className="text-slate-400 text-sm">Create new sales, add inventory, and check today's progress.</p>
          <div className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-bold group-hover:bg-green-500">
            Login as Staff
          </div>
        </Link>
      </div>
      
      <p className="mt-12 text-slate-500 text-xs italic">
        Authorized Access Only • C & E Investment &copy; 2026
      </p>
    </div>
  )
}