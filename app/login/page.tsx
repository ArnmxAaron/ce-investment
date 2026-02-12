'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roleType = searchParams.get('role') || 'staff' // Detects if Admin or Staff

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    // Check if the user's role in Supabase matches the portal they are trying to enter
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/staff')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            C & E <span className="text-blue-500 italic">INVESTMENT</span>
          </h1>
          <div className={`mt-2 inline-block px-4 py-1 rounded text-xs font-bold uppercase tracking-widest text-white ${roleType === 'admin' ? 'bg-blue-600' : 'bg-green-600'}`}>
            {roleType === 'admin' ? 'Management Access' : 'Staff Portal'}
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin@ce-investment.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all ${
                roleType === 'admin' 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' 
                : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'
              } shadow-lg`}
            >
              {loading ? 'Verifying...' : 'Enter System'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
            >
              ← Back to Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Next.js requires Suspense for useSearchParams in the App Router
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginForm />
    </Suspense>
  )
}