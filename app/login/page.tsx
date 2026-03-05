'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail } from 'react-icons/fi'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roleType = searchParams.get('role') || 'staff'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setErrorMsg(error.message); setLoading(false); return }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    router.push(profile?.role === 'admin' ? '/dashboard/admin' : '/dashboard/staff')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            C & E <span className="text-blue-500 italic">INVESTMENT</span>
          </h1>
          <div className={`mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${roleType === 'admin' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
            {roleType === 'admin' ? 'Management' : 'Staff Portal'}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black mb-1.5 uppercase tracking-widest">
                <FiMail className="text-blue-500" /> Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black mb-1.5 uppercase tracking-widest">
                <FiLock className="text-blue-500" /> Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-black text-white text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                roleType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-70`}
            >
              {loading ? (
                <><FiLoader className="animate-spin" size={18} /> Verifying...</>
              ) : 'Sign In'}
            </button>
          </form>
          
          <button 
            onClick={() => router.push('/')}
            className="mt-6 w-full text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            ← Back to Selection
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  )
}