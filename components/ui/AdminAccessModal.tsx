'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FiShield, FiX, FiAlertTriangle, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminAccessModal({ isOpen, onClose, onSuccess }: Props) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const SESSION_LENGTH = 15 * 60 * 1000 

  // Handle Mounting to prevent Hydration Errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // THE SESSION LOCK & BODY SCROLL LOCK
  useEffect(() => {
    if (isOpen && mounted) {
      // 1. Check Session
      const lastAuth = localStorage.getItem('admin_verified_at')
      if (lastAuth) {
        const timePassed = Date.now() - parseInt(lastAuth)
        if (timePassed < SESSION_LENGTH) {
          onSuccess()
          onClose()
          return
        }
      }
      // 2. Lock Scroll when modal is actually showing
      document.body.style.overflow = 'hidden'
    }

    return () => {
      // Cleanup scroll lock when modal unmounts
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, mounted, onClose, onSuccess])

  const checkPin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isVerifying) return
    setIsVerifying(true)

    try {
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'admin_pin')
        .single()

      if (fetchError) throw fetchError

      if (pin === data?.value) {
        localStorage.setItem('admin_verified_at', Date.now().toString())
        setError(false)
        setPin('')
        onSuccess()
        onClose()
      } else {
        throw new Error('Invalid PIN')
      }
    } catch (err) {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 600)
    } finally {
      setIsVerifying(false)
    }
  }

  // If not open or not mounted, render ABSOLUTELY NOTHING
  if (!isOpen || !mounted) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 touch-none">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] transition-all duration-300 ${error ? 'border-rose-600' : 'border-slate-900'}`}
      >
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <button 
            type="button"
            onClick={(e) => {
               e.stopPropagation();
               onClose();
            }} 
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2"
          >
            <FiX size={24} />
          </button>
          
          <div className="inline-block p-4 bg-blue-600 rounded-2xl mb-3 shadow-xl">
            <FiShield size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Security Shield</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-blue-400">
            <FiClock size={14} />
            <p className="font-black uppercase tracking-[0.1em] text-[10px]">Session: 15 Mins</p>
          </div>
        </div>

        <form onSubmit={checkPin} className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <FiAlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
            <p className="text-[11px] font-black text-amber-900 leading-tight uppercase">
              Enter Admin Code to Continue
            </p>
          </div>

          <div className="relative">
            <input 
              type="password"
              autoFocus
              maxLength={4}
              value={pin}
              disabled={isVerifying}
              onChange={e => setPin(e.target.value)}
              className={`w-full text-center text-4xl font-mono tracking-[0.4em] py-6 bg-slate-100 rounded-2xl border-4 outline-none transition-all ${error ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 focus:border-blue-600 focus:bg-white'}`}
              placeholder="****"
            />
          </div>

          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg disabled:bg-slate-500"
          >
            {isVerifying ? 'Verifying...' : 'Unlock System'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}