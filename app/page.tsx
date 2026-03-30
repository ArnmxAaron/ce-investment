'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'

// --- Sub-Component: Typewriter Effect ---
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [i, setI] = useState(0)

  useEffect(() => {
    if (i < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[i])
        setI(i + 1)
      }, 50) 
      return () => clearTimeout(timeout)
    }
  }, [i, text])

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-4 md:w-16 bg-slate-800" />
      <p className="text-blue-400 uppercase tracking-[0.2em] text-[8px] md:text-xs font-black">
        {displayedText}
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-0.5 h-2 ml-1 bg-blue-500" />
      </p>
      <div className="h-px w-4 md:w-16 bg-slate-800" />
    </div>
  )
}

export default function LandingPage() {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVars: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Dynamic Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-green-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl flex flex-col items-center"
      >
        {/* Header */}
        <motion.div variants={itemVars} className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-2">
            C & E <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">INVESTMENT</span>
          </h1>
          <TypewriterText text="Building Material Management System" />
        </motion.div>

        {/* Action Cards - Now "Shrink-wrapped" to content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* Management Card */}
          <motion.div variants={itemVars} whileHover={{ scale: 1.02, y: -5 }}>
            <Link href="/login?role=admin" 
              className="group relative block p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-2xl overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
              
              <div className="flex flex-col items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-400">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Management</h2>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Full analytics, stock oversight, and controls.
                  </p>
                </div>
                <div className="w-full py-3 rounded-lg bg-blue-600/10 border border-blue-600/50 text-blue-400 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white text-center transition-all">
                  Access Dashboard
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Staff Card */}
          <motion.div variants={itemVars} whileHover={{ scale: 1.02, y: -5 }}>
            <Link href="/login?role=staff" 
              className="group relative block p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-green-500/50 transition-all shadow-2xl overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-green-500/50 to-transparent" />
              
              <div className="flex flex-col items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 group-hover:bg-green-600 group-hover:text-white transition-all text-green-400">
                  <span className="text-2xl">🏗️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Staff Portal</h2>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Record sales and check daily progress.
                  </p>
                </div>
                <div className="w-full py-3 rounded-lg bg-green-600/10 border border-green-600/50 text-green-400 text-sm font-bold group-hover:bg-green-600 group-hover:text-white text-center transition-all">
                  Open Portal
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
        
        {/* Compact Footer */}
        <motion.div variants={itemVars} className="mt-12 opacity-40 text-center">
          <p className="text-slate-500 text-[9px] uppercase tracking-[0.3em]">
            C & E Investment &copy; 2026
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}