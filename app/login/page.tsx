'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FiEye, FiEyeOff, FiLoader, FiLock, FiMail, FiChevronLeft, FiShield } from 'react-icons/fi'
import { motion, AnimatePresence, Variants } from 'framer-motion'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const roleType = searchParams.get('role') || 'staff'

  // Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) { 
      setErrorMsg(error.message)
      setLoading(false)
      return 
    }

    // Trigger Success Animation
    setIsSuccess(true)

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    
    // Redirect after animation completes
    setTimeout(() => {
      router.push(profile?.role === 'admin' ? '/dashboard/admin' : '/dashboard/staff')
    }, 2000)
  }

  const containerVars: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* 1. Background System (Matches Landing) */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Dynamic Glow - Color shifts based on role */}
      <div className={`fixed top-[-10%] left-[-10%] w-[70%] h-[50%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${
        roleType === 'admin' ? 'bg-blue-600/15' : 'bg-emerald-600/15'
      }`} />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVars}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header - Fixed non-wrapping text */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 whitespace-nowrap">
            C & E <span className={`transition-colors duration-500 ${roleType === 'admin' ? 'text-blue-500' : 'text-emerald-500'}`}>INVESTMENT</span>
          </h1>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-slate-900/50 backdrop-blur-md transition-all duration-500 ${
            roleType === 'admin' ? 'border-blue-500/30 text-blue-400' : 'border-emerald-500/30 text-emerald-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${roleType === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">
              {roleType === 'admin' ? 'Management Vault' : 'Staff Access Portal'}
            </p>
          </div>
        </div>

        {/* The Login Vault Card */}
        <div className="relative group">
          {/* Accent border glow effect */}
          <div className={`absolute -inset-0.5 rounded-3xl blur opacity-20 transition duration-500 group-hover:opacity-40 ${
            roleType === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'
          }`} />
          
          <div className="relative bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-slate-800 shadow-2xl min-h-[420px] flex flex-col justify-center overflow-hidden">
            
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                >
                  <form onSubmit={handleLogin} className="space-y-6">
                    {errorMsg && (
                      <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-xs font-bold text-center border border-red-500/20">
                        {errorMsg}
                      </div>
                    )}
                    
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">
                        <FiMail className={roleType === 'admin' ? 'text-blue-500' : 'text-emerald-500'} /> 
                        System Identity
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700"
                        style={{ '--tw-ring-color': roleType === 'admin' ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)' } as any}
                        placeholder="Authorized email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="relative space-y-2">
                      <label className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest ml-1">
                        <FiLock className={roleType === 'admin' ? 'text-blue-500' : 'text-emerald-500'} /> 
                        Security Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-xl font-black text-white text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                        roleType === 'admin' 
                          ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                          : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      } disabled:opacity-50`}
                    >
                      {loading ? (
                        <><FiLoader className="animate-spin" size={18} /> Verifying...</>
                      ) : 'Authenticate'}
                    </button>
                  </form>
                  
                  <button 
                    onClick={() => router.push('/')}
                    className="mt-8 w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    <FiChevronLeft /> Back to Selection
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="success-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                      roleType === 'admin' ? 'border-blue-500/30 text-blue-500' : 'border-emerald-500/30 text-emerald-500'
                    } bg-slate-950/50 shadow-2xl`}
                  >
                    <FiShield size={48} className="animate-pulse" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Access Granted</h2>
                    <p className="text-slate-400 text-[9px] font-bold tracking-[0.4em] uppercase opacity-60">
                      Syncing System Data...
                    </p>
                  </div>

                  <div className="w-48 mx-auto h-1.5 bg-slate-950 rounded-full overflow-hidden mt-6 border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                      className={`h-full ${roleType === 'admin' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-700 text-[9px] uppercase tracking-[0.5em] font-medium opacity-50">
          Encrypted Connection • C&E INVESTMENT
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-700 uppercase tracking-widest text-[10px] font-bold animate-pulse">System Booting...</div>}>
      <LoginForm />
    </Suspense>
  )
}